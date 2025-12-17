import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';

// Sidebar Component (shared)
const SellerSidebar = ({ activePage }) => {
    const navigate = useNavigate();
    const { signOut, userProfile } = useAuth();

    const menuItems = [
        { id: 'dashboard', label: 'Home', icon: 'Home', path: '/seller' },
        { id: 'products', label: 'Products', icon: 'Package', path: '/seller/products' },
        { id: 'news', label: 'News', icon: 'Newspaper', path: '/seller/news' },
        { id: 'profile', label: 'Profile', icon: 'User', path: '/seller/profile' },
    ];

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
            <div className="p-6 border-b border-border">
                <Link to="/seller" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                        <Icon name="Sparkles" size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-foreground">GlowMatch</h1>
                        <p className="text-xs text-muted-foreground">Seller Portal</p>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.id}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activePage === item.id
                            ? 'bg-accent text-white'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                    >
                        <Icon name={item.icon} size={20} />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Icon name="User" size={20} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                            {userProfile?.full_name || 'Seller'}
                        </p>
                        <p className="text-xs text-muted-foreground">Seller Account</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-destructive hover:bg-destructive/10 transition-all"
                >
                    <Icon name="LogOut" size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

// News Item Component
const NewsItem = ({ item }) => (
    <div className="bg-card border border-border rounded-2xl overflow-hidden card-hover">
        {item.image_url && (
            <div className="h-40 bg-muted">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
            </div>
        )}
        <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                {item.published ? (
                    <span className="px-2 py-0.5 bg-success/10 text-success text-xs rounded-full">Published</span>
                ) : (
                    <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">Draft</span>
                )}
            </div>
            <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">{item.excerpt}</p>
        </div>
    </div>
);

// News Page
const NewsPage = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            // Fetch published blogs/news from the API
            const res = await fetch(`${API_BASE}/blogs`);
            if (res.ok) {
                const data = await res.json();
                setNews(data.data || []);
            }
        } catch (err) {
            console.error('Error fetching news:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background">
            <SellerSidebar activePage="news" />

            <main className="flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground">News & Updates</h1>
                    <p className="text-muted-foreground">Stay updated with GlowMatch announcements and tips</p>
                </div>

                {/* Featured Section */}
                <div className="bg-gradient-to-r from-accent/10 to-pink-500/10 rounded-2xl p-6 mb-8 border border-accent/20">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                            <Icon name="Megaphone" size={24} className="text-accent" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-foreground mb-1">Welcome to GlowMatch Seller Portal!</h2>
                            <p className="text-sm text-muted-foreground">
                                Start adding your products to reach thousands of skincare enthusiasts.
                                Check out our tips below to maximize your visibility.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tips Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-card border border-border rounded-xl p-5 card-hover">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                            <Icon name="Camera" size={20} className="text-blue-500" />
                        </div>
                        <h3 className="font-medium text-foreground mb-1">Quality Photos</h3>
                        <p className="text-sm text-muted-foreground">Use high-quality product images to attract buyers</p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-5 card-hover">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                            <Icon name="FileText" size={20} className="text-purple-500" />
                        </div>
                        <h3 className="font-medium text-foreground mb-1">Detailed Descriptions</h3>
                        <p className="text-sm text-muted-foreground">Include ingredients and usage instructions</p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-5 card-hover">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-3">
                            <Icon name="Tag" size={20} className="text-green-500" />
                        </div>
                        <h3 className="font-medium text-foreground mb-1">Competitive Pricing</h3>
                        <p className="text-sm text-muted-foreground">Offer fair prices to increase conversions</p>
                    </div>
                </div>

                {/* Blog Posts */}
                <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Latest Articles</h2>
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : news.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {news.map((item) => (
                                <NewsItem key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-card border border-border rounded-2xl">
                            <Icon name="Newspaper" size={48} className="mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No news articles yet. Check back later!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default NewsPage;
