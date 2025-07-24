import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@encodly/shared-ui';
import { Code2, FileJson, Hash, Link2, Key, ExternalLink } from 'lucide-react';
import { getToolUrls, getBaseUrl } from '../utils/urls';

export const HomePage: React.FC = () => {
  const toolUrls = getToolUrls();
  
  const tools = [
    {
      name: 'JSON Formatter & Validator',
      description: 'Format, validate, and beautify JSON data with syntax highlighting and error detection.',
      href: toolUrls.json,
      icon: FileJson,
      features: ['Real-time validation', 'Syntax highlighting', 'Tree view', 'Auto-formatting']
    },
    {
      name: 'Base64 Converter',
      description: 'Encode and decode Base64 data online with support for text and file encoding.',
      href: toolUrls.base64,
      icon: Hash,
      features: ['Text encoding', 'File support', 'Real-time conversion', 'Download results']
    },
    {
      name: 'URL Encoder/Decoder',
      description: 'Encode URLs for safe transmission or decode encoded URLs back to readable format.',
      href: toolUrls.url,
      icon: Link2,
      features: ['Percent encoding', 'URL decoding', 'Swap content', 'Copy results']
    },
    {
      name: 'JWT Token Decoder',
      description: 'Decode and validate JWT tokens instantly. Check expiration, view claims, and validate structure.',
      href: toolUrls.jwt,
      icon: Key,
      features: ['Instant decoding', 'Token validation', 'Expiration check', 'Claims highlighting']
    },
    {
      name: 'JWT Token Encoder',
      description: 'Create and sign JWT tokens with custom headers and payloads. Generate tokens with HMAC algorithms.',
      href: toolUrls.jwtEncoder,
      icon: Key,
      features: ['Token creation', 'Custom payloads', 'HMAC signing', 'Payload templates']
    }
  ];

  return (
    <PageLayout
      title="Encodly - Free AI-Powered Developer Tools"
      description="Free online AI-powered developer tools for JSON formatting, Base64 encoding, and more. Perfect for developers in Saudi Arabia, UAE, and Middle East. No signup required, fast and secure. أدوات المطورين المجانية مع الذكاء الاصطناعي"
      keywords={[
        'developer tools', 'json formatter', 'base64 converter', 'online tools', 'free tools',
        'ai developer tools', 'ai powered tools', 'smart coding tools', 'ai programming tools',
        'أدوات المطورين', 'أدوات الذكاء الاصطناعي', 'أدوات البرمجة المجانية',
        'developer tools saudi arabia', 'coding tools uae', 'middle east developers',
        'saudi programming tools', 'uae developer tools', 'arabic developer tools',
        'مطور سعودي', 'مطور إماراتي', 'أدوات الشرق الأوسط', 'برمجة الشرق الأوسط',
        'kuwait developer tools', 'qatar programming tools', 'bahrain coding tools', 'oman developer tools'
      ]}
      canonicalUrl={getBaseUrl()}
    >
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <Code2 className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Free Developer Tools</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Professional-grade tools for developers. Fast, secure, and completely free. 
          No signup required, no data stored on our servers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {tools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <Card key={tool.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <IconComponent className="h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{tool.description}</p>
                
                <ul className="space-y-1 mb-4">
                  {tool.features.map((feature) => (
                    <li key={feature} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button asChild className="w-full">
                  <a href={tool.href} className="flex items-center gap-2">
                    Open Tool
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center bg-muted/30 rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Why Choose Encodly?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <h3 className="font-semibold mb-2">🚀 Fast & Reliable</h3>
            <p className="text-sm text-muted-foreground">
              Optimized for performance with instant processing and results.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">🔒 Privacy First</h3>
            <p className="text-sm text-muted-foreground">
              All processing happens in your browser. We don't store your data.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">💯 Always Free</h3>
            <p className="text-sm text-muted-foreground">
              No subscriptions, no limits, no hidden costs. Just great tools.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};