import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import SellerAgreement from '../../components/seller/SellerAgreement';
import ProductOnboardingModal from '../../components/seller/ProductOnboardingModal';

// Modern Sidebar (shared with Dashboard)
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

// Modern Product Modal
const ProductModal = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState(product || {
        name: '',
        brand: '',
        description: '',
        ingredients: '',
        price: '',
        original_price: '',
        image_url: '',
        category: '',
        purchase_url: '',
        published: 0
    });
    const [saving, setSaving] = useState(false);
    const [imageMode, setImageMode] = useState('url'); // 'url' or 'upload'
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [uploadError, setUploadError] = useState('');
    const [safetyError, setSafetyError] = useState(null); // For toxic ingredient errors (blocking)
    const [safetyWarnings, setSafetyWarnings] = useState(null); // For medium-risk warnings (non-blocking)

    const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';
    const getHeaders = () => {
        const token = JSON.parse(localStorage.getItem('gm_auth') || '{}')?.token;
        return { 'Authorization': `Bearer ${token}` };
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setUploadError('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
                return;
            }
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setUploadError('File too large. Maximum size is 5MB.');
                return;
            }
            setUploadError('');
            setSelectedFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async () => {
        if (!selectedFile) return null;

        const formDataUpload = new FormData();
        formDataUpload.append('image', selectedFile);

        try {
            const res = await fetch(`${API_BASE}/upload/image`, {
                method: 'POST',
                headers: getHeaders(),
                body: formDataUpload
            });

            const data = await res.json();
            if (res.ok && data.success) {
                return data.data.url;
            } else {
                throw new Error(data.error || 'Failed to upload image');
            }
        } catch (err) {
            console.error('Image upload error:', err);
            setUploadError(err.message || 'Failed to upload image');
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setUploadError('');
        setSafetyError(null);

        let imageUrl = formData.image_url;

        // If upload mode and file selected, upload first
        if (imageMode === 'upload' && selectedFile) {
            const uploadedUrl = await uploadImage();
            if (!uploadedUrl) {
                setSaving(false);
                return; // Upload failed, error already set
            }
            imageUrl = uploadedUrl;
        }

        // Call onSave and handle the result
        const result = await onSave({ ...formData, image_url: imageUrl });
        setSaving(false);

        // If result has error code, it's a safety rejection (blocking)
        if (result && result.error) {
            if (result.code === 'TOXIC_INGREDIENTS_DETECTED' || result.code === 'INGREDIENTS_REQUIRED') {
                setSafetyError({
                    message: result.error,
                    flaggedIngredients: result.flaggedIngredients || [],
                    penalty: result.penalty || null
                });
            } else if (result.code === 'ACCOUNT_LOCKED') {
                setSafetyError({
                    message: result.message || 'Your account has been locked due to safety violations.',
                    flaggedIngredients: [],
                    penalty: null
                });
            }
        } else if (result && result.warnings && result.warnings.length > 0) {
            // Product was created but has warnings (non-blocking)
            setSafetyWarnings(result.warnings);
            // Don't close modal yet - show warnings first
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {product?.id ? 'Edit Product' : 'New Product'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">Fill in the product details</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                    >
                        <Icon name="X" size={20} className="text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Product Name *</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Vitamin C Serum"
                            required
                            className="rounded-xl"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Brand</label>
                            <Input
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                placeholder="Your brand"
                                className="rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                            >
                                <option value="">Select</option>
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
                        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe your product..."
                            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white min-h-[80px] focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        />
                    </div>

                    {/* Ingredients Field - MANDATORY for safety check */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                            Ingredients *
                            <span className="text-xs font-normal text-slate-400 ml-2">(Required for safety verification)</span>
                        </label>
                        <textarea
                            value={formData.ingredients}
                            onChange={(e) => { setFormData({ ...formData, ingredients: e.target.value }); setSafetyError(null); }}
                            placeholder="List all product ingredients, e.g.: Water, Glycerin, Niacinamide, Hyaluronic Acid..."
                            required
                            className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white min-h-[100px] focus:outline-none focus:ring-2 focus:ring-pink-500/50 ${safetyError ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-700'
                                }`}
                        />
                        <p className="text-xs text-slate-400 mt-1">All products are scanned for harmful ingredients before publishing</p>

                        {/* Safety Error Display */}
                        {safetyError && (
                            <div className="mt-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                <div className="flex items-start gap-2">
                                    <Icon name="AlertTriangle" size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-red-700 dark:text-red-400">Product Rejected - Safety Issue</p>
                                        <p className="text-sm text-red-600 dark:text-red-300 mt-1">{safetyError.message}</p>
                                        {safetyError.flaggedIngredients && safetyError.flaggedIngredients.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-xs font-medium text-red-600 dark:text-red-400">Flagged ingredients:</p>
                                                <ul className="mt-1 space-y-1">
                                                    {safetyError.flaggedIngredients.map((ing, i) => (
                                                        <li key={i} className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                                                            <span className={`w-2 h-2 rounded-full ${ing.severity === 'critical' ? 'bg-red-600' :
                                                                ing.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                                                                }`} />
                                                            <span className="font-medium">{ing.name}</span> - {ing.reason}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {safetyError.penalty && (
                                            <p className="text-xs text-red-500 dark:text-red-400 mt-2 font-medium">
                                                ⚠️ Warning {safetyError.penalty.violationCount}/3 - {safetyError.penalty.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Price ($)</label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="29.99"
                                className="rounded-xl"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Original Price</label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.original_price}
                                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                                placeholder="39.99"
                                className="rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Image Section with Toggle */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Product Image</label>

                        {/* Toggle Buttons */}
                        <div className="flex mb-3 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setImageMode('url')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${imageMode === 'url'
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                <Icon name="Link" size={16} />
                                URL
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageMode('upload')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${imageMode === 'upload'
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                <Icon name="Upload" size={16} />
                                Upload
                            </button>
                        </div>

                        {/* URL Mode */}
                        {imageMode === 'url' && (
                            <Input
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                                className="rounded-xl"
                            />
                        )}

                        {/* Upload Mode */}
                        {imageMode === 'upload' && (
                            <div>
                                <div
                                    className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:border-pink-400 transition-colors cursor-pointer"
                                    onClick={() => document.getElementById('image-upload').click()}
                                >
                                    <input
                                        type="file"
                                        id="image-upload"
                                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />

                                    {filePreview ? (
                                        <div className="relative">
                                            <img
                                                src={filePreview}
                                                alt="Preview"
                                                className="max-h-40 mx-auto rounded-lg object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedFile(null);
                                                    setFilePreview(null);
                                                }}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                                <Icon name="X" size={14} />
                                            </button>
                                            <p className="text-xs text-slate-500 mt-2">{selectedFile?.name}</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <Icon name="ImagePlus" size={40} className="mx-auto text-slate-400 mb-2" />
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                Click to select an image
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                JPEG, PNG, WebP, GIF (max 5MB)
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {uploadError && (
                                    <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                                        <Icon name="AlertCircle" size={14} />
                                        {uploadError}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Purchase URL</label>
                        <Input
                            value={formData.purchase_url}
                            onChange={(e) => setFormData({ ...formData, purchase_url: e.target.value })}
                            placeholder="https://yourstore.com/product"
                            className="rounded-xl"
                        />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <input
                            type="checkbox"
                            id="published"
                            checked={formData.published === 1}
                            onChange={(e) => setFormData({ ...formData, published: e.target.checked ? 1 : 0 })}
                            className="w-5 h-5 accent-pink-500 rounded"
                        />
                        <label htmlFor="published" className="text-sm font-medium text-slate-900 dark:text-white">Publish product (visible to users)</label>
                    </div>

                    {/* Safety Error Alert (Blocking - product rejected) */}
                    {safetyError && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                            <div className="flex items-start gap-3">
                                <Icon name="ShieldX" size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-red-700 dark:text-red-400">Product Rejected - Safety Issue</h4>
                                    <p className="text-sm text-red-600 dark:text-red-300 mt-1">{safetyError.message}</p>
                                    {safetyError.flaggedIngredients?.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-xs font-medium text-red-600 dark:text-red-400">Flagged ingredients:</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {safetyError.flaggedIngredients.map((ing, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 text-xs rounded">
                                                        {ing.name || ing}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {safetyError.penalty && (
                                        <p className="text-xs text-red-500 mt-2">⚠️ {safetyError.penalty.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Safety Warnings Alert (Non-blocking - product created with warnings) */}
                    {safetyWarnings && safetyWarnings.length > 0 && (
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                            <div className="flex items-start gap-3">
                                <Icon name="AlertTriangle" size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-amber-700 dark:text-amber-400">
                                        ✅ Product Created with Warnings
                                    </h4>
                                    <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
                                        Your product was published, but contains ingredients that may cause sensitivity in some users:
                                    </p>
                                    <div className="mt-2 space-y-1">
                                        {safetyWarnings.map((w, i) => (
                                            <div key={i} className="text-xs text-amber-600 dark:text-amber-400">
                                                • <strong>{w.ingredient}</strong>: {w.reason}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="mt-3 text-sm font-medium text-amber-700 dark:text-amber-400 underline"
                                    >
                                        Close and continue
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30 disabled:opacity-50 transition-all"
                        >
                            {saving ? 'Saving...' : (product?.id ? 'Update' : 'Create')}
                        </button>
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
    const [showOnboardingModal, setShowOnboardingModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(null); // null = loading, false = not accepted, true = accepted

    const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';
    const getHeaders = () => {
        const token = JSON.parse(localStorage.getItem('gm_auth') || '{}')?.token;
        return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    };

    useEffect(() => {
        checkTermsStatus();
        fetchProducts();
    }, []);

    const checkTermsStatus = async () => {
        try {
            const res = await fetch(`${API_BASE}/seller/terms-status`, { headers: getHeaders() });
            if (res.ok) {
                const data = await res.json();
                setTermsAccepted(data.data?.termsAccepted || false);
                if (!data.data?.termsAccepted) {
                    setShowTermsModal(true);
                }
            }
        } catch (err) {
            console.error('Error checking terms status:', err);
            setTermsAccepted(false);
            setShowTermsModal(true);
        }
    };

    const handleAcceptTerms = async (signatureData) => {
        try {
            const res = await fetch(`${API_BASE}/seller/accept-terms`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ signatureData })
            });

            if (res.ok) {
                setTermsAccepted(true);
                setShowTermsModal(false);
            } else {
                throw new Error('Failed to accept terms');
            }
        } catch (err) {
            console.error('Error accepting terms:', err);
            throw err;
        }
    };

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

            const res = await fetch(url, {
                method,
                headers: getHeaders(),
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                await fetchProducts();
                setShowModal(false);
                setEditingProduct(null);
                return { success: true };
            } else {
                // Return error data for safety-related rejections
                if (data.code === 'TOXIC_INGREDIENTS_DETECTED' ||
                    data.code === 'INGREDIENTS_REQUIRED' ||
                    data.code === 'ACCOUNT_LOCKED' ||
                    data.code === 'ACCOUNT_BANNED') {
                    return data; // Pass back to modal for display
                }
                alert(`Error: ${data.error || 'Failed to save product'}`);
                return { error: data.error };
            }
        } catch (err) {
            console.error('Error saving product:', err);
            alert(`Error: ${err.message || 'Network error'}`);
            return { error: err.message };
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
        <>
            {/* Terms of Service Agreement Modal */}
            {showTermsModal && (
                <SellerAgreement onAccept={handleAcceptTerms} />
            )}

            <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
                <SellerSidebar activePage="products" />

                <main className="flex-1 p-8 lg:p-10">
                    {/* Header */}
                    <header className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Products</h1>
                                <p className="text-slate-500 mt-1">Manage your product catalog</p>
                            </div>
                            <button
                                onClick={() => setShowOnboardingModal(true)}
                                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <Icon name="Plus" size={18} />
                                Add Product
                            </button>
                        </div>
                    </header>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="aspect-[4/5] bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {products.map((product) => (
                                <div key={product.id} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300">
                                    <div className="h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Icon name="Image" size={40} className="text-slate-300 dark:text-slate-600" />
                                            </div>
                                        )}
                                        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${product.published
                                            ? 'bg-emerald-500/90 text-white'
                                            : 'bg-amber-500/90 text-white'
                                            }`}>
                                            {product.published ? 'Live' : 'Draft'}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">{product.name}</h3>
                                        <p className="text-sm text-slate-500 mb-3">{product.brand || 'No brand'}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xl font-bold text-slate-900 dark:text-white">${product.price || '0.00'}</span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => { setEditingProduct(product); setShowModal(true); }}
                                                    className="p-2.5 text-slate-400 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-500/10 rounded-xl transition-colors"
                                                >
                                                    <Icon name="Edit" size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                                                >
                                                    <Icon name="Trash2" size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-500/10 dark:to-rose-500/10 flex items-center justify-center mx-auto mb-5">
                                <Icon name="Package" size={36} className="text-pink-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No products yet</h3>
                            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Start by adding your first product to showcase on Glowimatch</p>
                            <button
                                onClick={() => setShowOnboardingModal(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/25"
                            >
                                <Icon name="Plus" size={18} />
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

                    {/* Smart Product Onboarding Modal (for adding new products) */}
                    {showOnboardingModal && (
                        <ProductOnboardingModal
                            onClose={() => setShowOnboardingModal(false)}
                            onSave={async (productData) => {
                                const result = await handleSave(productData);
                                if (result?.success) {
                                    setShowOnboardingModal(false);
                                    return { success: true };
                                }
                                return result;
                            }}
                        />
                    )}
                </main>
            </div>
        </>
    );
};

export default ProductsPage;
