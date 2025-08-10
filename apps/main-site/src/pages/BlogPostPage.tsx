import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { PageLayout } from '../components/PageLayout';
import { getBlogPost } from '../utils/blog-loader';
import { BlogPost } from '../types/blog';
import { ChevronLeft, Calendar, Clock, Tag } from 'lucide-react';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<(BlogPost & { content: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    
    try {
      const blogPost = getBlogPost(slug);
      if (blogPost) {
        setPost(blogPost);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Failed to load blog post:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <PageLayout maxWidth="full">
        <div className="container mx-auto py-12 text-center max-w-6xl">
          <p className="text-xl text-muted-foreground">Loading blog post...</p>
        </div>
      </PageLayout>
    );
  }

  if (notFound || !post) {
    return (
      <PageLayout maxWidth="full">
        <div className="container mx-auto py-12 text-center max-w-6xl">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Sorry, we couldn't find the blog post you're looking for.
          </p>
          <Link to="/blog" className="text-primary hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </PageLayout>
    );
  }

  // Prepare JSON-LD structured data for blog post
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "author": {
      "@type": "Organization",
      "name": post.author
    },
    "datePublished": post.publishDate,
    "dateModified": post.lastModified,
    "url": `https://www.encodly.com/blog/${post.slug}`,
    "keywords": post.keywords.join(", "),
    "articleBody": post.content,
    "wordCount": post.content.split(' ').length,
    "publisher": {
      "@type": "Organization",
      "name": "Encodly",
      "url": "https://www.encodly.com"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.encodly.com/blog/${post.slug}`
    }
  };

  return (
    <PageLayout 
      title={`${post.title} - Encodly Blog`}
      description={post.description}
      keywords={post.keywords}
      canonicalUrl={`https://www.encodly.com/blog/${post.slug}`}
      maxWidth="full"
      jsonLd={jsonLd}
      type="article"
    >
        <article className="container mx-auto py-12 max-w-6xl">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-primary hover:underline mb-8"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Blog
          </Link>

          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.publishDate}>
                  {new Date(post.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-muted rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="prose prose-xl dark:prose-invert max-w-none prose-headings:max-w-none prose-p:max-w-none prose-ul:max-w-none prose-ol:max-w-none prose-li:max-w-none prose-blockquote:max-w-none prose-pre:max-w-none prose-code:max-w-none prose-img:max-w-none prose-table:max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-4xl font-bold mt-10 mb-6">{children}</h1>,
                h2: ({ children }) => <h2 className="text-3xl font-semibold mt-10 mb-5">{children}</h2>,
                h3: ({ children }) => <h3 className="text-2xl font-semibold mt-8 mb-4">{children}</h3>,
                p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                code: ({ className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic my-4">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          <footer className="mt-12 pt-8 border-t">
            <p className="text-center text-muted-foreground">
              Published by {post.author} on {new Date(post.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </footer>
        </article>
      </PageLayout>
  );
}