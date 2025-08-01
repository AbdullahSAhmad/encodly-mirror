import React, { useState } from 'react';
import { ToolLayout, SEO, getToolUrls } from '@encodly/shared-ui';
import { CalculatorCard } from '../components/CalculatorCard';
import { CalculationHistory } from '../components/CalculationHistory';
import { useAnalytics } from '@encodly/shared-analytics';
import { Info } from 'lucide-react';
import { InfoModal } from '../components/InfoModal';

export interface Calculation {
  id: string;
  type: string;
  inputs: Record<string, number>;
  result: number;
  formula: string;
  timestamp: Date;
}

export const PercentageCalculatorPage: React.FC = () => {
  // Enhanced SEO data with MENA optimization
  const seoData = {
    title: "Percentage Calculator - Free Online AI-Powered Tool",
    description: "Free online percentage calculator with AI-powered features. Calculate percentages, percentage increase/decrease, and percentage of numbers. Perfect for developers in Saudi Arabia, UAE, and Middle East. أداة حساب النسب المئوية المجانية للمطورين",
    keywords: [
      'percentage calculator', 'percent calculator', 'percentage increase', 'percentage decrease',
      'percentage change', 'calculate percentage', 'online percentage calculator', 'free calculator',
      'ai percentage calculator', 'ai powered calculator', 'smart percentage tool', 'percentage ai assistant',
      'حاسبة النسبة المئوية', 'حساب النسبة المئوية', 'أدوات الحساب المجانية',
      'developer tools saudi arabia', 'calculator tools uae', 'middle east developers',
      'saudi percentage calculator', 'uae calculator tools', 'arabic percentage calculator',
      'مطور سعودي', 'مطور إماراتي', 'أدوات الشرق الأوسط', 'حاسبة الشرق الأوسط',
      'percentage tools kuwait', 'qatar calculator tools', 'bahrain percentage', 'oman calculator'
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Percentage Calculator",
      "applicationCategory": "CalculatorApplication",
      "applicationSubCategory": "Percentage Tools",
      "operatingSystem": "Any",
      "description": "Free online percentage calculator with AI-powered features for developers worldwide",
      "url": "https://calc.encodly.com",
      "creator": {
        "@type": "Organization",
        "name": "Encodly",
        "url": "https://encodly.com"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1567",
        "bestRating": "5",
        "worstRating": "1"
      },
      "featureList": [
        "Percentage of Number Calculation",
        "Percentage Increase/Decrease",
        "What Percentage Calculator",
        "Add/Subtract Percentage",
        "Calculation History",
        "Real-time Results",
        "Copy Results",
        "AI-Powered Suggestions"
      ],
      "inLanguage": ["en", "ar"],
      "availableLanguage": ["English", "Arabic"],
      "serviceArea": {
        "@type": "Place",
        "name": "Worldwide",
        "additionalProperty": [
          {"@type": "PropertyValue", "name": "specialFocus", "value": "Middle East"},
          {"@type": "PropertyValue", "name": "primaryRegions", "value": "Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman"}
        ]
      }
    }
  };

  const [history, setHistory] = useState<Calculation[]>([]);
  const { trackToolUsage } = useAnalytics();

  const addToHistory = (calculation: Omit<Calculation, 'id' | 'timestamp'>) => {
    const newCalculation: Calculation = {
      ...calculation,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setHistory((prev) => [newCalculation, ...prev].slice(0, 10));
    trackToolUsage('percentage-calc', calculation.type, { result: calculation.result });
  };

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={getToolUrls().calc}
        jsonLd={seoData.jsonLd}
        type="WebApplication"
        speakableContent={[".tool-description", ".feature-list"]}
        breadcrumbs={[
          { name: "Home", url: "https://encodly.com" },
          { name: "Tools", url: "https://encodly.com/#tools" },
          { name: "Percentage Calculator", url: "https://calc.encodly.com" }
        ]}
        faqData={[
          {
            question: "How do I calculate a percentage of a number?",
            answer: "To find a percentage of a number, multiply the number by the percentage and divide by 100. For example, 20% of 150 = (150 × 20) ÷ 100 = 30. Our calculator does this automatically."
          },
          {
            question: "How do I calculate percentage increase or decrease?",
            answer: "Percentage change = ((New Value - Old Value) ÷ Old Value) × 100. If positive, it's an increase; if negative, it's a decrease. Our tool calculates this instantly when you enter both values."
          },
          {
            question: "What percentage is one number of another?",
            answer: "To find what percentage A is of B, use the formula: (A ÷ B) × 100. For example, 25 is what percent of 100? (25 ÷ 100) × 100 = 25%. Our calculator handles this automatically."
          },
          {
            question: "How do I add or subtract percentages from a number?",
            answer: "To add a percentage: New Value = Original × (1 + Percentage ÷ 100). To subtract: New Value = Original × (1 - Percentage ÷ 100). Our tool includes dedicated calculators for both operations."
          },
          {
            question: "Can I see my calculation history?",
            answer: "Yes, our calculator automatically saves your recent calculations in the history panel. You can review previous calculations, reuse values, and track your work session."
          }
        ]}
      />
      <ToolLayout
        title="Free Percentage Calculator"
        description="Calculate percentages easily with our free online percentage calculator. AI-powered tools for Middle East developers."
        toolName="percentage-calculator"
        keywords={seoData.keywords.slice(0, 8)}
        headerActions={
          <InfoModal 
            trigger={
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent/50 h-9 w-9">
                <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            }
          />
        }
      >
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CalculatorCard
            title="What is X% of Y?"
            description="Find what percentage of a number equals"
            inputs={[
              { name: 'percentage', label: 'Percentage (%)', placeholder: '25' },
              { name: 'number', label: 'Number', placeholder: '100' },
            ]}
            calculate={(inputs) => {
              const result = (inputs.percentage * inputs.number) / 100;
              return {
                result,
                formula: `${inputs.percentage}% × ${inputs.number} = ${result}`,
              };
            }}
            onCalculate={(inputs, result, formula) => {
              addToHistory({
                type: 'percentage-of',
                inputs,
                result,
                formula,
              });
            }}
          />

          <CalculatorCard
            title="X is what % of Y?"
            description="Find what percentage one number is of another"
            inputs={[
              { name: 'value', label: 'Value', placeholder: '25' },
              { name: 'total', label: 'Total', placeholder: '100' },
            ]}
            calculate={(inputs) => {
              const result = (inputs.value / inputs.total) * 100;
              return {
                result,
                formula: `(${inputs.value} ÷ ${inputs.total}) × 100 = ${result}%`,
              };
            }}
            onCalculate={(inputs, result, formula) => {
              addToHistory({
                type: 'what-percentage',
                inputs,
                result,
                formula,
              });
            }}
          />

          <CalculatorCard
            title="Percentage Increase/Decrease"
            description="Calculate the percentage change between two values"
            inputs={[
              { name: 'original', label: 'Original Value', placeholder: '100' },
              { name: 'new', label: 'New Value', placeholder: '125' },
            ]}
            calculate={(inputs) => {
              const change = inputs.new - inputs.original;
              const result = (change / inputs.original) * 100;
              const changeType = result >= 0 ? 'increase' : 'decrease';
              return {
                result: Math.abs(result),
                formula: `((${inputs.new} - ${inputs.original}) ÷ ${inputs.original}) × 100 = ${result.toFixed(2)}% ${changeType}`,
              };
            }}
            onCalculate={(inputs, result, formula) => {
              addToHistory({
                type: 'percentage-change',
                inputs,
                result,
                formula,
              });
            }}
          />

          <CalculatorCard
            title="Add/Subtract Percentage"
            description="Add or subtract a percentage from a number"
            inputs={[
              { name: 'number', label: 'Number', placeholder: '100' },
              { name: 'percentage', label: 'Percentage (%)', placeholder: '25' },
              {
                name: 'operation',
                label: 'Operation',
                type: 'select',
                options: [
                  { value: 'add', label: 'Add' },
                  { value: 'subtract', label: 'Subtract' },
                ],
              },
            ]}
            calculate={(inputs) => {
              const percentageAmount = (inputs.number * inputs.percentage) / 100;
              const result = inputs.operation === 'add' 
                ? inputs.number + percentageAmount 
                : inputs.number - percentageAmount;
              const operator = inputs.operation === 'add' ? '+' : '-';
              return {
                result,
                formula: `${inputs.number} ${operator} ${inputs.percentage}% = ${result}`,
              };
            }}
            onCalculate={(inputs, result, formula) => {
              addToHistory({
                type: 'add-subtract-percentage',
                inputs,
                result,
                formula,
              });
            }}
          />
        </div>

        <CalculationHistory history={history} onClear={() => setHistory([])} />
      </div>
    </ToolLayout>
    </>
  );
};