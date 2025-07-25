import React, { useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle, Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, useToast } from '@encodly/shared-ui';
import { useTheme } from '@encodly/shared-ui';
import { useDropzone } from 'react-dropzone';
import { Copy, Download, FileText, Trash2, CheckCircle, AlertCircle, Upload } from 'lucide-react';

interface Base64EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
  readOnly?: boolean;
  label: string;
  onFileUpload?: (content: string) => void;
  onCopy?: () => void;
  onDownload?: () => void;
  onClear?: () => void;
  isValid?: boolean | null;
  onToast?: (message: string) => void;
}

export const Base64Editor: React.FC<Base64EditorProps> = ({
  value,
  onChange,
  placeholder,
  error,
  readOnly = false,
  label,
  onFileUpload,
  onCopy,
  onDownload,
  onClear,
  isValid,
  onToast,
}) => {
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && onFileUpload) {
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
    noClick: true,
    multiple: false,
  });

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleCopy = useCallback(async () => {
    if (onCopy) {
      await onCopy();
      if (onToast) onToast('Copied to clipboard!');
    }
  }, [onCopy, onToast]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>{label}</CardTitle>
            {/* Validation Status - beside label */}
            {!readOnly && value.trim() && isValid !== null && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center cursor-help">
                      {isValid === true ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : isValid === false ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : null}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isValid === true ? (
                      <p>Valid - The conversion was successful</p>
                    ) : isValid === false ? (
                      <p>Invalid - Check your input format</p>
                    ) : null}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Input area controls */}
            {!readOnly && (
              <>
                {/* Upload file */}
                {onFileUpload && (
                  <label>
                    <input
                      type="file"
                      className="hidden"
                      accept=".txt,.json,.xml,.csv"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onDrop([file]);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      title="Upload file"
                      className="cursor-pointer"
                      asChild
                    >
                      <span>
                        <Upload className="h-4 w-4" />
                      </span>
                    </Button>
                  </label>
                )}
                
                {/* Clear content */}
                {onClear && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClear}
                    disabled={!value}
                    title="Clear content"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
            
            {/* Output area controls */}
            {readOnly && (
              <>
                {/* Copy */}
                {onCopy && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!value}
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
                
                {/* Download */}
                {onDownload && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDownload}
                    disabled={!value}
                    title="Download as file"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div {...getRootProps()} className="relative">
          <input {...getInputProps()} />
          {isDragActive && !readOnly && (
            <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center z-10">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-2 text-primary" />
                <p className="text-lg font-medium">Drop your file here</p>
              </div>
            </div>
          )}
          <Editor
            height="400px"
            language="plaintext"
            theme={theme === 'dark' ? 'vs-dark' : 'vs'}
            value={value}
            onChange={(value) => onChange(value || '')}
            onMount={handleEditorDidMount}
            options={{
              readOnly,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              automaticLayout: true,
              tabSize: 2,
              padding: { top: 16, bottom: 16 },
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
              },
            }}
          />
        </div>
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};