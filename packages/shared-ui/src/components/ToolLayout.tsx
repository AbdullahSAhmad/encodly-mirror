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
  void toolName; // Suppress unused variable warning
  
  return (
    <>
      <SEO title={title} description={description} keywords={keywords} />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <div className="flex-1 flex flex-col">
          {/* Header with Ad */}
          <div className="flex items-center justify-between px-6 py-3 border-b bg-gradient-to-r from-background to-muted/20 shadow-sm">
            <div className="flex-1 mr-6">
              <h1 className="text-xl font-semibold text-foreground leading-tight">{title}</h1>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
            </div>
            <div className="flex-shrink-0">
              <AdBanner position="header" />
            </div>
          </div>
          
          {/* Main Content Area */}
          <main className="flex-1 px-4 py-4 overflow-auto">
            <div className="w-full h-full">
              {children}
            </div>
          </main>
          
          {/* Bottom section for tool links */}
          <div className="px-4 py-6 border-t bg-muted/30">
            <div className="text-center mb-4">
              <h3 className="text-sm font-semibold mb-2">More Developer Tools</h3>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <a href="https://json.encodly.com" className="text-primary hover:underline">JSON Formatter & Validator</a>
                <a href="https://base64.encodly.com" className="text-primary hover:underline">Base64 Converter</a>
              </div>
            </div>
            <AdBanner position="content" />
          </div>
        </div>
        
        <AdBanner position="footer" />
        <Footer />
      </div>
    </>
  );
};