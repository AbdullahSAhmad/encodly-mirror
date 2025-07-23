import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { getPageUrl, getToolUrls } from '../utils/urls';

export const PrivacyPage: React.FC = () => {
  return (
    <PageLayout
      title="Privacy Policy - Encodly"
      description="Encodly's privacy policy explaining how we protect your data and maintain your privacy while using our developer tools."
      keywords={['privacy policy', 'data protection', 'privacy', 'encodly']}
      canonicalUrl={getPageUrl('/privacy')}
    >
      <h1>Privacy Policy</h1>

      <p><em>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p>

      <h2>Our Privacy Commitment</h2>

      <p>
        At Encodly, we take your privacy seriously. This policy explains how we collect, use, and protect your information 
        when you use our developer tools and website.
      </p>

      <h2>Data Processing</h2>

      <h3>Client-Side Processing</h3>
      <p>
        All data processing for our tools (JSON formatting, Base64 encoding/decoding, etc.) happens directly in your browser. 
        Your data is never sent to our servers for processing, ensuring complete privacy and security.
      </p>

      <h3>Local Storage</h3>
      <p>
        Our tools may save your input temporarily in your browser's local storage to restore your work if you refresh the page. 
        This data remains on your device and is never transmitted to our servers.
      </p>

      <h2>Information We Collect</h2>

      <h3>Analytics Data</h3>
      <p>
        We use privacy-focused analytics to understand how our tools are used and to improve our services. This includes:
      </p>
      <ul>
        <li>Page views and tool usage statistics</li>
        <li>Browser and device information (anonymized)</li>
        <li>General geographic location (country/region level)</li>
        <li>Referral sources</li>
      </ul>

      <p>
        We do not collect or store any personal information that can identify you individually.
      </p>

      <h3>Error Logging</h3>
      <p>
        We collect anonymous error logs to help us fix bugs and improve our tools. These logs do not contain any of your data or personal information.
      </p>

      <h2>Cookies and Tracking</h2>

      <p>
        We use minimal cookies and tracking technologies:
      </p>

      <ul>
        <li><strong>Essential Cookies:</strong> Required for basic functionality like theme preferences</li>
        <li><strong>Analytics Cookies:</strong> Help us understand usage patterns (anonymized)</li>
      </ul>

      <p>
        We do not use advertising cookies or sell your data to third parties.
      </p>

      <h2>Third-Party Services</h2>

      <h3>Content Delivery Network (CDN)</h3>
      <p>
        We use a CDN to deliver our website quickly and reliably. The CDN provider may log basic request information for security and performance purposes.
      </p>

      <h3>Hosting Provider</h3>
      <p>
        Our website is hosted on secure, privacy-compliant infrastructure. Server logs may contain IP addresses and request information for security purposes.
      </p>

      <h2>Data Security</h2>

      <p>
        We implement appropriate security measures to protect your information:
      </p>

      <ul>
        <li>All data transmission is encrypted using HTTPS</li>
        <li>No sensitive data is stored on our servers</li>
        <li>Regular security audits and updates</li>
        <li>Access controls and monitoring</li>
      </ul>

      <h2>Your Rights</h2>

      <p>
        You have the following rights regarding your privacy:
      </p>

      <ul>
        <li>Use our tools without creating an account</li>
        <li>Clear your browser's local storage to remove saved data</li>
        <li>Disable cookies in your browser settings</li>
        <li>Request information about data we may have collected</li>
      </ul>

      <h2>Children's Privacy</h2>

      <p>
        Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.
      </p>

      <h2>International Users</h2>

      <p>
        Our services are available globally. By using our tools, you consent to the processing of your information as described in this policy.
      </p>

      <h2>Changes to This Policy</h2>

      <p>
        We may update this privacy policy from time to time. We will notify users of any significant changes by updating the date at the top of this policy.
      </p>

      <h2>Contact Information</h2>

      <p>
        If you have any questions about this privacy policy or our privacy practices, please contact us at:
      </p>

      <ul>
        <li>Email: <a href={`mailto:privacy@${new URL(getToolUrls().main).hostname}`}>privacy@{new URL(getToolUrls().main).hostname}</a></li>
      </ul>

      <h2>Commitment to Privacy</h2>

      <p>
        We are committed to protecting your privacy and being transparent about our practices. 
        If you have any concerns or questions, please don't hesitate to reach out to us.
      </p>
    </PageLayout>
  );
};