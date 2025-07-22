import React, { useState, useCallback } from 'react';
import { ToolLayout } from '@encodly/shared-ui';
import { JSONEditor } from '../components/JSONEditor';
import { JSONToolbar } from '../components/JSONToolbar';
import { FileUploader } from '../components/FileUploader';
import { formatJSON, minifyJSON, isValidJSON } from '@encodly/shared-utils';
import { useAnalytics } from '@encodly/shared-analytics';

export const JSONFormatterPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'tree'>('editor');
  const { trackToolUsage } = useAnalytics();

  const handleFormat = useCallback(() => {
    try {
      const formatted = formatJSON(input);
      setOutput(formatted);
      setError(null);
      trackToolUsage('json-formatter', 'format', { success: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      trackToolUsage('json-formatter', 'format', { success: false });
    }
  }, [input, trackToolUsage]);

  const handleMinify = useCallback(() => {
    try {
      const minified = minifyJSON(input);
      setOutput(minified);
      setError(null);
      trackToolUsage('json-formatter', 'minify', { success: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      trackToolUsage('json-formatter', 'minify', { success: false });
    }
  }, [input, trackToolUsage]);

  const handleFileUpload = useCallback((content: string) => {
    setInput(content);
    trackToolUsage('json-formatter', 'file-upload');
  }, [trackToolUsage]);

  const handleValidate = useCallback(() => {
    const isValid = isValidJSON(input);
    if (isValid) {
      setError(null);
      setOutput('✓ Valid JSON');
    } else {
      setError('Invalid JSON');
    }
    trackToolUsage('json-formatter', 'validate', { valid: isValid });
  }, [input, trackToolUsage]);

  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="Format, validate, and beautify your JSON data with syntax highlighting and error detection"
      toolName="json-formatter"
      keywords={['json formatter', 'json validator', 'json beautifier', 'json minifier']}
    >
      <div className="space-y-6">
        <FileUploader onFileUpload={handleFileUpload} />
        
        <JSONToolbar
          onFormat={handleFormat}
          onMinify={handleMinify}
          onValidate={handleValidate}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <JSONEditor
            value={input}
            onChange={setInput}
            placeholder="Paste your JSON here..."
            error={error}
            label="Input"
          />
          
          <JSONEditor
            value={output}
            onChange={setOutput}
            placeholder="Formatted JSON will appear here..."
            readOnly
            label="Output"
          />
        </div>
      </div>
    </ToolLayout>
  );
};