import React, { useState, useEffect, useMemo } from 'react';
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
        className={`admin-range-btn ${active ? 'active' : ''}`}
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
    >
        <Icon name={icon} size={16} />
        {label}
        {count > 0 && (
            <span style={{
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: '600',
                background: active ? 'rgba(255,255,255,0.2)' : 'rgba(239, 68, 68, 0.15)',
                color: active ? 'white' : 'var(--admin-danger)',
            }}>
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

    useEffect(() => { fetchAppeals(); }, []);

    const fetchAppeals = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/violations/appeals`, { headers: getHeaders() });
            if (res.ok) { const data = await res.json(); setAppeals(data.data || []); }
        } catch (err) { console.error('Error fetching appeals:', err); }
        finally { setLoading(false); }
    };

    const handleReview = async (appealId, decision) => {
        setProcessing(appealId);
        try {
            const res = await fetch(`${API_BASE}/admin/violations/appeals/${appealId}/review`, {
                method: 'POST', headers: getHeaders(), body: JSON.stringify({ decision, notes: '' })
            });
            if (res.ok) fetchAppeals();
        } catch (err) { console.error('Error reviewing appeal:', err); }
        finally { setProcessing(null); }
    };

    if (loading) return <div className="admin-loading"><div className="admin-loading-spinner"></div></div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {appeals.length === 0 ? (
                <div className="admin-content-card" style={{ textAlign: 'center', padding: '60px' }}>
                    <Icon name="CheckCircle2" size={48} style={{ color: 'var(--admin-success)', marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--admin-text-primary)', margin: '0 0 8px' }}>No Pending Appeals</h3>
                    <p style={{ fontSize: '14px', color: 'var(--admin-text-muted)', margin: 0 }}>All appeals have been processed</p>
                </div>
            ) : appeals.map(appeal => (
                <div key={appeal.id} className="admin-content-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <span className={`admin-badge ${appeal.status === 'pending' ? 'warning' : appeal.status === 'approved' ? 'success' : 'danger'}`}>
                                    {appeal.status?.toUpperCase()}
                                </span>
                                <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                                    {new Date(appeal.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--admin-text-primary)', margin: '0 0 4px' }}>
                                {appeal.seller_email || 'Unknown Seller'}
                            </h3>
                            <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', margin: '0 0 12px' }}>
                                Product: {appeal.product_name || 'N/A'}
                            </p>
                            <div style={{ padding: '12px 16px', background: 'var(--admin-bg-primary)', borderRadius: '10px' }}>
                                <p style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', margin: 0 }}>
                                    <strong>Appeal Reason:</strong> {appeal.reason}
                                </p>
                            </div>
                        </div>
                        {appeal.status === 'pending' && (
                            <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                                <button onClick={() => handleReview(appeal.id, 'approved')} disabled={processing === appeal.id} className="admin-action-btn success"><Icon name="Check" size={16} /></button>
                                <button onClick={() => handleReview(appeal.id, 'rejected')} disabled={processing === appeal.id} className="admin-action-btn danger"><Icon name="X" size={16} /></button>
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

    useEffect(() => { fetchSellers(); }, []);

    const fetchSellers = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/violations/problem-sellers`, { headers: getHeaders() });
            if (res.ok) { const data = await res.json(); setSellers(data.data || []); }
        } catch (err) { console.error('Error fetching sellers:', err); }
        finally { setLoading(false); }
    };

    const handleUnlock = async (sellerId) => {
        setUnlocking(sellerId);
        try {
            const res = await fetch(`${API_BASE}/admin/violations/sellers/${sellerId}/unlock`, { method: 'POST', headers: getHeaders() });
            if (res.ok) fetchSellers();
        } catch (err) { console.error('Error unlocking seller:', err); }
        finally { setUnlocking(null); }
    };

    if (loading) return <div className="admin-loading"><div className="admin-loading-spinner"></div></div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sellers.length === 0 ? (
                <div className="admin-content-card" style={{ textAlign: 'center', padding: '60px' }}>
                    <Icon name="Users" size={48} style={{ color: 'var(--admin-success)', marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--admin-text-primary)', margin: '0 0 8px' }}>No Problem Sellers</h3>
                    <p style={{ fontSize: '14px', color: 'var(--admin-text-muted)', margin: 0 }}>All sellers are in good standing</p>
                </div>
            ) : sellers.map(seller => (
                <div key={seller.id} className="admin-content-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: seller.account_status === 'BANNED' ? 'rgba(239, 68, 68, 0.15)' : seller.account_status === 'LOCKED' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(139, 92, 246, 0.15)'
                            }}>
                                <Icon name={seller.account_status === 'BANNED' ? 'Ban' : seller.account_status === 'LOCKED' ? 'Lock' : 'AlertTriangle'} size={24}
                                    style={{ color: seller.account_status === 'BANNED' ? 'var(--admin-danger)' : seller.account_status === 'LOCKED' ? 'var(--admin-warning)' : 'var(--admin-purple)' }} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--admin-text-primary)', margin: 0 }}>{seller.full_name || seller.email}</h3>
                                <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: '2px 0 8px' }}>{seller.email}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span className={`admin-badge ${seller.account_status === 'BANNED' ? 'danger' : seller.account_status === 'LOCKED' ? 'warning' : 'purple'}`}>
                                        {seller.account_status}
                                    </span>
                                    <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>{seller.violation_count} violations</span>
                                    {seller.is_under_probation === 1 && <span className="admin-badge purple">On Probation</span>}
                                </div>
                            </div>
                        </div>
                        {seller.account_status === 'LOCKED' && (
                            <button onClick={() => handleUnlock(seller.id)} disabled={unlocking === seller.id} className="admin-gradient-btn" style={{ padding: '10px 20px' }}>
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

    useEffect(() => { fetchBlacklist(); }, []);

    const fetchBlacklist = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/violations/blacklist`, { headers: getHeaders() });
            if (res.ok) { const data = await res.json(); setBlacklist(data.data || []); }
        } catch (err) { console.error('Error fetching blacklist:', err); }
        finally { setLoading(false); }
    };

    if (loading) return <div className="admin-loading"><div className="admin-loading-spinner"></div></div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {blacklist.length === 0 ? (
                <div className="admin-content-card" style={{ textAlign: 'center', padding: '60px' }}>
                    <Icon name="Shield" size={48} style={{ color: 'var(--admin-success)', marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--admin-text-primary)', margin: '0 0 8px' }}>Blacklist Empty</h3>
                    <p style={{ fontSize: '14px', color: 'var(--admin-text-muted)', margin: 0 }}>No banned sellers yet</p>
                </div>
            ) : blacklist.map(item => (
                <div key={item.id} className="admin-content-card" style={{ padding: '20px', borderLeft: '4px solid var(--admin-danger)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name="Ban" size={24} style={{ color: 'var(--admin-danger)' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--admin-text-primary)', margin: 0 }}>{item.email}</h3>
                            <p style={{ fontSize: '13px', color: 'var(--admin-danger)', margin: '4px 0' }}>{item.ban_reason}</p>
                            <p style={{ fontSize: '11px', color: 'var(--admin-text-muted)', margin: 0 }}>Banned: {new Date(item.created_at).toLocaleDateString()}</p>
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

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/violations/rejected-products`, { headers: getHeaders() });
            if (res.ok) { const data = await res.json(); setProducts(data.data || []); }
        } catch (err) { console.error('Error fetching products:', err); }
        finally { setLoading(false); }
    };

    if (loading) return <div className="admin-loading"><div className="admin-loading-spinner"></div></div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {products.length === 0 ? (
                <div className="admin-content-card" style={{ textAlign: 'center', padding: '60px' }}>
                    <Icon name="Package" size={48} style={{ color: 'var(--admin-success)', marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--admin-text-primary)', margin: '0 0 8px' }}>No Rejected Products</h3>
                    <p style={{ fontSize: '14px', color: 'var(--admin-text-muted)', margin: 0 }}>All products passed safety checks</p>
                </div>
            ) : products.map(product => {
                const productData = JSON.parse(product.original_product_data || '{}');
                const ingredients = JSON.parse(product.detected_ingredients || '[]');
                return (
                    <div key={product.id} className="admin-content-card" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'var(--admin-bg-primary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {productData.image_url ? <img src={productData.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Icon name="Package" size={24} style={{ color: 'var(--admin-text-muted)' }} />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--admin-text-primary)', margin: 0 }}>{productData.name || 'Unknown Product'}</h3>
                                <p style={{ fontSize: '13px', color: 'var(--admin-text-muted)', margin: '4px 0 12px' }}>{product.rejection_reason}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {ingredients.map((ing, i) => (
                                        <span key={i} className="admin-badge danger">{ing.name || ing}</span>
                                    ))}
                                </div>
                                <p style={{ fontSize: '11px', color: 'var(--admin-text-muted)', marginTop: '12px' }}>Rejected: {new Date(product.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Database Settings Tab
const DatabaseTab = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [seedResult, setSeedResult] = useState(null);

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/violations/toxic-ingredients/stats`, { headers: getHeaders() });
            if (res.ok) { const data = await res.json(); setStats(data.data); }
        } catch (err) { console.error('Error fetching stats:', err); }
        finally { setLoading(false); }
    };

    const handleSeed = async () => {
        setSeeding(true);
        setSeedResult(null);
        try {
            const res = await fetch(`${API_BASE}/admin/violations/seed-toxic-ingredients`, { method: 'POST', headers: getHeaders() });
            const data = await res.json();
            setSeedResult(data);
            fetchStats();
        } catch (err) {
            console.error('Error seeding:', err);
            setSeedResult({ success: false, message: err.message });
        } finally { setSeeding(false); }
    };

    if (loading) return <div className="admin-loading"><div className="admin-loading-spinner"></div></div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Stats Card */}
            <div className="admin-content-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <Icon name="Database" size={24} style={{ color: 'var(--admin-accent)' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--admin-text-primary)', margin: 0 }}>Toxic Ingredients Database</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ padding: '20px', background: 'var(--admin-bg-primary)', borderRadius: '12px', textAlign: 'center' }}>
                        <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--admin-accent)', margin: 0 }}>{stats?.totalInDatabase || 0}</p>
                        <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: '4px 0 0' }}>In Database</p>
                    </div>
                    <div style={{ padding: '20px', background: 'var(--admin-bg-primary)', borderRadius: '12px', textAlign: 'center' }}>
                        <p style={{ fontSize: '28px', fontWeight: '700', color: 'var(--admin-success)', margin: 0 }}>{stats?.availableToSeed || 0}</p>
                        <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: '4px 0 0' }}>Available</p>
                    </div>
                    {stats?.bySeverity?.map(s => (
                        <div key={s.severity} style={{ padding: '20px', background: 'var(--admin-bg-primary)', borderRadius: '12px', textAlign: 'center' }}>
                            <p style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: s.severity === 'critical' ? 'var(--admin-danger)' : s.severity === 'high' ? 'var(--admin-warning)' : 'var(--admin-text-muted)' }}>{s.count}</p>
                            <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: '4px 0 0', textTransform: 'capitalize' }}>{s.severity}</p>
                        </div>
                    ))}
                </div>

                <button onClick={handleSeed} disabled={seeding} className="admin-gradient-btn" style={{ width: '100%', padding: '14px', justifyContent: 'center' }}>
                    {seeding ? <><div className="admin-loading-spinner" style={{ width: '20px', height: '20px' }}></div> Seeding Database...</> : <><Icon name="Download" size={20} /> Seed 100+ Toxic Ingredients</>}
                </button>

                {seedResult && (
                    <div style={{ marginTop: '16px', padding: '16px', borderRadius: '12px', background: seedResult.success ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)' }}>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: seedResult.success ? 'var(--admin-success)' : 'var(--admin-danger)', margin: 0 }}>{seedResult.message}</p>
                        {seedResult.data && <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: '8px 0 0' }}>Added: {seedResult.data.added} | Already existed: {seedResult.data.skipped}</p>}
                    </div>
                )}
            </div>

            {/* Info Card */}
            <div className="admin-content-card" style={{ padding: '24px', borderLeft: '4px solid var(--admin-accent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <Icon name="Shield" size={20} style={{ color: 'var(--admin-accent)' }} />
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--admin-text-primary)', margin: 0 }}>AI-Powered Safety Check</h4>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', margin: '0 0 12px' }}>النظام يستخدم طبقتين من الحماية:</p>
                <ul style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                    <li><strong>Quick Check:</strong> قاعدة بيانات + Gemini AI للفحص السريع</li>
                    <li><strong>Deep Scan:</strong> تحليل عميق بالذكاء الاصطناعي للمنتجات المشبوهة</li>
                </ul>
            </div>
        </div>
    );
};

// Main Admin Safety Page
const AdminSafety = () => {
    const [activeTab, setActiveTab] = useState('appeals');
    const [counts, setCounts] = useState({ appeals: 0, sellers: 0, blacklist: 0, rejected: 0 });

    useEffect(() => { fetchCounts(); }, []);

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
        } catch (err) { console.error('Error fetching counts:', err); }
    };

    return (
        <AdminLayout>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--admin-text-primary)', margin: 0 }}>
                    Safety Management
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
                    Manage appeals, violations, and blacklisted sellers
                </p>
            </div>

            {/* Tabs */}
            <div className="admin-range-selector" style={{ marginBottom: '24px', flexWrap: 'wrap' }}>
                <TabButton active={activeTab === 'appeals'} onClick={() => setActiveTab('appeals')} icon="MessageSquare" label="Appeals" count={counts.appeals} />
                <TabButton active={activeTab === 'sellers'} onClick={() => setActiveTab('sellers')} icon="Users" label="Problem Sellers" count={counts.sellers} />
                <TabButton active={activeTab === 'blacklist'} onClick={() => setActiveTab('blacklist')} icon="Ban" label="Blacklist" count={counts.blacklist} />
                <TabButton active={activeTab === 'rejected'} onClick={() => setActiveTab('rejected')} icon="Package" label="Rejected Products" count={counts.rejected} />
                <TabButton active={activeTab === 'database'} onClick={() => setActiveTab('database')} icon="Database" label="Database" count={0} />
            </div>

            {/* Tab Content */}
            {activeTab === 'appeals' && <AppealsTab />}
            {activeTab === 'sellers' && <ProblemSellersTab />}
            {activeTab === 'blacklist' && <BlacklistTab />}
            {activeTab === 'rejected' && <RejectedProductsTab />}
            {activeTab === 'database' && <DatabaseTab />}
        </AdminLayout>
    );
};

export default AdminSafety;
