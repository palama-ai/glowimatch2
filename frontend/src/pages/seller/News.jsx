import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';

// Modern Sidebar (shared)
const SellerSidebar = ({ activePage }) => {
    const navigate = useNavigate();
    const { signOut, userProfile } = useAuth();

    const menuItems = [
        { id: 'dashboard', label: 'Overview', icon: 'LayoutDashboard', path: '/seller' },
        { id: 'products', label: 'Products', icon: 'Package', path: '/seller/products' },
        { id: 'news', label: 'News', icon: 'Bell', path: '/seller/news' },
        { id: 'profile', label: 'Settings', icon: 'Settings', path: '/seller/profile' },
    ];

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <aside className="w-72 h-full bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col overflow-y-auto">
            <div className="p-8">
                <Link to="/seller" className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-pink-500/25">
                        <Icon name="Sparkles" size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl text-white tracking-tight">Glowimatch</h1>
                        <p className="text-xs text-slate-400 font-medium">Seller Dashboard</p>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 px-4 py-6">
                <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Menu</p>
                <div className="space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${activePage === item.id
                                ? 'bg-gradient-to-r from-pink-500/20 to-fuchsia-500/10 text-white border-l-2 border-pink-500'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon
                                name={item.icon}
                                size={20}
                                className={activePage === item.id ? 'text-pink-400' : 'text-slate-500 group-hover:text-pink-400 transition-colors'}
                            />
                            <span className="font-medium">{item.label}</span>
                            {activePage === item.id && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-500" />
                            )}
                        </Link>
                    ))}
                </div>
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm">
                        {(userProfile?.full_name?.[0] || 'S').toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                            {userProfile?.full_name || 'Seller'}
                        </p>
                        <p className="text-xs text-slate-500">Seller Account</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <Icon name="LogOut" size={18} />
                    <span className="font-medium text-sm">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

// Tip Card Component
const TipCard = ({ icon, color, title, description }) => (
    <div className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg hover:shadow-pink-500/5 transition-all duration-300">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <Icon name={icon} size={22} className="text-white" />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
    </div>
);

// News Item Component
const NewsItem = ({ item }) => (
    <div className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300">
        {item.image_url && (
            <div className="h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
        )}
        <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-slate-400">
                    {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                {item.published ? (
                    <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-full">Published</span>
                ) : (
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold rounded-full">Draft</span>
                )}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{item.title}</h3>
            <p className="text-sm text-slate-500 line-clamp-3">{item.excerpt}</p>
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
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 seller-layout overflow-hidden">
            <SellerSidebar activePage="news" />

            <main className="flex-1 p-8 lg:p-10 overflow-y-auto">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">News & Updates</h1>
                    <p className="text-slate-500 mt-1">Stay updated with Glowimatch announcements and tips</p>
                </header>

                {/* Welcome Banner */}
                <div className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 rounded-3xl p-8 mb-8 text-white">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative flex items-start gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                            <Icon name="Megaphone" size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-2">Welcome to Glowimatch Seller Portal! 🎉</h2>
                            <p className="text-white/80 max-w-xl">
                                Start adding your products to reach thousands of skincare enthusiasts.
                                Check out our tips below to maximize your visibility and sales.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tips Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                    <TipCard
                        icon="Camera"
                        color="from-blue-500 to-cyan-500"
                        title="Quality Photos"
                        description="Use high-quality product images to attract more buyers"
                    />
                    <TipCard
                        icon="FileText"
                        color="from-violet-500 to-purple-500"
                        title="Detailed Descriptions"
                        description="Include ingredients, benefits, and usage instructions"
                    />
                    <TipCard
                        icon="Tag"
                        color="from-emerald-500 to-teal-500"
                        title="Competitive Pricing"
                        description="Offer fair prices to increase your conversion rate"
                    />
                </div>

                {/* Latest Articles */}
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Latest Articles</h2>
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-72 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : news.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {news.map((item) => (
                                <NewsItem key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                <Icon name="Newspaper" size={32} className="text-slate-400" />
                            </div>
                            <p className="text-slate-500">No news articles yet. Check back later!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default NewsPage;
