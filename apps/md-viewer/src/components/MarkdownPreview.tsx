import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@encodly/shared-ui';
import { Copy, Download, Eye, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import { generateMarkdownStats } from '../utils/markdownUtils';

interface MarkdownPreviewProps {
  markdown: string;
  onToast?: (message: string) => void;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  markdown,
  onToast
}) => {
  const stats = generateMarkdownStats(markdown);

  const handleCopyHtml = React.useCallback(async () => {
    if (!markdown.trim()) return;
    
    try {
      // Create a temporary div to get the rendered HTML
      const tempDiv = document.createElement('div');
      tempDiv.className = 'markdown-content';
      document.body.appendChild(tempDiv);
      
      // This is a simplified approach - in a real implementation,
      // you might want to use a markdown-to-html library
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Markdown Export</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
    code { background: #f6f8fa; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
    pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
    blockquote { border-left: 4px solid #dfe2e5; padding-left: 16px; margin: 16px 0; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #dfe2e5; padding: 8px 12px; text-align: left; }
    th { background: #f6f8fa; font-weight: 600; }
  </style>
</head>
<body>
${tempDiv.innerHTML}
</body>
</html>`;
      
      document.body.removeChild(tempDiv);
      
      await navigator.clipboard.writeText(htmlContent);
      onToast?.('HTML copied to clipboard!');
    } catch (err) {
      onToast?.('Failed to copy HTML');
    }
  }, [markdown, onToast]);

  const handleDownloadHtml = React.useCallback(() => {
    if (!markdown.trim()) return;
    
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Markdown Export</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; color: #24292f; }
    h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; line-height: 1.25; }
    h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    code { background: #f6f8fa; padding: 2px 4px; border-radius: 3px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 85%; }
    pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
    pre code { background: transparent; padding: 0; }
    blockquote { border-left: 4px solid #dfe2e5; padding-left: 16px; margin: 16px 0; color: #656d76; }
    table { border-collapse: collapse; width: 100%; margin: 16px 0; }
    th, td { border: 1px solid #dfe2e5; padding: 6px 12px; text-align: left; }
    th { background: #f6f8fa; font-weight: 600; }
    a { color: #0969da; text-decoration: none; }
    a:hover { text-decoration: underline; }
    ul, ol { padding-left: 24px; }
    li { margin: 4px 0; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body id="markdown-content">
</body>
<script>
  // This would need actual markdown rendering - simplified for demo
  document.getElementById('markdown-content').innerHTML = \`${markdown.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
</script>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markdown-export.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onToast?.('HTML file downloaded!');
  }, [markdown, onToast]);

  const renderedContent = useMemo(() => {
    if (!markdown.trim()) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <FileText className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">No content to preview</p>
          <p className="text-sm">Start typing in the editor to see the preview</p>
        </div>
      );
    }

    return (
      <ReactMarkdown
        className="markdown-content"
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          // Custom component for code blocks with language labels
          pre: ({ children, ...props }) => (
            <pre {...props} className="relative">
              {children}
            </pre>
          ),
          // Custom component for task lists
          input: ({ checked, ...props }) => (
            <input
              {...props}
              type="checkbox"
              checked={checked}
              readOnly
              className="mr-2"
            />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    );
  }, [markdown]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Preview
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyHtml}
              disabled={!markdown.trim()}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadHtml}
              disabled={!markdown.trim()}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {markdown.trim() && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{stats.headers} headers</span>
            <span>{stats.codeBlocks} code blocks</span>
            <span>{stats.links} links</span>
            <span>{stats.images} images</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-4 pt-0">
        <div className="h-full overflow-y-auto border border-input rounded-md p-4 bg-background">
          {renderedContent}
        </div>
      </CardContent>
    </Card>
  );
};