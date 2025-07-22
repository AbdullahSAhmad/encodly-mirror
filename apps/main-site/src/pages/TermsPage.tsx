import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { getPageUrl, getToolUrls } from '../utils/urls';

export const TermsPage: React.FC = () => {
  return (
    <PageLayout
      title="Terms of Service - Encodly"
      description="Terms of service for using Encodly's free developer tools and website."
      keywords={['terms of service', 'terms', 'conditions', 'encodly']}
      canonicalUrl={getPageUrl('/terms')}
    >
      <h1>Terms of Service</h1>

      <p><em>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</em></p>

      <h2>Agreement to Terms</h2>

      <p>
        By accessing and using Encodly's website and tools, you accept and agree to be bound by the terms and provision of this agreement.
      </p>

      <h2>Description of Service</h2>

      <p>
        Encodly provides free online developer tools including but not limited to:
      </p>

      <ul>
        <li>JSON formatting and validation</li>
        <li>Base64 encoding and decoding</li>
        <li>Other developer utilities as they become available</li>
      </ul>

      <p>
        All tools are provided free of charge and without registration requirements.
      </p>

      <h2>Acceptable Use</h2>

      <h3>Permitted Uses</h3>
      <p>
        You may use our services for any lawful purpose including:
      </p>

      <ul>
        <li>Personal development and learning</li>
        <li>Professional software development</li>
        <li>Educational purposes</li>
        <li>Commercial projects</li>
      </ul>

      <h3>Prohibited Uses</h3>
      <p>
        You agree not to use our services to:
      </p>

      <ul>
        <li>Violate any applicable laws or regulations</li>
        <li>Process illegal, harmful, or malicious content</li>
        <li>Attempt to compromise or interfere with our services</li>
        <li>Use automated tools to scrape or abuse our services</li>
        <li>Reverse engineer or attempt to extract source code</li>
        <li>Use the service to harm minors in any way</li>
      </ul>

      <h2>Intellectual Property</h2>

      <p>
        The service and its original content, features, and functionality are and will remain the exclusive property of Encodly and its licensors.
      </p>

      <h3>Your Content</h3>
      <p>
        You retain all rights to any content you process through our tools. We do not claim ownership of your data or content.
      </p>

      <h2>Privacy and Data Processing</h2>

      <p>
        Our approach to your privacy and data:
      </p>

      <ul>
        <li>All data processing happens in your browser</li>
        <li>We do not store or transmit your sensitive data</li>
        <li>See our <a href={getPageUrl('/privacy')}>Privacy Policy</a> for complete details</li>
      </ul>

      <h2>Service Availability</h2>

      <p>
        We strive to provide reliable service, but we do not guarantee:
      </p>

      <ul>
        <li>100% uptime or availability</li>
        <li>That the service will be error-free</li>
        <li>That all features will work in all browsers or devices</li>
      </ul>

      <p>
        We may temporarily suspend service for maintenance, updates, or other operational reasons.
      </p>

      <h2>Disclaimers</h2>

      <h3>No Warranty</h3>
      <p>
        The service is provided "as is" and "as available" without any warranties of any kind, either express or implied.
      </p>

      <h3>Use at Your Own Risk</h3>
      <p>
        While we strive for accuracy, you should:
      </p>

      <ul>
        <li>Verify important results independently</li>
        <li>Not rely solely on our tools for critical applications</li>
        <li>Backup important data before processing</li>
      </ul>

      <h2>Limitation of Liability</h2>

      <p>
        In no event shall Encodly be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
      </p>

      <h2>Indemnification</h2>

      <p>
        You agree to defend, indemnify, and hold harmless Encodly from and against any loss, damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to or arising out of your use of the service or violation of these terms.
      </p>

      <h2>Termination</h2>

      <p>
        We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
      </p>

      <p>
        Upon termination, your right to use the service will cease immediately.
      </p>

      <h2>Changes to Terms</h2>

      <p>
        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
      </p>

      <h2>Governing Law</h2>

      <p>
        These Terms shall be interpreted and governed by the laws of the United States, without regard to its conflict of law provisions.
      </p>

      <h2>Severability</h2>

      <p>
        If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.
      </p>

      <h2>Contact Information</h2>

      <p>
        If you have any questions about these Terms, please contact us:
      </p>

      <ul>
        <li>Email: <a href={`mailto:legal@${new URL(getToolUrls().main).hostname}`}>legal@{new URL(getToolUrls().main).hostname}</a></li>
        <li>Contact form: <a href={getPageUrl('/contact')}>Contact page</a></li>
      </ul>

      <h2>Acknowledgment</h2>

      <p>
        By using our service, you acknowledge that you have read this Terms of Service and agree to be bound by its terms and conditions.
      </p>
    </PageLayout>
  );
};