import React, { useMemo } from 'react';
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
  // Define all available tools with their names and URLs
  const allTools = useMemo(() => {
    const urls = getToolUrls();
    return [
      { name: 'JSON Formatter & Validator', url: urls.json, key: 'json' },
      { name: 'Base64 Converter', url: urls.base64, key: 'base64' },
      { name: 'URL Encoder/Decoder', url: urls.url, key: 'url' },
      { name: 'JWT Decoder', url: urls.jwt, key: 'jwt' },
      { name: 'JWT Encoder', url: urls.jwtEncoder, key: 'jwt-encoder' },
      { name: 'Hash Generator', url: urls.hash, key: 'hash' },
      { name: 'UUID Generator', url: urls.uuid, key: 'uuid' },
      { name: 'Percentage Calculator', url: urls.calc, key: 'percentage-calc' },
      { name: 'Password Generator', url: urls.password, key: 'password' },
      { name: 'Markdown Viewer', url: urls.markdown, key: 'markdown' },
      { name: 'QR Code Generator', url: urls.qr, key: 'qr' },
      { name: 'Regex Tester', url: urls.regex, key: 'regex' },
    ];
  }, []);

  // Get 3 random tools excluding the current one
  const randomTools = useMemo(() => {
    const availableTools = allTools.filter(tool => tool.key !== toolName);

    // Shuffle and take 3
    const shuffled = [...availableTools].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [allTools, toolName]);
  
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
                {randomTools.map((tool) => (
                  <a 
                    key={tool.key} 
                    href={tool.url} 
                    className="text-primary hover:underline transition-colors"
                  >
                    {tool.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};