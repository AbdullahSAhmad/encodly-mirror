import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, Button } from '@encodly/shared-ui';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  HardDrive
} from 'lucide-react';

interface FileWithProgress {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  preview?: string;
}

interface EnhancedDropzoneProps {
  onFileProcess: (file: File) => Promise<void>;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  onToast?: (message: string) => void;
  disabled?: boolean;
}

export const EnhancedDropzone: React.FC<EnhancedDropzoneProps> = ({
  onFileProcess,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB
  acceptedTypes = [
    'image/*',
    'text/*',
    'application/pdf',
    'application/json',
    'application/xml'
  ],
  onToast,
  disabled = false
}) => {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    if (file.type.startsWith('text/')) return <FileText className="h-5 w-5 text-green-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const getFilePreview = useCallback((file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      } else {
        resolve(null);
      }
    });
  }, []);

  const processFile = useCallback(async (fileWithProgress: FileWithProgress) => {
    try {
      setFiles(prev => prev.map(f => 
        f.id === fileWithProgress.id 
          ? { ...f, status: 'processing', progress: 0 }
          : f
      ));

      // Simulate progress for processing
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => 
          f.id === fileWithProgress.id && f.progress < 90
            ? { ...f, progress: f.progress + 10 }
            : f
        ));
      }, 100);

      await onFileProcess(fileWithProgress.file);

      clearInterval(progressInterval);
      setFiles(prev => prev.map(f => 
        f.id === fileWithProgress.id 
          ? { ...f, status: 'completed', progress: 100 }
          : f
      ));

      onToast?.(`Successfully processed ${fileWithProgress.file.name}`);
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileWithProgress.id 
          ? { 
              ...f, 
              status: 'error', 
              error: error instanceof Error ? error.message : 'Processing failed'
            }
          : f
      ));
      onToast?.(`Failed to process ${fileWithProgress.file.name}`);
    }
  }, [onFileProcess, onToast]);

  const addFiles = useCallback(async (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      if (file.size > maxSize) {
        onToast?.(`File ${file.name} exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`);
        return false;
      }
      return true;
    });

    const filePromises = validFiles.slice(0, maxFiles - files.length).map(async file => {
      const id = Math.random().toString(36).substr(2, 9);
      const preview = await getFilePreview(file);
      
      const fileWithProgress: FileWithProgress = {
        id,
        file,
        progress: 0,
        status: 'pending',
        preview
      };

      return fileWithProgress;
    });

    const newFileObjects = await Promise.all(filePromises);
    setFiles(prev => [...prev, ...newFileObjects]);

    // Start processing files
    newFileObjects.forEach(fileObj => {
      setTimeout(() => processFile(fileObj), 100);
    });
  }, [files.length, maxFiles, maxSize, getFilePreview, processFile, onToast]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsDragOver(false);
    addFiles(acceptedFiles);
  }, [addFiles]);

  const onDragEnter = useCallback(() => {
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    disabled,
    multiple: true,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>)
  });

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const retryFile = useCallback((id: string) => {
    const fileToRetry = files.find(f => f.id === id);
    if (fileToRetry) {
      processFile(fileToRetry);
    }
  }, [files, processFile]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalProgress = files.length > 0 
    ? Math.round(files.reduce((sum, file) => sum + file.progress, 0) / files.length)
    : 0;

  const completedCount = files.filter(f => f.status === 'completed').length;
  const errorCount = files.filter(f => f.status === 'error').length;
  const processingCount = files.filter(f => f.status === 'processing' || f.status === 'uploading').length;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <Card>
        <CardContent className="p-0">
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
              ${isDragActive || isDragOver
                ? 'border-primary bg-primary/5 scale-[1.02]'
                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/25'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            {/* Upload Icon with Animation */}
            <div className="relative mb-4">
              <Upload 
                className={`h-12 w-12 mx-auto text-muted-foreground transition-all duration-300 ${
                  isDragActive ? 'scale-110 text-primary' : ''
                }`} 
              />
              {isDragActive && (
                <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-25" />
              )}
            </div>

            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop files here!' : 'Drag & drop files here'}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to select files
              </p>
              <p className="text-xs text-muted-foreground">
                Supports images, text files, PDF • Max {Math.round(maxSize / 1024 / 1024)}MB per file
              </p>
            </div>

            <Button 
              variant="outline" 
              className="mt-4"
              disabled={disabled}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overall Progress */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                <span className="font-medium">Processing Files</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {completedCount}/{files.length} completed
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{totalProgress}% complete</span>
              <span>
                {processingCount > 0 && `${processingCount} processing • `}
                {errorCount > 0 && `${errorCount} errors`}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Files</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {files.map((fileWithProgress) => (
                <div
                  key={fileWithProgress.id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  {/* File Preview */}
                  <div className="flex-shrink-0">
                    {fileWithProgress.preview ? (
                      <img
                        src={fileWithProgress.preview}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded border"
                      />
                    ) : (
                      <div className="w-12 h-12 border rounded flex items-center justify-center">
                        {getFileIcon(fileWithProgress.file)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {fileWithProgress.file.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(fileWithProgress.file.size)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {(fileWithProgress.status === 'uploading' || fileWithProgress.status === 'processing') && (
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${fileWithProgress.progress}%` }}
                        />
                      </div>
                    )}

                    {/* Status */}
                    <div className="flex items-center gap-2 mt-1">
                      {fileWithProgress.status === 'pending' && (
                        <>
                          <Clock className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-muted-foreground">Waiting...</span>
                        </>
                      )}
                      {(fileWithProgress.status === 'uploading' || fileWithProgress.status === 'processing') && (
                        <>
                          <Loader2 className="h-3 w-3 text-blue-500 animate-spin" />
                          <span className="text-xs text-muted-foreground">
                            {fileWithProgress.status === 'uploading' ? 'Uploading...' : 'Processing...'}
                          </span>
                        </>
                      )}
                      {fileWithProgress.status === 'completed' && (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600">Completed</span>
                        </>
                      )}
                      {fileWithProgress.status === 'error' && (
                        <>
                          <AlertCircle className="h-3 w-3 text-red-500" />
                          <span className="text-xs text-red-600">
                            {fileWithProgress.error || 'Failed'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {fileWithProgress.status === 'error' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => retryFile(fileWithProgress.id)}
                        title="Retry"
                      >
                        <Loader2 className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile(fileWithProgress.id)}
                      title="Remove"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};