import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';

// Sidebar Component
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
            {/* Logo */}
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

            {/* Menu */}
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

            {/* User & Logout */}
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

// Stats Card Component
const StatsCard = ({ icon, label, value, trend, color = 'accent' }) => (
    <div className="bg-card border border-border rounded-2xl p-5 card-hover">
        <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl bg-${color}/10 flex items-center justify-center`}>
                <Icon name={icon} size={20} className={`text-${color}`} />
            </div>
            {trend && (
                <span className={`text-xs font-medium ${trend > 0 ? 'text-success' : 'text-destructive'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
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

    // Determine active page from path
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

            // Fetch products
            const prodRes = await fetch(`${API_BASE}/seller/products`, { headers });
            if (prodRes.ok) {
                const prodData = await prodRes.json();
                setProducts(prodData.data || []);
            }

            // Fetch analytics
            const analyticsRes = await fetch(`${API_BASE}/seller/analytics`, { headers });
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

    return (
        <div className="flex min-h-screen bg-background">
            <SellerSidebar activePage={getActivePage()} />

            <main className="flex-1 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Welcome back, {userProfile?.full_name?.split(' ')[0] || 'Seller'}! 👋
                    </h1>
                    <p className="text-muted-foreground">
                        Here's what's happening with your products today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatsCard
                        icon="Package"
                        label="Total Products"
                        value={analytics?.totalProducts || 0}
                        color="accent"
                    />
                    <StatsCard
                        icon="Eye"
                        label="Total Views"
                        value={analytics?.totalViews || 0}
                        trend={12}
                        color="blue-500"
                    />
                    <StatsCard
                        icon="CheckCircle"
                        label="Published"
                        value={analytics?.publishedProducts || 0}
                        color="success"
                    />
                    <StatsCard
                        icon="TrendingUp"
                        label="This Week"
                        value={analytics?.viewsByDay?.reduce((a, b) => a + (b.views || 0), 0) || 0}
                        trend={8}
                        color="warning"
                    />
                </div>

                {/* Views Chart */}
                <div className="bg-card border border-border rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Views This Week</h2>
                            <p className="text-sm text-muted-foreground">Product impressions over time</p>
                        </div>
                    </div>

                    {analytics?.viewsByDay?.length > 0 ? (
                        <div className="flex items-end gap-2 h-40">
                            {analytics.viewsByDay.map((day, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div
                                        className="w-full bg-accent/20 rounded-lg relative overflow-hidden"
                                        style={{ height: `${Math.max((day.views / Math.max(...analytics.viewsByDay.map(d => d.views))) * 100, 10)}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-accent to-pink-400 rounded-lg" />
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-40 flex items-center justify-center text-muted-foreground">
                            <p>No view data yet. Add products to start tracking!</p>
                        </div>
                    )}
                </div>

                {/* Products Section */}
                <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Your Products</h2>
                            <p className="text-sm text-muted-foreground">{products.length} products in total</p>
                        </div>
                        <button
                            onClick={() => navigate('/seller/products')}
                            className="px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent/90 transition-all flex items-center gap-2"
                        >
                            <Icon name="Plus" size={16} />
                            Add Product
                        </button>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.slice(0, 8).map((product) => (
                                <div key={product.id} className="group relative aspect-square bg-muted rounded-xl overflow-hidden">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Icon name="Package" size={32} className="text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                        <div>
                                            <p className="text-white font-medium text-sm truncate">{product.name}</p>
                                            <p className="text-white/70 text-xs">{product.view_count || 0} views</p>
                                        </div>
                                    </div>
                                    {product.published ? (
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-success rounded-full" />
                                    ) : (
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-warning rounded-full" />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
                            <h3 className="font-medium text-foreground mb-2">No products yet</h3>
                            <p className="text-sm text-muted-foreground mb-4">Start adding products to showcase on GlowMatch</p>
                            <button
                                onClick={() => navigate('/seller/products')}
                                className="px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent/90"
                            >
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
