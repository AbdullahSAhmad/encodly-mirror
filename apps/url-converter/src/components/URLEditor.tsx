import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Textarea, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Toggle } from '@encodly/shared-ui';
import { Copy, Download, Trash2, CheckCircle, AlertCircle, ClipboardPaste, ExternalLink, Link, Unlink, Info } from 'lucide-react';

interface URLEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
  readOnly?: boolean;
  onCopy?: () => void;
  onDownload?: () => void;
  onClear?: () => void;
  onPaste?: () => void;
  onEncode?: () => void;
  onDecode?: () => void;
  isValid?: boolean | null;
  onToast?: (message: string) => void;
  showManualButtons?: boolean;
  // Auto-detect props (only for input)
  autoConvert?: boolean;
  onAutoConvertChange?: (enabled: boolean) => void;
  detectedOperation?: 'encode' | 'decode' | null;
}

export const URLEditor: React.FC<URLEditorProps> = ({
  value,
  onChange,
  placeholder,
  error,
  readOnly = false,
  onCopy,
  onDownload,
  onClear,
  onPaste,
  onEncode,
  onDecode,
  isValid,
  onToast,
  showManualButtons = false,
  autoConvert,
  onAutoConvertChange,
  detectedOperation,
}) => {
  // Handle copy with toast
  const handleCopy = useCallback(async () => {
    if (value && onCopy) {
      await navigator.clipboard.writeText(value);
      onCopy();
      if (onToast) {
        onToast('Copied to clipboard');
      }
    }
  }, [value, onCopy, onToast]);

  // Handle paste
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
        if (onPaste) onPaste();
        if (onToast) {
          onToast('Pasted from clipboard');
        }
      }
    } catch (err) {
      if (onToast) {
        onToast('Failed to paste from clipboard');
      }
    }
  }, [onChange, onPaste, onToast]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (!value || !onDownload) return;
    
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = readOnly ? 'url-output.txt' : 'url-input.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onDownload();
  }, [value, onDownload, readOnly]);

  // Check if the value is a valid URL
  const isValidUrl = useCallback((text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  }, []);

  // Handle open URL
  const handleOpenUrl = useCallback(() => {
    if (value && isValidUrl(value)) {
      window.open(value, '_blank', 'noopener,noreferrer');
      if (onToast) {
        onToast('Opened URL in new tab');
      }
    }
  }, [value, isValidUrl, onToast]);

  const showOpenButton = value && isValidUrl(value);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <CardTitle>{readOnly ? 'Output' : 'Input'}</CardTitle>
              {/* Validation Status */}
              {readOnly && value && isValid !== null && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center cursor-help">
                        {isValid === true ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isValid === true ? (
                        <p>Valid - The conversion was successful</p>
                      ) : (
                        <p>Invalid - Check your input format</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            {/* Status message for Input */}
            {!readOnly && (
              <div className="text-xs text-muted-foreground">
                {autoConvert && detectedOperation ? (
                  <span>Detected: {detectedOperation === 'encode' ? 'URL to encode' : 'Encoded URL to decode'}</span>
                ) : !autoConvert ? (
                  <span>Click encode or decode button to convert</span>
                ) : (
                  <span>Enter URL to auto-detect conversion type</span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Input area controls */}
            {!readOnly && (
              <>
                {/* Manual encode/decode buttons */}
                {showManualButtons && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onEncode}
                      disabled={!value}
                    >
                      <Link className="h-4 w-4 mr-1.5" />
                      Encode
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onDecode}
                      disabled={!value}
                    >
                      <Unlink className="h-4 w-4 mr-1.5" />
                      Decode
                    </Button>
                    <div className="w-px h-4 bg-border mx-1" />
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  {/* Paste */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePaste}
                    title="Paste from clipboard"
                  >
                    <ClipboardPaste className="h-4 w-4" />
                  </Button>
                  
                  {/* Clear */}
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
                </div>

                {/* Auto-detect toggle - similar to JSON formatter */}
                {onAutoConvertChange && (
                  <Toggle
                    checked={autoConvert || false}
                    onCheckedChange={onAutoConvertChange}
                    size="sm"
                    label="Auto"
                  />
                )}

              </>
            )}
            
            {/* Output area controls */}
            {readOnly && (
              <>
                {/* Open URL */}
                {showOpenButton && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenUrl}
                    title="Open URL in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
                
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
                    onClick={handleDownload}
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
      
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`min-h-[600px] font-mono text-sm resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 ${
              readOnly ? 'bg-muted/30' : ''
            }`}
            style={{ boxShadow: 'none' }}
          />
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