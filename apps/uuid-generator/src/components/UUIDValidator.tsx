import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@encodly/shared-ui';
import { CheckCircle, XCircle, Copy, ClipboardPaste } from 'lucide-react';
import { validateUUID, parseUUID, formatUUID } from '../utils/uuidUtils';

interface UUIDValidatorProps {
  onToast?: (message: string) => void;
}

export const UUIDValidator: React.FC<UUIDValidatorProps> = ({ onToast }) => {
  const [inputUUID, setInputUUID] = useState('');
  const [formatOptions, setFormatOptions] = useState<'standard' | 'compact' | 'uppercase' | 'lowercase'>('standard');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [parsedInfo, setParsedInfo] = useState<any>(null);

  const validateInput = useCallback(() => {
    if (!inputUUID.trim()) {
      setValidationResult(null);
      setParsedInfo(null);
      return;
    }

    const result = validateUUID(inputUUID);
    const parsed = parseUUID(inputUUID);
    
    setValidationResult(result);
    setParsedInfo(parsed);
  }, [inputUUID]);

  useEffect(() => {
    validateInput();
  }, [validateInput]);

  const handleCopyInput = useCallback(async () => {
    if (!inputUUID.trim()) return;
    
    try {
      await navigator.clipboard.writeText(inputUUID);
      onToast?.('Copied to clipboard!');
    } catch (err) {
      onToast?.('Failed to copy to clipboard');
    }
  }, [inputUUID, onToast]);

  const handleCopyFormatted = useCallback(async () => {
    if (!validationResult?.isValid) return;
    
    const formatted = formatUUID(inputUUID, formatOptions);
    try {
      await navigator.clipboard.writeText(formatted);
      onToast?.('Formatted UUID copied to clipboard!');
    } catch (err) {
      onToast?.('Failed to copy to clipboard');
    }
  }, [inputUUID, formatOptions, validationResult, onToast]);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">Validate & Format UUID</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Enter UUID</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    setInputUUID(text.trim());
                    onToast?.('Pasted from clipboard!');
                  } catch (err) {
                    onToast?.('Failed to paste from clipboard');
                  }
                }}
                className="flex items-center gap-2"
              >
                <ClipboardPaste className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyInput}
                disabled={!inputUUID.trim()}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Input
            value={inputUUID}
            onChange={(e) => setInputUUID(e.target.value)}
            placeholder="Paste UUID here..."
            className="font-mono"
          />
        </div>

        {/* Live Validation & Details */}
        {inputUUID.trim() && (
          <div className="space-y-4">
            {/* Validation Status */}
            <div className={`flex items-start gap-3 p-4 rounded-lg border ${
              validationResult?.isValid 
                ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
            }`}>
              {validationResult?.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
              )}
              <div className="flex-1">
                <div className={`font-medium ${
                  validationResult?.isValid 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {validationResult?.isValid ? 'Valid UUID' : 'Invalid UUID'}
                </div>
                {validationResult?.isValid && parsedInfo && (
                  <div className="mt-2 space-y-1 text-sm text-green-700 dark:text-green-300">
                    <div>Version {parsedInfo.version || 'Unknown'} • {validationResult.format} format</div>
                    <div>Variant: {parsedInfo.variant}</div>
                    {parsedInfo.isNil && <div>Special: Nil UUID (all zeros)</div>}
                    {parsedInfo.isMax && <div>Special: Max UUID (all ones)</div>}
                    {parsedInfo.version === 1 && (
                      <>
                        <div>Timestamp: {parsedInfo.timestamp}</div>
                        <div>Clock Seq: {parsedInfo.clockSequence}</div>
                        <div>Node: {parsedInfo.node}</div>
                      </>
                    )}
                  </div>
                )}
                {!validationResult?.isValid && validationResult?.errors && (
                  <div className="text-sm text-red-600 dark:text-red-300">
                    {validationResult.errors.join(', ')}
                  </div>
                )}
              </div>
            </div>

            {/* Format Selection & Output */}
            {validationResult?.isValid && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Format</label>
                  <select 
                    value={formatOptions} 
                    onChange={(e) => setFormatOptions(e.target.value as any)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="standard">Standard (with hyphens)</option>
                    <option value="compact">Compact (no hyphens)</option>
                    <option value="uppercase">Uppercase</option>
                    <option value="lowercase">Lowercase</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Formatted Output</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyFormatted}
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={formatUUID(inputUUID, formatOptions)}
                    readOnly
                    className="font-mono bg-muted/30"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};