import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@encodly/shared-ui';
import { Download, FileText, Database, Code } from 'lucide-react';
import * as YAML from 'js-yaml';

interface ExportManagerProps {
  jsonData: string;
  filename?: string;
}

type ExportFormat = 'json' | 'xml' | 'csv' | 'yaml';

export const ExportManager: React.FC<ExportManagerProps> = ({
  jsonData,
  filename = 'data'
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('json');
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'json' as const, label: 'JSON', icon: Code, extension: '.json', mime: 'application/json' },
    { value: 'xml' as const, label: 'XML', icon: FileText, extension: '.xml', mime: 'application/xml' },
    { value: 'csv' as const, label: 'CSV', icon: Database, extension: '.csv', mime: 'text/csv' },
    { value: 'yaml' as const, label: 'YAML', icon: FileText, extension: '.yaml', mime: 'application/x-yaml' },
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

  const handleExport = async () => {
    if (!jsonData.trim()) {
      return;
    }

    setIsExporting(true);
    
    try {
      const formatOption = formatOptions.find(f => f.value === selectedFormat)!;
      const convertedData = convertData(selectedFormat);
      
      const blob = new Blob([convertedData], { type: formatOption.mime });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}${formatOption.extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      // You might want to show a toast notification here
    } finally {
      setIsExporting(false);
    }
  };

  const getPreview = (): string => {
    if (!jsonData.trim()) {
      return 'No data to preview';
    }

    try {
      const converted = convertData(selectedFormat);
      const lines = converted.split('\n');
      
      if (lines.length > 10) {
        return lines.slice(0, 10).join('\n') + '\n... (truncated)';
      }
      
      return converted;
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'Conversion failed'}`;
    }
  };

  const selectedOption = formatOptions.find(f => f.value === selectedFormat)!;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Format:</label>
            <select 
              value={selectedFormat} 
              onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {formatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-shrink-0">
            <Button
              onClick={handleExport}
              disabled={!jsonData.trim() || isExporting}
              className="mt-6"
            >
              {isExporting ? 'Exporting...' : `Export ${selectedOption.label}`}
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Preview:</label>
          <div className="bg-muted/50 rounded border p-3 max-h-48 overflow-auto">
            <pre className="text-xs font-mono whitespace-pre-wrap">
              {getPreview()}
            </pre>
          </div>
        </div>

        {selectedFormat === 'csv' && (
          <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-700 rounded p-2">
            💡 <strong>CSV Export Tips:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Arrays of objects work best for CSV export</li>
              <li>• Nested objects will be JSON-stringified</li>
              <li>• Single objects are exported as key-value pairs</li>
            </ul>
          </div>
        )}

        {selectedFormat === 'xml' && (
          <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-700 rounded p-2">
            💡 <strong>XML Export Notes:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Special characters are automatically escaped</li>
              <li>• Array items are numbered for valid XML structure</li>
              <li>• Invalid XML tag names are converted to valid ones</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};