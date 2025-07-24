import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@encodly/shared-ui';
import { Code2, FileJson, Hash, Link2, Key, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { getToolUrls, getBaseUrl } from '../utils/urls';

export const HomePage: React.FC = () => {
  const toolUrls = getToolUrls();

  // Add animation styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  
  const tools = [
    {
      name: 'JSON Formatter & Validator',
      description: 'Format, validate, and beautify JSON data with syntax highlighting and error detection.',
      href: toolUrls.json,
      icon: FileJson,
      features: ['Real-time validation', 'Syntax highlighting', 'Tree view', 'Auto-formatting'],
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      darkBgGradient: 'from-emerald-950/20 to-teal-950/20'
    },
    {
      name: 'Base64 Converter',
      description: 'Encode and decode Base64 data online with support for text and file encoding.',
      href: toolUrls.base64,
      icon: Hash,
      features: ['Text encoding', 'File support', 'Real-time conversion', 'Download results'],
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      darkBgGradient: 'from-blue-950/20 to-indigo-950/20'
    },
    {
      name: 'URL Encoder/Decoder',
      description: 'Encode URLs for safe transmission or decode encoded URLs back to readable format.',
      href: toolUrls.url,
      icon: Link2,
      features: ['Percent encoding', 'URL decoding', 'Swap content', 'Copy results'],
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      darkBgGradient: 'from-purple-950/20 to-pink-950/20'
    },
    {
      name: 'JWT Token Decoder',
      description: 'Decode and validate JWT tokens instantly. Check expiration, view claims, and validate structure.',
      href: toolUrls.jwt,
      icon: Key,
      features: ['Instant decoding', 'Token validation', 'Expiration check', 'Claims highlighting'],
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50',
      darkBgGradient: 'from-orange-950/20 to-red-950/20'
    },
    {
      name: 'JWT Token Encoder',
      description: 'Create and sign JWT tokens with custom headers and payloads. Generate tokens with HMAC algorithms.',
      href: toolUrls.jwtEncoder,
      icon: Key,
      features: ['Token creation', 'Custom payloads', 'HMAC signing', 'Payload templates'],
      gradient: 'from-amber-500 to-yellow-600',
      bgGradient: 'from-amber-50 to-yellow-50',
      darkBgGradient: 'from-amber-950/20 to-yellow-950/20'
    },
    {
      name: 'Hash Generator',
      description: 'Generate MD5, SHA-1, SHA-256, SHA-512 and other cryptographic hashes for text and files.',
      href: toolUrls.hash,
      icon: Hash,
      features: ['Multiple algorithms', 'File hashing', 'Hash comparison', 'Security recommendations'],
      gradient: 'from-rose-500 to-pink-600',
      bgGradient: 'from-rose-50 to-pink-50',
      darkBgGradient: 'from-rose-950/20 to-pink-950/20'
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {tools.map((tool, index) => {
          const IconComponent = tool.icon;
          return (
            <div
              key={tool.name}
              className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.bgGradient} dark:bg-gradient-to-br dark:${tool.darkBgGradient} opacity-60`} />
              
              {/* Card content */}
              <Card className="relative border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                          {tool.name}
                        </CardTitle>
                        <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-xs font-medium text-primary">Professional Grade</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                    {tool.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    {tool.features.map((feature, featureIndex) => (
                      <div 
                        key={feature} 
                        className="flex items-center gap-3 transition-all duration-300"
                        style={{
                          animationDelay: `${(index * 200) + (featureIndex * 100)}ms`,
                          animation: 'fadeInUp 0.6s ease-out forwards'
                        }}
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${tool.gradient} shadow-sm`} />
                        <span className="text-sm font-medium text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    asChild 
                    className={`w-full h-12 bg-gradient-to-r ${tool.gradient} hover:shadow-lg hover:shadow-primary/25 border-0 font-semibold text-white group-hover:scale-[1.02] transition-all duration-300`}
                  >
                    <a href={tool.href} className="flex items-center justify-center gap-2">
                      <span>Open Tool</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <IconComponent className="h-24 w-24" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-12">
        <div className="relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Why Choose Encodly?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for developers who value speed, privacy, and simplicity
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Fast & Reliable</h3>
              <p className="text-muted-foreground leading-relaxed">
                Optimized for performance with instant processing and results. Built with modern web technologies.
              </p>
            </div>
            
            <div className="group text-center p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Privacy First</h3>
              <p className="text-muted-foreground leading-relaxed">
                All processing happens in your browser. We don't store your data or track your activity.
              </p>
            </div>
            
            <div className="group text-center p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">💯</span>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">Always Free</h3>
              <p className="text-muted-foreground leading-relaxed">
                No subscriptions, no limits, no hidden costs. Professional tools accessible to everyone.
              </p>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 opacity-5">
          <Code2 className="h-48 w-48" />
        </div>
      </div>
    </PageLayout>
  );
};