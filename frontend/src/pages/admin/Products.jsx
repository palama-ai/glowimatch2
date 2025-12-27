import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

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

    useEffect(() => {
        fetchProducts();
    }, []);

    // Get unique categories from products
    const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

    // Filter products based on search and category
    const filteredProducts = products.filter(p => {
        const matchesSearch = !searchTerm ||
            p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.seller_email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Stats
    const totalProducts = products.length;
    const publishedProducts = products.filter(p => p.published).length;
    const draftProducts = totalProducts - publishedProducts;

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Products</h1>
                    <p className="text-muted-foreground mt-1">View all products in the database</p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                    <Button variant="outline" iconName="RefreshCw" iconPosition="left" onClick={fetchProducts}>
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Total Products</div>
                            <div className="text-4xl font-bold text-foreground mt-2">{totalProducts}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-500/10">
                            <Icon name="Package" size={24} className="text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Published</div>
                            <div className="text-4xl font-bold text-green-600 mt-2">{publishedProducts}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-green-500/10">
                            <Icon name="CheckCircle" size={24} className="text-green-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Drafts</div>
                            <div className="text-4xl font-bold text-amber-600 mt-2">{draftProducts}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-amber-500/10">
                            <Icon name="FileEdit" size={24} className="text-amber-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-card border border-border rounded-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search products by name, brand, or seller..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                            />
                        </div>
                    </div>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Icon name="Loader2" className="animate-spin text-accent mr-2" />
                    <span className="text-muted-foreground">Loading products...</span>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Icon name="AlertTriangle" className="text-destructive" />
                        <span className="text-destructive">{error}</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={fetchProducts}>Retry</Button>
                </div>
            )}

            {/* Products Table */}
            {!loading && !error && (
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Product</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Category</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Price</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Seller</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Views</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                            <Icon name="Package" size={32} className="mx-auto mb-2 opacity-50" />
                                            <p>No products found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map(product => (
                                        <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {product.image_url ? (
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            className="w-10 h-10 rounded-lg object-cover border border-border"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                                            <Icon name="Image" size={16} className="text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-foreground">{product.name}</div>
                                                        {product.brand && (
                                                            <div className="text-xs text-muted-foreground">{product.brand}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-1 bg-muted rounded-md text-xs font-medium">
                                                    {product.category || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-foreground">
                                                {product.price ? `$${parseFloat(product.price).toFixed(2)}` : '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-foreground">{product.seller_name || '-'}</div>
                                                <div className="text-xs text-muted-foreground">{product.seller_email || ''}</div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {product.view_count || 0}
                                            </td>
                                            <td className="px-4 py-3">
                                                {product.published ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                        <Icon name="CheckCircle" size={12} />
                                                        Published
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
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
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 border-t border-border bg-muted/30 text-sm text-muted-foreground">
                        Showing {filteredProducts.length} of {totalProducts} products
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Products;
