import React, { useState, useCallback, useEffect } from 'react';
import { ToolLayout, SEO, useToast } from '@encodly/shared-ui';
import { Base64Editor } from '../components/Base64Editor';
import { Base64Toolbar } from '../components/Base64Toolbar';

const STORAGE_KEY = 'base64-converter-input';
const MODE_STORAGE_KEY = 'base64-converter-mode';

export const Base64ConverterPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { toast, ToastContainer } = useToast();

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
    } catch (error) {
      console.warn('Failed to load saved data:', error);
    }
  }, []);

  // Process saved input when mode changes or input is loaded
  useEffect(() => {
    if (input) {
      handleInputChange(input);
    }
  }, [mode]); // Trigger when mode changes

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
      } else {
        // Validate base64 format before decoding
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        if (!base64Regex.test(value.trim())) {
          throw new Error('Invalid Base64 format');
        }
        const decoded = atob(value.trim());
        setOutput(decoded);
        setIsValid(true);
      }
    } catch (err) {
      setError(mode === 'encode' ? 'Unable to encode text' : 'Invalid Base64 string');
      setOutput('');
      setIsValid(false);
    }
  }, [mode]);

  // Handle mode change
  const handleModeChange = useCallback((newMode: 'encode' | 'decode') => {
    setMode(newMode);
    setInput('');
    setOutput('');
    setError(null);
    setIsValid(null);
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((content: string) => {
    handleInputChange(content);
  }, [handleInputChange]);

  // Handle clear
  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError(null);
    setIsValid(null);
  }, []);

  // Handle copy
  const handleCopy = useCallback(async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
    }
  }, [output]);

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
  }, [output, mode]);

  return (
    <>
      <ToastContainer />
      <ToolLayout
        title="Base64 Encoder & Decoder"
        description="Encode and decode Base64 data online. Convert text to Base64 and Base64 to text instantly."
      >
      <SEO
        title="Base64 Encoder & Decoder - Free Online Tool"
        description="Encode and decode Base64 data online. Free Base64 converter with support for text and file encoding. Fast, secure, no ads, no signup required."
        keywords={["base64 encoder", "base64 decoder", "base64 converter", "encode base64", "decode base64", "online base64 tool"]}
        canonicalUrl="https://base64.encodly.com"
      />
      
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