import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea } from '@encodly/shared-ui';
import { Mail, MessageSquare, Bug, Lightbulb } from 'lucide-react';
import { getPageUrl, getToolUrls } from '../utils/urls';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create mailto link with form data
    const subject = encodeURIComponent(formData.subject || 'Contact from Encodly');
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    const domain = new URL(getToolUrls().main).hostname;
    const mailtoUrl = `mailto:hello@${domain}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PageLayout
      title="Contact Us - Encodly"
      description="Get in touch with the Encodly team for support, feedback, or suggestions about our developer tools."
      keywords={['contact', 'support', 'feedback', 'help', 'encodly']}
      canonicalUrl={getPageUrl('/contact')}
      maxWidth="wide"
    >
      <h1>Contact Us</h1>

      <p>
        We'd love to hear from you! Whether you have feedback, found a bug, or have ideas for new tools, 
        we're always excited to connect with our community.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 not-prose mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Send us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name (optional)
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email (optional)
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="What's this about?"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell us more..."
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                Send Message
              </Button>
              
              <p className="text-xs text-muted-foreground">
                This will open your email client with the message pre-filled.
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Direct Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Prefer to email us directly?</p>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>General inquiries:</strong><br />
                  <a href={`mailto:hello@${new URL(getToolUrls().main).hostname}`} className="text-primary hover:underline">
                    hello@{new URL(getToolUrls().main).hostname}
                  </a>
                </div>
                <div>
                  <strong>Technical support:</strong><br />
                  <a href={`mailto:support@${new URL(getToolUrls().main).hostname}`} className="text-primary hover:underline">
                    support@{new URL(getToolUrls().main).hostname}
                  </a>
                </div>
                <div>
                  <strong>Privacy concerns:</strong><br />
                  <a href={`mailto:privacy@${new URL(getToolUrls().main).hostname}`} className="text-primary hover:underline">
                    privacy@{new URL(getToolUrls().main).hostname}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Found a Bug?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3">Help us improve by reporting issues:</p>
              <ul className="text-sm space-y-1">
                <li>• Describe what you were trying to do</li>
                <li>• Tell us what happened vs. what you expected</li>
                <li>• Include your browser and operating system</li>
                <li>• Share any error messages you saw</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Feature Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3">Have an idea for a new tool or feature?</p>
              <ul className="text-sm space-y-1">
                <li>• What tool would you like to see?</li>
                <li>• How would it help your workflow?</li>
                <li>• Are there specific features you need?</li>
                <li>• Have you seen similar tools elsewhere?</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose mt-12">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              ⏱️ Response Time
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We typically respond within <strong className="text-foreground">24-48 hours</strong> during weekdays. 
              While we can't guarantee immediate responses, we read every message and truly appreciate your feedback.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              👥 Developer Community
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Encodly is built <em>by developers, for developers</em>. Your input helps shape the future of our tools. 
              Whether it's a small suggestion or a big feature request, we want to hear it!
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};