import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';

const BlogPost = () => {
  const { slug } = useParams();
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
            <h3 className="text-xl font-semibold text-foreground mb-2">Blog Post Not Found</h3>
            <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
            <Link to="/blog" className="inline-flex items-center text-accent font-semibold hover:gap-2 transition-all gap-1">
              <Icon name="ArrowLeft" size={16} />
              Back to Blogs
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-5 lg:px-8 py-16">
        {/* Back Link */}
        <Link to="/blog" className="inline-flex items-center text-accent font-semibold hover:gap-2 transition-all gap-1 mb-8">
          <Icon name="ArrowLeft" size={16} />
          Back to Blogs
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
              {Math.ceil((post.content?.length || 0) / 200)} min read
            </span>
          </div>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 mb-8">
            <p className="text-lg text-foreground font-semibold italic">{post.excerpt}</p>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert max-w-none text-foreground">
          <div className="whitespace-pre-wrap text-base leading-relaxed">
            {post.content}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPost;
