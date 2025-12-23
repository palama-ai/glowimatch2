import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Icon from '../../components/AppIcon';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

const getHeaders = () => {
    const token = JSON.parse(localStorage.getItem('gm_auth') || '{}')?.token;
    return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
};

// Tab Button Component
const TabButton = ({ active, onClick, icon, label, count }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${active
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
    >
        <Icon name={icon} size={18} />
        {label}
        {count > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${active ? 'bg-white/20' : 'bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400'
                }`}>
                {count}
            </span>
        )}
    </button>
);

// Appeals Tab
const AppealsTab = () => {
    const [appeals, setAppeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        fetchAppeals();
    }, []);

    const fetchAppeals = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/violations/appeals`, { headers: getHeaders() });
            if (res.ok) {
                const data = await res.json();
                setAppeals(data.data || []);
            }
        } catch (err) {
            console.error('Error fetching appeals:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (appealId, decision) => {
        setProcessing(appealId);
        try {
            const res = await fetch(`${API_BASE}/admin/violations/appeals/${appealId}/review`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ decision, notes: '' })
            });
            if (res.ok) {
                fetchAppeals();
            }
        } catch (err) {
            console.error('Error reviewing appeal:', err);
        } finally {
            setProcessing(null);
        }
    };

    if (loading) return <div className="p-8 text-center"><div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"></div></div>;

    return (
        <div className="space-y-4">
            {appeals.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl">
                    <Icon name="CheckCircle" size={48} className="mx-auto text-emerald-500 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Pending Appeals</h3>
                    <p className="text-slate-500">All appeals have been processed</p>
                </div>
            ) : appeals.map(appeal => (
                <div key={appeal.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${appeal.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                        appeal.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                            'bg-red-100 text-red-700'
                                    }`}>
                                    {appeal.status?.toUpperCase()}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {new Date(appeal.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                {appeal.seller_email || 'Unknown Seller'}
                            </h3>
                            <p className="text-sm text-slate-500 mb-2">
                                Product: {appeal.product_name || 'N/A'}
                            </p>
                            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    <strong>Appeal Reason:</strong> {appeal.reason}
                                </p>
                            </div>
                        </div>
                        {appeal.status === 'pending' && (
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={() => handleReview(appeal.id, 'approved')}
                                    disabled={processing === appeal.id}
                                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 disabled:opacity-50"
                                >
                                    <Icon name="Check" size={16} />
                                </button>
                                <button
                                    onClick={() => handleReview(appeal.id, 'rejected')}
                                    disabled={processing === appeal.id}
                                    className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 disabled:opacity-50"
                                >
                                    <Icon name="X" size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

// Problem Sellers Tab
const ProblemSellersTab = () => {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unlocking, setUnlocking] = useState(null);

    useEffect(() => {
        fetchSellers();
    }, []);

    const fetchSellers = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/violations/problem-sellers`, { headers: getHeaders() });
            if (res.ok) {
                const data = await res.json();
                setSellers(data.data || []);
            }
        } catch (err) {
            console.error('Error fetching sellers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUnlock = async (sellerId) => {
        setUnlocking(sellerId);
        try {
            const res = await fetch(`${API_BASE}/admin/violations/sellers/${sellerId}/unlock`, {
                method: 'POST',
                headers: getHeaders()
            });
            if (res.ok) {
                fetchSellers();
            }
        } catch (err) {
            console.error('Error unlocking seller:', err);
        } finally {
            setUnlocking(null);
        }
    };

    if (loading) return <div className="p-8 text-center"><div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"></div></div>;

    return (
        <div className="space-y-4">
            {sellers.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl">
                    <Icon name="Users" size={48} className="mx-auto text-emerald-500 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Problem Sellers</h3>
                    <p className="text-slate-500">All sellers are in good standing</p>
                </div>
            ) : sellers.map(seller => (
                <div key={seller.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${seller.account_status === 'BANNED' ? 'bg-red-100 dark:bg-red-900/30' :
                                    seller.account_status === 'LOCKED' ? 'bg-orange-100 dark:bg-orange-900/30' :
                                        'bg-amber-100 dark:bg-amber-900/30'
                                }`}>
                                <Icon
                                    name={seller.account_status === 'BANNED' ? 'Ban' : seller.account_status === 'LOCKED' ? 'Lock' : 'AlertTriangle'}
                                    size={24}
                                    className={
                                        seller.account_status === 'BANNED' ? 'text-red-500' :
                                            seller.account_status === 'LOCKED' ? 'text-orange-500' :
                                                'text-amber-500'
                                    }
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">{seller.full_name || seller.email}</h3>
                                <p className="text-sm text-slate-500">{seller.email}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${seller.account_status === 'BANNED' ? 'bg-red-100 text-red-700' :
                                            seller.account_status === 'LOCKED' ? 'bg-orange-100 text-orange-700' :
                                                'bg-amber-100 text-amber-700'
                                        }`}>
                                        {seller.account_status}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        {seller.violation_count} violations
                                    </span>
                                    {seller.is_under_probation === 1 && (
                                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                                            On Probation
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {seller.account_status === 'LOCKED' && (
                            <button
                                onClick={() => handleUnlock(seller.id)}
                                disabled={unlocking === seller.id}
                                className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 disabled:opacity-50 flex items-center gap-2"
                            >
                                <Icon name="Unlock" size={16} />
                                {unlocking === seller.id ? 'Unlocking...' : 'Unlock'}
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

// Blacklist Tab
const BlacklistTab = () => {
    const [blacklist, setBlacklist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlacklist();
    }, []);

    const fetchBlacklist = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/violations/blacklist`, { headers: getHeaders() });
            if (res.ok) {
                const data = await res.json();
                setBlacklist(data.data || []);
            }
        } catch (err) {
            console.error('Error fetching blacklist:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center"><div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"></div></div>;

    return (
        <div className="space-y-4">
            {blacklist.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl">
                    <Icon name="Shield" size={48} className="mx-auto text-emerald-500 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Blacklist Empty</h3>
                    <p className="text-slate-500">No banned sellers yet</p>
                </div>
            ) : blacklist.map(item => (
                <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-red-200 dark:border-red-900">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <Icon name="Ban" size={24} className="text-red-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white">{item.email}</h3>
                            <p className="text-sm text-red-500">{item.ban_reason}</p>
                            <p className="text-xs text-slate-400 mt-1">
                                Banned: {new Date(item.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Rejected Products Tab
const RejectedProductsTab = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/violations/rejected-products`, { headers: getHeaders() });
            if (res.ok) {
                const data = await res.json();
                setProducts(data.data || []);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center"><div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"></div></div>;

    return (
        <div className="space-y-4">
            {products.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl">
                    <Icon name="Package" size={48} className="mx-auto text-emerald-500 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Rejected Products</h3>
                    <p className="text-slate-500">All products passed safety checks</p>
                </div>
            ) : products.map(product => {
                const productData = JSON.parse(product.original_product_data || '{}');
                const ingredients = JSON.parse(product.detected_ingredients || '[]');
                return (
                    <div key={product.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                                {productData.image_url ? (
                                    <img src={productData.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <Icon name="Package" size={24} className="text-slate-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-slate-900 dark:text-white">{productData.name || 'Unknown Product'}</h3>
                                <p className="text-sm text-slate-500">{product.rejection_reason}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {ingredients.map((ing, i) => (
                                        <span key={i} className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded text-xs font-medium">
                                            {ing.name || ing}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-400 mt-2">
                                    Rejected: {new Date(product.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Main Admin Safety Page
const AdminSafety = () => {
    const [activeTab, setActiveTab] = useState('appeals');
    const [counts, setCounts] = useState({ appeals: 0, sellers: 0, blacklist: 0, rejected: 0 });

    useEffect(() => {
        fetchCounts();
    }, []);

    const fetchCounts = async () => {
        try {
            const [appealsRes, sellersRes, blacklistRes, rejectedRes] = await Promise.all([
                fetch(`${API_BASE}/admin/violations/appeals?status=pending`, { headers: getHeaders() }),
                fetch(`${API_BASE}/admin/violations/problem-sellers`, { headers: getHeaders() }),
                fetch(`${API_BASE}/admin/violations/blacklist`, { headers: getHeaders() }),
                fetch(`${API_BASE}/admin/violations/rejected-products`, { headers: getHeaders() })
            ]);

            const [appeals, sellers, blacklist, rejected] = await Promise.all([
                appealsRes.ok ? appealsRes.json() : { data: [] },
                sellersRes.ok ? sellersRes.json() : { data: [] },
                blacklistRes.ok ? blacklistRes.json() : { data: [] },
                rejectedRes.ok ? rejectedRes.json() : { data: [] }
            ]);

            setCounts({
                appeals: (appeals.data || []).filter(a => a.status === 'pending').length,
                sellers: (sellers.data || []).length,
                blacklist: (blacklist.data || []).length,
                rejected: (rejected.data || []).length
            });
        } catch (err) {
            console.error('Error fetching counts:', err);
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Safety Management</h1>
                    <p className="text-slate-500 mt-1">Manage appeals, violations, and blacklisted sellers</p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <TabButton
                        active={activeTab === 'appeals'}
                        onClick={() => setActiveTab('appeals')}
                        icon="MessageSquare"
                        label="Appeals"
                        count={counts.appeals}
                    />
                    <TabButton
                        active={activeTab === 'sellers'}
                        onClick={() => setActiveTab('sellers')}
                        icon="Users"
                        label="Problem Sellers"
                        count={counts.sellers}
                    />
                    <TabButton
                        active={activeTab === 'blacklist'}
                        onClick={() => setActiveTab('blacklist')}
                        icon="Ban"
                        label="Blacklist"
                        count={counts.blacklist}
                    />
                    <TabButton
                        active={activeTab === 'rejected'}
                        onClick={() => setActiveTab('rejected')}
                        icon="Package"
                        label="Rejected Products"
                        count={counts.rejected}
                    />
                </div>

                {/* Tab Content */}
                {activeTab === 'appeals' && <AppealsTab />}
                {activeTab === 'sellers' && <ProblemSellersTab />}
                {activeTab === 'blacklist' && <BlacklistTab />}
                {activeTab === 'rejected' && <RejectedProductsTab />}
            </div>
        </AdminLayout>
    );
};

export default AdminSafety;
