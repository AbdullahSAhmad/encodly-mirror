import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@encodly/shared-ui';
import { Upload, FileJson } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload: (content: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileUpload(content);
      };
      reader.readAsText(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
        transition-colors duration-200
        ${isDragActive 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary/50'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex items-center justify-center gap-3">
        {isDragActive ? (
          <>
            <FileJson className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Drop your JSON file here</span>
          </>
        ) : (
          <>
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Drop JSON file or click to select</span>
          </>
        )}
      </div>
    </div>
  );
};