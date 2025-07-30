import React from 'react';
import { ToolLayout, useToast, SEO, getToolUrls } from '@encodly/shared-ui';
import { Shield } from 'lucide-react';
import { PasswordGenerator } from '../components/PasswordGenerator';
import { PasswordValidator } from '../components/PasswordValidator';
import { InfoModal } from '../components/InfoModal';

export const PasswordGeneratorPage: React.FC = () => {
  const { toast, ToastContainer } = useToast();

  const seoData = {
    title: "Free Password Generator - Secure Online Tool | Encodly",
    description: "Generate secure passwords with customizable length, character sets and multiple passwords at once. Features strength indicator and security best practices for developers.",
    keywords: [
      'password generator', 'secure password', 'random password', 'password strength', 'cybersecurity', 
      'online tools', 'password creator', 'strong password', 'password security', 'developer tools'
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Password Generator - Encodly",
      "description": "Generate secure passwords with customizable length, character sets and multiple passwords at once. Features strength indicator and security best practices.",
      "url": "https://password.encodly.com",
      "applicationCategory": "SecurityApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0"
      },
      "creator": {
        "@type": "Organization",
        "name": "Encodly",
        "url": "https://encodly.com"
      }
    }
  };

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={getToolUrls().password}
        jsonLd={seoData.jsonLd}
        type="WebApplication"
        speakableContent={[".tool-description", ".feature-list"]}
        breadcrumbs={[
          { name: "Home", url: "https://encodly.com" },
          { name: "Tools", url: "https://encodly.com/#tools" },
          { name: "Password Generator", url: "https://password.encodly.com" }
        ]}
        faqData={[
          {
            question: "How do I create a strong password?",
            answer: "A strong password should be at least 12 characters long, include uppercase and lowercase letters, numbers, and special characters. Avoid using personal information, dictionary words, or common patterns."
          },
          {
            question: "What makes a password secure?",
            answer: "Password security depends on length, complexity, and unpredictability. Longer passwords with mixed character types are exponentially harder to crack. Our generator creates truly random passwords for maximum security."
          },
          {
            question: "Should I use the same password for multiple accounts?",
            answer: "No, never reuse passwords across different accounts. If one account is compromised, all accounts with the same password become vulnerable. Use unique passwords for each account."
          },
          {
            question: "How often should I change my passwords?",
            answer: "Change passwords immediately if there's a security breach, and consider changing important account passwords every 6-12 months. Focus on using strong, unique passwords rather than frequent changes."
          },
          {
            question: "Is it safe to generate passwords online?",
            answer: "Yes, our password generator works entirely in your browser. Passwords are generated locally using cryptographically secure random functions and never sent to our servers."
          }
        ]}
      />
      
      <ToolLayout
        title="Free Password Generator"
        description="Generate secure passwords with customizable options and strength indicators"
        toolName="password-generator"
        keywords={['password generator', 'secure password', 'random password', 'password strength', 'cybersecurity', 'online tools', 'password creator', 'strong password']}
        headerActions={
          <InfoModal 
            trigger={
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent/50 h-9 w-9">
                <Shield className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            }
          />
        }
      >
        <div className="h-full flex flex-col">
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6">
            <PasswordGenerator onToast={toast} />
            <PasswordValidator onToast={toast} />
          </div>
        </div>
      </ToolLayout>

      <ToastContainer />
    </>
  );
};