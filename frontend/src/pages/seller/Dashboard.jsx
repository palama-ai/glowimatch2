import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';

// Modern Minimal Sidebar
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
        <aside className="w-72 min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col">
            {/* Logo Area */}
            <div className="p-8">
                <Link to="/seller" className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-pink-500/25">
                        <Icon name="Sparkles" size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl text-white tracking-tight">GlowMatch</h1>
                        <p className="text-xs text-slate-400 font-medium">Seller Dashboard</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
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

            {/* User Profile & Logout */}
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

// Modern Stats Card with Gradient Background
const StatsCard = ({ icon, label, value, trend, gradient = 'from-pink-500 to-rose-500' }) => (
    <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 group hover:shadow-lg hover:shadow-pink-500/5 transition-all duration-300">
        {/* Decorative gradient blob */}
        <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />

        <div className="relative">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                    <Icon name={icon} size={22} className="text-white" />
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${trend >= 0
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                            : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                        }`}>
                        <Icon name={trend >= 0 ? 'TrendingUp' : 'TrendingDown'} size={12} />
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
            <p className="text-sm text-slate-500 mt-1 font-medium">{label}</p>
        </div>
    </div>
);

// Modern Chart Container
const ChartSection = ({ analytics }) => {
    const maxViews = Math.max(...(analytics?.viewsByDay?.map(d => d.views) || [1]), 1);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Views Analytics</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Last 7 days performance</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-pink-500" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Views</span>
                </div>
            </div>

            {analytics?.viewsByDay?.length > 0 ? (
                <div className="flex items-end justify-between gap-3 h-48">
                    {analytics.viewsByDay.map((day, i) => {
                        const height = Math.max((day.views / maxViews) * 100, 5);
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                <div className="relative w-full group">
                                    {/* Tooltip */}
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-medium px-2 py-1 rounded-lg whitespace-nowrap">
                                        {day.views} views
                                    </div>
                                    <div
                                        className="w-full bg-gradient-to-t from-pink-500 via-rose-400 to-pink-300 rounded-xl transition-all duration-500 hover:from-pink-600 hover:via-rose-500 hover:to-pink-400 cursor-pointer"
                                        style={{ height: `${height}%`, minHeight: '12px' }}
                                    />
                                </div>
                                <span className="text-xs font-medium text-slate-400">
                                    {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                                </span>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="h-48 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <Icon name="BarChart3" size={28} className="text-slate-400" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">No data yet</p>
                    <p className="text-sm text-slate-400 mt-1">Views will appear here once you get traffic</p>
                </div>
            )}
        </div>
    );
};

// Product Card with modern design
const ProductCard = ({ product, onClick }) => (
    <div
        onClick={onClick}
        className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 cursor-pointer"
    >
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden">
            {product.image_url ? (
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                    <Icon name="Image" size={40} className="text-slate-300 dark:text-slate-600" />
                </div>
            )}

            {/* Status Badge */}
            <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${product.published
                    ? 'bg-emerald-500/90 text-white'
                    : 'bg-amber-500/90 text-white'
                }`}>
                {product.published ? 'Live' : 'Draft'}
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-semibold truncate">{product.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-white/80 text-sm">
                            <Icon name="Eye" size={14} />
                            {product.view_count || 0}
                        </span>
                        {product.price && (
                            <span className="text-white/80 text-sm">${product.price}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white truncate">{product.name}</h3>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                <Icon name="Eye" size={14} />
                {product.view_count || 0} views
            </p>
        </div>
    </div>
);

// Main Dashboard Component
const SellerDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userProfile } = useAuth();
    const [products, setProducts] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const getActivePage = () => {
        const path = location.pathname;
        if (path === '/seller' || path === '/seller/') return 'dashboard';
        if (path.includes('/products')) return 'products';
        if (path.includes('/news')) return 'news';
        if (path.includes('/profile')) return 'profile';
        return 'dashboard';
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('gm_auth') || '{}')?.token;
            const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
            const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

            const [prodRes, analyticsRes] = await Promise.all([
                fetch(`${API_BASE}/seller/products`, { headers }),
                fetch(`${API_BASE}/seller/analytics`, { headers })
            ]);

            if (prodRes.ok) {
                const prodData = await prodRes.json();
                setProducts(prodData.data || []);
            }

            if (analyticsRes.ok) {
                const analyticsData = await analyticsRes.json();
                setAnalytics(analyticsData.data || {});
            }
        } catch (err) {
            console.error('Error fetching seller data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Get time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            <SellerSidebar activePage={getActivePage()} />

            <main className="flex-1 p-8 lg:p-10">
                {/* Header Section */}
                <header className="mb-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-pink-500 mb-1">{getGreeting()}</p>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Welcome back, {userProfile?.full_name?.split(' ')[0] || 'Seller'}
                            </h1>
                            <p className="text-slate-500 mt-2">
                                Here's an overview of your store performance
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/seller/products')}
                            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <Icon name="Plus" size={18} />
                            Add Product
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <StatsCard
                        icon="Package"
                        label="Total Products"
                        value={analytics?.totalProducts || 0}
                        gradient="from-violet-500 to-purple-500"
                    />
                    <StatsCard
                        icon="Eye"
                        label="Total Views"
                        value={analytics?.totalViews || 0}
                        trend={12}
                        gradient="from-pink-500 to-rose-500"
                    />
                    <StatsCard
                        icon="CheckCircle"
                        label="Published"
                        value={analytics?.publishedProducts || 0}
                        gradient="from-emerald-500 to-teal-500"
                    />
                    <StatsCard
                        icon="TrendingUp"
                        label="This Week"
                        value={analytics?.viewsByDay?.reduce((a, b) => a + (b.views || 0), 0) || 0}
                        trend={8}
                        gradient="from-amber-500 to-orange-500"
                    />
                </div>

                {/* Chart Section */}
                <div className="mb-8">
                    <ChartSection analytics={analytics} />
                </div>

                {/* Products Section */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Products</h2>
                            <p className="text-sm text-slate-500 mt-0.5">{products.length} products in catalog</p>
                        </div>
                        <Link
                            to="/seller/products"
                            className="text-sm font-semibold text-pink-500 hover:text-pink-600 flex items-center gap-1 transition-colors"
                        >
                            View All
                            <Icon name="ArrowRight" size={16} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-[4/5] bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {products.slice(0, 8).map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onClick={() => navigate('/seller/products')}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-500/10 dark:to-rose-500/10 flex items-center justify-center mx-auto mb-5">
                                <Icon name="Package" size={36} className="text-pink-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No products yet</h3>
                            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                                Start adding products to showcase your brand on GlowMatch
                            </p>
                            <button
                                onClick={() => navigate('/seller/products')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30 transition-all"
                            >
                                <Icon name="Plus" size={18} />
                                Add Your First Product
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SellerDashboard;
