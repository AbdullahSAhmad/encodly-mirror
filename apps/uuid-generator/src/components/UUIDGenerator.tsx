import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@encodly/shared-ui';
import { Copy, Download, Shuffle } from 'lucide-react';
import { generateUUID, generateBulkUUIDs, UUIDVersion, UUID_VERSIONS } from '../utils/uuidUtils';

interface UUIDGeneratorProps {
  onToast?: (message: string) => void;
}

export const UUIDGenerator: React.FC<UUIDGeneratorProps> = ({ onToast }) => {
  const [selectedVersion, setSelectedVersion] = useState<UUIDVersion>('v4');
  const [results, setResults] = useState<string[]>([]);

  // Generate initial UUID
  useEffect(() => {
    handleGenerateSingle();
  }, [selectedVersion]);

  const handleGenerateSingle = useCallback(() => {
    const uuid = generateUUID(selectedVersion);
    setResults([uuid]);
  }, [selectedVersion]);

  const handleGenerateMultiple = useCallback(() => {
    const uuids = generateBulkUUIDs(selectedVersion, 10);
    setResults(uuids);
  }, [selectedVersion]);

  const handleCopyAll = useCallback(async () => {
    if (results.length === 0) return;
    
    const text = results.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      onToast?.(`${results.length} UUID${results.length > 1 ? 's' : ''} copied to clipboard!`);
    } catch (err) {
      onToast?.('Failed to copy to clipboard');
    }
  }, [results, onToast]);

  const handleDownload = useCallback(() => {
    if (results.length === 0) return;
    
    const content = results.join('\n');
    const filename = `uuid${results.length > 1 ? 's' : ''}-${selectedVersion}-${results.length}.txt`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onToast?.('Downloaded successfully!');
  }, [results, selectedVersion, onToast]);

  const selectedVersionInfo = UUID_VERSIONS.find(v => v.value === selectedVersion);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">Generate UUIDs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Version Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">UUID Version</label>
          <select 
            value={selectedVersion} 
            onChange={(e) => setSelectedVersion(e.target.value as UUIDVersion)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {UUID_VERSIONS.map((version) => (
              <option key={version.value} value={version.value}>
                {version.label}
              </option>
            ))}
          </select>
          {selectedVersionInfo && (
            <div className="text-xs text-muted-foreground">
              {selectedVersionInfo.description}
            </div>
          )}
        </div>

        {/* Generation Buttons */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={handleGenerateSingle}
            className="flex-1 flex items-center gap-2"
          >
            <Shuffle className="h-4 w-4" />
            Generate 1
          </Button>
          <Button
            variant="secondary"
            onClick={handleGenerateMultiple}
            className="flex-1 flex items-center gap-2"
          >
            <Shuffle className="h-4 w-4" />
            Generate 10
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Generated {results.length > 1 ? `${results.length} UUIDs` : 'UUID'}
              </label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAll}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md">
              <div className="p-3 space-y-1">
                {results.map((uuid, index) => (
                  <div key={index} className="p-2 hover:bg-muted/50 rounded text-sm">
                    <span className="font-mono">{uuid}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};