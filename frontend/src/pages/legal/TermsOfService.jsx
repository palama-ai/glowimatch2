import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Footer from '../../components/Footer';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
            {/* Header */}
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/40 transition-shadow">
                            <Icon name="Sparkles" size={22} className="text-white" />
                        </div>
                        <span className="font-bold text-xl bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                            Glowimatch
                        </span>
                    </Link>
                    <Link
                        to="/"
                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                        <Icon name="ArrowLeft" size={16} />
                        Back to Home
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
                <div className="max-w-5xl mx-auto px-4 text-center relative">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white/90 text-sm mb-6">
                        <Icon name="Shield" size={16} />
                        Legal Information
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto">
                        Please read these terms carefully before using Glowimatch
                    </p>
                    <p className="text-white/60 text-sm mt-4">
                        Last updated: December 2024
                    </p>
                </div>
            </div>

            {/* Content */}
            <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Sidebar Navigation */}
                    <nav className="md:col-span-1">
                        <div className="sticky top-24 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Contents</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#users" className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-pink-500 transition-colors py-1">
                                        <Icon name="User" size={14} />
                                        For Users
                                    </a>
                                </li>
                                <li>
                                    <a href="#sellers" className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-pink-500 transition-colors py-1">
                                        <Icon name="Store" size={14} />
                                        For Sellers
                                    </a>
                                </li>
                                <li>
                                    <a href="#general" className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-pink-500 transition-colors py-1">
                                        <Icon name="Scale" size={14} />
                                        General Terms
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-10">
                        {/* User Terms */}
                        <section id="users" className="scroll-mt-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-500/20 dark:to-rose-500/20 flex items-center justify-center">
                                    <Icon name="User" size={24} className="text-pink-500" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">For Users</h2>
                                    <p className="text-slate-500 text-sm">Terms for registered users</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <TermsCard
                                    number="1"
                                    title="Account Registration"
                                    content="By creating an account, you agree to provide accurate information and keep your credentials secure. You are responsible for all activities under your account."
                                />
                                <TermsCard
                                    number="2"
                                    title="Skin Analysis Service"
                                    content="Our AI-powered skin analysis is for informational purposes only and should not replace professional dermatological advice. Results may vary based on the images you provide."
                                />
                                <TermsCard
                                    number="3"
                                    title="Product Recommendations"
                                    content="Recommendations are generated based on your skin analysis. We do not guarantee results from any recommended products. Always check ingredients for allergies before use."
                                />
                                <TermsCard
                                    number="4"
                                    title="Privacy & Data"
                                    content="Your uploaded images and personal data are stored securely. We do not share your information with third parties without consent. You can request data deletion anytime."
                                />
                                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4">
                                    <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2">
                                        <Icon name="AlertTriangle" size={16} />
                                        Acceptable Use
                                    </h3>
                                    <ul className="text-amber-700 dark:text-amber-300 text-sm space-y-1">
                                        <li>• Do not upload inappropriate or offensive content</li>
                                        <li>• Do not attempt to abuse or exploit the service</li>
                                        <li>• Do not create multiple accounts to bypass limits</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Seller Terms */}
                        <section id="sellers" className="scroll-mt-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-500/20 dark:to-violet-500/20 flex items-center justify-center">
                                    <Icon name="Store" size={24} className="text-purple-500" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">For Sellers</h2>
                                    <p className="text-slate-500 text-sm">Terms for product sellers</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <TermsCard
                                    number="1"
                                    title="Seller Registration"
                                    content="Sellers must provide accurate business information. We reserve the right to verify and approve seller accounts before activation."
                                    color="purple"
                                />
                                <TermsCard
                                    number="2"
                                    title="Product Listings"
                                    content="All product information must be accurate and truthful. Product images must represent the actual product. Ingredient lists must be complete. Misleading claims are prohibited."
                                    color="purple"
                                />
                                <TermsCard
                                    number="3"
                                    title="Quality Standards"
                                    content="Sellers are responsible for the quality and safety of their products. Products must comply with all applicable regulations and standards."
                                    color="purple"
                                />
                                <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl p-4">
                                    <h3 className="font-semibold text-green-800 dark:text-green-400 mb-2 flex items-center gap-2">
                                        <Icon name="Gift" size={16} />
                                        Trial Period
                                    </h3>
                                    <p className="text-green-700 dark:text-green-300 text-sm">
                                        New sellers receive a <strong>3-month free trial</strong>. After the trial, applicable fees will be communicated in advance.
                                    </p>
                                </div>
                                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-4">
                                    <h3 className="font-semibold text-red-800 dark:text-red-400 mb-2 flex items-center gap-2">
                                        <Icon name="Ban" size={16} />
                                        Account Suspension
                                    </h3>
                                    <p className="text-red-700 dark:text-red-300 text-sm mb-2">We may suspend accounts for:</p>
                                    <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                                        <li>• Violation of terms</li>
                                        <li>• Fraudulent practices</li>
                                        <li>• Poor customer reviews</li>
                                        <li>• Selling unsafe products</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* General Terms */}
                        <section id="general" className="scroll-mt-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center">
                                    <Icon name="Scale" size={24} className="text-blue-500" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">General Terms</h2>
                                    <p className="text-slate-500 text-sm">Terms for all users</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <TermsCard
                                    number="1"
                                    title="Limitation of Liability"
                                    content="Glowimatch is not liable for damages arising from the use of our service. We provide the platform 'as is' without warranties."
                                    color="blue"
                                />
                                <TermsCard
                                    number="2"
                                    title="Modifications"
                                    content="We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance of the new terms."
                                    color="blue"
                                />
                            </div>
                        </section>

                        {/* Agreement */}
                        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-center text-white">
                            <Icon name="CheckCircle" size={40} className="mx-auto mb-4 opacity-80" />
                            <h3 className="text-xl font-bold mb-2">Agreement</h3>
                            <p className="text-white/90 max-w-md mx-auto">
                                By using Glowimatch, you acknowledge that you have read and agree to these Terms of Service.
                            </p>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors"
                            >
                                <Icon name="HelpCircle" size={16} />
                                Have Questions? Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

// Reusable Terms Card Component
const TermsCard = ({ number, title, content, color = 'pink' }) => {
    const colors = {
        pink: 'from-pink-500 to-rose-500',
        purple: 'from-purple-500 to-violet-500',
        blue: 'from-blue-500 to-cyan-500'
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex gap-4">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-sm font-bold">{number}</span>
                </div>
                <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{content}</p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
