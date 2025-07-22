import React from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  jsonLd?: any;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage,
  jsonLd
}) => {
  // Use optional parameters to avoid unused variable warnings
  void canonicalUrl;
  void ogImage;
  void jsonLd;
  React.useEffect(() => {
    document.title = `${title} | DevTools`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && Array.isArray(keywords) && keywords.length > 0) {
      metaKeywords.setAttribute('content', keywords.join(', '));
    }
  }, [title, description, keywords]);

  return null;
};