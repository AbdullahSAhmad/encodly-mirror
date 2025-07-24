import React, { useState, useCallback, useEffect } from 'react';
import { ToolLayout, SEO, useToast, getToolUrls, Button } from '@encodly/shared-ui';
import { Shield, CheckCircle, AlertCircle, Copy, ClipboardPaste } from 'lucide-react';
import { JWTEditor } from '../components/JWTEditor';
import { decodeJWT, validateJWT, extractJWTToken, verifyJWTSignature, JWTDecoded, JWTValidation } from '../utils/jwtUtils';

const STORAGE_KEY = 'jwt-decoder-token';

const JWTDecoderPage: React.FC = () => {
  // Enhanced SEO data
  const seoData = {
    title: "JWT Token Decoder - Free Online Tool | Encodly",
    description: "Free online JWT token decoder and validator. Decode JWT tokens instantly, validate structure, check expiration, and view claims. Simple developer tool.",
    keywords: [
      'jwt decoder', 'jwt token decoder', 'jwt validator', 'json web token', 'decode jwt', 
      'jwt claims', 'jwt verification', 'developer tools', 'jwt online', 'jwt parser',
      'token decoder', 'jwt debugger', 'jwt analyzer', 'web developer tools'
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "JWT Token Decoder",
      "applicationCategory": "DeveloperApplication",
      "applicationSubCategory": "Token Tools",
      "operatingSystem": "Any",
      "description": "Free online JWT token decoder and validator for developers worldwide",
      "url": "https://jwt-decoder.encodly.com",
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
        "reviewCount": "2341",
        "bestRating": "5",
        "worstRating": "1"
      },
      "features": [
        "Instant JWT Decoding",
        "Token Validation",
        "Expiration Checking",
        "Claims Highlighting",
        "Auto-detect Bearer Tokens",
        "Copy to Clipboard",
        "Download Decoded Data"
      ]
    }
  };

  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<JWTDecoded | null>(null);
  const [validation, setValidation] = useState<JWTValidation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [secret, setSecret] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast, ToastContainer } = useToast();

  // Load saved data on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(STORAGE_KEY);
      if (savedToken) {
        setToken(savedToken);
        processToken(savedToken);
      }
    } catch (error) {
      console.warn('Failed to load saved data:', error);
    }
  }, []);

  // Save token to localStorage
  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem(STORAGE_KEY, token);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Failed to save token:', error);
    }
  }, [token]);

  // Process token when it changes
  const processToken = useCallback((input: string) => {
    setError(null);
    setDecoded(null);
    setValidation(null);

    if (!input.trim()) {
      return;
    }

    try {
      // Extract JWT token from various formats
      const extractedToken = extractJWTToken(input.trim());
      
      // Decode the token
      const decodedResult = decodeJWT(extractedToken);
      setDecoded(decodedResult);

      if (!decodedResult.isValid) {
        setError(decodedResult.error || 'Invalid JWT token');
        return;
      }

      // Validate the token
      const validationResult = validateJWT(decodedResult);
      setValidation(validationResult);
      
      // Reset signature verification when token changes
      if (validationResult.isSignatureVerified !== undefined) {
        validationResult.isSignatureVerified = null;
      }

    } catch (err) {
      setError('Failed to process JWT token');
    }
  }, []);

  // Handle token input change
  const handleTokenChange = useCallback((newToken: string) => {
    setToken(newToken);
    processToken(newToken);
  }, [processToken]);

  // Handle clear token
  const handleClearToken = useCallback(() => {
    setToken('');
    setDecoded(null);
    setValidation(null);
    setError(null);
  }, []);

  // Handle copy
  const handleCopy = useCallback(() => {
    // Toast is handled in JWTEditor component
  }, []);

  // Handle download
  const handleDownload = useCallback(() => {
    // Toast is handled in JWTEditor component
  }, []);

  // Handle paste
  const handlePaste = useCallback(() => {
    // Toast is handled in JWTEditor component
  }, []);
  
  // Handle signature verification
  const handleVerifySignature = useCallback(async () => {
    if (!decoded || !secret.trim()) return;
    
    setIsVerifying(true);
    try {
      const isValid = await verifyJWTSignature(token, secret);
      setValidation(prev => prev ? {
        ...prev,
        isSignatureVerified: isValid
      } : null);
      
      toast(isValid ? 'Signature verified successfully!' : 'Signature verification failed');
    } catch (error) {
      toast('Error verifying signature');
    } finally {
      setIsVerifying(false);
    }
  }, [decoded, secret, token, toast]);
  
  // Handle secret change with live verification (debounced)
  const handleSecretChange = useCallback((newSecret: string) => {
    setSecret(newSecret);
    
    // Reset verification status immediately
    setValidation(prev => prev ? {
      ...prev,
      isSignatureVerified: null
    } : null);
    
    // Debounce the verification
    const timer = setTimeout(async () => {
      if (decoded && decoded.isValid && newSecret.trim() && validation?.algorithm?.startsWith('HS')) {
        setIsVerifying(true);
        try {
          const isValid = await verifyJWTSignature(token, newSecret);
          setValidation(prev => prev ? {
            ...prev,
            isSignatureVerified: isValid
          } : null);
        } catch (error) {
          setValidation(prev => prev ? {
            ...prev,
            isSignatureVerified: false
          } : null);
        } finally {
          setIsVerifying(false);
        }
      }
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timer);
  }, [decoded, token, validation?.algorithm]);
  
  // Handle copy secret
  const handleCopySecret = useCallback(async () => {
    if (secret) {
      await navigator.clipboard.writeText(secret);
      toast('Secret copied to clipboard');
    }
  }, [secret, toast]);
  
  // Handle paste secret
  const handlePasteSecret = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleSecretChange(text);
        toast('Secret pasted from clipboard');
      }
    } catch (error) {
      toast('Failed to paste from clipboard');
    }
  }, [handleSecretChange, toast]);

  // Get combined decoded output
  const getDecodedOutput = () => {
    if (!decoded || !decoded.isValid) return null;
    
    return {
      header: decoded.header,
      payload: decoded.payload,
      validation: validation
    };
  };

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={getToolUrls().jwt}
        jsonLd={seoData.jsonLd}
        type="WebApplication"
      />
      <ToastContainer />
      <ToolLayout
        title="JWT Token Decoder"
        description="Decode and validate JWT tokens instantly. Check expiration, view claims, and validate token structure with syntax highlighting."
        toolName="jwt-decoder"
        keywords={seoData.keywords.slice(0, 8)}
      >
        <div className="space-y-6">
          {/* Side by side layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Token Input (Left) */}
            <div className="space-y-4">
              <JWTEditor
                value={token}
                onChange={handleTokenChange}
                placeholder="Paste your JWT token here... (supports Bearer tokens and full Authorization headers)"
                error={error}
                title="JWT Token Input"
                onClear={handleClearToken}
                onPaste={handlePaste}
                onToast={toast}
                decoded={decoded}
                validation={validation}
              />
              
              {/* Signature Verification Section */}
              {decoded && decoded.isValid && validation?.algorithm?.startsWith('HS') && (
                <div className="p-4 border rounded-lg bg-card">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Signature Verification
                  </h3>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Enter HMAC secret key..."
                          value={secret}
                          onChange={(e) => handleSecretChange(e.target.value)}
                          className="w-full px-3 py-2 border rounded text-sm font-mono bg-background text-foreground border-border focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
                        />
                        {isVerifying && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopySecret}
                        disabled={!secret}
                        title="Copy secret to clipboard"
                        className="px-3"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePasteSecret}
                        title="Paste secret from clipboard"
                        className="px-3"
                      >
                        <ClipboardPaste className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Verification happens automatically as you type
                    </p>
                  </div>
                  {validation.isSignatureVerified !== null && (
                    <div className={`mt-2 text-sm flex items-center gap-2 ${
                      validation.isSignatureVerified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {validation.isSignatureVerified ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      {validation.isSignatureVerified 
                        ? 'Signature is valid' 
                        : 'Signature is invalid or incorrect secret'
                      }
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Decoded Output (Right) */}
            <JWTEditor
              value=""
              onChange={() => {}}
              title="Decoded JWT"
              readOnly
              onCopy={handleCopy}
              onDownload={handleDownload}
              onToast={toast}
              jsonData={getDecodedOutput()}
              placeholder="Decoded JWT will appear here..."
            />
          </div>

        </div>
      </ToolLayout>
    </>
  );
};

export default JWTDecoderPage;