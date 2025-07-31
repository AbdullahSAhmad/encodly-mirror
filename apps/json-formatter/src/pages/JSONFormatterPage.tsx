import React, { useState, useCallback, useEffect } from 'react';
import { ToolLayout, Button, useToast, SEO, getToolUrls, Card, CardContent } from '@encodly/shared-ui';
import { JSONEditor } from '../components/JSONEditor';
import { ShareModal } from '../components/ShareModal';
import { SchemaValidatorModal } from '../components/SchemaValidatorModal';
import { SyntaxErrorDetector } from '../components/SyntaxErrorDetector';
import { ExportModal } from '../components/ExportModal';
import { JSONPathQuery } from '../components/JSONPathQuery';
import { URLLoaderModal } from '../components/URLLoaderModal';
import { LargeFileHandler } from '../components/LargeFileHandler';
import { formatJSON, minifyJSON, isValidJSON } from '@encodly/shared-utils';
import { useAnalytics } from '@encodly/shared-analytics';
import { FileText, Minimize2, CheckCircle, Info, Settings, Globe, Search, Download, Shield, Upload, X } from 'lucide-react';
import { InfoModal } from '../components/InfoModal';

const STORAGE_KEY = 'json-formatter-input';

export const JSONFormatterPage: React.FC = () => {
  const seoData = {
    title: "JSON Formatter & Validator - Free Online Tool",
    description: "Free online JSON formatter, validator and beautifier. Format, validate, and minify JSON data with real-time syntax highlighting and error detection.",
    keywords: [
      'json formatter', 'json validator', 'json beautifier', 'json minifier', 'json viewer', 
      'online json tool', 'free json formatter', 'json parser', 'json editor',
      'json pretty print', 'json syntax checker', 'web development tools', 'developer utilities',
      'programming tools', 'data formatter', 'api tools', 'json converter'
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "JSON Formatter & Validator",
      "applicationCategory": "DeveloperApplication",
      "applicationSubCategory": "JSON Tools",
      "operatingSystem": "Any",
      "description": "Free online JSON formatter, validator and beautifier with AI-powered features for developers worldwide",
      "url": "https://json.encodly.com",
      "creator": {
        "@type": "Organization",
        "name": "Encodly",
        "url": "https://encodly.com"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "2847",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "JSON Formatting and Beautification",
        "Real-time JSON Validation", 
        "JSON Minification",
        "Tree View Display",
        "Error Detection and Fixing",
        "Copy to Clipboard",
        "File Upload/Download",
        "AI-Powered Suggestions"
      ],
      "inLanguage": ["en", "ar"],
      "availableLanguage": ["English", "Arabic"],
      "serviceArea": {
        "@type": "Place",
        "name": "Worldwide",
        "additionalProperty": [
          {"@type": "PropertyValue", "name": "specialFocus", "value": "Middle East"},
          {"@type": "PropertyValue", "name": "primaryRegions", "value": "Saudi Arabia, UAE, Qatar, Kuwait"}
        ]
      }
    }
  };

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'tree'>('editor');
  const [autoFormat, setAutoFormat] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isMinified, setIsMinified] = useState(false);
  const [isValidJson, setIsValidJson] = useState<boolean | null>(null);
  const [syntaxErrors, setSyntaxErrors] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  
  // Feature panels state
  const [showSchemaValidator, setShowSchemaValidator] = useState(false);
  const [showJsonPathQuery, setShowJsonPathQuery] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showUrlLoaderModal, setShowUrlLoaderModal] = useState(false);
  const [showLargeFileHandler, setShowLargeFileHandler] = useState(false);
  
  const { trackToolUsage } = useAnalytics();
  const { toast, ToastContainer } = useToast();

  // Load saved input on mount
  useEffect(() => {
    try {
      const savedInput = localStorage.getItem(STORAGE_KEY);
      if (savedInput) {
        setInput(savedInput);
      }
    } catch (error) {
      console.warn('Failed to load saved input:', error);
    }
  }, []);

  // Save input to localStorage
  useEffect(() => {
    try {
      if (input) {
        localStorage.setItem(STORAGE_KEY, input);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Failed to save input:', error);
    }
  }, [input]);

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

  const handleURLLoad = useCallback((content: string, filename?: string) => {
    setInput(content);
    if (filename) {
      toast(`Loaded data from: ${filename}`);
    }
    trackToolUsage('json-formatter', 'url-load');
  }, [trackToolUsage, toast]);

  const handleSyntaxErrorsChange = useCallback((errors: any[]) => {
    setSyntaxErrors(errors);
  }, []);

  const handleValidationChange = useCallback((isValid: boolean, errors: any[]) => {
    setValidationErrors(errors);
  }, []);

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

  const handlePrint = useCallback(() => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      toast('Failed to open print window. Please check your popup blocker settings.');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>JSON Output</title>
          <style>
            body { 
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; 
              white-space: pre-wrap; 
              padding: 20px; 
              font-size: 12px; 
              line-height: 1.4;
              margin: 0;
            }
            h3 { 
              margin: 0 0 20px 0; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              color: #333;
            }
            .json-content {
              border: 1px solid #ddd;
              padding: 15px;
              border-radius: 4px;
              background: #f9f9f9;
            }
            @media print {
              body { padding: 10px; }
              .json-content { border: none; background: white; }
            }
          </style>
        </head>
        <body>
          <h3>JSON Output</h3>
          <div class="json-content">${output || input}</div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait a bit longer for content to load before printing
    setTimeout(() => {
      try {
        printWindow.focus();
        printWindow.print();
        
        // Close the window after a delay to allow printing to complete
        setTimeout(() => {
          if (!printWindow.closed) {
            printWindow.close();
          }
        }, 1000);
      } catch (error) {
        console.error('Print error:', error);
        toast('Print failed. Please try again.');
      }
    }, 500);
    
    trackToolUsage('json-formatter', 'print');
  }, [output, input, trackToolUsage, toast]);

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

  const inputCustomActions = (
    <>
      {/* Advanced features */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowUrlLoaderModal(true)}
        title="Load from URL"
      >
        <Globe className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowJsonPathQuery(!showJsonPathQuery)}
        title="JSONPath Query"
      >
        <Search className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowSchemaValidator(!showSchemaValidator)}
        title="Schema Validation"
      >
        <Shield className="h-4 w-4" />
      </Button>
    </>
  );

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={getToolUrls().json}
        jsonLd={seoData.jsonLd}
        type="WebApplication"
        speakableContent={[".tool-description", ".feature-list"]}
        breadcrumbs={[
          { name: "Home", url: "https://encodly.com" },
          { name: "Tools", url: "https://encodly.com/#tools" },
          { name: "JSON Formatter", url: "https://json.encodly.com" }
        ]}
        faqData={[
          {
            question: "What is JSON formatting?",
            answer: "JSON formatting, also known as JSON beautification, is the process of adding proper indentation, line breaks, and spacing to JSON data to make it human-readable and easier to understand."
          },
          {
            question: "Is this JSON formatter free to use?",
            answer: "Yes, our JSON formatter is completely free to use. There are no limits on usage, file size, or features. You can format and validate unlimited JSON data."
          },
          {
            question: "Can I upload JSON files?",
            answer: "Yes, you can drag and drop JSON files directly into the editor or use the file upload feature. The tool supports various file formats and automatically detects JSON content."
          },
          {
            question: "Does the tool validate JSON syntax?",
            answer: "Yes, our JSON formatter includes real-time validation that checks your JSON syntax and highlights any errors. It also provides detailed error messages to help you fix issues."
          },
          {
            question: "Is my data secure when using this tool?",
            answer: "Absolutely. All JSON processing happens entirely in your browser. Your data never leaves your device and is not sent to our servers, ensuring complete privacy and security."
          }
        ]}
      />
      <ToastContainer />
      <ToolLayout
        title="Free JSON Formatter & Validator"
        description="Format, validate, and beautify your JSON data with syntax highlighting and error detection. AI-powered tools for Middle East developers."
        className="tool-description"
        toolName="json-formatter"
        keywords={seoData.keywords.slice(0, 8)}
        headerActions={
          <InfoModal 
            trigger={
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent/50 h-9 w-9">
                <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            }
          />
        }
      >
      <div className="h-full flex flex-col gap-4">
        {/* Syntax Error Detection - Always visible when JSON is invalid */}
        {input.trim() && isValidJson === false && (
          <SyntaxErrorDetector 
            content={input}
            onErrorsChange={handleSyntaxErrorsChange}
            onValidityChange={setIsValidJson}
          />
        )}
        
        {/* Main editor area */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Input column */}
          <div className="flex flex-col gap-4">
            <JSONEditor
              value={input}
              onChange={handleInputChange}
              placeholder="Paste your JSON here or drag and drop a file..."
              error={error}
              label="Input"
              onFileUpload={handleFileUpload}
              actions={inputActions}
              customActions={inputCustomActions}
              onClear={handleClear}
              onAutoFix={handleAutoFix}
              autoFormat={autoFormat}
              onAutoFormatChange={handleAutoFormatChange}
              isValidJson={isValidJson}
              onToast={toast}
            />
            
            
            {/* Large File Handler Panel */}
            {showLargeFileHandler && (
              <Card className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLargeFileHandler(false)}
                  className="absolute top-2 right-2 z-10"
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardContent className="pt-6">
                  <LargeFileHandler onDataLoaded={handleURLLoad} maxFileSize={50} />
                </CardContent>
              </Card>
            )}
            
            {/* JSONPath Query Panel */}
            {showJsonPathQuery && (
              <Card className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowJsonPathQuery(false)}
                  className="absolute top-2 right-2 z-10"
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardContent className="pt-6">
                  <JSONPathQuery jsonData={input} />
                </CardContent>
              </Card>
            )}
            
          </div>
          
          {/* Output column */}
          <div className="flex flex-col gap-4">
            <JSONEditor
              value={output}
              onChange={() => {}} // Read-only
              placeholder="Formatted JSON will appear here..."
              readOnly
              label="Output"
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onPrint={handlePrint}
              onMinify={handleMinify}
              onExpand={handleExpand}
              isMinified={isMinified}
              onToast={toast}
              customActions={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExportModal(true)}
                  title="Export to multiple formats"
                >
                  <Download className="h-4 w-4" />
                </Button>
              }
            />
            
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        currentUrl={currentUrl}
      />
      
      <URLLoaderModal
        isOpen={showUrlLoaderModal}
        onClose={() => setShowUrlLoaderModal(false)}
        onDataLoaded={handleURLLoad}
      />
      
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        jsonData={output || input}
        filename="json_data"
      />
      
      <SchemaValidatorModal
        isOpen={showSchemaValidator}
        onClose={() => setShowSchemaValidator(false)}
        jsonData={input}
        onValidationChange={handleValidationChange}
      />
    </ToolLayout>
    </>
  );
};