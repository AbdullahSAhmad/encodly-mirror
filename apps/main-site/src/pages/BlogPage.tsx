import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageLayout } from '../components/PageLayout';
import { BlogCard } from '../components/BlogCard';
import { getAllBlogPosts } from '../utils/blog-loader';
import { BlogPost } from '../types/blog';

export function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    try {
      const posts = getAllBlogPosts();
      setBlogPosts(posts);
    } catch (error) {
      console.error('Failed to load blog posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const blogMeta = blogPosts.map(post => ({
    title: post.title,
    description: post.description,
    author: post.author,
    publishDate: post.publishDate,
    readTime: post.readTime,
    tags: post.tags,
    slug: post.slug
  }));

  return (
    <>
      <Helmet>
        <title>Developer Blog - Encodly | Web Development Tutorials & Best Practices</title>
        <meta name="description" content="Read our latest articles on web development, JSON, Base64, JWT security, and developer tools. Learn best practices and improve your coding skills." />
        <meta name="keywords" content="developer blog, web development tutorials, JSON formatting, Base64 encoding, JWT security, programming best practices, coding tips" />
        
        <meta property="og:title" content="Developer Blog - Encodly" />
        <meta property="og:description" content="Read our latest articles on web development, JSON, Base64, JWT security, and developer tools." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://encodly.com/blog" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Developer Blog - Encodly" />
        <meta name="twitter:description" content="Read our latest articles on web development and developer tools." />
        
        <link rel="canonical" href="https://encodly.com/blog" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Encodly Developer Blog",
            "description": "Technical articles about web development, developer tools, and best practices",
            "url": "https://encodly.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "Encodly",
              "url": "https://encodly.com"
            },
            "blogPost": blogPosts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.description,
              "author": {
                "@type": "Organization",
                "name": post.author
              },
              "datePublished": post.publishDate,
              "dateModified": post.lastModified,
              "url": `https://encodly.com/blog/${post.slug}`,
              "keywords": post.keywords.join(", ")
            }))
          })}
        </script>
      </Helmet>

      <PageLayout maxWidth="full">
        <div className="container mx-auto py-12 max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Developer Blog</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our latest articles on web development, best practices, and developer tools.
              Stay updated with modern techniques and improve your coding skills.
            </p>
          </div>

          {loading ? (
            <div className="text-center">
              <p className="text-muted-foreground">Loading blog posts...</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {blogMeta.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </PageLayout>
    </>
  );
}