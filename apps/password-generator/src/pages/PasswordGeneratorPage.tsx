import React from 'react';
import { ToolLayout, useToast } from '@encodly/shared-ui';
import { Shield } from 'lucide-react';
import { PasswordGenerator } from '../components/PasswordGenerator';
import { PasswordValidator } from '../components/PasswordValidator';
import { InfoModal } from '../components/InfoModal';

export const PasswordGeneratorPage: React.FC = () => {
  const { toast, ToastContainer } = useToast();

  const jsonLd = {
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ToolLayout
        title="Password Generator"
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