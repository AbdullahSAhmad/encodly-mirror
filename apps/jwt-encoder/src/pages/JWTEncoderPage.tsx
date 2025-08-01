import React, { useState, useCallback, useEffect } from 'react';
import { ToolLayout, SEO, useToast, getToolUrls, Button } from '@encodly/shared-ui';
import { useAnalytics } from '@encodly/shared-analytics';
import { JWTEditor } from '../components/JWTEditor';
import { EncoderSettings } from '../components/EncoderSettings';
import { encodeJWT, validateAndParseJSON, formatJSON, DEFAULT_HEADER, DEFAULT_PAYLOAD, JWTEncoded } from '../utils/jwtUtils';
import { Key, Dice3, Info } from 'lucide-react';
import { InfoModal } from '../components/InfoModal';

const HEADER_STORAGE_KEY = 'jwt-encoder-header';
const PAYLOAD_STORAGE_KEY = 'jwt-encoder-payload';
const SECRET_STORAGE_KEY = 'jwt-encoder-secret';
const ALGORITHM_STORAGE_KEY = 'jwt-encoder-algorithm';

const JWTEncoderPage: React.FC = () => {
  // Enhanced SEO data
  const seoData = {
    title: "JWT Token Encoder - Free Online Tool | Encodly",
    description: "Free online JWT token encoder and creator. Create JWT tokens with custom headers and payloads, sign with secrets, and generate tokens instantly. Simple developer tool.",
    keywords: [
      'jwt encoder', 'jwt token encoder', 'jwt creator', 'jwt generator', 'json web token',
      'create jwt', 'jwt builder', 'jwt signing', 'online jwt tool', 'free jwt encoder',
      'jwt token creator', 'developer tools', 'web development tools', 'jwt online tool'
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "JWT Token Encoder",
      "applicationCategory": "DeveloperApplication",
      "applicationSubCategory": "Token Tools",
      "operatingSystem": "Any",
      "description": "Free online JWT token encoder and creator for developers worldwide",
      "url": "https://jwt-encoder.encodly.com",
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
        "reviewCount": "1432",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "JWT Token Creation",
        "Custom Header Support",
        "Custom Payload Support",
        "HMAC Signing (HS256, HS384, HS512)",
        "Payload Templates",
        "Real-time Validation",
        "Copy to Clipboard",
        "Download Generated Tokens",
        "Real-time Token Generation"
      ],
      "inLanguage": ["en"]
    }
  };

  const [headerJson, setHeaderJson] = useState(formatJSON(DEFAULT_HEADER));
  const [payloadJson, setPayloadJson] = useState(formatJSON(DEFAULT_PAYLOAD));
  const [secret, setSecret] = useState('your-256-bit-secret');
  const [algorithm, setAlgorithm] = useState('HS256');
  const [generatedToken, setGeneratedToken] = useState('');
  const [headerError, setHeaderError] = useState<string | null>(null);
  const [payloadError, setPayloadError] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isHeaderValid, setIsHeaderValid] = useState<boolean | null>(null);
  const [isPayloadValid, setIsPayloadValid] = useState<boolean | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { toast, ToastContainer } = useToast();
  const { trackToolUsage, trackPageView } = useAnalytics();

  // Track page view on mount
  useEffect(() => {
    trackPageView('/jwt-encoder', 'JWT Encoder');
  }, [trackPageView]);

  // Load saved data on mount
  useEffect(() => {
    try {
      const savedHeader = localStorage.getItem(HEADER_STORAGE_KEY);
      const savedPayload = localStorage.getItem(PAYLOAD_STORAGE_KEY);
      const savedSecret = localStorage.getItem(SECRET_STORAGE_KEY);
      const savedAlgorithm = localStorage.getItem(ALGORITHM_STORAGE_KEY);

      if (savedHeader) setHeaderJson(savedHeader);
      if (savedPayload) setPayloadJson(savedPayload);
      if (savedSecret) setSecret(savedSecret);
      if (savedAlgorithm) setAlgorithm(savedAlgorithm);
    } catch (error) {
      console.warn('Failed to load saved data:', error);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HEADER_STORAGE_KEY, headerJson);
    } catch (error) {
      console.warn('Failed to save header:', error);
    }
  }, [headerJson]);

  useEffect(() => {
    try {
      localStorage.setItem(PAYLOAD_STORAGE_KEY, payloadJson);
    } catch (error) {
      console.warn('Failed to save payload:', error);
    }
  }, [payloadJson]);

  useEffect(() => {
    try {
      localStorage.setItem(SECRET_STORAGE_KEY, secret);
    } catch (error) {
      console.warn('Failed to save secret:', error);
    }
  }, [secret]);

  useEffect(() => {
    try {
      localStorage.setItem(ALGORITHM_STORAGE_KEY, algorithm);
    } catch (error) {
      console.warn('Failed to save algorithm:', error);
    }
  }, [algorithm]);

  // Validate JSON inputs in real-time
  useEffect(() => {
    const headerValidation = validateAndParseJSON(headerJson);
    setHeaderError(headerValidation.isValid ? null : headerValidation.error || 'Invalid JSON');
    setIsHeaderValid(headerValidation.isValid);
  }, [headerJson]);

  useEffect(() => {
    const payloadValidation = validateAndParseJSON(payloadJson);
    setPayloadError(payloadValidation.isValid ? null : payloadValidation.error || 'Invalid JSON');
    setIsPayloadValid(payloadValidation.isValid);
  }, [payloadJson]);

  const handleGenerateToken = useCallback(async (showToast = true) => {
    if (!isHeaderValid || !isPayloadValid || !secret.trim()) {
      setTokenError('Please provide valid header, payload, and secret');
      return;
    }

    try {
      setIsGenerating(true);
      setTokenError(null);
      
      const headerValidation = validateAndParseJSON(headerJson);
      const payloadValidation = validateAndParseJSON(payloadJson);
      
      if (!headerValidation.isValid || !payloadValidation.isValid) {
        setTokenError('Invalid JSON in header or payload');
        return;
      }

      const result = await encodeJWT(
        headerValidation.data,
        payloadValidation.data,
        secret,
        algorithm as 'HS256' | 'HS384' | 'HS512'
      );

      if (result.success && result.token) {
        setGeneratedToken(result.token);
        if (showToast) {
          toast('JWT token generated successfully!');
          trackToolUsage('jwt-encoder', 'generate-token');
        }
      } else {
        setTokenError(result.error || 'Failed to generate token');
      }
    } catch (error) {
      console.error('Token generation error:', error);
      setTokenError('Failed to generate JWT token');
    } finally {
      setIsGenerating(false);
    }
  }, [headerJson, payloadJson, secret, algorithm, isHeaderValid, isPayloadValid, toast, trackToolUsage]);

  // Auto-generate token when inputs are valid and not empty
  useEffect(() => {
    if (isHeaderValid && isPayloadValid && secret.trim() && headerJson.trim() && payloadJson.trim()) {
      const timeoutId = setTimeout(() => {
        handleGenerateToken(false); // Silent generation for auto-update
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setGeneratedToken('');
      setTokenError(null);
    }
  }, [headerJson, payloadJson, secret, algorithm, isHeaderValid, isPayloadValid, handleGenerateToken]);

  const handleRandomPayload = useCallback(() => {
    const randomPayloads = [
      {
        sub: '1234567890',
        name: 'John Doe',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600
      },
      {
        sub: 'user-456',
        email: 'user@example.com',
        role: 'admin',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 7200
      },
      {
        sub: 'api-client-123',
        aud: 'api.example.com',
        scope: 'read write',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 1800
      }
    ];
    
    const randomPayload = randomPayloads[Math.floor(Math.random() * randomPayloads.length)];
    setPayloadJson(formatJSON(randomPayload));
    toast('Random payload generated');
    trackToolUsage('jwt-encoder', 'random-payload');
  }, [toast, trackToolUsage]);

  const handleShareToken = useCallback(async () => {
    if (generatedToken) {
      try {
        if (navigator.share) {
          await navigator.share({
            title: 'JWT Token',
            text: 'Generated JWT Token',
            url: window.location.href
          });
        } else {
          // Fallback to copying URL with token in query param
          const url = new URL(window.location.href);
          url.searchParams.set('token', generatedToken);
          await navigator.clipboard.writeText(url.toString());
          toast('Shareable URL copied to clipboard!');
        }
        trackToolUsage('jwt-encoder', 'share-token');
      } catch (err) {
        toast('Failed to share token');
      }
    }
  }, [generatedToken, toast, trackToolUsage]);

  const handleDownloadToken = useCallback(() => {
    if (generatedToken) {
      const blob = new Blob([generatedToken], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'jwt-token.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast('Token downloaded successfully!');
      trackToolUsage('jwt-encoder', 'download-token');
    }
  }, [generatedToken, toast, trackToolUsage]);

  const handleCopyToken = useCallback(async () => {
    if (generatedToken) {
      try {
        await navigator.clipboard.writeText(generatedToken);
        toast('Token copied to clipboard!');
        trackToolUsage('jwt-encoder', 'copy-token');
      } catch (err) {
        toast('Failed to copy token to clipboard');
      }
    }
  }, [generatedToken, toast, trackToolUsage]);

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={getToolUrls().jwtEncoder}
        jsonLd={seoData.jsonLd}
        type="WebApplication"
        speakableContent={[".tool-description", ".feature-list"]}
        breadcrumbs={[
          { name: "Home", url: "https://encodly.com" },
          { name: "Tools", url: "https://encodly.com/#tools" },
          { name: "JWT Encoder", url: "https://jwt-encoder.encodly.com" }
        ]}
        faqData={[
          {
            question: "What is JWT token encoding?",
            answer: "JWT encoding is the process of creating a JSON Web Token by combining a header, payload, and signature. The token is then base64url encoded and signed with a secret key."
          },
          {
            question: "How do I create a JWT token?",
            answer: "Enter your custom header and payload in JSON format, provide a secret key, choose an algorithm (HS256, HS384, or HS512), and the tool will automatically generate your signed JWT token."
          },
          {
            question: "What should I put in the JWT payload?",
            answer: "The payload contains claims about the user and additional metadata. Common claims include 'sub' (subject), 'iat' (issued at), 'exp' (expiration), 'aud' (audience), and custom claims specific to your application."
          },
          {
            question: "Is my secret key secure?",
            answer: "Yes, all JWT generation happens entirely in your browser. Your secret keys never leave your device and are not sent to our servers, ensuring complete security."
          },
          {
            question: "Which JWT algorithm should I use?",
            answer: "HS256 is the most commonly used and recommended for most applications. HS384 and HS512 provide stronger security but are slower. Choose based on your security requirements and performance needs."
          }
        ]}
      />
      <ToastContainer />
      <ToolLayout
        title="Free JWT Token Encoder"
        description="Create and sign JWT tokens with custom headers and payloads. Simple JWT encoder with real-time generation."
        toolName="jwt-encoder"
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
          {/* Info Bar */}
          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              Auto-generates as you type when all fields are valid
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="space-y-6">
            {/* Top Row - Header, Payload, and Secret */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <JWTEditor
                value={headerJson}
                onChange={setHeaderJson}
                placeholder="Enter JWT header JSON..."
                error={headerError}
                label="Header"
                isValid={isHeaderValid}
                onToast={toast}
                language="json"
                height="300px"
              />

              <JWTEditor
                value={payloadJson}
                onChange={setPayloadJson}
                placeholder="Enter JWT payload JSON..."
                error={payloadError}
                label="Payload"
                isValid={isPayloadValid}
                onToast={toast}
                language="json"
                height="300px"
                onRandomPayload={handleRandomPayload}
              />

              <div className="space-y-4">
                <EncoderSettings
                  algorithm={algorithm}
                  onAlgorithmChange={setAlgorithm}
                  secret={secret}
                  onSecretChange={setSecret}
                  onToast={toast}
                />
              </div>
            </div>

            {/* Bottom Row - Generated Token */}
            <JWTEditor
              value={generatedToken}
              onChange={() => {}} // Read-only
              placeholder="Generated JWT token will appear here..."
              error={tokenError}
              label="Generated JWT Token"
              readOnly
              onCopy={handleCopyToken}
              onDownload={handleDownloadToken}
              onShare={handleShareToken}
              onToast={toast}
              language="text"
              height="200px"
              showTokenColors={true}
              isValid={generatedToken && !tokenError ? true : tokenError ? false : null}
            />
          </div>
        </div>
      </ToolLayout>
    </>
  );
};

export default JWTEncoderPage;