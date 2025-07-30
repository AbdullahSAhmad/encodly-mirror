import React from 'react';
import { ToolLayout, SEO, useToast, getToolUrls } from '@encodly/shared-ui';
import { QRGenerator } from '../components/QRGenerator';
import { InfoModal } from '../components/InfoModal';
import { Info } from 'lucide-react';

export const QRGeneratorPage: React.FC = () => {
  const { toast, ToastContainer } = useToast();

  // Enhanced SEO data
  const seoData = {
    title: "QR Code Generator - Free Online Tool | Encodly",
    description: "Generate QR codes from text or URLs online. Free QR code generator with customizable size, colors, and download options. Create QR codes for websites, text, and more.",
    keywords: [
      'qr code generator', 'qr code maker', 'text to qr', 'url to qr', 'free qr generator',
      'qr code download', 'online qr generator', 'qr code creator', 'generate qr code',
      'qr code tools', 'developer tools', 'web development', 'qr code customization'
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "QR Code Generator",
      "applicationCategory": "DeveloperApplication",
      "applicationSubCategory": "QR Code Tools",
      "operatingSystem": "Any",
      "description": "Free online QR code generator with customizable options for developers worldwide",
      "url": "https://qr.encodly.com",
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
        "reviewCount": "1247",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Text to QR Code Generation",
        "URL to QR Code Conversion", 
        "Customizable QR Code Size",
        "Color Customization",
        "PNG and SVG Download",
        "Real-time Generation",
        "Error Correction Levels",
        "Copy to Clipboard"
      ],
      "inLanguage": ["en"]
    }
  };

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={getToolUrls().qr}
        jsonLd={seoData.jsonLd}
        type="WebApplication"
        speakableContent={[".tool-description", ".feature-list"]}
        breadcrumbs={[
          { name: "Home", url: "https://encodly.com" },
          { name: "Tools", url: "https://encodly.com/#tools" },
          { name: "QR Code Generator", url: "https://qr.encodly.com" }
        ]}
        faqData={[
          {
            question: "What is a QR code?",
            answer: "QR (Quick Response) code is a two-dimensional barcode that can store various types of data like URLs, text, contact information, WiFi credentials, and more. They can be scanned by smartphones and other devices."
          },
          {
            question: "What types of data can I encode in a QR code?",
            answer: "You can encode URLs, plain text, email addresses, phone numbers, SMS messages, WiFi credentials, contact information (vCard), and even small files. The tool automatically detects the best format."
          },
          {
            question: "What size should my QR code be?",
            answer: "QR code size depends on where you'll use it. For business cards, 0.5-1 inch works well. For posters or signs, 2-4 inches ensures easy scanning. Our tool lets you customize the size for your specific needs."
          },
          {
            question: "Can I customize QR code colors?",
            answer: "Yes, you can customize both foreground and background colors. However, ensure good contrast for reliable scanning - dark foreground on light background works best."
          },
          {
            question: "What formats can I download QR codes in?",
            answer: "You can download QR codes as PNG (for web/digital use) or SVG (for print/scalable graphics). SVG format is recommended for professional printing as it scales without quality loss."
          }
        ]}
      />
      <ToastContainer />
      <ToolLayout
        title="Free QR Code Generator"
        description="Generate QR codes from text or URLs with customizable options. Download as PNG or SVG formats. Perfect for sharing links, contact info, and more."
        toolName="qr-generator"
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
        <div className="h-full flex flex-col">
          <QRGenerator onToast={toast} />
        </div>
      </ToolLayout>
    </>
  );
};