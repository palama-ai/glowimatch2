import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';

// Sidebar (shared with other seller pages)
const SellerSidebar = ({ activePage }) => {
    const navigate = useNavigate();
    const { signOut, userProfile } = useAuth();

    const menuItems = [
        { id: 'dashboard', label: 'Overview', icon: 'LayoutDashboard', path: '/seller' },
        { id: 'products', label: 'Products', icon: 'Package', path: '/seller/products' },
        { id: 'violations', label: 'Violations', icon: 'AlertTriangle', path: '/seller/violations' },
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

// Appeal Modal
const AppealModal = ({ violation, onClose, onSubmit }) => {
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason.trim()) return;
        setSubmitting(true);
        await onSubmit(violation.id, reason);
        setSubmitting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Submit Appeal</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                            <Icon name="X" size={20} className="text-slate-500" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                        <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                            Violation: {violation.violation_type}
                        </p>
                        <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
                            Product: {violation.product_name}
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                            Why do you believe this was a mistake?
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Explain why you believe the product should not have been flagged..."
                            required
                            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white min-h-[120px] focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                        />
                    </div>

                    <p className="text-xs text-slate-400 mb-4">
                        ⏱️ Appeals are reviewed within 48 hours. You will receive a notification with the decision.
                    </p>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !reason.trim()}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold disabled:opacity-50"
                        >
                            {submitting ? 'Submitting...' : 'Submit Appeal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Violations Page
const ViolationsPage = () => {
    const [violations, setViolations] = useState([]);
    const [accountStatus, setAccountStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [appealViolation, setAppealViolation] = useState(null);
    const [message, setMessage] = useState(null);

    const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';
    const getHeaders = () => {
        const token = JSON.parse(localStorage.getItem('gm_auth') || '{}')?.token;
        return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [violationsRes, statusRes] = await Promise.all([
                fetch(`${API_BASE}/seller/violations`, { headers: getHeaders() }),
                fetch(`${API_BASE}/seller/account-status`, { headers: getHeaders() })
            ]);

            if (violationsRes.ok) {
                const data = await violationsRes.json();
                setViolations(data.data || []);
            }

            if (statusRes.ok) {
                const data = await statusRes.json();
                setAccountStatus(data.data || null);
            }
        } catch (err) {
            console.error('Error fetching violations:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAppealSubmit = async (violationId, reason) => {
        try {
            const res = await fetch(`${API_BASE}/seller/appeals`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ violationId, reason })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: data.data?.message || 'Appeal submitted successfully!' });
                setAppealViolation(null);
                fetchData(); // Refresh
            } else {
                setMessage({ type: 'error', text: data.error || data.message || 'Failed to submit appeal' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
            case 'high': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
            default: return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
        }
    };

    const getAppealStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-semibold rounded-full">Approved</span>;
            case 'rejected':
                return <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-semibold rounded-full">Rejected</span>;
            case 'pending':
                return <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-semibold rounded-full">Pending Review</span>;
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            <SellerSidebar activePage="violations" />

            <main className="flex-1 p-8 lg:p-10">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Violations & Appeals</h1>
                    <p className="text-slate-500 mt-1">View your violation history and submit appeals</p>
                </header>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                        }`}>
                        <Icon name={message.type === 'success' ? 'CheckCircle' : 'AlertCircle'} size={20} />
                        <p>{message.text}</p>
                        <button onClick={() => setMessage(null)} className="ml-auto">
                            <Icon name="X" size={16} />
                        </button>
                    </div>
                )}

                {/* Account Status Card */}
                {accountStatus && (
                    <div className={`mb-8 rounded-2xl p-6 border ${accountStatus.status === 'BANNED' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                            accountStatus.status === 'LOCKED' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' :
                                accountStatus.isOnProbation ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' :
                                    accountStatus.violationCount > 0 ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                                        'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                        }`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Account Status</h2>
                                <p className={`text-sm mt-1 ${accountStatus.status === 'ACTIVE' ? 'text-emerald-600' :
                                        accountStatus.status === 'LOCKED' ? 'text-orange-600' : 'text-red-600'
                                    }`}>
                                    {accountStatus.status === 'ACTIVE' && !accountStatus.isOnProbation ? '✓ Good Standing' :
                                        accountStatus.status === 'ACTIVE' && accountStatus.isOnProbation ? '⚠️ On Probation' :
                                            accountStatus.status === 'LOCKED' ? '🔒 Account Locked' : '⛔ Permanently Banned'}
                                </p>
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className={`w-4 h-4 rounded-full ${i <= (accountStatus.violationCount || 0)
                                                ? 'bg-red-500'
                                                : 'bg-slate-200 dark:bg-slate-700'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mt-2">
                            Violations: {accountStatus.violationCount || 0} / 3
                            {accountStatus.isOnProbation && ' • Any new violation will result in permanent ban'}
                        </p>
                    </div>
                )}

                {/* Violations List */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Violation History</h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-slate-500 mt-4">Loading...</p>
                        </div>
                    ) : violations.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {violations.map((violation) => (
                                <div key={violation.id} className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getSeverityColor(violation.penalty_applied)}`}>
                                                    {violation.violation_type?.replace('_', ' ').toUpperCase()}
                                                </span>
                                                {getAppealStatusBadge(violation.appeal_status)}
                                            </div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                {violation.product_name}
                                            </h3>
                                            {violation.detected_ingredients && (
                                                <p className="text-sm text-slate-500 mt-1">
                                                    Flagged: {JSON.parse(violation.detected_ingredients || '[]').map(i => i.name || i).join(', ')}
                                                </p>
                                            )}
                                            <p className="text-xs text-slate-400 mt-2">
                                                {new Date(violation.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        {!violation.appeal_status && (
                                            <button
                                                onClick={() => setAppealViolation(violation)}
                                                className="px-4 py-2 text-sm font-semibold text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-500/10 rounded-xl transition-colors"
                                            >
                                                Appeal
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-4">
                                <Icon name="CheckCircle" size={32} className="text-emerald-500" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Violations</h3>
                            <p className="text-slate-500 mt-1">Your account is in good standing!</p>
                        </div>
                    )}
                </div>

                {/* Appeal Modal */}
                {appealViolation && (
                    <AppealModal
                        violation={appealViolation}
                        onClose={() => setAppealViolation(null)}
                        onSubmit={handleAppealSubmit}
                    />
                )}
            </main>
        </div>
    );
};

export default ViolationsPage;
