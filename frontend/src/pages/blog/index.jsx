import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import { Link } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';
import Icon from '../../components/AppIcon';
import { IMAGES } from '../../utils/imageConstants';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';

const Blog = () => {
  const { t } = useI18n();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        console.log('[Blog] Fetching from:', `${API_BASE}/blogs`);
        const response = await fetch(`${API_BASE}/blogs`);
        console.log('[Blog] Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('[Blog] Fetched data:', data);
        
        if (data.data && Array.isArray(data.data)) {
          // Map blogs to display format
          const mappedBlogs = data.data.map((blog) => ({
            id: blog.id,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt || blog.content?.substring(0, 150) + '...',
            image: blog.image_url || IMAGES.blog_routine, // Use uploaded image or default
            category: 'Blog',
            date: new Date(blog.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            readTime: `${Math.ceil((blog.content?.length || 0) / 200)} min read`
          }));
          
          console.log('[Blog] Mapped blogs:', mappedBlogs);
          setPosts(mappedBlogs);
        } else {
          console.log('[Blog] No blogs found');
          setPosts([]);
        }
      } catch (err) {
        console.error('[Blog] Failed to fetch blogs:', err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
    
    // Refresh blogs every 30 seconds to catch updates from admin panel
    const interval = setInterval(fetchBlogs, 30000);
    
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-5 lg:px-8 bg-gradient-to-br from-accent/10 to-purple-500/10">
          <div className="max-w-6xl mx-auto">
            <div className="inline-block px-4 py-2 bg-accent/20 border border-accent/40 rounded-full mb-4">
              <span className="text-accent text-sm font-semibold">Skincare Insights</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">Skincare Tips & Guides</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">Expert advice, tutorials, and insights to help you achieve and maintain healthy, glowing skin</p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20 px-5 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Icon name="Loader2" size={40} className="animate-spin text-accent" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-card border border-border rounded-xl">
                <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Blog Posts Yet</h3>
                <p className="text-muted-foreground">Check back soon for skincare tips and guides!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {posts.map(p => (
                  <article key={p.id} className="group bg-card border border-border rounded-xl overflow-hidden hover:border-accent hover:shadow-xl transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden bg-muted">
                      <img 
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full">
                          {p.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="Calendar" size={14} />
                          {p.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Clock" size={14} />
                          {p.readTime}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">{p.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{p.excerpt}</p>
                      
                      <Link to={`/blog/${p.slug}`} className="inline-flex items-center text-accent font-semibold hover:gap-3 transition-all gap-2">
                        Read More <Icon name="ArrowRight" size={16} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 px-5 lg:px-8 bg-accent/5 border-t border-accent/20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">Stay Updated</h2>
            <p className="text-lg text-muted-foreground mb-8">Get the latest skincare tips and beauty insights delivered to your inbox</p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-6 py-3 bg-background border border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <button 
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-pink-500/40 transition-all hover:scale-105"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Blog;
