import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@encodly/shared-ui';
import { Upload, AlertCircle, CheckCircle, FileText, HardDrive } from 'lucide-react';

interface LargeFileHandlerProps {
  onDataLoaded: (data: string, filename?: string) => void;
  maxFileSize?: number; // in MB
}

interface FileInfo {
  name: string;
  size: number;
  type: string;
}

export const LargeFileHandler: React.FC<LargeFileHandlerProps> = ({
  onDataLoaded,
  maxFileSize = 50 // 50MB default
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processLargeFile = useCallback(async (file: File) => {
    const maxSizeBytes = maxFileSize * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
      setError(`File size (${formatFileSize(file.size)}) exceeds the maximum limit of ${formatFileSize(maxSizeBytes)}`);
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      if (file.size < 1024 * 1024) { // < 1MB, process normally
        const text = await file.text();
        if (signal.aborted) return;
        
        setProgress(100);
        onDataLoaded(text, file.name.replace(/\.[^.]+$/, ''));
        setIsProcessing(false);
        return;
      }

      // For larger files, use streaming approach
      const reader = file.stream().getReader();
      const decoder = new TextDecoder();
      let result = '';
      let totalRead = 0;

      try {
        while (true) {
          if (signal.aborted) {
            await reader.cancel();
            throw new Error('Operation cancelled');
          }

          const { done, value } = await reader.read();
          
          if (done) break;
          
          totalRead += value.length;
          const progressPercent = Math.round((totalRead / file.size) * 100);
          setProgress(progressPercent);
          
          // Decode chunk and append to result
          const chunk = decoder.decode(value, { stream: true });
          result += chunk;
          
          // For very large files, we might want to validate JSON structure incrementally
          // to catch errors early and avoid processing invalid data
          if (totalRead % (1024 * 1024) === 0 && result.length > 1000) {
            // Basic validation every MB - check if it looks like valid JSON start
            const trimmed = result.trim();
            if (!trimmed.startsWith('{') && !trimmed.startsWith('[') && !trimmed.startsWith('"')) {
              throw new Error('File does not appear to contain valid JSON data');
            }
          }
        }
        
        // Final decode with stream: false to handle any remaining bytes
        result += decoder.decode();
        
        if (signal.aborted) return;

        // Validate final JSON
        try {
          JSON.parse(result);
        } catch (jsonError) {
          throw new Error(`Invalid JSON: ${jsonError instanceof Error ? jsonError.message : 'Parse error'}`);
        }

        setProgress(100);
        onDataLoaded(result, file.name.replace(/\.[^.]+$/, ''));
        
      } finally {
        reader.releaseLock();
      }
      
    } catch (err) {
      if (err instanceof Error && err.message === 'Operation cancelled') {
        setError('File processing was cancelled');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to process file');
      }
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  }, [maxFileSize, onDataLoaded]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processLargeFile(files[0]);
    }
  }, [processLargeFile]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      processLargeFile(files[0]);
    }
  }, [processLargeFile]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  const cancelProcessing = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Large File Support (up to {maxFileSize}MB)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Selection Area */}
        <div
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={triggerFileSelect}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.txt,.xml,.csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <div className="space-y-2">
            <p className="text-sm font-medium">Drop large JSON files here or click to browse</p>
            <p className="text-xs text-muted-foreground">
              Supports files up to {formatFileSize(maxFileSize * 1024 * 1024)} with streaming processing
            </p>
          </div>
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Processing file...</span>
              <Button
                variant="outline"
                size="sm"
                onClick={cancelProcessing}
              >
                Cancel
              </Button>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            {fileInfo && (
              <div className="text-xs text-muted-foreground space-y-1">
                <div>File: {fileInfo.name}</div>
                <div>Size: {formatFileSize(fileInfo.size)}</div>
                <div>Progress: {progress}%</div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-700 rounded p-3">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Processing failed:</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {fileInfo && !isProcessing && !error && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-700 rounded p-3">
            <CheckCircle className="h-4 w-4" />
            <span>Successfully processed: {fileInfo.name} ({formatFileSize(fileInfo.size)})</span>
          </div>
        )}

        {/* Features */}
        <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-700 rounded p-3">
          <strong>🚀 Large File Features:</strong>
          <ul className="mt-2 space-y-1">
            <li>• Streaming processing for memory efficiency</li>
            <li>• Real-time progress tracking</li>
            <li>• Cancellable operations</li>
            <li>• Early validation to catch errors quickly</li>
            <li>• Support for files up to {maxFileSize}MB</li>
            <li>• Optimized for large JSON datasets</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};