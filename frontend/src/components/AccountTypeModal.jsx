import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './AppIcon';

/**
 * Modal to select account type after Google sign-in for new users
 */
const AccountTypeModal = ({ isOpen, onSelect, userEmail, userName }) => {
    const [selectedType, setSelectedType] = useState(null);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!selectedType || !acceptTerms) return;
        setLoading(true);
        await onSelect(selectedType);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white text-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                        <Icon name="UserCheck" size={32} />
                    </div>
                    <h2 className="text-xl font-bold">Welcome to Glowimatch!</h2>
                    <p className="text-white/80 text-sm mt-1">
                        {userName || userEmail}
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div>
                        <p className="text-center text-muted-foreground mb-4">
                            How would you like to use Glowimatch?
                        </p>

                        {/* Account Type Selection */}
                        <div className="grid gap-3">
                            {/* User Option */}
                            <button
                                onClick={() => setSelectedType('user')}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${selectedType === 'user'
                                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-500/10'
                                    : 'border-border hover:border-pink-300'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedType === 'user' ? 'bg-pink-500 text-white' : 'bg-muted'
                                        }`}>
                                        <Icon name="User" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-foreground">I'm a User</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Get personalized skincare analysis and product recommendations
                                        </p>
                                    </div>
                                    {selectedType === 'user' && (
                                        <Icon name="CheckCircle" size={24} className="text-pink-500 flex-shrink-0" />
                                    )}
                                </div>
                            </button>

                            {/* Seller Option */}
                            <button
                                onClick={() => setSelectedType('seller')}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${selectedType === 'seller'
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10'
                                    : 'border-border hover:border-purple-300'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedType === 'seller' ? 'bg-purple-500 text-white' : 'bg-muted'
                                        }`}>
                                        <Icon name="Store" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-foreground">I'm a Seller</h3>
                                        <p className="text-sm text-muted-foreground">
                                            List and sell skincare products to our users
                                        </p>
                                    </div>
                                    {selectedType === 'seller' && (
                                        <Icon name="CheckCircle" size={24} className="text-purple-500 flex-shrink-0" />
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            id="acceptTermsModal"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer"
                        />
                        <label htmlFor="acceptTermsModal" className="text-sm text-muted-foreground cursor-pointer">
                            I agree to the{' '}
                            <Link to="/terms" className="text-accent hover:underline font-medium" target="_blank">
                                Terms of Service
                            </Link>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedType || !acceptTerms || loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Icon name="Loader2" size={18} className="animate-spin" />
                                Setting up...
                            </>
                        ) : (
                            <>
                                <Icon name="ArrowRight" size={18} />
                                Continue
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountTypeModal;
