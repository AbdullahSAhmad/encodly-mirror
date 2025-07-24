import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@encodly/shared-ui';
import { GitCompare, CheckCircle, XCircle, Copy, Trash2 } from 'lucide-react';
import { compareHashes, validateHashFormat, HashAlgorithm, HASH_ALGORITHMS } from '../utils/hashUtils';

interface HashComparisonProps {
  onToast?: (message: string) => void;
}

export const HashComparison: React.FC<HashComparisonProps> = ({ onToast }) => {
  const [hash1, setHash1] = useState('');
  const [hash2, setHash2] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [comparisonResult, setComparisonResult] = useState<{
    matches: boolean;
    hash1Valid: boolean;
    hash2Valid: boolean;
  } | null>(null);

  const performComparison = useCallback(() => {
    if (!hash1.trim() || !hash2.trim()) {
      setComparisonResult(null);
      return;
    }

    const hash1Valid = validateHashFormat(hash1, selectedAlgorithm);
    const hash2Valid = validateHashFormat(hash2, selectedAlgorithm);
    const result = compareHashes(hash1, hash2, selectedAlgorithm);

    setComparisonResult({
      matches: result.matches,
      hash1Valid,
      hash2Valid,
    });
  }, [hash1, hash2, selectedAlgorithm]);

  useEffect(() => {
    performComparison();
  }, [performComparison]);

  const handlePasteFromClipboard = useCallback(async (targetHash: 'hash1' | 'hash2') => {
    try {
      const text = await navigator.clipboard.readText();
      if (targetHash === 'hash1') {
        setHash1(text.trim());
      } else {
        setHash2(text.trim());
      }
      onToast?.('Hash pasted from clipboard');
    } catch (err) {
      onToast?.('Failed to read from clipboard');
    }
  }, [onToast]);

  const handleClear = useCallback(() => {
    setHash1('');
    setHash2('');
    setComparisonResult(null);
  }, []);

  const getValidationIcon = (isValid: boolean | undefined) => {
    if (isValid === undefined) return null;
    return isValid ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getResultDisplay = () => {
    if (!comparisonResult) return null;

    const { matches, hash1Valid, hash2Valid } = comparisonResult;

    if (!hash1Valid || !hash2Valid) {
      return (
        <div className="flex items-center gap-2 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <XCircle className="h-5 w-5 text-orange-500" />
          <div>
            <div className="font-medium text-orange-800 dark:text-orange-200">Invalid Hash Format</div>
            <div className="text-sm text-orange-600 dark:text-orange-300">
              One or both hashes don't match the expected format for {selectedAlgorithm}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex items-center gap-2 p-4 rounded-lg border ${
        matches 
          ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
          : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
      }`}>
        {matches ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        <div>
          <div className={`font-medium ${
            matches 
              ? 'text-green-800 dark:text-green-200' 
              : 'text-red-800 dark:text-red-200'
          }`}>
            {matches ? 'Hashes Match!' : 'Hashes Do Not Match'}
          </div>
          <div className={`text-sm ${
            matches 
              ? 'text-green-600 dark:text-green-300' 
              : 'text-red-600 dark:text-red-300'
          }`}>
            {matches 
              ? 'Both hashes are identical and valid'
              : 'The hashes are different or one contains errors'
            }
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Hash Comparison
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={!hash1 && !hash2}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Algorithm</label>
          <select 
            value={selectedAlgorithm} 
            onChange={(e) => setSelectedAlgorithm(e.target.value as HashAlgorithm)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {HASH_ALGORITHMS.map((algo) => (
              <option key={algo.value} value={algo.value}>
                {algo.label} - {algo.description}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                First Hash
                {comparisonResult && getValidationIcon(comparisonResult.hash1Valid)}
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePasteFromClipboard('hash1')}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Input
              value={hash1}
              onChange={(e) => setHash1(e.target.value)}
              placeholder={`Enter ${selectedAlgorithm} hash...`}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                Second Hash
                {comparisonResult && getValidationIcon(comparisonResult.hash2Valid)}
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePasteFromClipboard('hash2')}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Input
              value={hash2}
              onChange={(e) => setHash2(e.target.value)}
              placeholder={`Enter ${selectedAlgorithm} hash...`}
              className="font-mono"
            />
          </div>
        </div>

        {getResultDisplay()}

        <div className="text-sm text-muted-foreground">
          <p className="mb-2"><strong>Tips:</strong></p>
          <ul className="space-y-1 text-xs">
            <li>• Hashes are automatically compared as you type</li>
            <li>• Comparison is case-insensitive and ignores whitespace</li>
            <li>• Choose the correct algorithm for accurate format validation</li>
            <li>• Use Ctrl+V to paste hashes from clipboard</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};