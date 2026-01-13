import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import SEO, { createBlogPostSchema } from '../../components/SEO';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

const BlogPost = () => {
  const { slug } = useParams();
  const { t } = useI18n();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${API_BASE}/blogs`);
        const data = await response.json();

        if (data.data && Array.isArray(data.data)) {
          const blog = data.data.find(b => b.slug === slug);
          setPost(blog);
        }
      } catch (err) {
        console.error('[BlogPost] Failed to fetch blog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-3xl mx-auto px-5 lg:px-8 py-16">
          <div className="flex justify-center items-center py-20">
            <Icon name="Loader2" size={40} className="animate-spin text-accent" />
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-3xl mx-auto px-5 lg:px-8 py-16">
          <div className="text-center py-20 bg-card border border-border rounded-xl">
            <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('blog_not_found')}</h3>
            <p className="text-muted-foreground mb-6">{t('blog_not_found_desc')}</p>
            <Link to="/blog" className="inline-flex items-center text-accent font-semibold hover:gap-2 transition-all gap-1">
              <Icon name="ArrowLeft" size={16} />
              {t('back_to_blog')}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={post.title}
        description={post.excerpt || post.content?.substring(0, 160)}
        keywords={`skincare tips, ${post.category || 'beauty'}, skincare article, نصائح العناية بالبشرة, ${post.title?.toLowerCase()}`}
        url={`/blog/${slug}`}
        image={post.image_url}
        type="article"
        jsonLd={createBlogPostSchema({
          title: post.title,
          excerpt: post.excerpt || post.content?.substring(0, 160),
          image: post.image_url,
          date: post.created_at
        })}
      />
      <Header />
      <main className="max-w-3xl mx-auto px-5 lg:px-8 py-16">
        {/* Back Link */}
        <Link to="/blog" className="inline-flex items-center text-accent font-semibold hover:gap-2 transition-all gap-1 mb-8">
          <Icon name="ArrowLeft" size={16} />
          {t('back_to_blog')}
        </Link>

        {/* Featured Image */}
        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-96 object-cover rounded-xl mb-8"
          />
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <span className="flex items-center gap-2">
              <Icon name="Calendar" size={16} />
              {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-2">
              <Icon name="Clock" size={16} />
              {Math.ceil((post.content?.length || 0) / 200)} {t('min_read')}
            </span>
          </div>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 mb-8">
            <p className="text-lg text-foreground font-semibold italic">{post.excerpt}</p>
          </div>
        )}

        {/* Content - Render HTML from Rich Text Editor */}
        <article className="prose prose-lg max-w-none">
          <style>{`
            .blog-content {
              color: var(--color-foreground);
              line-height: 1.8;
            }
            .blog-content h1 {
              font-size: 2rem;
              font-weight: 700;
              margin: 2rem 0 1rem;
              color: var(--color-foreground);
            }
            .blog-content h2 {
              font-size: 1.5rem;
              font-weight: 700;
              margin: 1.75rem 0 0.75rem;
              color: var(--color-foreground);
            }
            .blog-content h3 {
              font-size: 1.25rem;
              font-weight: 600;
              margin: 1.5rem 0 0.5rem;
              color: var(--color-foreground);
            }
            .blog-content p {
              margin: 1rem 0;
              color: var(--color-muted-foreground);
            }
            .blog-content strong {
              font-weight: 600;
              color: var(--color-foreground);
            }
            .blog-content em {
              font-style: italic;
            }
            .blog-content a {
              color: var(--color-accent);
              text-decoration: underline;
              transition: opacity 0.2s;
            }
            .blog-content a:hover {
              opacity: 0.8;
            }
            .blog-content blockquote {
              border-left: 4px solid var(--color-accent);
              padding: 1rem 1.5rem;
              margin: 1.5rem 0;
              background: var(--color-accent-foreground);
              background: rgba(236, 72, 153, 0.1);
              border-radius: 0 8px 8px 0;
              font-style: italic;
            }
            .blog-content blockquote strong {
              color: var(--color-accent);
            }
            .blog-content ul, .blog-content ol {
              margin: 1rem 0;
              padding-left: 2rem;
            }
            .blog-content li {
              margin: 0.5rem 0;
              color: var(--color-muted-foreground);
            }
            .blog-content img {
              max-width: 100%;
              border-radius: 12px;
              margin: 1.5rem 0;
            }
            .blog-content pre, .blog-content code {
              background: var(--color-muted);
              padding: 0.25rem 0.5rem;
              border-radius: 4px;
              font-family: monospace;
            }
            .blog-content pre {
              padding: 1rem;
              overflow-x: auto;
            }
            .blog-content [style*="background-color"] {
              padding: 0.125rem 0.375rem;
              border-radius: 4px;
            }
          `}</style>
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </div>
  );
};

export default BlogPost;
