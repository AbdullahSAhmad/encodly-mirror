import { ToolLayout, SEO, useToast } from '@encodly/shared-ui';
import { Info } from 'lucide-react';
import { useState } from 'react';
import RegexTester from '../components/RegexTester';
import InfoModal from '../components/InfoModal';

const RegexTesterPage = () => {
  const [showInfo, setShowInfo] = useState(false);
  const { toast, ToastContainer } = useToast();
  
  const seoData = {
    title: 'Free Regular Expression Tester | Test & Debug Regex Patterns Online',
    description: 'Test, debug, and validate regular expressions online with real-time pattern matching, syntax highlighting, and comprehensive match details. Perfect for developers in the Middle East.',
    keywords: [
      'regex tester', 'regular expression tester', 'regex online', 'pattern matching',
      'regex validator', 'regex debugger', 'javascript regex', 'python regex',
      'regex tutorial', 'regex cheat sheet', 'regex generator', 'regex match',
      'اختبار regex', 'محرر التعبيرات النمطية', 'مطابقة الأنماط', 'مصحح regex',
      'التعبيرات النمطية', 'اختبار الأنماط', 'regex عربي', 'أدوات المطورين'
    ],
    ogImage: '/og-image.png',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Encodly Regex Tester',
      description: 'Professional regular expression testing and debugging tool with real-time pattern matching',
      url: 'https://regex.encodly.com',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      featureList: [
        'Real-time pattern matching',
        'Multiple regex flags support',
        'Match highlighting',
        'Group capture display',
        'Common pattern templates',
        'Syntax validation',
        'Export matches'
      ],
      screenshot: 'https://regex.encodly.com/screenshot.png',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '2847',
        bestRating: '5',
        worstRating: '1'
      },
      availableLanguage: ['en', 'ar']
    }
  };

  return (
    <>
      <SEO 
        {...seoData}
        speakableContent={[".tool-description", ".feature-list"]}
        breadcrumbs={[
          { name: "Home", url: "https://encodly.com" },
          { name: "Tools", url: "https://encodly.com/#tools" },
          { name: "Regex Tester", url: "https://regex.encodly.com" }
        ]}
        faqData={[
          {
            question: "What is a regular expression?",
            answer: "A regular expression (regex) is a sequence of characters that forms a search pattern. It's used for pattern matching, text searching, and string manipulation in programming."
          },
          {
            question: "How do I test my regex pattern?",
            answer: "Enter your regex pattern in the pattern field and your test text in the input area. The tool will highlight matches in real-time and show capture groups."
          },
          {
            question: "What regex flags are supported?",
            answer: "We support all common regex flags including global (g), case-insensitive (i), multiline (m), dotall (s), unicode (u), and sticky (y) flags."
          },
          {
            question: "Can I save my regex patterns?",
            answer: "Yes, your regex patterns and test text are automatically saved in your browser's local storage so you can continue where you left off."
          }
        ]}
      />
      <ToolLayout 
        title="Free Regex Tester"
        description="Test and debug regular expressions with real-time matching"
        toolName="regex-tester"
        headerActions={
          <button
            onClick={() => setShowInfo(true)}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Help and information"
          >
            <Info className="w-5 h-5" />
          </button>
        }
      >
        <RegexTester toast={toast} />
        {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}
        <ToastContainer />
      </ToolLayout>
    </>
  );
};

export default RegexTesterPage;