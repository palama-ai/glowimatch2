import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

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

// Profile Page
const ProfilePage = () => {
    const { userProfile, user, refreshProfile } = useAuth();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        brand_name: '',
        website: '',
        bio: ''
    });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

    useEffect(() => {
        if (userProfile) {
            setFormData({
                full_name: userProfile.full_name || '',
                email: userProfile.email || user?.email || '',
                brand_name: userProfile.brand_name || '',
                website: userProfile.website || '',
                bio: userProfile.bio || ''
            });
        }
    }, [userProfile, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess(false);

        try {
            const token = JSON.parse(localStorage.getItem('gm_auth') || '{}')?.token;
            const res = await fetch(`${API_BASE}/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    full_name: formData.full_name,
                    brand_name: formData.brand_name,
                    website: formData.website,
                    bio: formData.bio
                })
            });

            if (res.ok) {
                setSuccess(true);
                refreshProfile && await refreshProfile();
                setTimeout(() => setSuccess(false), 3000);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 seller-layout overflow-hidden">
            <SellerSidebar activePage="profile" />

            <main className="flex-1 p-8 lg:p-10 overflow-y-auto">
                <div className="max-w-2xl">
                    {/* Header */}
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
                        <p className="text-slate-500 mt-1">Manage your seller account information</p>
                    </header>

                    {/* Profile Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                        {/* Profile Header */}
                        <div className="relative h-32 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500">
                            <div className="absolute -bottom-12 left-8">
                                <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center border-4 border-white dark:border-slate-900">
                                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-fuchsia-500">
                                        {(formData.full_name?.[0] || 'S').toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-16 px-8 pb-2">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{formData.full_name || 'Seller'}</h2>
                            <p className="text-slate-500">{formData.email}</p>
                            <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-semibold rounded-full">
                                <Icon name="Store" size={12} />
                                Seller Account
                            </span>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-6">
                            {success && (
                                <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                    <Icon name="CheckCircle" size={20} />
                                    <span className="text-sm font-medium">Profile updated successfully!</span>
                                </div>
                            )}

                            {error && (
                                <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl">
                                    <Icon name="AlertTriangle" size={20} />
                                    <span className="text-sm font-medium">{error}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Full Name</label>
                                    <Input
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        placeholder="Your full name"
                                        className="rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Email</label>
                                    <Input
                                        value={formData.email}
                                        disabled
                                        className="rounded-xl bg-slate-50 dark:bg-slate-800 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Brand Name</label>
                                <Input
                                    value={formData.brand_name}
                                    onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                                    placeholder="Your brand or company name"
                                    className="rounded-xl"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Website</label>
                                <Input
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    placeholder="https://yourwebsite.com"
                                    className="rounded-xl"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Tell customers about yourself and your products..."
                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white min-h-[120px] focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-shadow"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30 disabled:opacity-50 transition-all"
                                >
                                    {saving ? (
                                        <>
                                            <Icon name="Loader2" size={18} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="Save" size={18} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Account Stats */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                                    <Icon name="Calendar" size={22} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Member since</p>
                                    <p className="font-bold text-slate-900 dark:text-white">
                                        {userProfile?.created_at
                                            ? new Date(userProfile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                            : 'N/A'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <Icon name="Shield" size={22} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Account Type</p>
                                    <p className="font-bold text-slate-900 dark:text-white capitalize">{userProfile?.role || 'Seller'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                    <Icon name="CheckCircle" size={22} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Status</p>
                                    <p className="font-bold text-slate-900 dark:text-white">Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
