import React, { useState, useCallback, useEffect } from 'react';
import { ToolLayout, Button } from '@encodly/shared-ui';
import { JSONEditor } from '../components/JSONEditor';
import { ShareModal } from '../components/ShareModal';
import { formatJSON, minifyJSON, isValidJSON } from '@encodly/shared-utils';
import { useAnalytics } from '@encodly/shared-analytics';
import { FileText, Minimize2, CheckCircle } from 'lucide-react';

export const JSONFormatterPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'tree'>('editor');
  const [autoFormat, setAutoFormat] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isMinified, setIsMinified] = useState(false);
  const [isValidJson, setIsValidJson] = useState<boolean | null>(null);
  const { trackToolUsage } = useAnalytics();

  // Real-time formatting when auto-format is enabled
  useEffect(() => {
    if (!autoFormat || !input.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      try {
        const formatted = formatJSON(input);
        setOutput(formatted);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid JSON');
        setOutput('');
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [input, autoFormat]);

  // Real-time JSON validation
  useEffect(() => {
    if (!input.trim()) {
      setIsValidJson(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      try {
        JSON.parse(input);
        setIsValidJson(true);
      } catch (err) {
        setIsValidJson(false);
      }
    }, 200); // Quick validation check

    return () => clearTimeout(timeoutId);
  }, [input]);

  const handleFormat = useCallback(() => {
    try {
      const formatted = formatJSON(input);
      setOutput(formatted);
      setError(null);
      setIsMinified(false);
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
      setIsMinified(true);
      trackToolUsage('json-formatter', 'minify', { success: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      trackToolUsage('json-formatter', 'minify', { success: false });
    }
  }, [input, trackToolUsage]);

  const handleExpand = useCallback(() => {
    try {
      const formatted = formatJSON(input);
      setOutput(formatted);
      setError(null);
      setIsMinified(false);
      trackToolUsage('json-formatter', 'expand', { success: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      trackToolUsage('json-formatter', 'expand', { success: false });
    }
  }, [input, trackToolUsage]);

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

  const handleFileUpload = useCallback((content: string) => {
    setInput(content);
    trackToolUsage('json-formatter', 'file-upload');
  }, [trackToolUsage]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError(null);
    trackToolUsage('json-formatter', 'clear');
  }, [trackToolUsage]);

  const handleAutoFix = useCallback(() => {
    try {
      // Basic auto-fix: try to parse and re-stringify to fix common issues
      const parsed = JSON.parse(input);
      const fixed = JSON.stringify(parsed, null, 2);
      setInput(fixed);
      setError(null);
      trackToolUsage('json-formatter', 'auto-fix', { success: true });
    } catch (err) {
      // If parsing fails, try comprehensive fixes while preserving formatting
      const lines = input.split('\n');
      let fixed = lines.map(line => {
        let fixedLine = line;
        
        // Replace single quotes with double quotes (preserve spacing)
        fixedLine = fixedLine.replace(/'/g, '"');
        
        // Add quotes to unquoted keys (preserve indentation)
        fixedLine = fixedLine.replace(/^(\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/, '$1"$2":');
        
        // Remove trailing commas before closing braces/brackets
        fixedLine = fixedLine.replace(/,(\s*[}\]])$/, '$1');
        
        return fixedLine;
      }).join('\n');
      
      // Add missing commas between adjacent properties (preserve line structure)
      const fixedLines = fixed.split('\n');
      for (let i = 0; i < fixedLines.length - 1; i++) {
        const currentLine = fixedLines[i].trim();
        const nextLine = fixedLines[i + 1].trim();
        
        // Check if current line ends with a value and next line starts with a key
        if (
          (currentLine.match(/["\d}\]]\s*$/) || currentLine.match(/(true|false|null)\s*$/)) &&
          nextLine.match(/^"[^"]*"\s*:/) &&
          !currentLine.endsWith(',')
        ) {
          fixedLines[i] = fixedLines[i].replace(/(\S)(\s*)$/, '$1,$2');
        }
      }
      
      fixed = fixedLines.join('\n');
      
      try {
        JSON.parse(fixed);
        setInput(fixed);
        setError(null);
        trackToolUsage('json-formatter', 'auto-fix', { success: true });
      } catch (err2) {
        setError('Could not auto-fix JSON. Please check syntax manually.');
        trackToolUsage('json-formatter', 'auto-fix', { success: false });
      }
    }
  }, [input, trackToolUsage]);

  const handleShare = useCallback(() => {
    setShareModalOpen(true);
    trackToolUsage('json-formatter', 'share');
  }, [trackToolUsage]);

  const handleAutoFormatChange = useCallback((enabled: boolean) => {
    setAutoFormat(enabled);
    if (!enabled) {
      // Clear output when disabling auto-format
      setOutput('');
      setError(null);
    }
    trackToolUsage('json-formatter', 'auto-format-toggle', { enabled });
  }, [trackToolUsage]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const inputActions = (
    <Button
      variant="outline"
      size="sm"
      onClick={handleFormat}
      disabled={!input.trim()}
    >
      <FileText className="h-4 w-4 mr-1" />
      Format
    </Button>
  );

  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="Format, validate, and beautify your JSON data with syntax highlighting and error detection"
      toolName="json-formatter"
      keywords={['json formatter', 'json validator', 'json beautifier', 'json minifier']}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4">
          <JSONEditor
            value={input}
            onChange={handleInputChange}
            placeholder="Paste your JSON here or drag and drop a file..."
            error={error}
            label="Input"
            onFileUpload={handleFileUpload}
            actions={inputActions}
            onClear={handleClear}
            onAutoFix={handleAutoFix}
            autoFormat={autoFormat}
            onAutoFormatChange={handleAutoFormatChange}
            isValidJson={isValidJson}
          />
          
          <JSONEditor
            value={output}
            onChange={() => {}} // Read-only
            placeholder="Formatted JSON will appear here..."
            readOnly
            label="Output"
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onShare={handleShare}
            onMinify={handleMinify}
            onExpand={handleExpand}
            isMinified={isMinified}
          />
        </div>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        currentUrl={currentUrl}
      />
    </ToolLayout>
  );
};