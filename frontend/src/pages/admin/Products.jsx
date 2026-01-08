import React, { useEffect, useState, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Icon from '../../components/AppIcon';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const raw = localStorage.getItem('gm_auth');
            const headers = raw ? { Authorization: `Bearer ${JSON.parse(raw).token}` } : {};
            const r = await fetch(`${API_BASE}/admin/products`, { headers });
            if (r.ok) {
                const j = await r.json();
                setProducts(j.data || []);
            } else {
                setError('Failed to load products');
            }
        } catch (e) {
            console.error('Failed to fetch products:', e);
            setError(e?.message || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const categories = useMemo(() => {
        const cats = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];
        return cats;
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = !searchTerm ||
                p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.seller_email?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
            const matchesStatus = filterStatus === 'all' ||
                (filterStatus === 'published' && p.published) ||
                (filterStatus === 'draft' && !p.published);
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [products, searchTerm, filterCategory, filterStatus]);

    const stats = useMemo(() => ({
        total: products.length,
        published: products.filter(p => p.published).length,
        draft: products.filter(p => !p.published).length,
        totalViews: products.reduce((acc, p) => acc + (p.view_count || 0), 0),
    }), [products]);

    return (
        <AdminLayout>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--admin-text-primary)', margin: 0 }}>
                    Products Management
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
                    View and manage all products in the marketplace
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                <div className="admin-stat-card blue" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>Total Products</div>
                            <div className="admin-stat-card-value" style={{ fontSize: '28px' }}>{stats.total}</div>
                        </div>
                        <div className="admin-stat-card-icon"><Icon name="Package" size={24} /></div>
                    </div>
                </div>
                <div className="admin-stat-card green" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>Published</div>
                            <div className="admin-stat-card-value" style={{ fontSize: '28px' }}>{stats.published}</div>
                        </div>
                        <div className="admin-stat-card-icon"><Icon name="CheckCircle2" size={24} /></div>
                    </div>
                </div>
                <div className="admin-stat-card orange" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>Drafts</div>
                            <div className="admin-stat-card-value" style={{ fontSize: '28px' }}>{stats.draft}</div>
                        </div>
                        <div className="admin-stat-card-icon"><Icon name="FileEdit" size={24} /></div>
                    </div>
                </div>
                <div className="admin-stat-card purple" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>Total Views</div>
                            <div className="admin-stat-card-value" style={{ fontSize: '28px' }}>{stats.totalViews.toLocaleString()}</div>
                        </div>
                        <div className="admin-stat-card-icon"><Icon name="Eye" size={24} /></div>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div className="admin-search" style={{ flex: 1, minWidth: '200px', maxWidth: '400px' }}>
                    <Icon name="Search" size={18} style={{ color: 'var(--admin-text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search by name, brand, or seller..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '10px',
                        border: '1px solid var(--admin-border)',
                        background: 'var(--admin-bg-card)',
                        color: 'var(--admin-text-primary)',
                        fontSize: '14px',
                        cursor: 'pointer',
                        outline: 'none',
                    }}
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat} style={{ background: 'var(--admin-bg-card)' }}>
                            {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                    ))}
                </select>

                <div className="admin-range-selector">
                    {['all', 'published', 'draft'].map(status => (
                        <button
                            key={status}
                            className={`admin-range-btn ${filterStatus === status ? 'active' : ''}`}
                            onClick={() => setFilterStatus(status)}
                        >
                            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                <button onClick={fetchProducts} className="admin-quick-btn" style={{ padding: '10px 16px' }}>
                    <Icon name="RefreshCw" size={16} />
                    Refresh
                </button>
            </div>

            {/* Error State */}
            {error && (
                <div className="admin-error" style={{ marginBottom: '24px' }}>
                    <div className="admin-error-content">
                        <Icon name="AlertTriangle" size={18} style={{ color: 'var(--admin-danger)' }} />
                        <span className="admin-error-text">{error}</span>
                    </div>
                    <button onClick={fetchProducts} className="admin-quick-btn" style={{ padding: '8px 16px' }}>Retry</button>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="admin-loading">
                    <div className="admin-loading-spinner"></div>
                    <span className="admin-loading-text">Loading products...</span>
                </div>
            ) : (
                /* Products Table */
                <div className="admin-content-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--admin-bg-primary)' }}>
                                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Product</th>
                                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Category</th>
                                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Price</th>
                                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Seller</th>
                                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Views</th>
                                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                                        <Icon name="Package" size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                                        <p style={{ margin: 0, fontSize: '16px' }}>No products found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map(product => (
                                    <tr
                                        key={product.id}
                                        style={{ borderTop: '1px solid var(--admin-border)' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--admin-bg-card-hover)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.name} style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--admin-border)' }} />
                                                ) : (
                                                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--admin-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Icon name="Image" size={18} style={{ color: 'var(--admin-text-muted)' }} />
                                                    </div>
                                                )}
                                                <div>
                                                    <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--admin-text-primary)' }}>{product.name}</div>
                                                    {product.brand && <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{product.brand}</div>}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                background: 'var(--admin-bg-primary)',
                                                color: 'var(--admin-text-secondary)',
                                            }}>
                                                {product.category || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 20px', color: 'var(--admin-text-primary)', fontWeight: '500' }}>
                                            {product.price ? `$${parseFloat(product.price).toFixed(2)}` : '-'}
                                        </td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ fontSize: '13px', color: 'var(--admin-text-primary)' }}>{product.seller_name || '-'}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>{product.seller_email || ''}</div>
                                        </td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-text-muted)' }}>
                                                <Icon name="Eye" size={14} />
                                                {product.view_count || 0}
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 20px' }}>
                                            {product.published ? (
                                                <span className="admin-badge success">
                                                    <Icon name="CheckCircle2" size={12} />
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="admin-badge warning">
                                                    <Icon name="FileEdit" size={12} />
                                                    Draft
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Footer */}
                    <div style={{ padding: '14px 20px', borderTop: '1px solid var(--admin-border)', background: 'var(--admin-bg-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: 'var(--admin-text-muted)' }}>
                            Showing {filteredProducts.length} of {stats.total} products
                        </span>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Products;
