import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@encodly/shared-ui';
import { Download, FileText, Database, Code, File, FileSpreadsheet, X } from 'lucide-react';
import * as YAML from 'js-yaml';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  jsonData: string;
  filename?: string;
}

type ExportFormat = 'json' | 'xml' | 'csv' | 'yaml';

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  jsonData,
  filename = 'data'
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('json');
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { 
      value: 'json' as const, 
      label: 'JSON', 
      icon: Code, 
      extension: '.json', 
      mime: 'application/json',
      description: 'Structured JSON format with metadata'
    },
    { 
      value: 'csv' as const, 
      label: 'CSV', 
      icon: FileSpreadsheet, 
      extension: '.csv', 
      mime: 'text/csv',
      description: 'Comma-separated values with optional headers'
    },
    { 
      value: 'xml' as const, 
      label: 'XML', 
      icon: File, 
      extension: '.xml', 
      mime: 'application/xml',
      description: 'Structured XML format'
    },
    { 
      value: 'yaml' as const, 
      label: 'YAML', 
      icon: FileText, 
      extension: '.yaml', 
      mime: 'text/yaml',
      description: 'YAML format for configuration files'
    },
  ];

  const convertToXML = (obj: any, rootName = 'root'): string => {
    const escapeXml = (str: string): string => {
      return str.replace(/[<>&'"]/g, (match) => {
        switch (match) {
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '&': return '&amp;';
          case '"': return '&quot;';
          case "'": return '&#39;';
          default: return match;
        }
      });
    };

    const convertValue = (value: any, key: string, indent = 0): string => {
      const spaces = '  '.repeat(indent);
      const tagName = key.replace(/[^a-zA-Z0-9_-]/g, '_');

      if (value === null) {
        return `${spaces}<${tagName} xsi:nil="true"></${tagName}>`;
      }

      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          return value.map((item, index) => 
            convertValue(item, `${tagName}_item`, indent)
          ).join('\n');
        } else {
          const content = Object.entries(value)
            .map(([k, v]) => convertValue(v, k, indent + 1))
            .join('\n');
          return `${spaces}<${tagName}>\n${content}\n${spaces}</${tagName}>`;
        }
      }

      const escapedValue = escapeXml(String(value));
      return `${spaces}<${tagName}>${escapedValue}</${tagName}>`;
    };

    try {
      const parsed = JSON.parse(jsonData);
      const xmlContent = convertValue(parsed, rootName, 1);
      return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n${xmlContent}\n</${rootName}>`;
    } catch (error) {
      throw new Error('Invalid JSON data for XML conversion');
    }
  };

  const convertToCSV = (obj: any): string => {
    try {
      const parsed = JSON.parse(jsonData);
      
      // Handle array of objects (most common CSV case)
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
        const headers = [...new Set(parsed.flatMap(item => Object.keys(item)))];
        const csvHeaders = headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',');
        
        const csvRows = parsed.map(item => {
          return headers.map(header => {
            const value = item[header] ?? '';
            if (typeof value === 'object') {
              return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            }
            return `"${String(value).replace(/"/g, '""')}"`;
          }).join(',');
        });
        
        return [csvHeaders, ...csvRows].join('\n');
      }
      
      // Handle single object
      if (typeof parsed === 'object' && !Array.isArray(parsed) && parsed !== null) {
        const entries = Object.entries(parsed);
        const headers = 'Key,Value';
        const rows = entries.map(([key, value]) => {
          const csvValue = typeof value === 'object' 
            ? `"${JSON.stringify(value).replace(/"/g, '""')}"` 
            : `"${String(value).replace(/"/g, '""')}"`;
          return `"${key.replace(/"/g, '""')}",${csvValue}`;
        });
        
        return [headers, ...rows].join('\n');
      }
      
      // Handle primitive values or arrays of primitives
      if (Array.isArray(parsed)) {
        const headers = 'Index,Value';
        const rows = parsed.map((value, index) => {
          const csvValue = typeof value === 'object' 
            ? `"${JSON.stringify(value).replace(/"/g, '""')}"` 
            : `"${String(value).replace(/"/g, '""')}"`;
          return `${index},${csvValue}`;
        });
        
        return [headers, ...rows].join('\n');
      }
      
      // Single primitive value
      return `Value\n"${String(parsed).replace(/"/g, '""')}"`;
      
    } catch (error) {
      throw new Error('Invalid JSON data for CSV conversion');
    }
  };

  const convertToYAML = (obj: any): string => {
    try {
      const parsed = JSON.parse(jsonData);
      return YAML.dump(parsed, {
        indent: 2,
        lineWidth: 80,
        noRefs: true,
        quotingType: '"',
        forceQuotes: false,
      });
    } catch (error) {
      throw new Error('Invalid JSON data for YAML conversion');
    }
  };

  const convertData = (format: ExportFormat): string => {
    switch (format) {
      case 'json':
        try {
          const parsed = JSON.parse(jsonData);
          return JSON.stringify(parsed, null, 2);
        } catch (error) {
          throw new Error('Invalid JSON data');
        }
      case 'xml':
        return convertToXML(jsonData);
      case 'csv':
        return convertToCSV(jsonData);
      case 'yaml':
        return convertToYAML(jsonData);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  };

  const handleExport = async (format: ExportFormat) => {
    if (!jsonData.trim()) {
      return;
    }

    setIsExporting(true);
    
    try {
      const formatOption = formatOptions.find(f => f.value === format)!;
      const convertedData = convertData(format);
      
      const blob = new Blob([convertedData], { type: formatOption.mime });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}${formatOption.extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      // Close modal after successful export
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      // You might want to show a toast notification here
    } finally {
      setIsExporting(false);
    }
  };

  const getPreview = (format: ExportFormat): string => {
    if (!jsonData.trim()) {
      return 'No data to preview';
    }

    try {
      const converted = convertData(format);
      const lines = converted.split('\n');
      
      if (lines.length > 6) {
        return lines.slice(0, 6).join('\n') + '\n... (truncated)';
      }
      
      return converted;
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'Conversion failed'}`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Export Data</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Export Format</label>
            <div className="grid grid-cols-1 gap-3">
              {formatOptions.map((option, index) => {
                const Icon = option.icon;
                const uniqueKey = `${option.value}-${index}`;
                return (
                  <button
                    key={uniqueKey}
                    onClick={() => setSelectedFormat(option.value)}
                    className={`p-3 border rounded-lg text-left transition-all ${
                      selectedFormat === option.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 mt-0.5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="text-sm">
              <div className="font-medium mb-1">Export Summary</div>
              <div className="text-gray-600 dark:text-gray-400 space-y-1">
                <div>• Format: {formatOptions.find(f => f.value === selectedFormat)?.label}</div>
                <div>• Data ready for export</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={() => handleExport(selectedFormat)} 
              className="flex-1 flex items-center justify-center gap-2"
              disabled={!jsonData.trim() || isExporting}
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};