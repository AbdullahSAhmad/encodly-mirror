import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { getPageUrl, getToolUrls } from '../utils/urls';

export const AboutPage: React.FC = () => {
  return (
    <PageLayout
      title="About Encodly - Free Developer Tools"
      description="Learn about Encodly's mission to provide free, fast, and secure developer tools for everyone."
      keywords={['about encodly', 'developer tools', 'free tools', 'mission']}
      canonicalUrl={getPageUrl('/about')}
    >
      <h1>About Encodly</h1>

      <p>
        Encodly is a collection of free, professional-grade developer tools designed to make your work easier and more efficient. 
        We believe that great tools shouldn't come with a price tag or require you to compromise your privacy.
      </p>

      <h2>Our Mission</h2>

      <p>
        Our mission is simple: provide developers with fast, reliable, and secure tools that they can use without any barriers. 
        No signups, no subscriptions, no data collection – just great tools that work.
      </p>

      <h2>Why We Built Encodly</h2>

      <p>
        As developers ourselves, we understand the frustration of finding good tools that either:
      </p>

      <ul>
        <li>Require expensive subscriptions</li>
        <li>Have usage limits that interrupt your workflow</li>
        <li>Collect and store your sensitive data</li>
        <li>Are slow or unreliable when you need them most</li>
      </ul>

      <p>
        That's why we created Encodly – to solve these problems once and for all.
      </p>

      <h2>Our Principles</h2>

      <h3>🔒 Privacy First</h3>
      <p>
        All processing happens directly in your browser. We don't send your data to our servers, 
        store it, or track what you're working on. Your code and data remain private.
      </p>

      <h3>🚀 Performance Focused</h3>
      <p>
        Our tools are optimized for speed and reliability. We use modern web technologies 
        to ensure fast processing and instant results.
      </p>

      <h3>💯 Always Free</h3>
      <p>
        We believe great developer tools should be accessible to everyone. All our tools 
        are completely free with no usage limits or hidden costs.
      </p>

      <h3>🎨 User Experience</h3>
      <p>
        Clean, intuitive interfaces that get out of your way and let you focus on your work. 
        Features like dark mode, syntax highlighting, and keyboard shortcuts are built-in.
      </p>

      <h2>Current Tools</h2>

      <p>
        We currently offer the following tools, with more planned for the future:
      </p>

      <ul>
        <li><strong>JSON Formatter & Validator</strong> – Format, validate, and beautify JSON data with real-time error detection</li>
        <li><strong>Base64 Converter</strong> – Encode and decode Base64 data with support for text and files</li>
      </ul>

      <h2>What's Next</h2>

      <p>
        We're constantly working on new tools and improvements based on developer feedback. 
        Upcoming tools include URL encoders, hash generators, color pickers, and regex testers.
      </p>

      <h2>Open Source</h2>

      <p>
        We believe in giving back to the developer community. Many of our tools and 
        components will be open-sourced to help other developers build great tools.
      </p>

      <h2>Contact Us</h2>

      <p>
        Have a suggestion for a new tool or found a bug? We'd love to hear from you! 
        Reach out to us at <a href={`mailto:hello@${new URL(getToolUrls().main).hostname}`}>hello@{new URL(getToolUrls().main).hostname}</a>.
      </p>
    </PageLayout>
  );
};