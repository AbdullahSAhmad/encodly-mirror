import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@encodly/shared-ui';
import { Copy, Download, Eye, Code2, Image, FileText, Globe, ChevronDown, ChevronRight } from 'lucide-react';

interface OutputFormatsProps {
  base64: string;
  mimeType: string;
  originalFileName?: string;
  onToast?: (message: string) => void;
  onClose?: () => void;
}

interface FormatOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  generate: (base64: string, mimeType: string) => string;
  language?: string; // For syntax highlighting
}

export const OutputFormats: React.FC<OutputFormatsProps> = ({
  base64,
  mimeType,
  originalFileName,
  onToast,
  onClose
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('dataUri');
  const [previewContent, setPreviewContent] = useState<string>('');
  const [rawExpanded, setRawExpanded] = useState<boolean>(false);

  const formats: FormatOption[] = [
    {
      id: 'raw',
      name: 'Raw Base64',
      description: 'Plain Base64 encoded string',
      icon: <FileText className="h-4 w-4" />,
      generate: (base64) => base64
    },
    {
      id: 'dataUri',
      name: 'Data URI',
      description: 'Complete data URI with MIME type',
      icon: <Globe className="h-4 w-4" />,
      generate: (base64, mimeType) => `data:${mimeType};base64,${base64}`
    },
    {
      id: 'htmlImg',
      name: 'HTML Image Tag',
      description: 'Ready-to-use HTML img element',
      icon: <Image className="h-4 w-4" />,
      language: 'html',
      generate: (base64, mimeType) => 
        `<img src="data:${mimeType};base64,${base64}" alt="Base64 Image" style="max-width: 100%; height: auto;" />`
    },
    {
      id: 'cssBackground',
      name: 'CSS Background',
      description: 'CSS background-image property',
      icon: <Code2 className="h-4 w-4" />,
      language: 'css',
      generate: (base64, mimeType) => 
        `background-image: url('data:${mimeType};base64,${base64}');`
    },
    {
      id: 'reactImg',
      name: 'React JSX',
      description: 'React image component',
      icon: <Code2 className="h-4 w-4" />,
      language: 'jsx',
      generate: (base64, mimeType) => 
        `<img 
  src="data:${mimeType};base64,${base64}" 
  alt="Base64 Image" 
  style={{ maxWidth: '100%', height: 'auto' }}
/>`
    },
    {
      id: 'markdown',
      name: 'Markdown',
      description: 'Markdown image syntax',
      icon: <FileText className="h-4 w-4" />,
      language: 'markdown',
      generate: (base64, mimeType) => 
        `![Base64 Image](data:${mimeType};base64,${base64})`
    },
    {
      id: 'json',
      name: 'JSON Object',
      description: 'JSON representation',
      icon: <Code2 className="h-4 w-4" />,
      language: 'json',
      generate: (base64, mimeType) => 
        JSON.stringify({
          mimeType,
          base64,
          dataUri: `data:${mimeType};base64,${base64}`,
          size: base64.length,
          originalFileName
        }, null, 2)
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      description: 'JavaScript variable assignment',
      icon: <Code2 className="h-4 w-4" />,
      language: 'javascript',
      generate: (base64, mimeType) => 
        `const base64Image = {
  mimeType: '${mimeType}',
  data: '${base64}',
  dataUri: 'data:${mimeType};base64,${base64}'
};`
    },
    {
      id: 'python',
      name: 'Python',
      description: 'Python variable with base64 data',
      icon: <Code2 className="h-4 w-4" />,
      language: 'python',
      generate: (base64, mimeType) => 
        `import base64
from io import BytesIO

# Base64 encoded data
base64_data = "${base64}"
mime_type = "${mimeType}"
data_uri = f"data:{mime_type};base64,{base64_data}"

# Decode back to bytes if needed
decoded_bytes = base64.b64decode(base64_data)`
    },
    {
      id: 'curl',
      name: 'cURL',
      description: 'cURL command for API usage',
      icon: <Code2 className="h-4 w-4" />,
      language: 'bash',
      generate: (base64, mimeType) => 
        `curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{
    "image": "data:${mimeType};base64,${base64}",
    "mimeType": "${mimeType}"
  }' \\
  https://your-api-endpoint.com/upload`
    }
  ];

  // Filter formats based on MIME type
  const availableFormats = formats.filter(format => {
    if (format.id === 'htmlImg' || format.id === 'cssBackground' || 
        format.id === 'reactImg' || format.id === 'markdown') {
      return mimeType.startsWith('image/');
    }
    return true;
  });

  const currentFormat = availableFormats.find(f => f.id === selectedFormat) || availableFormats[0];
  const output = currentFormat ? currentFormat.generate(base64, mimeType) : '';

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(output);
      onToast?.(`Copied ${currentFormat.name} to clipboard`);
    } catch (error) {
      onToast?.('Failed to copy to clipboard');
    }
  }, [output, currentFormat, onToast]);

  const handleDownload = useCallback(() => {
    const extension = currentFormat.language || 'txt';
    const filename = `base64-output.${extension}`;
    
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onToast?.(`Downloaded ${currentFormat.name} as ${filename}`);
  }, [output, currentFormat, onToast]);

  const handlePreview = useCallback(() => {
    if (currentFormat.id === 'dataUri' && mimeType.startsWith('image/')) {
      // Open image in new window
      const win = window.open();
      if (win) {
        win.document.write(`<img src="${output}" style="max-width: 100%; height: auto;" />`);
      }
    } else if (currentFormat.id === 'htmlImg') {
      // Open HTML preview
      const win = window.open();
      if (win) {
        win.document.write(`
          <!DOCTYPE html>
          <html>
          <head><title>HTML Preview</title></head>
          <body style="margin: 20px; font-family: Arial, sans-serif;">
            <h3>HTML Preview:</h3>
            ${output}
          </body>
          </html>
        `);
      }
    } else {
      // Show preview modal or copy to clipboard for other formats
      navigator.clipboard.writeText(output);
      onToast?.('Copied to clipboard for preview');
    }
  }, [output, currentFormat, mimeType, onToast]);

  const formatFileSize = (length: number) => {
    if (length === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(length) / Math.log(k));
    return parseFloat((length / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Export Format</label>
        <div className="grid grid-cols-1 gap-3">
          {availableFormats.map((format) => (
            <button
              key={format.id}
              onClick={() => setSelectedFormat(format.id)}
              className={`p-3 border rounded-lg text-left transition-all ${
                selectedFormat === format.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 mt-0.5 text-gray-600 dark:text-gray-400">
                  {format.icon}
                </div>
                <div>
                  <div className="font-medium text-sm">{format.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {format.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Export Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <div className="text-sm">
          <div className="font-medium mb-1">Export Summary</div>
          <div className="text-gray-600 dark:text-gray-400 space-y-1">
            <div>• Format: {currentFormat?.name}</div>
            <div>• Size: {formatFileSize(output.length)}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={handleDownload} 
          className="flex-1 flex items-center justify-center gap-2"
          disabled={!selectedFormat}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
};