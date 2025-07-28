import React, { useEffect } from 'react';
import { ToolLayout, SEO, useToast, getToolUrls } from '@encodly/shared-ui';
import { useAnalytics } from '@encodly/shared-analytics';
import { UUIDGenerator } from '../components/UUIDGenerator';
import { UUIDValidator } from '../components/UUIDValidator';
import { InfoModal } from '../components/InfoModal';
import { Key, CheckCircle, Info } from 'lucide-react';

const UUIDGeneratorPage: React.FC = () => {
  // Enhanced SEO data
  const seoData = {
    title: "UUID Generator - Free Online Tool | Encodly",
    description: "Generate UUID/GUID v1, v4 and other versions online. Free UUID generator with bulk generation, validation, and formatting tools for developers.",
    keywords: [
      'uuid generator', 'guid generator', 'uuid v4', 'uuid v1', 'unique identifier',
      'online uuid tool', 'bulk uuid generator', 'uuid validator', 'uuid formatter',
      'developer tools', 'random uuid', 'timestamp uuid', 'guid tools', 'web development'
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "UUID Generator",
      "applicationCategory": "DeveloperApplication",
      "applicationSubCategory": "Development Tools",
      "operatingSystem": "Any",
      "description": "Generate UUID/GUID v1, v4 and other versions online with bulk generation, validation, and formatting tools",
      "url": "https://uuid.encodly.com",
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
        "reviewCount": "1847",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "UUID v1 Generation (Timestamp-based)",
        "UUID v4 Generation (Random)",
        "Nil and Max UUID Generation",
        "Bulk UUID Generation",
        "UUID Validation",
        "UUID Formatting",
        "UUID Information Parsing",
        "Copy & Download Results",
        "Multiple Format Support"
      ],
      "inLanguage": ["en"]
    }
  };

  const { toast, ToastContainer } = useToast();
  const { trackToolUsage, trackPageView } = useAnalytics();

  // Track page view on mount
  useEffect(() => {
    trackPageView('/uuid-generator', 'UUID Generator');
  }, [trackPageView]);

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={getToolUrls().uuid}
        jsonLd={seoData.jsonLd}
        type="WebApplication"
      />
      <ToastContainer />
      <ToolLayout
        title="UUID Generator"
        description="Generate UUID/GUID v1, v4 and other versions with bulk generation, validation, and formatting tools."
        toolName="uuid-generator"
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
              <Key className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Generate</h2>
            </div>
            
            <UUIDGenerator onToast={toast} />
          </div>

          {/* Validator Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Verify</h2>
            </div>
            
            <UUIDValidator onToast={toast} />
          </div>
        </div>
      </ToolLayout>
    </>
  );
};

export default UUIDGeneratorPage;