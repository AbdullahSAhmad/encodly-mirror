import React from 'react';
import { Header, Footer, SEO } from '@encodly/shared-ui';

interface PageLayoutProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  children: React.ReactNode;
  maxWidth?: 'narrow' | 'normal' | 'wide' | 'full';
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  children,
  maxWidth = 'normal',
  className = '',
}) => {
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'narrow': return 'max-w-2xl';
      case 'normal': return 'max-w-4xl';
      case 'wide': return 'max-w-6xl';
      case 'full': return 'max-w-none';
      default: return 'max-w-4xl';
    }
  };

  return (
    <>
      <SEO 
        title={title} 
        description={description} 
        keywords={keywords}
        canonicalUrl={canonicalUrl}
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className={`flex-1 container mx-auto px-4 py-8 ${getMaxWidthClass()} ${className}`}>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {children}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};