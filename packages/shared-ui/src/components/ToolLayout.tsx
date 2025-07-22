import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { AdBanner } from './AdBanner';
import { SEO } from './SEO';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  toolName: string;
  keywords?: string[];
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  title,
  description,
  children,
  toolName,
  keywords = [],
}) => {
  return (
    <>
      <SEO title={title} description={description} keywords={keywords} />
      <div className="min-h-screen flex flex-col">
        <Header />
        <AdBanner position="header" />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{description}</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                {children}
              </div>
              
              <aside className="lg:col-span-1">
                <AdBanner position="sidebar" />
              </aside>
            </div>
          </div>
        </main>
        
        <AdBanner position="footer" />
        <Footer />
      </div>
    </>
  );
};