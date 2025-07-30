import React, { useState } from 'react';
import { ToolLayout, useToast, SEO, getToolUrls } from '@encodly/shared-ui';
import { Info } from 'lucide-react';
import { MarkdownEditor } from '../components/MarkdownEditor';
import { MarkdownPreview } from '../components/MarkdownPreview';
import { InfoModal } from '../components/InfoModal';
import { DEFAULT_MARKDOWN } from '../utils/markdownUtils';

export const MarkdownViewerPage: React.FC = () => {
  const [markdown, setMarkdown] = useState(() => {
    // Try to load from localStorage first, fallback to default
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('markdown-editor-content');
      return saved || DEFAULT_MARKDOWN;
    }
    return DEFAULT_MARKDOWN;
  });
  const { toast, ToastContainer } = useToast();

  const seoData = {
    title: "Free Markdown Viewer & Editor - Online Tool | Encodly",
    description: "A powerful markdown editor and viewer with live preview, syntax highlighting, and mathematical equation support using KaTeX. Perfect for documentation, README files, and technical writing.",
    keywords: [
      'markdown viewer', 'markdown editor', 'md preview', 'markdown converter', 'live preview', 
      'syntax highlighting', 'math equations', 'katex', 'markdown online', 'developer tools'
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Markdown Viewer - Encodly",
      "description": "A powerful markdown editor and viewer with live preview, syntax highlighting, and mathematical equation support using KaTeX. Perfect for documentation, README files, and technical writing.",
      "url": "https://md.encodly.com",
      "applicationCategory": "ProductivityApplication",
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
        canonicalUrl={getToolUrls().md}
        jsonLd={seoData.jsonLd}
        type="WebApplication"
        speakableContent={[".tool-description", ".feature-list"]}
        breadcrumbs={[
          { name: "Home", url: "https://encodly.com" },
          { name: "Tools", url: "https://encodly.com/#tools" },
          { name: "Markdown Viewer", url: "https://md.encodly.com" }
        ]}
        faqData={[
          {
            question: "What is Markdown?",
            answer: "Markdown is a lightweight markup language that uses plain text formatting syntax. It's commonly used for documentation, README files, forums, and note-taking because it's easy to write and read."
          },
          {
            question: "What Markdown features are supported?",
            answer: "Our viewer supports standard Markdown plus extensions: tables, task lists, code highlighting, math equations (KaTeX), footnotes, and emoji. It renders everything in real-time as you type."
          },
          {
            question: "Can I write mathematical equations?",
            answer: "Yes, we support LaTeX-style math equations using KaTeX. Use $inline math$ for inline equations and $$block math$$ for display equations. Perfect for technical documentation and academic writing."
          },
          {
            question: "How do I export my Markdown?",
            answer: "You can copy the raw Markdown text or the rendered HTML. The tool also supports printing and saving as PDF through your browser's print function."
          },
          {
            question: "Is my content saved automatically?",
            answer: "Yes, your Markdown content is automatically saved in your browser's local storage. Your work persists between sessions, but remember to backup important documents externally."
          }
        ]}
      />
      
      <ToolLayout
        title="Free Markdown Viewer"
        description="View and edit Markdown with live preview, syntax highlighting, and math support"
        toolName="md-viewer"
        keywords={['markdown viewer', 'markdown editor', 'md preview', 'markdown converter', 'live preview', 'syntax highlighting', 'math equations', 'katex']}
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
        <div className="h-full flex flex-col">
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6">
            <MarkdownEditor
              markdown={markdown}
              onMarkdownChange={setMarkdown}
              onToast={toast}
            />
            <MarkdownPreview
              markdown={markdown}
              onToast={toast}
            />
          </div>
        </div>
      </ToolLayout>

      <ToastContainer />
    </>
  );
};