export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishDate: string;
  lastModified: string;
  readTime: number;
  tags: string[];
  keywords: string[];
  featuredImage?: string;
  canonicalUrl?: string;
}

export interface BlogMeta {
  title: string;
  description: string;
  author: string;
  publishDate: string;
  readTime: number;
  tags: string[];
  slug: string;
}