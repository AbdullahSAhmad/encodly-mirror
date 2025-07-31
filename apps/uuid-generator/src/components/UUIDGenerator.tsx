import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@encodly/shared-ui';
import { Copy, Download, Shuffle, Settings, Info, Calculator, Clock, Link, FileText, Table, Code, Database, X } from 'lucide-react';
import { 
  generateUUID, 
  generateBulkUUIDs, 
  UUIDVersion, 
  UUID_VERSIONS,
  UUIDGenerationOptions,
  ExportFormat,
  exportUUIDs,
  PREDEFINED_NAMESPACES,
  calculateCollisionProbability,
  extractTimestamp,
  formatUUIDCustom,
  generateAPIEndpoint
} from '../utils/uuidUtils';

interface UUIDGeneratorProps {
  onToast?: (message: string) => void;
}

export const UUIDGenerator: React.FC<UUIDGeneratorProps> = ({ onToast }) => {
  const [selectedVersion, setSelectedVersion] = useState<UUIDVersion>('v4');
  const [results, setResults] = useState<string[]>([]);
  const [count, setCount] = useState<number>(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] = useState<ExportFormat>('txt');
  
  // Advanced options
  const [namespace, setNamespace] = useState('');
  const [name, setName] = useState('');
  const [customFormat, setCustomFormat] = useState({
    case: 'lower' as 'upper' | 'lower',
    separator: '-',
    prefix: '',
    suffix: '',
    removeSeparators: false
  });
  const [sqlOptions, setSqlOptions] = useState({
    tableName: 'uuids',
    columnName: 'uuid'
  });

  // Generate initial UUID
  useEffect(() => {
    handleGenerate();
  }, [selectedVersion]);

  const getGenerationOptions = (): UUIDGenerationOptions | undefined => {
    if ((selectedVersion === 'v3' || selectedVersion === 'v5') && namespace && name) {
      return { version: selectedVersion, namespace, name };
    }
    return undefined;
  };

  const handleGenerate = useCallback(() => {
    try {
      const options = getGenerationOptions();
      if (count === 1) {
        const uuid = generateUUID(selectedVersion, options);
        setResults([uuid]);
      } else {
        const uuids = generateBulkUUIDs(selectedVersion, count, options);
        setResults(uuids);
      }
    } catch (error) {
      onToast?.(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [selectedVersion, count, namespace, name, onToast]);

  const handleCopyAll = useCallback(async () => {
    if (results.length === 0) return;
    
    let textToCopy: string;
    
    if (customFormat.case !== 'lower' || customFormat.separator !== '-' || 
        customFormat.prefix || customFormat.suffix || customFormat.removeSeparators) {
      const formattedResults = results.map(uuid => 
        formatUUIDCustom(uuid, customFormat)
      );
      textToCopy = formattedResults.join('\n');
    } else {
      textToCopy = results.join('\n');
    }
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      onToast?.(`${results.length} UUID${results.length > 1 ? 's' : ''} copied to clipboard!`);
    } catch (err) {
      onToast?.('Failed to copy to clipboard');
    }
  }, [results, customFormat, onToast]);

  const handleDownload = useCallback((format: ExportFormat) => {
    if (results.length === 0) return;
    
    const exportOptions = {
      format,
      tableName: sqlOptions.tableName,
      columnName: sqlOptions.columnName,
      includeHeaders: true
    };
    
    let content: string;
    let filename: string;
    let mimeType: string;
    
    if (customFormat.case !== 'lower' || customFormat.separator !== '-' || 
        customFormat.prefix || customFormat.suffix || customFormat.removeSeparators) {
      const formattedResults = results.map(uuid => 
        formatUUIDCustom(uuid, customFormat)
      );
      content = exportUUIDs(formattedResults, exportOptions);
    } else {
      content = exportUUIDs(results, exportOptions);
    }
    
    switch (format) {
      case 'csv':
        filename = `uuids-${selectedVersion}-${results.length}.csv`;
        mimeType = 'text/csv';
        break;
      case 'json':
        filename = `uuids-${selectedVersion}-${results.length}.json`;
        mimeType = 'application/json';
        break;
      case 'sql':
        filename = `uuids-${selectedVersion}-${results.length}.sql`;
        mimeType = 'text/plain';
        break;
      default:
        filename = `uuids-${selectedVersion}-${results.length}.txt`;
        mimeType = 'text/plain';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onToast?.('Downloaded successfully!');
    setShowExportModal(false);
  }, [results, customFormat, sqlOptions, selectedVersion, onToast]);

  const selectedVersionInfo = UUID_VERSIONS.find(v => v.value === selectedVersion);
  const needsNamespace = selectedVersion === 'v3' || selectedVersion === 'v5';
  const supportsTimestamp = selectedVersion === 'v1' || selectedVersion === 'v6' || selectedVersion === 'v7';

  const collisionData = calculateCollisionProbability(count, selectedVersion);

  return (
    <div className="space-y-6">
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
              <div className="text-xs text-muted-foreground space-y-1">
                <div>{selectedVersionInfo.description}</div>
                <div><strong>Use case:</strong> {selectedVersionInfo.useCase}</div>
              </div>
            )}
          </div>

          {/* Namespace UUID Options */}
          {needsNamespace && (
            <div className="space-y-4 p-4 border rounded-md bg-muted/20">
              <h4 className="font-medium">Namespace UUID Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Namespace</label>
                  <select 
                    value={namespace} 
                    onChange={(e) => setNamespace(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select or enter custom...</option>
                    {Object.entries(PREDEFINED_NAMESPACES).map(([key, value]) => (
                      <option key={key} value={value}>{key}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Or enter custom namespace UUID"
                    value={namespace}
                    onChange={(e) => setNamespace(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <input
                    type="text"
                    placeholder="Enter name to hash"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Generation Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Count</label>
              <input
                type="number"
                min="1"
                max="10000"
                value={count}
                onChange={(e) => setCount(Math.min(10000, Math.max(1, parseInt(e.target.value) || 1)))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium">&nbsp;</label>
              <Button
                variant="outline"
                onClick={handleGenerate}
                className="w-full h-10 flex items-center justify-center gap-2"
                disabled={needsNamespace && (!namespace || !name)}
              >
                <Shuffle className="h-4 w-4" />
                Generate {count === 1 ? '1 UUID' : `${count} UUIDs`}
              </Button>
            </div>
          </div>



          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium">
                    Generated {results.length > 1 ? `${results.length} UUIDs` : 'UUID'}
                  </label>
                  {/* Collision Probability Info */}
                  <div className="relative group">
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-md shadow-md border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-64">
                      <div className="space-y-1">
                        <div><strong>Collision Probability:</strong> {collisionData.probability.toExponential(2)}</div>
                        <div>{collisionData.recommendation}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="h-8 w-8 p-0"
                    title="Formatting Options"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyAll}
                    className="h-8 w-8 p-0"
                    title="Copy All"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowExportModal(true)}
                    className="h-8 w-8 p-0"
                    title="Export"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Advanced Formatting Options - Above Results */}
              {showAdvanced && (
                <div className="space-y-4 p-4 border rounded-md bg-muted/20">
                  <h4 className="font-medium">Custom Formatting</h4>
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
              )}
              
              <div className="border rounded-md max-h-96 overflow-y-auto">
                <div className="p-3 space-y-1">
                  {results.map((uuid, index) => {
                    const displayUuid = customFormat.case !== 'lower' || customFormat.separator !== '-' || 
                                       customFormat.prefix || customFormat.suffix || customFormat.removeSeparators
                                       ? formatUUIDCustom(uuid, customFormat)
                                       : uuid;
                    
                    return (
                      <div key={index} className="p-2 hover:bg-muted/50 rounded text-sm flex items-center justify-between group">
                        <span className="font-mono flex-1">{displayUuid}</span>
                        <div className="flex items-center gap-2">
                          {supportsTimestamp && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              {(() => {
                                const timestamp = extractTimestamp(uuid);
                                return timestamp ? (
                                  <span className="text-xs text-muted-foreground">
                                    {timestamp.toLocaleString()}
                                  </span>
                                ) : null;
                              })()}
                            </div>
                          )}
                          {/* Individual Copy Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(displayUuid);
                                onToast?.('UUID copied to clipboard!');
                              } catch (err) {
                                onToast?.('Failed to copy to clipboard');
                              }
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Export UUIDs</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowExportModal(false)} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Format Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Export Format</label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { 
                      value: 'txt', 
                      label: 'Plain Text', 
                      description: 'Simple text file, one UUID per line',
                      icon: FileText
                    },
                    { 
                      value: 'csv', 
                      label: 'CSV', 
                      description: 'Comma-separated values with optional headers',
                      icon: Table
                    },
                    { 
                      value: 'json', 
                      label: 'JSON', 
                      description: 'Structured JSON format with metadata',
                      icon: Code
                    },
                    { 
                      value: 'sql', 
                      label: 'SQL Insert', 
                      description: 'SQL INSERT statements for database import',
                      icon: Database
                    },
                  ].map(({ value, label, description, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setSelectedExportFormat(value as ExportFormat)}
                      className={`p-3 border rounded-lg text-left transition-all ${
                        selectedExportFormat === value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 mt-0.5 text-gray-600 dark:text-gray-400" />
                        <div>
                          <div className="font-medium text-sm">{label}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* SQL Options - Show only when SQL is selected */}
              {selectedExportFormat === 'sql' && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">SQL Options</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-600">Table Name</label>
                      <input
                        type="text"
                        value={sqlOptions.tableName}
                        onChange={(e) => setSqlOptions(prev => ({ ...prev, tableName: e.target.value }))}
                        className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Column Name</label>
                      <input
                        type="text"
                        value={sqlOptions.columnName}
                        onChange={(e) => setSqlOptions(prev => ({ ...prev, columnName: e.target.value }))}
                        className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Export Summary */}
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="text-sm">
                  <div className="font-medium mb-1">Export Summary</div>
                  <div className="text-gray-600 dark:text-gray-400 space-y-1">
                    <div>• {results.length} UUID{results.length !== 1 ? 's' : ''}</div>
                    <div>• Format: {
                      selectedExportFormat === 'txt' ? 'Plain Text' :
                      selectedExportFormat === 'csv' ? 'CSV' :
                      selectedExportFormat === 'json' ? 'JSON' :
                      'SQL Insert'
                    }</div>
                    {selectedExportFormat === 'sql' && (
                      <div>• Table: {sqlOptions.tableName}.{sqlOptions.columnName}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowExportModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleDownload(selectedExportFormat)} 
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};