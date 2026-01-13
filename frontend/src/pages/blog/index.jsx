import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import { Link } from 'react-router-dom';
import { useI18n } from '../../contexts/I18nContext';
import Icon from '../../components/AppIcon';
import { IMAGES } from '../../utils/imageConstants';
import SEO from '../../components/SEO';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

// Blog Card Component - Modern minimal design
const BlogCard = ({ post }) => {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group relative overflow-hidden rounded-2xl h-64 block bg-card border border-border hover:border-accent/50 transition-all duration-500"
    >
      {/* Background Image */}
      <img
        src={post.image}
        alt={post.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <span className="inline-block px-3 py-1 bg-accent/90 backdrop-blur-sm rounded-lg text-white text-xs font-semibold mb-3 uppercase tracking-wide">
          {post.category}
        </span>
        <h3 className="text-white font-bold text-lg leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-300">
          {post.title}
        </h3>
      </div>
    </Link>
  );
};

// Featured Article Component - Clean & Professional
const FeaturedArticle = ({ post }) => {
  if (!post) {
    return (
      <div className="h-full min-h-[480px] rounded-3xl bg-gradient-to-br from-card to-muted border border-border flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Icon name="BookOpen" size={32} className="text-accent" />
          </div>
          <p className="text-muted-foreground font-medium">Featured Article</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Coming soon...</p>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block h-full min-h-[480px] rounded-3xl overflow-hidden relative bg-card border border-border hover:border-accent/50 transition-all duration-500"
    >
      {/* Full Image Background */}
      <img
        src={post.image}
        alt={post.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Elegant Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      {/* Top Badge */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <span className="px-4 py-2 bg-accent text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
          Featured
        </span>
        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-300">
          <Icon name="ArrowUpRight" size={18} className="text-white" />
        </div>
      </div>

      {/* Content at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {/* Author/Brand Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-gradient-to-r from-accent to-pink-400 flex items-center justify-center shadow-lg ring-2 ring-white/20">
            <Icon name="Sparkles" size={18} className="text-white" />
          </div>
          <div>
            <span className="text-white font-semibold text-sm block">Glowimatch</span>
            <span className="text-white/60 text-xs">{post.date} • {post.readTime}</span>
          </div>
        </div>

        {/* Article Info */}
        <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-white/90 text-xs font-medium mb-3 border border-white/10">
          {post.category}
        </span>
        <h3 className="text-white font-bold text-xl sm:text-2xl leading-tight line-clamp-2 mb-2">
          {post.title}
        </h3>
        <p className="text-white/70 text-sm line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
};

// Social Link Component - Minimal style
const SocialLink = ({ icon, label }) => (
  <button className="group px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-medium text-foreground hover:border-accent hover:bg-accent/5 transition-all duration-300 flex items-center gap-2">
    <Icon name={icon} size={16} className="text-muted-foreground group-hover:text-accent transition-colors" />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

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
          const mappedBlogs = data.data.map((blog) => ({
            id: blog.id,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt || blog.content?.substring(0, 150) + '...',
            image: blog.image_url || IMAGES.blog_routine,
            category: blog.category || t('blog_category_default'),
            date: new Date(blog.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            readTime: `${Math.ceil((blog.content?.length || 0) / 200)} ${t('min_read')}`
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
    const interval = setInterval(fetchBlogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const topPosts = posts.slice(0, 3);
  const featuredPost = posts[0];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Skincare Tips & Beauty Blog"
        description="Explore expert skincare tips, beauty routines, and product guides. Learn about skin types, anti-aging secrets, and the latest trends in skincare and cosmetics."
        keywords="skincare blog, beauty tips, skin care routine, skincare articles, beauty guide, نصائح العناية بالبشرة, مدونة الجمال, conseils beauté"
        url="/blog"
      />
      <Header />

      <main className="pt-6 pb-16">
        {loading ? (
          <div className="flex justify-center items-center py-40">
            <div className="relative">
              <Icon name="Loader2" size={48} className="animate-spin text-accent" />
              <div className="absolute inset-0 blur-xl bg-accent/20 rounded-full" />
            </div>
          </div>
        ) : (
          <>
            {/* Hero Section - Split Layout */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
                {/* Left Section - 60% */}
                <div className="lg:col-span-3 space-y-8">
                  {/* Three Blog Cards Row */}
                  {posts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {topPosts.map((post, idx) => (
                        <BlogCard key={post.id || idx} post={post} />
                      ))}
                      {topPosts.length < 3 && Array.from({ length: 3 - topPosts.length }).map((_, idx) => (
                        <div key={`placeholder-${idx}`} className="h-64 rounded-2xl bg-gradient-to-br from-card to-muted border border-border flex items-center justify-center">
                          <Icon name="Image" size={32} className="text-muted-foreground/50" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[1, 2, 3].map((idx) => (
                        <div key={idx} className="h-64 rounded-2xl bg-gradient-to-br from-card to-muted border border-border flex flex-col items-center justify-center gap-2">
                          <Icon name="FileText" size={32} className="text-accent/30" />
                          <span className="text-sm text-muted-foreground">No articles yet</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Main Title Section */}
                  <div className="py-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
                      <Icon name="Sparkles" size={14} className="text-accent" />
                      <span className="text-accent text-sm font-semibold">{t('blog_badge') || 'Expert Tips'}</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tight mb-6">
                      BEAUTY DEFINED<br />
                      <span className="text-accent">BY SCIENCE</span><br />
                      AND CARE
                    </h1>
                    <p className="text-muted-foreground text-base sm:text-lg max-w-xl leading-relaxed">
                      Discover the latest skincare insights, expert tips, and personalized beauty routines.
                      Science-backed advice to help you achieve your best skin ever.
                    </p>
                  </div>

                  {/* Social Media Links */}
                  <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-border">
                    <SocialLink icon="Instagram" label="Instagram" />
                    <SocialLink icon="Facebook" label="Facebook" />
                    <SocialLink icon="Twitter" label="Twitter" />
                    <div className="hidden sm:block h-8 w-px bg-border mx-2" />
                    <Link
                      to="/contact"
                      className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-xl text-sm font-semibold hover:bg-accent transition-colors"
                    >
                      Follow Us <Icon name="ArrowRight" size={16} />
                    </Link>
                  </div>
                </div>

                {/* Right Section - 40% - Featured Article */}
                <div className="lg:col-span-2">
                  <FeaturedArticle post={featuredPost} />
                </div>
              </div>
            </section>

            {/* Mobile Featured Section */}
            <section className="lg:hidden px-4 sm:px-6 mt-10">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Icon name="Star" size={20} className="text-accent" />
                Featured Article
              </h2>
              {featuredPost ? (
                <Link to={`/blog/${featuredPost.slug}`} className="block">
                  <div className="rounded-2xl overflow-hidden bg-card border border-border hover:border-accent transition-colors">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-5">
                      <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-lg mb-3">
                        {featuredPost.category}
                      </span>
                      <h3 className="text-foreground font-bold text-lg line-clamp-2">{featuredPost.title}</h3>
                      <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{featuredPost.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="rounded-2xl bg-card border border-border h-48 flex items-center justify-center">
                  <Icon name="FileText" size={32} className="text-muted-foreground/50" />
                </div>
              )}
            </section>

            {/* All Blog Posts Grid */}
            {posts.length > 3 && (
              <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-20">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {t('blog_hero_title') || 'More Articles'}
                  </h2>
                  <Link to="/blog" className="text-accent font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    View All <Icon name="ArrowRight" size={16} />
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.slice(3).map((post) => (
                    <article
                      key={post.id}
                      className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300"
                    >
                      <div className="relative h-48 overflow-hidden bg-muted">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-accent text-white text-xs font-semibold rounded-lg">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Icon name="Calendar" size={14} />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="Clock" size={14} />
                            {post.readTime}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>

                        <Link
                          to={`/blog/${post.slug}`}
                          className="inline-flex items-center text-accent font-semibold text-sm hover:gap-3 transition-all gap-2"
                        >
                          {t('read_more')} <Icon name="ArrowRight" size={16} />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* No Posts Message */}
            {posts.length === 0 && (
              <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-12">
                <div className="text-center py-20 bg-card border border-border rounded-3xl">
                  <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                    <Icon name="FileText" size={32} className="text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{t('no_blogs_title')}</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">{t('no_blogs_desc')}</p>
                </div>
              </section>
            )}

            {/* Newsletter Section */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-20">
              <div className="relative bg-card border border-border rounded-3xl p-8 sm:p-12 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl" />

                <div className="relative text-center max-w-xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
                    <Icon name="Mail" size={14} className="text-accent" />
                    <span className="text-accent text-sm font-semibold">Newsletter</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{t('newsletter_title')}</h2>
                  <p className="text-muted-foreground mb-8">{t('newsletter_desc')}</p>
                  <form className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder={t('email_placeholder')}
                      className="flex-1 px-6 py-4 bg-background border border-border rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all text-foreground placeholder:text-muted-foreground"
                    />
                    <button
                      type="submit"
                      className="px-8 py-4 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20 transition-all"
                    >
                      {t('subscribe_btn')}
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Blog;
