import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@encodly/shared-ui';
import { Code2, FileJson, Hash, Link2, Key, ExternalLink, ArrowRight, Sparkles, Lock, Eye, QrCode, Users, Globe, Zap, Shield, Heart, Regex, Percent } from 'lucide-react';
import { getPageUrl, getToolUrls } from '../utils/urls';

export const AboutPage: React.FC = () => {
  const toolUrls = getToolUrls();

  const tools = [
    {
      name: 'JSON Formatter & Validator',
      description: 'Format, validate, and beautify JSON data with syntax highlighting and error detection.',
      href: toolUrls.json,
      icon: FileJson,
      features: ['Real-time validation', 'Syntax highlighting', 'Tree view', 'Auto-formatting'],
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      name: 'Base64 Converter',
      description: 'Encode and decode Base64 data online with support for text and file encoding.',
      href: toolUrls.base64,
      icon: Hash,
      features: ['Text encoding', 'File support', 'Real-time conversion', 'Download results'],
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      name: 'URL Encoder/Decoder',
      description: 'Encode URLs for safe transmission or decode encoded URLs back to readable format.',
      href: toolUrls.url,
      icon: Link2,
      features: ['Percent encoding', 'URL decoding', 'Swap content', 'Copy results'],
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      name: 'Hash Generator',
      description: 'Generate MD5, SHA-1, SHA-256, SHA-512 and other cryptographic hashes for text and files. Compare hashes and verify data integrity.',
      href: toolUrls.hash,
      icon: Hash,
      features: ['Multiple algorithms', 'File hash support', 'Hash comparison', 'Integrity verification'],
      gradient: 'from-red-500 to-rose-600'
    },
    {
      name: 'JWT Token Decoder',
      description: 'Decode and validate JWT tokens instantly. Check expiration, view claims, and validate structure.',
      href: toolUrls.jwt,
      icon: Key,
      features: ['Instant decoding', 'Token validation', 'Expiration check', 'Claims highlighting'],
      gradient: 'from-orange-500 to-red-600'
    },
    {
      name: 'JWT Token Encoder',
      description: 'Create and sign JWT tokens with custom headers and payloads. Generate tokens with HMAC algorithms.',
      href: toolUrls.jwtEncoder,
      icon: Key,
      features: ['Token creation', 'Custom payloads', 'HMAC signing', 'Payload templates'],
      gradient: 'from-amber-500 to-yellow-600'
    },
    {
      name: 'UUID Generator',
      description: 'Generate UUID/GUID v1, v4 and other versions with bulk generation and validation tools.',
      href: toolUrls.uuid,
      icon: Key,
      features: ['UUID v1 & v4', 'Bulk generation', 'UUID validation', 'Format conversion'],
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      name: 'Password Generator',
      description: 'Generate secure passwords with customizable options and strength indicators.',
      href: toolUrls.password,
      icon: Lock,
      features: ['Strong passwords', 'Custom options', 'Strength meter', 'Copy & download'],
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      name: 'Markdown Viewer',
      description: 'View and edit Markdown with live preview, syntax highlighting, and export options.',
      href: toolUrls.markdown,
      icon: Eye,
      features: ['Live preview', 'Syntax highlighting', 'Export options', 'Example content'],
      gradient: 'from-teal-500 to-green-600'
    },
    {
      name: 'Percentage Calculator',
      description: 'Calculate percentages easily with our free online percentage calculator. Supports percentage increase/decrease, what percentage, and more.',
      href: toolUrls.calc,
      icon: Percent,
      features: ['Multiple calculation types', 'Percentage increase/decrease', 'What percentage of', 'Calculation history'],
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      name: 'QR Code Generator',
      description: 'Generate QR codes from text or URLs with customizable size, colors, and download options.',
      href: toolUrls.qr,
      icon: QrCode,
      features: ['Text/URL to QR', 'Custom colors & size', 'PNG/SVG download', 'Real-time preview'],
      gradient: 'from-violet-500 to-indigo-600'
    },
    {
      name: 'Regex Tester',
      description: 'Test, debug, and validate regular expressions online with real-time pattern matching, syntax highlighting, and comprehensive match details.',
      href: toolUrls.regex,
      icon: Regex,
      features: ['Real-time matching', 'Pattern highlighting', 'Match groups', 'Common patterns'],
      gradient: 'from-indigo-500 to-purple-600'
    }
  ];

  const principles = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All processing happens directly in your browser. We don\'t send your data to our servers, store it, or track what you\'re working on.',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: Zap,
      title: 'Performance Focused',
      description: 'Our tools are optimized for speed and reliability using modern web technologies to ensure fast processing and instant results.',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Heart,
      title: 'Always Free',
      description: 'We believe great developer tools should be accessible to everyone. All our tools are completely free with no usage limits or hidden costs.',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      icon: Users,
      title: 'User Experience',
      description: 'Clean, intuitive interfaces that get out of your way. Features like dark mode, syntax highlighting, and keyboard shortcuts are built-in.',
      gradient: 'from-blue-500 to-indigo-600'
    }
  ];

  return (
    <PageLayout
      title="About Encodly - Free Developer Tools"
      description="Learn about Encodly's mission to provide free, fast, and secure developer tools for everyone."
      keywords={['about encodly', 'developer tools', 'free tools', 'mission']}
      canonicalUrl={getPageUrl('/about')}
      maxWidth="wide"
    >
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <Code2 className="h-20 w-20 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-6">About Encodly</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Encodly is a collection of free, professional-grade developer tools designed to make your work easier and more efficient. 
          We believe that great tools shouldn't come with a price tag or require you to compromise your privacy.
        </p>
      </div>

      {/* Mission Section */}
      <div className="mb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 p-12 border border-primary/20">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
            <p className="text-lg text-center max-w-4xl mx-auto leading-relaxed">
              Our mission is simple: provide developers with fast, reliable, and secure tools that they can use without any barriers. 
              No signups, no subscriptions, no data collection – just great tools that work.
            </p>
          </div>
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 opacity-5">
            <Globe className="h-48 w-48" />
          </div>
        </div>
      </div>

      {/* Why We Built This Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Why We Built Encodly</h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg mb-6 text-center">
            As developers ourselves, we understand the frustration of finding good tools that either:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Require expensive subscriptions',
              'Have usage limits that interrupt your workflow',
              'Collect and store your sensitive data',
              'Are slow or unreliable when you need them most'
            ].map((issue, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                <span className="text-muted-foreground">{issue}</span>
              </div>
            ))}
          </div>
          <p className="text-lg mt-6 text-center font-medium">
            That's why we created Encodly – to solve these problems once and for all.
          </p>
        </div>
      </div>

      {/* Principles Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {principles.map((principle, index) => {
            const IconComponent = principle.icon;
            return (
              <Card key={index} className="relative overflow-hidden border-2 hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${principle.gradient} shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{principle.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{principle.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tools Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Developer Tools</h2>
        <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
          We currently offer {tools.length} professional-grade tools, each designed to solve specific developer challenges with speed and precision.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <Card key={index} className="group relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${tool.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                      {tool.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    {tool.features.slice(0, 2).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${tool.gradient}`} />
                        <span className="text-xs text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    asChild 
                    variant="outline"
                    size="sm"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  >
                    <a href={tool.href} className="flex items-center justify-center gap-2">
                      <span>Try Tool</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Future & Open Source Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold">What's Next</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We're constantly working on new tools and improvements based on developer feedback. 
            Our roadmap includes advanced features, more integrations, and tools specifically requested by our community.
          </p>
        </Card>

        <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
              <Code2 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold">Open Source</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We believe in giving back to the developer community. Many of our tools and 
            components will be open-sourced to help other developers build great tools.
          </p>
        </Card>
      </div>

      {/* Contact Section */}
      <div className="text-center">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 p-12 border border-primary/20">
          <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Have a suggestion for a new tool or found a bug? We'd love to hear from you! 
            Your feedback helps us build better tools for the entire developer community.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg">
            <a href={`mailto:hello@${new URL(toolUrls.main).hostname}`} className="flex items-center gap-2">
              <span>Contact Us</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};