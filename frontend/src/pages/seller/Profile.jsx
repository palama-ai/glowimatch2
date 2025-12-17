import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

// Sidebar Component (shared)
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

// Profile Page
const ProfilePage = () => {
    const { userProfile, user, updateProfile, refreshProfile } = useAuth();
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
        <div className="flex min-h-screen bg-background">
            <SellerSidebar activePage="profile" />

            <main className="flex-1 p-8">
                <div className="max-w-2xl">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
                        <p className="text-muted-foreground">Manage your seller account information</p>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-accent/10 to-pink-500/10 p-6 border-b border-border">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center">
                                    <Icon name="User" size={40} className="text-accent" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">{formData.full_name || 'Seller'}</h2>
                                    <p className="text-muted-foreground">{formData.email}</p>
                                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full">
                                        <Icon name="Store" size={12} />
                                        Seller Account
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {success && (
                                <div className="bg-success/10 border border-success/30 text-success px-4 py-3 rounded-lg flex items-center gap-2">
                                    <Icon name="CheckCircle" size={18} />
                                    <span className="text-sm">Profile updated successfully!</span>
                                </div>
                            )}

                            {error && (
                                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
                                    <Icon name="AlertTriangle" size={18} />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                                    <Input
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                                    <Input
                                        value={formData.email}
                                        disabled
                                        className="bg-muted cursor-not-allowed"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Brand Name</label>
                                <Input
                                    value={formData.brand_name}
                                    onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                                    placeholder="Your brand or company name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Website</label>
                                <Input
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Tell customers about yourself and your products..."
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background min-h-[100px] focus:outline-none focus:ring-2 focus:ring-accent/50"
                                />
                            </div>

                            <div className="pt-4">
                                <Button type="submit" disabled={saving} className="w-full md:w-auto">
                                    {saving ? (
                                        <>
                                            <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="Save" size={16} className="mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Account Stats */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-card border border-border rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                                    <Icon name="Calendar" size={20} className="text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Member since</p>
                                    <p className="font-medium text-foreground">
                                        {userProfile?.created_at
                                            ? new Date(userProfile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                            : 'N/A'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Icon name="Shield" size={20} className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Account Type</p>
                                    <p className="font-medium text-foreground capitalize">{userProfile?.role || 'Seller'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <Icon name="CheckCircle" size={20} className="text-green-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <p className="font-medium text-foreground">Active</p>
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
