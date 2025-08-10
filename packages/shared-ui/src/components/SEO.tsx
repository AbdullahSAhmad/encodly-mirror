import React from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  jsonLd?: any;
  twitterCard?: string;
  siteName?: string;
  locale?: string;
  type?: string;
  speakableContent?: string[];
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqData?: Array<{ question: string; answer: string }>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = 'https://encodly.com/og-default.png',
  jsonLd,
  twitterCard = 'summary_large_image',
  siteName = 'Encodly',
  locale = 'en_US',
  type = 'website',
  speakableContent = [],
  breadcrumbs = [],
  faqData = []
}) => {
  React.useEffect(() => {
    // Update document title with Encodly prefix if not already present
    // Extract core app name from long descriptive titles
    let coreTitle = title;
    if (title.includes(' - ')) {
      coreTitle = title.split(' - ')[0]; // Take the part before the first dash
    }
    
    const formattedTitle = coreTitle.startsWith('Encodly') ? title : `Encodly | ${coreTitle}`;
    document.title = formattedTitle;
    
    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let metaTag = document.querySelector(selector) as HTMLMetaElement;
      if (metaTag) {
        metaTag.content = content;
      } else {
        metaTag = document.createElement('meta');
        if (property) {
          metaTag.setAttribute('property', name);
        } else {
          metaTag.setAttribute('name', name);
        }
        metaTag.content = content;
        document.head.appendChild(metaTag);
      }
    };

    // Basic meta tags
    updateMetaTag('description', description);
    if (keywords && Array.isArray(keywords) && keywords.length > 0) {
      updateMetaTag('keywords', keywords.join(', '));
    }
    updateMetaTag('author', 'Encodly');
    updateMetaTag('robots', 'index, follow');
    
    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:site_name', siteName, true);
    updateMetaTag('og:locale', locale, true);
    if (canonicalUrl) {
      updateMetaTag('og:url', canonicalUrl, true);
    }
    
    // Twitter Card tags
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:site', '@encodly');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);
    
    // Canonical URL - ensure it's clean without query parameters
    if (canonicalUrl) {
      // Remove any query parameters from canonical URL
      const cleanCanonicalUrl = canonicalUrl.split('?')[0];
      
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (canonicalLink) {
        canonicalLink.href = cleanCanonicalUrl;
      } else {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        canonicalLink.href = cleanCanonicalUrl;
        document.head.appendChild(canonicalLink);
      }
    }
    
    // JSON-LD structured data
    const structuredData = [];
    
    // Add main jsonLd data
    if (jsonLd) {
      structuredData.push(jsonLd);
    }
    
    // Add speakable schema
    if (speakableContent.length > 0) {
      structuredData.push({
        "@context": "https://schema.org",
        "@type": "SpeakableSpecification",
        "cssSelector": speakableContent
      });
    }
    
    // Add breadcrumb schema
    if (breadcrumbs.length > 0) {
      structuredData.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": breadcrumb.name,
          "item": breadcrumb.url
        }))
      });
    }
    
    // Add FAQ schema
    if (faqData.length > 0) {
      structuredData.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      });
    }
    
    // Update JSON-LD script with all structured data
    if (structuredData.length > 0) {
      let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
      if (jsonLdScript) {
        jsonLdScript.textContent = JSON.stringify(structuredData);
      } else {
        jsonLdScript = document.createElement('script');
        jsonLdScript.setAttribute('type', 'application/ld+json');
        jsonLdScript.textContent = JSON.stringify(structuredData);
        document.head.appendChild(jsonLdScript);
      }
    }
  }, [title, description, keywords, canonicalUrl, ogImage, jsonLd, twitterCard, siteName, locale, type, speakableContent, breadcrumbs, faqData]);

  return null;
};