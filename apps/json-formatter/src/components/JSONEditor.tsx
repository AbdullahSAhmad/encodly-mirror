import React, { useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle, Button, Toggle, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, useToast } from '@encodly/shared-ui';
import { useTheme } from '@encodly/shared-ui';
import { useDropzone } from 'react-dropzone';
import { Copy, Download, FileJson, TreePine, Share2, Printer, RotateCcw, Wand2, Minimize2, CheckCircle, AlertCircle, Expand, Upload } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { JsonTreeView } from './JsonTreeView';
import { defineCustomThemes } from '../utils/editorTheme';

interface JSONEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
  readOnly?: boolean;
  label: string;
  onFileUpload?: (content: string) => void;
  actions?: React.ReactNode;
  onCopy?: () => void;
  onDownload?: () => void;
  viewMode?: 'editor' | 'tree';
  onViewModeChange?: (mode: 'editor' | 'tree') => void;
  onShare?: () => void;
  onPrint?: () => void;
  onClear?: () => void;
  onAutoFix?: () => void;
  autoFormat?: boolean;
  onAutoFormatChange?: (enabled: boolean) => void;
  onMinify?: () => void;
  onValidate?: () => void;
  onExpand?: () => void;
  isValidJson?: boolean | null;
  isMinified?: boolean;
  onToast?: (message: string) => void;
}

export const JSONEditor: React.FC<JSONEditorProps> = ({
  value,
  onChange,
  placeholder,
  error,
  readOnly = false,
  label,
  onFileUpload,
  actions,
  onCopy,
  onDownload,
  viewMode = 'editor',
  onViewModeChange,
  onShare,
  onPrint,
  onClear,
  onAutoFix,
  autoFormat,
  onAutoFormatChange,
  onMinify,
  onValidate,
  onExpand,
  isValidJson,
  isMinified,
  onToast,
}) => {
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!onFileUpload) return;
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
    noClick: true,
  });

  const handleCopy = useCallback(async () => {
    if (onCopy) {
      await onCopy();
      if (onToast) onToast('Copied to clipboard!');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(value);
      if (onToast) onToast('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      if (onToast) onToast('Failed to copy to clipboard');
    }
  }, [value, onCopy, onToast]);

  const handleDownload = useCallback(() => {
    if (onDownload) {
      onDownload();
      return;
    }

    const blob = new Blob([value], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [value, onDownload]);

  const handlePrint = useCallback(() => {
    if (onPrint) {
      onPrint();
      return;
    }

    // Create a new window for printing to avoid breaking the current page
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>JSON Output</title>
            <style>
              body { 
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; 
                white-space: pre-wrap; 
                padding: 20px; 
                font-size: 12px; 
                line-height: 1.4;
                margin: 0;
              }
              h3 { 
                margin: 0 0 20px 0; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                color: #333;
              }
              .json-content {
                border: 1px solid #ddd;
                padding: 15px;
                border-radius: 4px;
                background: #f9f9f9;
              }
              @media print {
                body { padding: 10px; }
                .json-content { border: none; background: white; }
              }
            </style>
          </head>
          <body>
            <h3>JSON Output</h3>
            <div class="json-content">${value.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }, [value, onPrint]);

  const handleScrollToMatch = useCallback((line: number, column: number) => {
    if (editorRef.current) {
      // Only scroll to line without changing cursor position
      editorRef.current.revealLineInCenter(line);
      // Don't set position or focus to avoid moving the cursor
    }
  }, []);

  const renderTreeView = () => {
    return <JsonTreeView data={value} />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>{label}</CardTitle>
            {/* JSON Validation Status - moved beside label */}
            {!readOnly && value.trim() && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center cursor-help">
                      {isValidJson === true ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : isValidJson === false ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : null}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isValidJson === true ? (
                      <p>Valid JSON - Your JSON is properly formatted and ready to use</p>
                    ) : isValidJson === false ? (
                      <p>Invalid JSON - Check for missing quotes, commas, or brackets. Use Auto-fix for quick corrections</p>
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
                {/* Left side controls */}
                <div className="flex items-center gap-2">
                  {/* Upload file */}
                  {onFileUpload && (
                    <label>
                      <input
                        type="file"
                        className="hidden"
                        accept=".json,.txt,.xml,.csv"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const content = event.target?.result as string;
                              onFileUpload(content);
                            };
                            reader.readAsText(file);
                          }
                        }}
                      />
                      <Button
                        variant="ghost"
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
                      variant="ghost"
                      size="sm"
                      onClick={onClear}
                      disabled={!value}
                      title="Clear content"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {/* Auto-fix issues */}
                  {onAutoFix && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onAutoFix}
                      disabled={!value}
                      title="Auto-fix JSON issues"
                    >
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {/* Search */}
                  <SearchBar
                    content={value}
                    onScrollToMatch={handleScrollToMatch}
                  />
                  
                  {/* Manual format button (only shown when auto-format is off) */}
                  {!autoFormat && actions}
                </div>

                {/* Right side - Auto-format toggle */}
                {onAutoFormatChange && (
                  <Toggle
                    checked={autoFormat || false}
                    onCheckedChange={onAutoFormatChange}
                    size="sm"
                    label="Auto"
                  />
                )}
              </>
            )}

            {/* Output area controls */}
            {readOnly && (
              <>
                {/* View Mode Toggle */}
                {onViewModeChange && (
                  <div className="flex border rounded">
                    <Button
                      variant={viewMode === 'editor' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onViewModeChange('editor')}
                      className="rounded-r-none"
                    >
                      Editor
                    </Button>
                    <Button
                      variant={viewMode === 'tree' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onViewModeChange('tree')}
                      className="rounded-l-none"
                    >
                      <TreePine className="h-4 w-4 mr-1" />
                      Tree
                    </Button>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  {/* Output actions - Minify/Expand */}
                  {!isMinified && onMinify && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onMinify}
                      title="Minify JSON"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {isMinified && onExpand && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onExpand}
                      title="Expand JSON"
                    >
                      <Expand className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {/* Separator */}
                  {(onMinify || onExpand) && <div className="w-px h-4 bg-border mx-1" />}
                  
                  {/* Share */}
                  {onShare && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onShare}
                      title="Share"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {/* Copy */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!value}
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  
                  {/* Download */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!value}
                    title="Download as file"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  {/* Print */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    disabled={!value}
                    title="Print"
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          {...(onFileUpload ? getRootProps() : {})}
          className={`border rounded-lg overflow-hidden ${
            isDragActive ? 'border-primary bg-primary/5' : ''
          } ${onFileUpload ? 'relative' : ''}`}
        >
          {onFileUpload && <input {...getInputProps()} />}
          
          {isDragActive && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-primary/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-primary">
                <FileJson className="h-8 w-8" />
                <span className="font-medium">Drop JSON file here</span>
              </div>
            </div>
          )}
          
          {viewMode === 'tree' && readOnly ? (
            renderTreeView()
          ) : (
            <Editor
              height="600px"
              defaultLanguage="json"
              value={value}
              onChange={(val) => onChange(val || '')}
              theme={theme === 'dark' ? 'encodly-dark' : 'encodly-light'}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                defineCustomThemes(monaco);
                monaco.editor.setTheme(theme === 'dark' ? 'encodly-dark' : 'encodly-light');
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                readOnly,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                lineNumbers: 'on',
                folding: true,
                find: {
                  addExtraSpaceOnTop: false,
                },
              }}
            />
          )}
        </div>
        {error && (
          <div className="mt-2 text-sm text-destructive">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};