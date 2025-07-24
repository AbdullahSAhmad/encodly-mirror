import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Textarea, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@encodly/shared-ui';
import { Copy, Download, Trash2, CheckCircle, AlertCircle, Clock, Shield, Eye, FileText, List, ChevronDown } from 'lucide-react';
import { JWTDecoded, JWTValidation, formatTimeUntilExpiry, getExpirationColor, COMMON_CLAIMS } from '../utils/jwtUtils';

interface JWTEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string | null;
  readOnly?: boolean;
  title: string;
  onCopy?: () => void;
  onDownload?: () => void;
  onClear?: () => void;
  onPaste?: () => void;
  onToast?: (message: string) => void;
  decoded?: JWTDecoded | null;
  validation?: JWTValidation | null;
  jsonData?: any;
}

export const JWTEditor: React.FC<JWTEditorProps> = ({
  value,
  onChange,
  placeholder,
  error,
  readOnly = false,
  title,
  onCopy,
  onDownload,
  onClear,
  onPaste,
  onToast,
  decoded,
  validation,
  jsonData,
}) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [viewMode, setViewMode] = useState<'raw' | 'colorful' | 'breakdown'>('raw');
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsViewDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update countdown timer
  useEffect(() => {
    if (!validation?.timeUntilExpiry || validation.timeUntilExpiry <= 0) {
      setTimeLeft('');
      return;
    }

    const updateTimer = () => {
      const remaining = validation.timeUntilExpiry! - (Date.now() - (validation.expirationTime!.getTime() - validation.timeUntilExpiry!));
      if (remaining <= 0) {
        setTimeLeft('Expired');
      } else {
        setTimeLeft(formatTimeUntilExpiry(remaining));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [validation?.timeUntilExpiry, validation?.expirationTime]);

  const handleCopy = useCallback(async () => {
    const hasContent = readOnly ? jsonData : value;
    if (hasContent && onCopy) {
      await navigator.clipboard.writeText(readOnly ? JSON.stringify(jsonData, null, 2) : value);
      onCopy();
      if (onToast) {
        onToast('Copied to clipboard');
      }
    }
  }, [value, jsonData, readOnly, onCopy, onToast]);

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

  const handleDownload = useCallback(() => {
    const hasContent = readOnly ? jsonData : value;
    if (!hasContent || !onDownload) return;
    
    const content = readOnly ? JSON.stringify(jsonData, null, 2) : value;
    const blob = new Blob([content], { type: readOnly ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = readOnly ? `jwt-${title.toLowerCase().replace(' ', '-')}.json` : 'jwt-token.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (onDownload) onDownload();
  }, [value, jsonData, readOnly, title, onDownload]);

  const renderClaimTooltip = (key: string, value: any) => {
    const claim = COMMON_CLAIMS[key as keyof typeof COMMON_CLAIMS];
    if (!claim) return null;

    return (
      <TooltipProvider key={key}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-blue-600 dark:text-blue-400 cursor-help font-medium">{key}</span>
          </TooltipTrigger>
          <TooltipContent>
            <div>
              <p className="font-medium">{claim.name}</p>
              <p className="text-sm text-muted-foreground">{claim.description}</p>
              {key === 'exp' || key === 'iat' || key === 'nbf' ? (
                <p className="text-xs mt-1">
                  {new Date(value * 1000).toLocaleString()}
                </p>
              ) : null}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Render JWT as colorful plain text with overlay
  const renderColorfulPlainJWT = (token: string) => {
    // Always try to split by dots, even if not valid JWT
    const parts = token.split('.');
    
    // If it doesn't look like a JWT structure at all, show as red text
    if (parts.length < 2) {
      return (
        <div className="relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full resize-none font-mono text-sm bg-transparent border-0 outline-none text-transparent caret-gray-500 p-4 absolute inset-0 z-10"
            placeholder={placeholder}
            style={{ minHeight: '400px' }}
          />
          <div 
            className="w-full font-mono text-sm leading-relaxed p-4 pointer-events-none break-all whitespace-pre-wrap absolute inset-0 z-0 text-red-600 dark:text-red-400"
            style={{ minHeight: '400px' }}
          >
            {token}
          </div>
        </div>
      );
    }
    
    const renderColoredOverlay = () => {
      let currentIndex = 0;
      const elements = [];
      
      // Header part
      const headerText = parts[0];
      elements.push(
        <TooltipProvider key="header">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-red-600 dark:text-red-400 cursor-help">
                {headerText}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">Header</p>
              <p className="text-xs">Contains algorithm and token type</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      currentIndex += headerText.length;
      
      // First dot
      elements.push(
        <span key="dot1" className="text-gray-600 dark:text-gray-400">.</span>
      );
      currentIndex += 1;
      
      // Payload part
      const payloadText = parts[1];
      elements.push(
        <TooltipProvider key="payload">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-purple-600 dark:text-purple-400 cursor-help">
                {payloadText}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">Payload</p>
              <p className="text-xs">Contains the claims</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      currentIndex += payloadText.length;
      
      // Second dot
      elements.push(
        <span key="dot2" className="text-gray-600 dark:text-gray-400">.</span>
      );
      currentIndex += 1;
      
      // Signature part
      const signatureText = parts[2];
      elements.push(
        <TooltipProvider key="signature">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-cyan-600 dark:text-cyan-400 cursor-help">
                {signatureText}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">Signature</p>
              <p className="text-xs">Verifies the token integrity</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      
      return elements;
    };
    
    return (
      <div className="relative">
        {/* Hidden textarea for editing */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full resize-none font-mono text-sm bg-transparent border-0 outline-none text-transparent caret-gray-500 p-4 absolute inset-0 z-10"
          placeholder={placeholder}
          style={{ minHeight: '400px' }}
        />
        {/* Colored overlay */}
        <div 
          className="w-full font-mono text-sm leading-relaxed p-4 pointer-events-none break-all whitespace-pre-wrap absolute inset-0 z-0"
          style={{ minHeight: '400px' }}
        >
          {renderColoredOverlay()}
        </div>
      </div>
    );
  };

  // Render JWT with color-coded editable sections
  const renderColorCodedJWT = (token: string) => {
    const parts = token.split('.');
    
    // Handle any number of parts, but optimize for JWT structure
    const minParts = Math.max(parts.length, 3);
    while (parts.length < 3) {
      parts.push('');
    }
    
    const handlePartChange = (partIndex: number, newValue: string) => {
      const newParts = [...parts];
      newParts[partIndex] = newValue;
      onChange(newParts.join('.'));
    };
    
    return (
      <div className="font-mono text-sm leading-relaxed space-y-2">
        {/* Header */}
        <div className="flex items-start gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-red-600 dark:text-red-400 font-medium cursor-help text-xs whitespace-nowrap">Header:</span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">Header</p>
                <p className="text-xs">Contains algorithm and token type</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <textarea
            value={parts[0]}
            onChange={(e) => handlePartChange(0, e.target.value)}
            className="flex-1 resize-none border rounded px-2 py-1 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 min-h-[2.5rem]"
            style={{ fontFamily: 'inherit' }}
          />
        </div>
        
        {/* Payload */}
        <div className="flex items-start gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-purple-600 dark:text-purple-400 font-medium cursor-help text-xs whitespace-nowrap">Payload:</span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">Payload</p>
                <p className="text-xs">Contains the claims</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <textarea
            value={parts[1]}
            onChange={(e) => handlePartChange(1, e.target.value)}
            className="flex-1 resize-none border rounded px-2 py-1 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 min-h-[4rem]"
            style={{ fontFamily: 'inherit' }}
          />
        </div>
        
        {/* Signature */}
        <div className="flex items-start gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-cyan-600 dark:text-cyan-400 font-medium cursor-help text-xs whitespace-nowrap">Signature:</span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">Signature</p>
                <p className="text-xs">Verifies the token integrity</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <textarea
            value={parts[2]}
            onChange={(e) => handlePartChange(2, e.target.value)}
            className="flex-1 resize-none border rounded px-2 py-1 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-800 min-h-[2.5rem]"
            style={{ fontFamily: 'inherit' }}
          />
        </div>
      </div>
    );
  };

  const renderJSONWithHighlights = (data: any, depth = 0) => {
    if (data === null) return <span className="text-gray-500">null</span>;
    if (typeof data === 'boolean') return <span className="text-purple-600">{data.toString()}</span>;
    if (typeof data === 'number') return <span className="text-blue-600">{data}</span>;
    if (typeof data === 'string') return <span className="text-green-600">"{data}"</span>;
    
    if (Array.isArray(data)) {
      return (
        <div>
          <span>[</span>
          {data.map((item, index) => (
            <div key={index} style={{ paddingLeft: (depth + 1) * 20 }}>
              {renderJSONWithHighlights(item, depth + 1)}
              {index < data.length - 1 && <span>,</span>}
            </div>
          ))}
          <span>]</span>
        </div>
      );
    }
    
    if (typeof data === 'object') {
      return (
        <div>
          <span>{'{'}</span>
          {Object.entries(data).map(([key, value], index, arr) => (
            <div key={key} style={{ paddingLeft: (depth + 1) * 20 }}>
              <span>
                {renderClaimTooltip(key, value) || <span className="text-red-600">"{key}"</span>}
                <span>: </span>
                {renderJSONWithHighlights(value, depth + 1)}
                {index < arr.length - 1 && <span>,</span>}
              </span>
            </div>
          ))}
          <span>{'}'}</span>
        </div>
      );
    }
    
    return <span>{String(data)}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-1">
            <CardTitle className="flex items-center gap-2">
              {title}
              {title === 'JWT Token Input' && <Shield className="h-4 w-4" />}
              {(title === 'Header' || title === 'Payload') && <Eye className="h-4 w-4" />}
            </CardTitle>
            
            {/* Validation status and algorithm */}
            {!readOnly && (
              <div className="flex items-center gap-2">
                {/* Validation Status */}
                {(decoded || error) && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-help">
                          {decoded && decoded.isValid ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {decoded && decoded.isValid ? 'Valid JWT' : 'Invalid JWT'}
                          </p>
                          {error && (
                            <p className="text-sm text-red-400">{error}</p>
                          )}
                          {decoded && !decoded.isValid && decoded.error && (
                            <p className="text-sm text-red-400">{decoded.error}</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                {/* Algorithm Badge */}
                {validation && validation.algorithm && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded cursor-help">
                          {validation.algorithm}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-medium">Signature Algorithm</p>
                          <p className="text-sm">{validation.algorithm}</p>
                          <p className="text-xs text-muted-foreground">
                            Used to sign the token
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                {/* Signature Status */}
                {decoded && decoded.signature && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-help">
                          <Shield className={`h-3 w-3 ${
                            validation?.isSignatureVerified === true ? 'text-green-500' :
                            validation?.isSignatureVerified === false ? 'text-red-500' :
                            'text-amber-500'
                          }`} />
                          <span className={`text-xs font-medium ${
                            validation?.isSignatureVerified === true ? 'text-green-600 dark:text-green-400' :
                            validation?.isSignatureVerified === false ? 'text-red-600 dark:text-red-400' :
                            'text-amber-600 dark:text-amber-400'
                          }`}>
                            {validation?.isSignatureVerified === true ? 'Verified' :
                             validation?.isSignatureVerified === false ? 'Invalid' :
                             'Unverified'}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {validation?.isSignatureVerified === true ? 'Signature Verified' :
                             validation?.isSignatureVerified === false ? 'Signature Invalid' :
                             'Signature Not Verified'}
                          </p>
                          <p className="text-sm">
                            {validation?.isSignatureVerified === true ? 
                              'The signature is valid and matches the secret key' :
                             validation?.isSignatureVerified === false ?
                              'The signature is invalid or incorrect secret key' :
                              'The signature exists but hasn\'t been verified'}
                          </p>
                          {validation?.isSignatureVerified === null && (
                            <p className="text-xs text-muted-foreground">
                              Use the verification section below to verify with your secret key
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                {/* Expiration Status */}
                {validation && validation.isExpired !== null && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-help">
                          <Clock className="h-3 w-3" />
                          <span className={`text-xs font-medium ${getExpirationColor(validation.isExpired)}`}>
                            {validation.isExpired ? 'Expired' : timeLeft || 'Valid'}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-medium">Expiration Status</p>
                          {validation.isExpired ? (
                            <p className="text-sm text-red-400">Token has expired</p>
                          ) : (
                            <p className="text-sm text-green-400">Token is valid for {timeLeft}</p>
                          )}
                          {validation.expirationTime && (
                            <p className="text-xs text-muted-foreground">
                              Expires at: {validation.expirationTime.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Mode Selector - Only for input area */}
            {!readOnly && (
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
                  className="flex items-center gap-1 text-xs"
                >
                  {viewMode === 'raw' && <FileText className="h-3 w-3" />}
                  {viewMode === 'colorful' && <Eye className="h-3 w-3" />}
                  {viewMode === 'breakdown' && <List className="h-3 w-3" />}
                  <span className="capitalize">{viewMode}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
                
                {isViewDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-32 bg-background border rounded-md shadow-lg z-50">
                    <button
                      onClick={() => {
                        setViewMode('raw');
                        setIsViewDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 ${
                        viewMode === 'raw' ? 'bg-muted' : ''
                      }`}
                    >
                      <FileText className="h-3 w-3" />
                      Raw
                    </button>
                    <button
                      onClick={() => {
                        setViewMode('colorful');
                        setIsViewDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 ${
                        viewMode === 'colorful' ? 'bg-muted' : ''
                      }`}
                    >
                      <Eye className="h-3 w-3" />
                      Colorful
                    </button>
                    <button
                      onClick={() => {
                        setViewMode('breakdown');
                        setIsViewDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 ${
                        viewMode === 'breakdown' ? 'bg-muted' : ''
                      }`}
                    >
                      <List className="h-3 w-3" />
                      Breakdown
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Input area controls */}
            {!readOnly && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!value}
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                
                
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={readOnly ? !jsonData : !value}
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={readOnly ? !jsonData : !value}
                  title="Download as file"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          {readOnly && jsonData ? (
            <div className="p-4 bg-muted/30 font-mono text-sm min-h-[400px] max-h-[600px] overflow-auto">
              {renderJSONWithHighlights(jsonData)}
            </div>
          ) : !readOnly && viewMode === 'breakdown' ? (
            // Show color-coded JWT breakdown when in breakdown mode
            <div className="p-4 min-h-[400px] max-h-[600px] overflow-auto bg-background">
              {renderColorCodedJWT(value)}
            </div>
          ) : !readOnly && viewMode === 'colorful' ? (
            // Show colorful plain text JWT when in colorful mode
            <div className="min-h-[400px] max-h-[600px] overflow-auto bg-background">
              {renderColorfulPlainJWT(value)}
            </div>
          ) : (
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              readOnly={readOnly}
              className={`min-h-[400px] font-mono text-sm resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 ${
                readOnly ? 'bg-muted/30' : ''
              }`}
              style={{ boxShadow: 'none' }}
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