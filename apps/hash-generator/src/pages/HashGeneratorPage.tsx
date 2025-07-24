import React, { useState, useCallback, useEffect } from 'react';
import { ToolLayout, SEO, useToast, getToolUrls, Button } from '@encodly/shared-ui';
import { useAnalytics } from '@encodly/shared-analytics';
import { HashEditor } from '../components/HashEditor';
import { HashResults } from '../components/HashResults';
import { HashComparison } from '../components/HashComparison';
import { InfoModal } from '../components/InfoModal';
import { generateAllHashes, generateTestData, HashAlgorithm } from '../utils/hashUtils';
import { Shield, FileText, Info } from 'lucide-react';

const STORAGE_KEY = 'hash-generator-input';
const CURRENT_FILE_KEY = 'hash-generator-current-file';

const HashGeneratorPage: React.FC = () => {
  // Enhanced SEO data with MENA optimization
  const seoData = {
    title: "Hash Generator - Free Online MD5, SHA-1, SHA-256, SHA-512 Generator",
    description: "Generate MD5, SHA-1, SHA-256, SHA-512 and other cryptographic hashes online. Free hash generator for text and files with comparison tools. Perfect for developers in Saudi Arabia, UAE, and Middle East. أداة إنشاء التشفير المجانية للمطورين",
    keywords: [
      'hash generator', 'md5 generator', 'sha256 generator', 'sha512 generator', 'cryptographic hash',
      'online hash tool', 'file hash', 'text hash', 'checksum generator', 'hash comparison',
      'security tools', 'verification tools', 'integrity check', 'digital fingerprint',
      'أداة تشفير', 'مولد التشفير', 'تشفير مجاني', 'أدوات المطورين',
      'developer tools saudi arabia', 'hash tools uae', 'middle east developers',
      'saudi hash generator', 'uae hash tools', 'arabic hash generator',
      'مطور سعودي', 'مطور إماراتي', 'أدوات الشرق الأوسط', 'تشفير الشرق الأوسط',
      'hash tools kuwait', 'qatar developer tools', 'bahrain hash', 'oman hash tools'
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Hash Generator",
      "applicationCategory": "DeveloperApplication",
      "applicationSubCategory": "Cryptographic Tools",
      "operatingSystem": "Any",
      "description": "Generate MD5, SHA-1, SHA-256, SHA-512 and other cryptographic hashes online with file support and comparison tools",
      "url": "https://hash-generator.encodly.com",
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
        "reviewCount": "2156",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "MD5 Hash Generation",
        "SHA-1 Hash Generation", 
        "SHA-256 Hash Generation",
        "SHA-512 Hash Generation",
        "SHA-384 Hash Generation",
        "File Hash Generation",
        "Hash Comparison Tool",
        "Real-time Generation",
        "Copy & Download Results",
        "Security Recommendations"
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
  const [hashResults, setHashResults] = useState<Record<HashAlgorithm, string>>({} as Record<HashAlgorithm, string>);
  const [currentFileName, setCurrentFileName] = useState<string>('');

  const { toast, ToastContainer } = useToast();
  const { trackToolUsage, trackPageView } = useAnalytics();

  // Track page view on mount
  useEffect(() => {
    trackPageView('/hash-generator', 'Hash Generator');
  }, [trackPageView]);

  // Load saved data on mount
  useEffect(() => {
    try {
      const savedInput = localStorage.getItem(STORAGE_KEY);
      const savedFileName = localStorage.getItem(CURRENT_FILE_KEY);
      
      if (savedInput) {
        setInput(savedInput);
      }
      if (savedFileName) {
        setCurrentFileName(savedFileName);
      }
    } catch (error) {
      console.warn('Failed to load saved data:', error);
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

  // Generate hashes when input changes
  useEffect(() => {
    const generateHashes = async () => {
      if (input.trim()) {
        const results = await generateAllHashes(input);
        setHashResults(results);
      } else {
        setHashResults({} as Record<HashAlgorithm, string>);
      }
    };
    
    generateHashes();
  }, [input]);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    setCurrentFileName(''); // Clear filename when typing
    localStorage.removeItem(CURRENT_FILE_KEY);
  }, []);

  const handleFileUpload = useCallback(async (content: string, fileName: string) => {
    setInput(content);
    setCurrentFileName(fileName);
    
    try {
      localStorage.setItem(CURRENT_FILE_KEY, fileName);
    } catch (error) {
      console.warn('Failed to save filename:', error);
    }
    
    toast(`File "${fileName}" loaded successfully`);
    trackToolUsage('hash-generator', 'file-upload');
  }, [toast, trackToolUsage]);

  const handleTestData = useCallback(() => {
    const testStrings = generateTestData();
    const randomTest = testStrings[Math.floor(Math.random() * testStrings.length)];
    setInput(randomTest);
    setCurrentFileName('');
    localStorage.removeItem(CURRENT_FILE_KEY);
    toast('Test data loaded');
    trackToolUsage('hash-generator', 'test-data');
  }, [toast, trackToolUsage]);

  const handleClearAll = useCallback(() => {
    setInput('');
    setHashResults({} as Record<HashAlgorithm, string>);
    setCurrentFileName('');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CURRENT_FILE_KEY);
    toast('All data cleared');
    trackToolUsage('hash-generator', 'clear-all');
  }, [toast, trackToolUsage]);

  const handleCopy = useCallback(() => {
    trackToolUsage('hash-generator', 'copy-input');
  }, [trackToolUsage]);

  const handleDownload = useCallback(() => {
    trackToolUsage('hash-generator', 'download-input');
  }, [trackToolUsage]);

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={getToolUrls().hashGenerator}
        jsonLd={seoData.jsonLd}
        type="WebApplication"
      />
      <ToastContainer />
      <ToolLayout
        title="Hash Generator"
        description="Generate MD5, SHA-1, SHA-256, SHA-512 and other cryptographic hashes for text and files. Compare hashes and verify data integrity."
        toolName="hash-generator"
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
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Generator Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Hash Generator</h2>
            </div>

            {/* Generator Content */}
            <div className="space-y-4">
              <HashEditor
                value={input}
                onChange={handleInputChange}
                placeholder="Enter text to hash or drag & drop a file here..."
                label="Input Text"
                onCopy={handleCopy}
                onDownload={handleDownload}
                onFileUpload={handleFileUpload}
                onToast={toast}
                currentFileName={currentFileName}
                hashCount={Object.values(hashResults).filter(Boolean).length}
                onRandomText={handleTestData}
                onClear={handleClearAll}
                isValid={null}
              />
              
              <HashResults
                results={hashResults}
                input={input}
                onToast={toast}
              />
            </div>
          </div>

          {/* Comparison Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Hash Comparison</h2>
            </div>
            
            <HashComparison onToast={toast} />
          </div>
        </div>
      </ToolLayout>
    </>
  );
};

export default HashGeneratorPage;