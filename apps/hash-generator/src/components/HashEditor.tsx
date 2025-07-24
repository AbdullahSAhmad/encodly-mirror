import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Textarea } from '@encodly/shared-ui';
import { useDropzone } from 'react-dropzone';
import { Copy, Download, Trash2, Upload, CheckCircle, AlertCircle, Shuffle } from 'lucide-react';

interface HashEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
  readOnly?: boolean;
  label: string;
  onCopy?: () => void;
  onDownload?: () => void;
  onClear?: () => void;
  onFileUpload?: (content: string, fileName: string) => void;
  isValid?: boolean | null;
  onToast?: (message: string) => void;
  currentFileName?: string;
  hashCount?: number;
  onRandomText?: () => void;
}

export const HashEditor: React.FC<HashEditorProps> = ({
  value,
  onChange,
  placeholder,
  error,
  readOnly = false,
  label,
  onCopy,
  onDownload,
  onClear,
  onFileUpload,
  isValid,
  onToast,
  currentFileName,
  hashCount,
  onRandomText,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && onFileUpload) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onFileUpload(content, file.name);
      };
      reader.readAsText(file);
    }
    setIsDragActive(false);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive: dropzoneActive } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: {
      'text/*': ['.txt', '.json', '.xml', '.csv', '.log'],
      'application/json': ['.json'],
    },
    multiple: false,
    noClick: true, // Disable click to upload, only allow drag & drop
    disabled: readOnly
  });

  const handleCopy = useCallback(async () => {
    if (value) {
      try {
        await navigator.clipboard.writeText(value);
        onToast?.('Copied to clipboard!');
        onCopy?.();
      } catch (err) {
        onToast?.('Failed to copy to clipboard');
      }
    }
  }, [value, onCopy, onToast]);

  const handleDownload = useCallback(() => {
    if (value) {
      const blob = new Blob([value], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'input.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onDownload?.();
      onToast?.('Downloaded successfully!');
    }
  }, [value, onDownload, onToast]);

  const handleClear = useCallback(() => {
    onChange('');
    onClear?.();
  }, [onChange, onClear]);

  const validationIcon = isValid === null ? null : isValid ? (
    <CheckCircle className="h-4 w-4 text-green-500" />
  ) : (
    <AlertCircle className="h-4 w-4 text-red-500" />
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-medium">{label}</CardTitle>
            {validationIcon}
            {(value || currentFileName) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground ml-2">
                <span>
                  {currentFileName ? `File: ${currentFileName}` : 'Text Input'}
                </span>
                <span>
                  ({value.length.toLocaleString()} characters)
                </span>
                {hashCount !== undefined && hashCount > 0 && (
                  <span>
                    {hashCount} hashes generated
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {!readOnly && (
              <>
                {onRandomText && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onRandomText}
                        >
                          <Shuffle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Random text</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {onFileUpload && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label>
                          <input {...getInputProps()} />
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer"
                            asChild
                          >
                            <span>
                              <Upload className="h-4 w-4" />
                            </span>
                          </Button>
                        </label>
                      </TooltipTrigger>
                      <TooltipContent>Upload file</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClear}
                        disabled={!value}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear input</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!value}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy to clipboard</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!value}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          {...(!readOnly ? getRootProps() : {})}
          className={`relative ${
            !readOnly && (isDragActive || dropzoneActive) 
              ? 'border-2 border-dashed border-primary bg-primary/5' 
              : ''
          }`}
        >
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`min-h-[200px] resize-none ${
              !readOnly && (isDragActive || dropzoneActive) ? 'pointer-events-none' : ''
            }`}
          />
          
          {!readOnly && (isDragActive || dropzoneActive) && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/5 rounded-md">
              <div className="text-center">
                <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-primary font-medium">Drop file here to hash</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute bottom-2 left-2 text-sm text-red-500 bg-background/90 px-2 py-1 rounded">
              {error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};