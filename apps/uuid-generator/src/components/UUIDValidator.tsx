import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@encodly/shared-ui';
import { CheckCircle, XCircle, Copy, ClipboardPaste, Clock, Info } from 'lucide-react';
import { validateUUID, parseUUID, formatUUID, formatUUIDCustom, extractTimestamp } from '../utils/uuidUtils';

interface UUIDValidatorProps {
  onToast?: (message: string) => void;
}

export const UUIDValidator: React.FC<UUIDValidatorProps> = ({ onToast }) => {
  const [inputUUID, setInputUUID] = useState('');
  const [formatOptions, setFormatOptions] = useState<'standard' | 'compact' | 'uppercase' | 'lowercase'>('standard');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [parsedInfo, setParsedInfo] = useState<any>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customFormat, setCustomFormat] = useState({
    case: 'lower' as 'upper' | 'lower',
    separator: '-',
    prefix: '',
    suffix: '',
    removeSeparators: false
  });

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
                    {(parsedInfo.version === 1 || parsedInfo.version === 6 || parsedInfo.version === 7) && (() => {
                      const timestamp = extractTimestamp(inputUUID);
                      return timestamp ? (
                        <div>Timestamp: {timestamp.toISOString()} ({timestamp.toLocaleString()})</div>
                      ) : null;
                    })()}
                    {parsedInfo.version === 1 && (
                      <>
                        <div>Clock Sequence: {parsedInfo.clockSequence}</div>
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
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Formatting Options</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                  >
                    {showAdvanced ? 'Simple' : 'Advanced'}
                  </Button>
                </div>

                {!showAdvanced ? (
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
                ) : (
                  <>
                    {/* Advanced Custom Formatting */}
                    <div className="space-y-4 p-4 border rounded-md bg-muted/20">
                      <h5 className="text-sm font-medium">Custom Formatting</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs">Case</label>
                          <select 
                            value={customFormat.case} 
                            onChange={(e) => setCustomFormat(prev => ({ ...prev, case: e.target.value as 'upper' | 'lower' }))}
                            className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                          >
                            <option value="lower">Lowercase</option>
                            <option value="upper">Uppercase</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs">Separator</label>
                          <input
                            type="text"
                            maxLength={3}
                            value={customFormat.separator}
                            onChange={(e) => setCustomFormat(prev => ({ ...prev, separator: e.target.value }))}
                            className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs">Prefix</label>
                          <input
                            type="text"
                            maxLength={10}
                            value={customFormat.prefix}
                            onChange={(e) => setCustomFormat(prev => ({ ...prev, prefix: e.target.value }))}
                            className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs">Suffix</label>
                          <input
                            type="text"
                            maxLength={10}
                            value={customFormat.suffix}
                            onChange={(e) => setCustomFormat(prev => ({ ...prev, suffix: e.target.value }))}
                            className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                          />
                        </div>
                      </div>
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={customFormat.removeSeparators}
                          onChange={(e) => setCustomFormat(prev => ({ ...prev, removeSeparators: e.target.checked }))}
                        />
                        <span>Remove separators (compact format)</span>
                      </label>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Custom Formatted Output</label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const formatted = formatUUIDCustom(inputUUID, customFormat);
                            try {
                              await navigator.clipboard.writeText(formatted);
                              onToast?.('Custom formatted UUID copied to clipboard!');
                            } catch (err) {
                              onToast?.('Failed to copy to clipboard');
                            }
                          }}
                          className="flex items-center gap-2"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        value={formatUUIDCustom(inputUUID, customFormat)}
                        readOnly
                        className="font-mono bg-muted/30"
                      />
                    </div>
                  </>
                )}

                {/* Component Breakdown */}
                {parsedInfo && (
                  <div className="space-y-3 p-4 border rounded-md bg-blue-50 dark:bg-blue-900/20">
                    <h4 className="font-medium flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Component Breakdown
                    </h4>
                    <div className="space-y-2 text-sm font-mono">
                      {(() => {
                        const uuid = inputUUID.replace(/-/g, '');
                        const timeLow = uuid.substring(0, 8);
                        const timeMid = uuid.substring(8, 12);
                        const timeHiAndVersion = uuid.substring(12, 16);
                        const clockSeqAndReserved = uuid.substring(16, 20);
                        const node = uuid.substring(20, 32);
                        
                        return (
                          <>
                            <div><span className="text-blue-600 font-bold">{timeLow}</span> - Time Low (32 bits)</div>
                            <div><span className="text-green-600 font-bold">{timeMid}</span> - Time Mid (16 bits)</div>
                            <div><span className="text-purple-600 font-bold">{timeHiAndVersion}</span> - Time Hi + Version (16 bits)</div>
                            <div><span className="text-orange-600 font-bold">{clockSeqAndReserved}</span> - Clock Seq + Reserved (16 bits)</div>
                            <div><span className="text-red-600 font-bold">{node}</span> - Node (48 bits)</div>
                          </>
                        );
                      })()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <strong>Hexadecimal breakdown:</strong> <span className="font-mono">
                        <span className="text-blue-600">{inputUUID.substring(0, 8)}</span>-
                        <span className="text-green-600">{inputUUID.substring(9, 13)}</span>-
                        <span className="text-purple-600">{inputUUID.substring(14, 18)}</span>-
                        <span className="text-orange-600">{inputUUID.substring(19, 23)}</span>-
                        <span className="text-red-600">{inputUUID.substring(24, 36)}</span>
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};