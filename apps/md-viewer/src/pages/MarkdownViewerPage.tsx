import React, { useState } from 'react';
import { ToolLayout, useToast } from '@encodly/shared-ui';
import { FileText } from 'lucide-react';
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

  const jsonLd = {
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ToolLayout
        title="Markdown Viewer"
        description="View and edit Markdown with live preview, syntax highlighting, and math support"
        toolName="md-viewer"
        keywords={['markdown viewer', 'markdown editor', 'md preview', 'markdown converter', 'live preview', 'syntax highlighting', 'math equations', 'katex']}
        headerActions={
          <InfoModal 
            trigger={
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent/50 h-9 w-9">
                <FileText className="h-4 w-4 text-muted-foreground hover:text-foreground" />
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