import React, { useState, useMemo } from 'react';
import { PageLayout } from '../components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@encodly/shared-ui';
import { Code2, FileJson, Hash, Link2, Key, ExternalLink, ArrowRight, Sparkles, Lock, Eye, Calculator, Search, Filter, QrCode } from 'lucide-react';
import { getToolUrls, getBaseUrl } from '../utils/urls';

export const HomePage: React.FC = () => {
  const toolUrls = getToolUrls();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
  
  const categories = [
    { id: 'all', name: 'All Tools', count: 11 },
    { id: 'text', name: 'Text Tools', count: 4 },
    { id: 'security', name: 'Security', count: 4 },
    { id: 'generators', name: 'Generators', count: 4 },
    { id: 'calculators', name: 'Calculators', count: 1 }
  ];

  const tools = [
    {
      name: 'JSON Formatter & Validator',
      description: 'Format, validate, and beautify JSON data with syntax highlighting and error detection.',
      href: toolUrls.json,
      icon: FileJson,
      features: ['Real-time validation', 'Syntax highlighting', 'Tree view', 'Auto-formatting'],
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      darkBgGradient: 'from-emerald-950/20 to-teal-950/20',
      categories: ['text'],
      searchKeywords: ['json', 'format', 'validate', 'beautify', 'syntax', 'tree', 'data']
    },
    {
      name: 'Base64 Converter',
      description: 'Encode and decode Base64 data online with support for text and file encoding.',
      href: toolUrls.base64,
      icon: Hash,
      features: ['Text encoding', 'File support', 'Real-time conversion', 'Download results'],
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      darkBgGradient: 'from-blue-950/20 to-indigo-950/20',
      categories: ['text'],
      searchKeywords: ['base64', 'encode', 'decode', 'convert', 'file', 'text', 'binary']
    },
    {
      name: 'URL Encoder/Decoder',
      description: 'Encode URLs for safe transmission or decode encoded URLs back to readable format.',
      href: toolUrls.url,
      icon: Link2,
      features: ['Percent encoding', 'URL decoding', 'Swap content', 'Copy results'],
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      darkBgGradient: 'from-purple-950/20 to-pink-950/20',
      categories: ['text'],
      searchKeywords: ['url', 'encode', 'decode', 'percent', 'uri', 'link', 'web']
    },
    {
      name: 'JWT Token Decoder',
      description: 'Decode and validate JWT tokens instantly. Check expiration, view claims, and validate structure.',
      href: toolUrls.jwt,
      icon: Key,
      features: ['Instant decoding', 'Token validation', 'Expiration check', 'Claims highlighting'],
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50',
      darkBgGradient: 'from-orange-950/20 to-red-950/20',
      categories: ['security'],
      searchKeywords: ['jwt', 'token', 'decode', 'validate', 'claims', 'auth', 'security']
    },
    {
      name: 'JWT Token Encoder',
      description: 'Create and sign JWT tokens with custom headers and payloads. Generate tokens with HMAC algorithms.',
      href: toolUrls.jwtEncoder,
      icon: Key,
      features: ['Token creation', 'Custom payloads', 'HMAC signing', 'Payload templates'],
      gradient: 'from-amber-500 to-yellow-600',
      bgGradient: 'from-amber-50 to-yellow-50',
      darkBgGradient: 'from-amber-950/20 to-yellow-950/20',
      categories: ['security'],
      searchKeywords: ['jwt', 'token', 'encode', 'create', 'sign', 'auth', 'security', 'hmac']
    },
    {
      name: 'Hash Generator',
      description: 'Generate MD5, SHA-1, SHA-256, SHA-512 and other cryptographic hashes for text and files.',
      href: toolUrls.hash,
      icon: Hash,
      features: ['Multiple algorithms', 'File hashing', 'Hash comparison', 'Security recommendations'],
      gradient: 'from-rose-500 to-pink-600',
      bgGradient: 'from-rose-50 to-pink-50',
      darkBgGradient: 'from-rose-950/20 to-pink-950/20',
      categories: ['security', 'generators'],
      searchKeywords: ['hash', 'md5', 'sha256', 'sha512', 'checksum', 'crypto', 'security', 'generate']
    },
    {
      name: 'UUID Generator',
      description: 'Generate UUID/GUID v1, v4 and other versions with bulk generation and validation tools.',
      href: toolUrls.uuid,
      icon: Key,
      features: ['UUID v1 & v4', 'Bulk generation', 'UUID validation', 'Format conversion'],
      gradient: 'from-purple-500 to-violet-600',
      bgGradient: 'from-purple-50 to-violet-50',
      darkBgGradient: 'from-purple-950/20 to-violet-950/20',
      categories: ['generators'],
      searchKeywords: ['uuid', 'guid', 'generate', 'unique', 'identifier', 'v1', 'v4', 'bulk']
    },
    {
      name: 'Password Generator',
      description: 'Generate secure passwords with customizable options and strength indicators.',
      href: toolUrls.password,
      icon: Lock,
      features: ['Strong passwords', 'Custom options', 'Strength meter', 'Copy & download'],
      gradient: 'from-cyan-500 to-blue-600',
      bgGradient: 'from-cyan-50 to-blue-50',
      darkBgGradient: 'from-cyan-950/20 to-blue-950/20',
      categories: ['security', 'generators'],
      searchKeywords: ['password', 'generate', 'secure', 'random', 'strength', 'security']
    },
    {
      name: 'Markdown Viewer',
      description: 'View and edit Markdown with live preview, syntax highlighting, and export options.',
      href: toolUrls.markdown,
      icon: Eye,
      features: ['Live preview', 'Syntax highlighting', 'Export options', 'Example content'],
      gradient: 'from-teal-500 to-green-600',
      bgGradient: 'from-teal-50 to-green-50',
      darkBgGradient: 'from-teal-950/20 to-green-950/20',
      categories: ['text'],
      searchKeywords: ['markdown', 'md', 'viewer', 'editor', 'preview', 'documentation', 'readme']
    },
    {
      name: 'QR Code Generator',
      description: 'Generate QR codes from text or URLs with customizable size, colors, and download options.',
      href: toolUrls.qr,
      icon: QrCode,
      features: ['Text/URL to QR', 'Custom colors & size', 'PNG/SVG download', 'Real-time preview'],
      gradient: 'from-violet-500 to-indigo-600',
      bgGradient: 'from-violet-50 to-indigo-50',
      darkBgGradient: 'from-violet-950/20 to-indigo-950/20',
      categories: ['generators'],
      searchKeywords: ['qr code', 'qr generator', 'barcode', 'url to qr', 'text to qr', 'download']
    },
    {
      name: 'Percentage Calculator',
      description: 'Calculate percentages, ratios, and percentage changes with detailed results.',
      href: toolUrls.calc,
      icon: Calculator,
      features: ['Multiple calculations', 'History tracking', 'Step-by-step results', 'Copy results'],
      gradient: 'from-indigo-500 to-purple-600',
      bgGradient: 'from-indigo-50 to-purple-50',
      darkBgGradient: 'from-indigo-950/20 to-purple-950/20',
      categories: ['calculators'],
      searchKeywords: ['percentage', 'calculator', 'math', 'ratio', 'calculate', 'percent']
    }
  ];

  // Filter and search logic
  const filteredTools = useMemo(() => {
    let filtered = tools;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tool => tool.categories.includes(selectedCategory));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.searchKeywords.some(keyword => keyword.toLowerCase().includes(query)) ||
        tool.features.some(feature => feature.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery, tools]);

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
      maxWidth="wide"
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

      {/* Search and Filter Section */}
      <div className="mb-12 space-y-6">
        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-background/60 hover:bg-background border border-border hover:border-primary/50 backdrop-blur-sm'
              }`}
            >
              <Filter className="h-3 w-3" />
              <span>{category.name}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                selectedCategory === category.id
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {category.id === 'all' 
                  ? tools.length 
                  : tools.filter(tool => tool.categories.includes(category.id)).length
                }
              </span>
            </button>
          ))}
        </div>

        {/* Results Info */}
        {(searchQuery || selectedCategory !== 'all') && (
          <div className="text-center text-sm text-muted-foreground">
            {filteredTools.length === 0 ? (
              <p>No tools found matching your criteria</p>
            ) : (
              <p>
                Showing {filteredTools.length} of {tools.length} tools
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
        {filteredTools.map((tool, index) => {
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
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.bgGradient} dark:bg-gradient-to-br dark:${tool.darkBgGradient} opacity-50 dark:opacity-60`} />
              
              {/* Card content */}
              <Card className="relative border-2 border-border/60 dark:border-0 bg-white/60 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl dark:shadow-xl transition-shadow duration-300 h-full flex flex-col">
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
                
                <CardContent className="pt-0 flex-1 flex flex-col">
                  <p className="text-muted-foreground mb-6 text-base leading-relaxed">
                    {tool.description}
                  </p>
                  
                  <div className="space-y-3 mb-6 flex-1">
                    {tool.features.map((feature, featureIndex) => (
                      <div 
                        key={feature} 
                        className="flex items-center gap-3 transition-all duration-300"
                        style={{
                          animationDelay: `${(index * 200) + (featureIndex * 100)}ms`,
                          animation: 'fadeInUp 0.6s ease-out forwards'
                        }}
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${tool.gradient} shadow-sm flex-shrink-0`} />
                        <span className="text-sm font-medium text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    asChild 
                    className={`w-full h-12 bg-gradient-to-r ${tool.gradient} hover:shadow-lg hover:shadow-primary/25 border-0 font-semibold text-white group-hover:scale-[1.02] transition-all duration-300 mt-auto`}
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