import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { SEO } from './SEO';
import { getToolUrls } from '../utils/urls';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  toolName: string;
  keywords?: string[];
  headerActions?: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  title,
  description,
  children,
  toolName,
  keywords = [],
  headerActions,
}) => {
  void toolName; // Suppress unused variable warning
  
  return (
    <>
      <SEO title={title} description={description} keywords={keywords} />
      <div className="min-h-screen flex flex-col" lang="en">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50">
          Skip to main content
        </a>
        <Header />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b bg-gradient-to-r from-background to-muted/20 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 id="page-title" className="text-xl font-semibold text-foreground leading-tight">{title}</h1>
                  {headerActions && (
                    <div className="flex items-center gap-2">
                      {headerActions}
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <main id="main-content" className="flex-1 px-4 py-4 overflow-auto" role="main" aria-labelledby="page-title">
            <div className="w-full h-full">
              {children}
            </div>
          </main>
          
          {/* Bottom section for tool links */}
          <div className="px-4 py-6 border-t bg-muted/30">
            <div className="text-center">
              <h3 className="text-sm font-semibold mb-2">More Developer Tools</h3>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <a href={getToolUrls().json} className="text-primary hover:underline">JSON Formatter & Validator</a>
                <a href={getToolUrls().base64} className="text-primary hover:underline">Base64 Converter</a>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};