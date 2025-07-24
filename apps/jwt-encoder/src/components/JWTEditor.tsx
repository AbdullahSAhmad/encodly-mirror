import React, { useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle, Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@encodly/shared-ui';
import { useTheme } from '@encodly/shared-ui';
import { Copy, Download, FileText, Trash2, CheckCircle, AlertCircle, Key, Shuffle, Share2 } from 'lucide-react';

interface JWTEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
  readOnly?: boolean;
  label: string;
  onCopy?: () => void;
  onDownload?: () => void;
  onClear?: () => void;
  onShare?: () => void;
  onRandomPayload?: () => void;
  isValid?: boolean | null;
  onToast?: (message: string) => void;
  language?: string;
  height?: string;
  showTokenColors?: boolean;
}

export const JWTEditor: React.FC<JWTEditorProps> = ({
  value,
  onChange,
  placeholder,
  error,
  readOnly = false,
  label,
  onCopy,
  onDownload,
  onClear,
  onShare,
  onRandomPayload,
  isValid,
  onToast,
  language = 'json',
  height = '300px',
  showTokenColors = false,
}) => {
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = useCallback((editor: any) => {
    editorRef.current = editor;
  }, []);

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
      a.download = language === 'json' ? `jwt-${label.toLowerCase().replace(/\s+/g, '-')}.json` : `jwt-${label.toLowerCase().replace(/\s+/g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onDownload?.();
      onToast?.('Downloaded successfully!');
    }
  }, [value, onDownload, onToast, label, language]);

  const handleClear = useCallback(() => {
    onChange('');
    onClear?.();
  }, [onChange, onClear]);

  const validationIcon = isValid === null ? null : isValid ? (
    <CheckCircle className="h-4 w-4 text-green-500" />
  ) : (
    <AlertCircle className="h-4 w-4 text-red-500" />
  );

  // Function to render JWT token with colors
  const renderColoredToken = useCallback(() => {
    if (!showTokenColors || !value || !value.includes('.')) {
      return null;
    }

    const parts = value.split('.');
    if (parts.length !== 3) {
      return null;
    }

    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 p-4 font-mono text-base break-all leading-relaxed">
          <span className="text-red-500 font-medium">{parts[0]}</span>
          <span className="text-muted-foreground">.</span>
          <span className="text-blue-500 font-medium">{parts[1]}</span>
          <span className="text-muted-foreground">.</span>
          <span className="text-green-500 font-medium">{parts[2]}</span>
        </div>
        <div className="px-4 pb-2 text-xs text-muted-foreground flex items-center gap-4 border-t border-border">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Header
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Payload
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Signature
          </span>
        </div>
      </div>
    );
  }, [showTokenColors, value]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-medium">{label}</CardTitle>
            {validationIcon}
          </div>
          <div className="flex items-center space-x-2">
            {!readOnly && (
              <>
                {onRandomPayload && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onRandomPayload}
                        >
                          <Shuffle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Random payload</TooltipContent>
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
                    <TooltipContent>Clear</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
            
            {readOnly && (
              <>
                {onShare && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onShare}
                          disabled={!value}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Share</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {showTokenColors && value && value.includes('.') ? (
          <div className="relative border rounded-md" style={{ height }}>
            {renderColoredToken()}
            {!value && placeholder && (
              <div className="absolute inset-0 flex items-start justify-start p-4 pointer-events-none">
                <span className="text-muted-foreground text-sm">
                  {placeholder}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <Editor
              height={height}
              language={language}
              theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
              value={value}
              onChange={(newValue) => onChange(newValue || '')}
              onMount={handleEditorDidMount}
              options={{
                readOnly,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                lineNumbers: language === 'json' ? 'on' : 'off',
                folding: language === 'json',
                formatOnPaste: language === 'json',
                formatOnType: language === 'json',
                automaticLayout: true,
                fontSize: 14,
                tabSize: 2,
                insertSpaces: true,
                scrollbar: {
                  vertical: 'auto',
                  horizontal: 'auto',
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                },
              }}
              loading={
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              }
            />
            
            {placeholder && !value && (
              <div className="absolute inset-0 flex items-start justify-start p-4 pointer-events-none">
                <span className="text-muted-foreground text-sm">
                  {placeholder}
                </span>
              </div>
            )}
          </div>
        )}
        
        {error && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};