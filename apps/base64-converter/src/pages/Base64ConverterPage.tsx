import React, { useState, useCallback, useEffect } from 'react';
import { ToolLayout, SEO, useToast, getToolUrls } from '@encodly/shared-ui';
import { useAnalytics } from '@encodly/shared-analytics';
import { Base64Editor } from '../components/Base64Editor';
import { Base64Toolbar } from '../components/Base64Toolbar';
import { Info } from 'lucide-react';
import { InfoModal } from '../components/InfoModal';

const STORAGE_KEY = 'base64-converter-input';
const MODE_STORAGE_KEY = 'base64-converter-mode';

export const Base64ConverterPage: React.FC = () => {
  const seoData = {
    title: "Base64 Encoder & Decoder - Free Online Tool",
    description: "Free online Base64 encoder and decoder tool. Convert text to Base64 and decode Base64 back to text. Supports files and provides instant results.",
    keywords: [
      'base64 encoder', 'base64 decoder', 'base64 converter', 'base64 tool', 'online base64',
      'free base64 encoder', 'base64 file encoder', 'text to base64', 'base64 to text',
      'encoding tool', 'decoding tool', 'data conversion', 'web development tools',
      'developer utilities', 'programming tools', 'text converter', 'file encoder'
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Base64 Encoder & Decoder",
      "applicationCategory": "DeveloperApplication",
      "applicationSubCategory": "Encoding Tools",
      "operatingSystem": "Any",
      "description": "Free online Base64 encoder and decoder with AI-powered features for developers worldwide",
      "url": "https://base64.encodly.com",
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
        "ratingValue": "4.8",
        "reviewCount": "1923",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Text to Base64 Encoding",
        "Base64 to Text Decoding",
        "File Upload and Encoding",
        "Real-time Conversion",
        "Download Encoded Results",
        "Copy to Clipboard",
        "Input Validation",
        "AI-Powered Error Detection"
      ],
      "inLanguage": ["en", "ar"],
      "availableLanguage": ["English", "Arabic"],
      "serviceArea": {
        "@type": "Place",
        "name": "Worldwide",
        "additionalProperty": [
          {"@type": "PropertyValue", "name": "specialFocus", "value": "Middle East"},
          {"@type": "PropertyValue", "name": "primaryRegions", "value": "Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman"}
        ]
      }
    }
  };
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { toast, ToastContainer } = useToast();
  const { trackToolUsage, trackPageView } = useAnalytics();

  // State to track if initial load is complete
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Track page view on mount
  useEffect(() => {
    trackPageView('/base64-converter', 'Base64 Converter');
  }, [trackPageView]);

  // Load saved data on mount
  useEffect(() => {
    try {
      const savedInput = localStorage.getItem(STORAGE_KEY);
      const savedMode = localStorage.getItem(MODE_STORAGE_KEY) as 'encode' | 'decode';
      
      if (savedMode && (savedMode === 'encode' || savedMode === 'decode')) {
        setMode(savedMode);
      }
      if (savedInput) {
        setInput(savedInput);
      }
      setIsInitialLoad(false);
    } catch (error) {
      console.warn('Failed to load saved data:', error);
      setIsInitialLoad(false);
    }
  }, []);

  // Process saved input when mode changes
  useEffect(() => {
    if (input && !isInitialLoad) {
      handleInputChange(input);
    }
  }, [mode]); // Trigger when mode changes

  // Process input after initial load
  useEffect(() => {
    if (!isInitialLoad && input) {
      // Small delay to ensure handleInputChange is defined
      const timer = setTimeout(() => {
        handleInputChange(input);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isInitialLoad]); // Trigger when initial load completes

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

  // Save mode to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(MODE_STORAGE_KEY, mode);
    } catch (error) {
      console.warn('Failed to save mode:', error);
    }
  }, [mode]);

  // Handle input change with real-time conversion
  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    setError(null);
    
    if (!value.trim()) {
      setOutput('');
      setIsValid(null);
      return;
    }

    try {
      if (mode === 'encode') {
        const encoded = btoa(value);
        setOutput(encoded);
        setIsValid(true);
        trackToolUsage('base64-converter', 'encode', { success: true, length: value.length });
      } else {
        // Validate base64 format before decoding
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        if (!base64Regex.test(value.trim())) {
          throw new Error('Invalid Base64 format');
        }
        const decoded = atob(value.trim());
        setOutput(decoded);
        setIsValid(true);
        trackToolUsage('base64-converter', 'decode', { success: true, length: value.length });
      }
    } catch (err) {
      setError(mode === 'encode' ? 'Unable to encode text' : 'Invalid Base64 string');
      setOutput('');
      setIsValid(false);
      trackToolUsage('base64-converter', mode, { success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }, [mode, trackToolUsage]);

  // Handle mode change
  const handleModeChange = useCallback((newMode: 'encode' | 'decode') => {
    setMode(newMode);
    setInput('');
    setOutput('');
    setError(null);
    setIsValid(null);
    trackToolUsage('base64-converter', 'mode-change', { mode: newMode });
  }, [trackToolUsage]);

  // Handle file upload
  const handleFileUpload = useCallback((content: string) => {
    handleInputChange(content);
    trackToolUsage('base64-converter', 'file-upload', { mode, size: content.length });
  }, [handleInputChange, mode, trackToolUsage]);

  // Handle clear
  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError(null);
    setIsValid(null);
    trackToolUsage('base64-converter', 'clear');
  }, [trackToolUsage]);

  // Handle copy
  const handleCopy = useCallback(async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      trackToolUsage('base64-converter', 'copy', { mode, outputSize: output.length });
    }
  }, [output, mode, trackToolUsage]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (!output) return;
    
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    trackToolUsage('base64-converter', 'download', { mode, outputSize: output.length });
  }, [output, mode, trackToolUsage]);

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={getToolUrls().base64}
        jsonLd={seoData.jsonLd}
        type="WebApplication"
      />
      <ToastContainer />
      <ToolLayout
        title="Base64 Encoder & Decoder"
        description="Encode and decode Base64 data online with AI-powered features. Perfect for Middle East developers with file support."
        toolName="base64-converter"
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
      
      <div className="space-y-6">
        <Base64Toolbar
          mode={mode}
          onModeChange={handleModeChange}
        />
        
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Base64Editor
            value={input}
            onChange={handleInputChange}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
            error={error}
            label={mode === 'encode' ? 'Text Input' : 'Base64 Input'}
            onFileUpload={handleFileUpload}
            onClear={handleClear}
            isValid={isValid}
            onToast={toast}
          />
          
          <Base64Editor
            value={output}
            onChange={() => {}} // Read-only
            placeholder={mode === 'encode' ? 'Base64 encoded text will appear here...' : 'Decoded text will appear here...'}
            label={mode === 'encode' ? 'Base64 Output' : 'Text Output'}
            readOnly
            onCopy={handleCopy}
            onDownload={handleDownload}
            onToast={toast}
          />
        </div>
      </div>
    </ToolLayout>
    </>
  );
};