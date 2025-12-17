import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

// Sidebar (reused from Dashboard)
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

// Product Modal
const ProductModal = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState(product || {
        name: '',
        brand: '',
        description: '',
        price: '',
        original_price: '',
        image_url: '',
        category: '',
        purchase_url: '',
        published: 0
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await onSave(formData);
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">
                        {product?.id ? 'Edit Product' : 'Add Product'}
                    </h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <Icon name="X" size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Product Name *</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Vitamin C Serum"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Brand</label>
                            <Input
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                placeholder="Your brand name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                            >
                                <option value="">Select category</option>
                                <option value="cleanser">Cleanser</option>
                                <option value="toner">Toner</option>
                                <option value="serum">Serum</option>
                                <option value="moisturizer">Moisturizer</option>
                                <option value="sunscreen">Sunscreen</option>
                                <option value="mask">Mask</option>
                                <option value="treatment">Treatment</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe your product..."
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background min-h-[80px]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Price ($)</label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="29.99"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Original Price</label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.original_price}
                                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                                placeholder="39.99"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Image URL</label>
                        <Input
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Purchase URL</label>
                        <Input
                            value={formData.purchase_url}
                            onChange={(e) => setFormData({ ...formData, purchase_url: e.target.value })}
                            placeholder="https://yourstore.com/product"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="published"
                            checked={formData.published === 1}
                            onChange={(e) => setFormData({ ...formData, published: e.target.checked ? 1 : 0 })}
                            className="w-4 h-4 accent-accent"
                        />
                        <label htmlFor="published" className="text-sm text-foreground">Publish product (visible to users)</label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving} className="flex-1">
                            {saving ? 'Saving...' : (product?.id ? 'Update' : 'Create')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Products Page
const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';
    const getHeaders = () => {
        const token = JSON.parse(localStorage.getItem('gm_auth') || '{}')?.token;
        return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_BASE}/seller/products`, { headers: getHeaders() });
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

    const handleSave = async (formData) => {
        try {
            const isEdit = !!formData.id;
            const url = isEdit ? `${API_BASE}/seller/products/${formData.id}` : `${API_BASE}/seller/products`;
            const method = isEdit ? 'PUT' : 'POST';

            console.log('[Products] Saving product:', { url, method, formData });

            const res = await fetch(url, {
                method,
                headers: getHeaders(),
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            console.log('[Products] Save response:', { status: res.status, data });

            if (res.ok) {
                await fetchProducts();
                setShowModal(false);
                setEditingProduct(null);
            } else {
                // Show error to user
                alert(`Error: ${data.error || 'Failed to save product'}`);
            }
        } catch (err) {
            console.error('Error saving product:', err);
            alert(`Error: ${err.message || 'Network error'}`);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const res = await fetch(`${API_BASE}/seller/products/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            if (res.ok) fetchProducts();
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    };

    return (
        <div className="flex min-h-screen bg-background">
            <SellerSidebar activePage="products" />

            <main className="flex-1 p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Products</h1>
                        <p className="text-muted-foreground">Manage your product catalog</p>
                    </div>
                    <button
                        onClick={() => { setEditingProduct(null); setShowModal(true); }}
                        className="px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent/90 transition-all flex items-center gap-2"
                    >
                        <Icon name="Plus" size={16} />
                        Add Product
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((product) => (
                            <div key={product.id} className="bg-card border border-border rounded-2xl overflow-hidden card-hover">
                                <div className="h-40 bg-muted relative">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Icon name="Image" size={32} className="text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${product.published ? 'bg-success text-white' : 'bg-warning text-white'}`}>
                                        {product.published ? 'Published' : 'Draft'}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-foreground mb-1">{product.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">{product.brand || 'No brand'}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-foreground">${product.price || '0.00'}</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => { setEditingProduct(product); setShowModal(true); }}
                                                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                                            >
                                                <Icon name="Edit" size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                                            >
                                                <Icon name="Trash2" size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-card border border-border rounded-2xl">
                        <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-medium text-foreground mb-2">No products yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">Start by adding your first product</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium"
                        >
                            Add Product
                        </button>
                    </div>
                )}

                {showModal && (
                    <ProductModal
                        product={editingProduct}
                        onClose={() => { setShowModal(false); setEditingProduct(null); }}
                        onSave={handleSave}
                    />
                )}
            </main>
        </div>
    );
};

export default ProductsPage;
