export const DEFAULT_MARKDOWN = `# Welcome to Markdown Viewer

This is a **powerful** markdown editor with live preview. You can write your markdown on the left and see the rendered output on the right.

Press Enter to create a new paragraph (like this one).

For a line break without paragraph spacing,  
use Shift+Enter (notice the line break above).

## Features

- ✅ **GitHub Flavored Markdown** support
- ✅ **Syntax highlighting** for code blocks
- ✅ **Math equations** with KaTeX
- ✅ **Live preview** as you type
- ✅ **Export options** (copy, download)
- ✅ **Dark mode** support

## Code Example

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // Output: 55
\`\`\`

## Math Equations

Inline math: $E = mc^2$

Block math:
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

## Tables

| Feature | Status | Description |
|---------|--------|-------------|
| GFM | ✅ | GitHub Flavored Markdown |
| Math | ✅ | KaTeX rendering |
| Syntax | ✅ | Code highlighting |

## Task Lists

- [x] Create markdown parser
- [x] Add syntax highlighting
- [x] Implement math support
- [ ] Add more themes
- [ ] Mobile optimization

## Links and Images

Visit [Encodly](https://encodly.com) for more tools!

> **Tip**: Start editing this text to see the live preview in action!

---

*Happy writing! 📝*`;

export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function getCharacterCount(text: string): number {
  return text.length;
}

export function getReadingTime(text: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = getWordCount(text);
  return Math.ceil(wordCount / wordsPerMinute);
}

export function generateMarkdownStats(text: string) {
  const lines = text.split('\n').length;
  const words = getWordCount(text);
  const characters = getCharacterCount(text);
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const readingTime = getReadingTime(text);

  // Count headers
  const headers = text.match(/^#{1,6}\s/gm)?.length || 0;
  
  // Count code blocks
  const codeBlocks = text.match(/```[\s\S]*?```/g)?.length || 0;
  
  // Count links
  const links = text.match(/\[.*?\]\(.*?\)/g)?.length || 0;
  
  // Count images
  const images = text.match(/!\[.*?\]\(.*?\)/g)?.length || 0;

  return {
    lines,
    words,
    characters,
    charactersNoSpaces,
    readingTime,
    headers,
    codeBlocks,
    links,
    images
  };
}