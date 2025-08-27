import { BlogPost } from '../types/blog';

// Import all metadata files
import jsonFormattingMeta from '../content/posts/mastering-json-formatting/meta.json';
import productivityToolsMeta from '../content/posts/developer-productivity-tools/meta.json';
import debuggingTechniquesMeta from '../content/posts/web-debugging-techniques/meta.json';
import apiDesignMeta from '../content/posts/api-design-best-practices/meta.json';
import typescriptPatternsMeta from '../content/posts/typescript-advanced-patterns/meta.json';
import modernCssMeta from '../content/posts/modern-css-techniques/meta.json';
import aiCodingAssistantsMeta from '../content/posts/ai-coding-assistants-developer-workflow/meta.json';
import aiWebDevelopmentMeta from '../content/posts/ai-web-development-future/meta.json';
import anthropicClaudeMeta from '../content/posts/anthropic-claude-ai-development/meta.json';
import aiPoweredCodeReviewMeta from '../content/posts/ai-powered-code-review/meta.json';
import futureOfFrontendFrameworksMeta from '../content/posts/future-of-frontend-frameworks/meta.json';

// Import all content files
import jsonFormattingContent from '../content/posts/mastering-json-formatting/content.md?raw';
import productivityToolsContent from '../content/posts/developer-productivity-tools/content.md?raw';
import debuggingTechniquesContent from '../content/posts/web-debugging-techniques/content.md?raw';
import apiDesignContent from '../content/posts/api-design-best-practices/content.md?raw';
import typescriptPatternsContent from '../content/posts/typescript-advanced-patterns/content.md?raw';
import modernCssContent from '../content/posts/modern-css-techniques/content.md?raw';
import aiCodingAssistantsContent from '../content/posts/ai-coding-assistants-developer-workflow/content.md?raw';
import aiWebDevelopmentContent from '../content/posts/ai-web-development-future/content.md?raw';
import anthropicClaudeContent from '../content/posts/anthropic-claude-ai-development/content.md?raw';
import aiPoweredCodeReviewContent from '../content/posts/ai-powered-code-review/content.md?raw';
import futureOfFrontendFrameworksContent from '../content/posts/future-of-frontend-frameworks/content.md?raw';

// Create a map of all posts with their metadata and content
// Using the actual slugs from the metadata files
const BLOG_POSTS_MAP = {
  'mastering-json-formatting-best-practices-2025': {
    metadata: jsonFormattingMeta as BlogPost,
    content: jsonFormattingContent
  },
  'developer-productivity-essential-tools-2025': {
    metadata: productivityToolsMeta as BlogPost,
    content: productivityToolsContent
  },
  'web-development-debugging-techniques-2025': {
    metadata: debuggingTechniquesMeta as BlogPost,
    content: debuggingTechniquesContent
  },
  'rest-api-design-best-practices-2025': {
    metadata: apiDesignMeta as BlogPost,
    content: apiDesignContent
  },
  'typescript-advanced-patterns-type-safety-2025': {
    metadata: typescriptPatternsMeta as BlogPost,
    content: typescriptPatternsContent
  },
  'modern-css-techniques-responsive-design-2025': {
    metadata: modernCssMeta as BlogPost,
    content: modernCssContent
  },
  'ai-coding-assistants-transform-developer-workflow-2025': {
    metadata: aiCodingAssistantsMeta as BlogPost,
    content: aiCodingAssistantsContent
  },
  'ai-powered-web-development-future-2025': {
    metadata: aiWebDevelopmentMeta as BlogPost,
    content: aiWebDevelopmentContent
  },
  'anthropic-claude-ai-development-revolution-2025': {
    metadata: anthropicClaudeMeta as BlogPost,
    content: anthropicClaudeContent
  },
  'ai-powered-code-review-revolution': {
    metadata: aiPoweredCodeReviewMeta as BlogPost,
    content: aiPoweredCodeReviewContent
  },
  'future-of-frontend-frameworks-2025': {
    metadata: futureOfFrontendFrameworksMeta as BlogPost,
    content: futureOfFrontendFrameworksContent
  }
};

/**
 * Load blog post metadata
 */
function loadPostMetadata(slug: string): BlogPost | null {
  const post = BLOG_POSTS_MAP[slug as keyof typeof BLOG_POSTS_MAP];
  return post?.metadata || null;
}

/**
 * Load blog post content
 */
function loadPostContent(slug: string): string | null {
  const post = BLOG_POSTS_MAP[slug as keyof typeof BLOG_POSTS_MAP];
  return post?.content || null;
}

/**
 * Get all available blog posts (metadata only)
 */
export function getAllBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = [];
  
  for (const slug of Object.keys(BLOG_POSTS_MAP)) {
    const metadata = loadPostMetadata(slug);
    if (metadata) {
      posts.push(metadata);
    }
  }
  
  // Sort by publish date (newest first)
  return posts.sort((a, b) => 
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

/**
 * Get a specific blog post with content
 */
export function getBlogPost(slug: string): (BlogPost & { content: string }) | null {
  const metadata = loadPostMetadata(slug);
  const content = loadPostContent(slug);
  
  if (!metadata || !content) {
    return null;
  }
  
  return {
    ...metadata,
    content
  };
}

/**
 * Get blog posts by tag
 */
export function getBlogPostsByTag(tag: string): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter(post => 
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Search blog posts by keyword
 */
export function searchBlogPosts(query: string): BlogPost[] {
  const allPosts = getAllBlogPosts();
  const searchTerm = query.toLowerCase();
  
  return allPosts.filter(post => {
    const searchableText = [
      post.title,
      post.description,
      ...post.tags,
      ...post.keywords
    ].join(' ').toLowerCase();
    
    return searchableText.includes(searchTerm);
  });
}

/**
 * Get related blog posts based on tags
 */
export function getRelatedBlogPosts(currentSlug: string, limit = 3): BlogPost[] {
  const currentPost = loadPostMetadata(currentSlug);
  if (!currentPost) return [];
  
  const allPosts = getAllBlogPosts();
  const otherPosts = allPosts.filter(post => post.slug !== currentSlug);
  
  // Score posts based on shared tags
  const scoredPosts = otherPosts.map(post => {
    const sharedTags = post.tags.filter(tag => 
      currentPost.tags.includes(tag)
    ).length;
    
    return {
      post,
      score: sharedTags
    };
  });
  
  // Sort by score and return top results
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

/**
 * Check if a blog post exists
 */
export function blogPostExists(slug: string): boolean {
  return slug in BLOG_POSTS_MAP;
}