import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@encodly/shared-ui';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  X, 
  Download, 
  Trash2, 
  FileText, 
  Image, 
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { BatchProcessor as BatchProcessorClass, QueueItem, EXPORT_TEMPLATES } from '../utils/base64-enhanced';

interface BatchProcessorProps {
  onToast?: (message: string) => void;
}

export const BatchProcessor: React.FC<BatchProcessorProps> = ({ onToast }) => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const batchProcessorRef = useRef<BatchProcessorClass | null>(null);

  useEffect(() => {
    batchProcessorRef.current = new BatchProcessorClass();
    
    // Poll for queue updates
    const interval = setInterval(() => {
      if (batchProcessorRef.current) {
        const currentQueue = batchProcessorRef.current.getQueueStatus();
        setQueue([...currentQueue]);
        setIsProcessing(currentQueue.some(item => 
          item.status === 'processing' || item.status === 'pending'
        ));
      }
    }, 500);

    return () => {
      clearInterval(interval);
      if (batchProcessorRef.current) {
        batchProcessorRef.current.destroy();
      }
    };
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!batchProcessorRef.current) return;

    const validFiles = acceptedFiles.filter(file => {
      if (file.size > 50 * 1024 * 1024) {
        onToast?.(`File ${file.name} exceeds 50MB limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      batchProcessorRef.current.addFiles(validFiles);
      onToast?.(`Added ${validFiles.length} file(s) to batch queue`);
    }
  }, [onToast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'],
      'text/*': ['.txt', '.json', '.xml', '.csv', '.html'],
      'application/*': ['.pdf', '.zip', '.doc', '.docx']
    }
  });

  const removeItem = useCallback((id: string) => {
    if (batchProcessorRef.current) {
      batchProcessorRef.current.removeItem(id);
    }
  }, []);

  const clearCompleted = useCallback(() => {
    if (batchProcessorRef.current) {
      batchProcessorRef.current.clearCompleted();
      onToast?.('Cleared completed items');
    }
  }, [onToast]);

  const clearAll = useCallback(() => {
    if (batchProcessorRef.current) {
      batchProcessorRef.current.clearAll();
      onToast?.('Cleared all items');
    }
  }, [onToast]);

  const downloadResults = useCallback((format: 'json' | 'html' | 'css' = 'json') => {
    const completedItems = queue
      .filter(item => item.status === 'completed' && item.result)
      .map(item => item.result!);

    if (completedItems.length === 0) {
      onToast?.('No completed items to export');
      return;
    }

    const content = EXPORT_TEMPLATES[format](completedItems);
    const mimeType = format === 'json' ? 'application/json' : 
                     format === 'html' ? 'text/html' : 'text/css';
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `base64-batch-export.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onToast?.(`Exported ${completedItems.length} items as ${format.toUpperCase()}`);
  }, [queue, onToast]);

  const downloadIndividual = useCallback((item: QueueItem) => {
    if (!item.result) return;

    const content = item.result.base64 || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.file.name}.base64`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const getStatusIcon = (status: QueueItem['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const completedCount = queue.filter(item => item.status === 'completed').length;
  const errorCount = queue.filter(item => item.status === 'error').length;
  const totalCount = queue.length;

  return (
    <div className="w-full min-w-0">
      <Card>
        <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Batch File Processor</span>
          <div className="flex items-center gap-2">
            {completedCount > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadResults('json')}
                  title="Export as JSON"
                >
                  JSON
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadResults('html')}
                  title="Export as HTML"
                >
                  HTML
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadResults('css')}
                  title="Export as CSS"
                >
                  CSS
                </Button>
              </>
            )}
            {totalCount > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCompleted}
                  disabled={completedCount === 0}
                >
                  Clear Completed
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                >
                  Clear All
                </Button>
              </>
            )}
          </div>
        </CardTitle>
        {totalCount > 0 && (
          <div className="text-sm text-muted-foreground">
            {completedCount} completed, {errorCount} errors, {totalCount} total
            {isProcessing && <span> • Processing...</span>}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragActive
              ? 'border-primary bg-primary/10'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            or click to select files (max 50MB each)
          </p>
          <Button variant="outline">
            Select Files
          </Button>
        </div>

        {/* Queue Display */}
        {queue.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-medium">Processing Queue</h4>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 border rounded-lg min-w-0"
                >
                  {/* Status Icon */}
                  {getStatusIcon(item.status)}
                  
                  {/* File Icon */}
                  {item.result?.isImage ? (
                    <Image className="h-4 w-4 text-blue-500" />
                  ) : (
                    <FileText className="h-4 w-4 text-gray-500" />
                  )}
                  
                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium truncate flex-1 min-w-0">{item.file.name}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatFileSize(item.file.size)}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    {item.status === 'processing' && (
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${item.progress * 100}%` }}
                        />
                      </div>
                    )}
                    
                    {/* Error Message */}
                    {item.status === 'error' && item.error && (
                      <div className="text-xs text-red-500 mt-1">{item.error}</div>
                    )}
                    
                    {/* Result Info */}
                    {item.status === 'completed' && item.result && (
                      <div className="text-xs text-muted-foreground mt-1 truncate">
                        <span className="truncate">{item.result.mimeType}</span> • {formatFileSize(item.result.size)}
                        {item.result.base64 && (
                          <span> • {Math.round(item.result.base64.length / 1024)}KB encoded</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {item.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadIndividual(item)}
                        title="Download Base64"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      title="Remove from queue"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    </div>
  );
};