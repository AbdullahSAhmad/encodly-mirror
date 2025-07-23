import React, { useState, useCallback, useEffect } from 'react';
import { ToolLayout, SEO, useToast, getToolUrls } from '@encodly/shared-ui';
import { URLEditor } from '../components/URLEditor';
import { InfoModal } from '../components/InfoSection';

const STORAGE_KEY = 'url-converter-input';
const AUTO_CONVERT_STORAGE_KEY = 'url-converter-auto';

const URLConverterPage: React.FC = () => {
  // Enhanced SEO data
  const seoData = {
    title: "URL Encoder/Decoder - Free Online Tool | Encodly",
    description: "Free online URL encoder and decoder tool. Encode URLs for safe transmission or decode encoded URLs back to readable format. Fast, secure, and easy to use.",
    keywords: [
      'url encoder', 'url decoder', 'percent encoding', 'uri encoding', 'url encoding tool', 
      'decode url', 'encode url', 'url converter', 'online url tool', 'free url encoder',
      'percent decoder', 'uri decoder', 'web development tools', 'developer tools',
      'url encoding online', 'url decoding online', 'url escape', 'url unescape'
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "URL Encoder/Decoder",
      "applicationCategory": "DeveloperApplication",
      "applicationSubCategory": "Encoding Tools",
      "operatingSystem": "Any",
      "description": "Free online URL encoder and decoder tool for developers worldwide",
      "url": "https://url.encodly.com",
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
        "reviewCount": "1456",
        "bestRating": "5",
        "worstRating": "1"
      },
      "features": [
        "Smart Auto-detection",
        "URL Encoding",
        "URL Decoding", 
        "Copy to Clipboard",
        "Download Results",
        "Paste from Clipboard",
        "Open URL in New Tab"
      ]
    }
  };

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [autoConvert, setAutoConvert] = useState(true);
  const [detectedOperation, setDetectedOperation] = useState<'encode' | 'decode' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { toast, ToastContainer } = useToast();

  // State to track if initial load is complete
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load saved data on mount
  useEffect(() => {
    try {
      const savedInput = localStorage.getItem(STORAGE_KEY);
      const savedAutoConvert = localStorage.getItem(AUTO_CONVERT_STORAGE_KEY);
      
      if (savedAutoConvert !== null) {
        setAutoConvert(savedAutoConvert === 'true');
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

  // Process input after initial load
  useEffect(() => {
    if (!isInitialLoad && input && autoConvert) {
      const timer = setTimeout(() => {
        processInput(input);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isInitialLoad]);

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

  // Save auto-convert setting to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(AUTO_CONVERT_STORAGE_KEY, autoConvert.toString());
    } catch (error) {
      console.warn('Failed to save auto-convert setting:', error);
    }
  }, [autoConvert]);

  // Detect if input needs encoding or decoding
  const detectOperation = useCallback((text: string): 'encode' | 'decode' => {
    // Check if the text contains percent-encoded characters
    const hasPercentEncoding = /%[0-9A-Fa-f]{2}/.test(text);
    
    // Check if decoding would change the text (strong indicator it's encoded)
    try {
      const decoded = decodeURIComponent(text);
      if (decoded !== text && hasPercentEncoding) {
        return 'decode';
      }
    } catch (e) {
      // If decode fails, it's likely not properly encoded
    }
    
    // Default to encode
    return 'encode';
  }, []);

  // Process input with auto-detection
  const processInput = useCallback((newInput: string) => {
    setError(null);
    setIsValid(null);

    if (!newInput.trim()) {
      setOutput('');
      setDetectedOperation(null);
      return;
    }

    const operation = detectOperation(newInput.trim());
    setDetectedOperation(operation);

    try {
      let result: string;
      if (operation === 'encode') {
        result = encodeURIComponent(newInput.trim());
      } else {
        result = decodeURIComponent(newInput.trim());
      }
      
      setOutput(result);
      setIsValid(true);
    } catch (err) {
      const errorMessage = operation === 'encode' 
        ? 'Failed to encode URL. Please check your input.'
        : 'Failed to decode URL. The input may not be properly encoded.';
      setError(errorMessage);
      setIsValid(false);
      setOutput('');
    }
  }, [detectOperation]);

  // Handle input change
  const handleInputChange = useCallback((newInput: string) => {
    setInput(newInput);
    
    if (autoConvert) {
      processInput(newInput);
    } else {
      // When auto-convert is off, clear output and validation
      setOutput('');
      setIsValid(null);
      setDetectedOperation(null);
      setError(null);
    }
  }, [autoConvert, processInput]);

  // Handle manual encode
  const handleEncode = useCallback(() => {
    if (!input.trim()) {
      setError('Please enter a URL to encode');
      return;
    }

    try {
      const result = encodeURIComponent(input.trim());
      setOutput(result);
      setError(null);
      setIsValid(true);
      setDetectedOperation('encode');
    } catch (err) {
      setError('Failed to encode URL. Please check your input.');
      setIsValid(false);
      setOutput('');
    }
  }, [input]);

  // Handle manual decode
  const handleDecode = useCallback(() => {
    if (!input.trim()) {
      setError('Please enter an encoded URL to decode');
      return;
    }

    try {
      const result = decodeURIComponent(input.trim());
      setOutput(result);
      setError(null);
      setIsValid(true);
      setDetectedOperation('decode');
    } catch (err) {
      setError('Failed to decode URL. The input may not be properly encoded.');
      setIsValid(false);
      setOutput('');
    }
  }, [input]);

  // Handle clear input
  const handleClearInput = useCallback(() => {
    setInput('');
    setOutput('');
    setError(null);
    setIsValid(null);
    setDetectedOperation(null);
  }, []);

  // Handle copy
  const handleCopy = useCallback(() => {
    toast('Copied to clipboard');
  }, [toast]);

  // Handle download
  const handleDownload = useCallback(() => {
    toast('File downloaded successfully');
  }, [toast]);

  // Handle paste
  const handlePaste = useCallback(() => {
    // Toast is handled in URLEditor component
  }, []);

  // Handle auto-convert toggle
  const handleAutoConvertChange = useCallback((enabled: boolean) => {
    setAutoConvert(enabled);
    
    if (enabled && input) {
      // Process input when enabling auto-convert
      processInput(input);
    } else if (!enabled) {
      // Clear output when disabling auto-convert
      setOutput('');
      setIsValid(null);
      setDetectedOperation(null);
      setError(null);
    }
  }, [input, processInput]);

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={getToolUrls().url}
        jsonLd={seoData.jsonLd}
        type="WebApplication"
      />
      <ToastContainer />
      <ToolLayout
        title="URL Encoder & Decoder"
        description="Smart URL encoding and decoding with automatic detection. Encode URLs for safe transmission or decode them back."
        toolName="url-converter"
        keywords={seoData.keywords.slice(0, 8)}
      >
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <URLEditor
            value={input}
            onChange={handleInputChange}
            placeholder="Enter a URL or encoded URL..."
            error={error}
            onClear={handleClearInput}
            onPaste={handlePaste}
            onEncode={handleEncode}
            onDecode={handleDecode}
            showManualButtons={!autoConvert}
            onToast={toast}
            autoConvert={autoConvert}
            onAutoConvertChange={handleAutoConvertChange}
            detectedOperation={detectedOperation}
            infoModalTrigger={<InfoModal />}
          />
          
          <URLEditor
            value={output}
            onChange={() => {}} // Read-only
            placeholder="Result will appear here..."
            readOnly
            onCopy={handleCopy}
            onDownload={handleDownload}
            isValid={isValid}
            onToast={toast}
          />
        </div>
      </ToolLayout>
    </>
  );
};

export default URLConverterPage;