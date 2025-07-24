import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@encodly/shared-ui';
import { Copy, Download, Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';
import { HashAlgorithm, formatHashDisplay, getHashStrength, getSecurityRecommendation, exportHashResults } from '../utils/hashUtils';

interface HashResultsProps {
  results: Record<HashAlgorithm, string>;
  input: string;
  onToast?: (message: string) => void;
}

export const HashResults: React.FC<HashResultsProps> = ({
  results,
  input,
  onToast,
}) => {
  const [showFormatted, setShowFormatted] = useState<Record<string, boolean>>({});
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopyHash = useCallback(async (algorithm: string, hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedHash(algorithm);
      onToast?.(`${algorithm} hash copied to clipboard!`);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (err) {
      onToast?.('Failed to copy hash');
    }
  }, [onToast]);

  const handleDownloadHash = useCallback((algorithm: string, hash: string) => {
    const content = `${algorithm} Hash\nInput: ${input}\nHash: ${hash}\nGenerated: ${new Date().toISOString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${algorithm.toLowerCase()}-hash.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onToast?.(`${algorithm} hash downloaded!`);
  }, [input, onToast]);

  const handleDownloadAll = useCallback(() => {
    const content = exportHashResults(results, input);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hash-results.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onToast?.('All hash results downloaded!');
  }, [results, input, onToast]);

  const toggleFormat = useCallback((algorithm: string) => {
    setShowFormatted(prev => ({
      ...prev,
      [algorithm]: !prev[algorithm]
    }));
  }, []);

  const hasResults = Object.values(results).some(hash => hash);

  if (!hasResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Hash Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Enter text or upload a file to generate hashes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Hash Results
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadAll}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(results).map(([algorithm, hash]) => {
          if (!hash) return null;
          
          const strength = getHashStrength(algorithm as HashAlgorithm);
          const recommendation = getSecurityRecommendation(algorithm as HashAlgorithm);
          const isFormatted = showFormatted[algorithm];
          const displayHash = isFormatted ? formatHashDisplay(hash, 'spaced') : hash;

          return (
            <div key={algorithm} className="group border rounded-lg p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-base">{algorithm}</h3>
                  <span 
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      strength >= 90 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : strength >= 70 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : strength >= 50
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {strength >= 90 ? 'Excellent' : strength >= 70 ? 'Good' : strength >= 50 ? 'Legacy' : 'Deprecated'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFormat(algorithm)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {isFormatted ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyHash(algorithm, hash)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadHash(algorithm, hash)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="font-mono text-sm bg-muted/50 p-3 rounded break-all leading-relaxed">
                  {displayHash}
                </div>

                <div className="flex items-start gap-2 text-sm">
                  {strength < 70 ? (
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Shield className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  )}
                  <span className="text-muted-foreground">{recommendation}</span>
                </div>

                {copiedHash === algorithm && (
                  <div className="text-sm text-green-600 font-medium">
                    ✓ Copied to clipboard!
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};