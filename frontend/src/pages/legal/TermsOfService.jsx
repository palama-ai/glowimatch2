import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Footer from '../../components/Footer';
import { useI18n } from '../../contexts/I18nContext';
import SEO from '../../components/SEO';

const TermsOfService = () => {
    const { t } = useI18n();
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
            <SEO
                title="Terms of Service & Privacy Policy"
                description="Read Glowimatch's terms of service and privacy policy. Learn how we protect your data, our user agreements, and seller guidelines."
                keywords="terms of service, privacy policy, user agreement, skincare platform terms, شروط الخدمة, سياسة الخصوصية"
                url="/terms"
            />
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
                        {t('back_to_home')}
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="max-w-5xl mx-auto px-4 text-center relative">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white/90 text-sm mb-6">
                        <Icon name="Shield" size={16} />
                        {t('legal_info')}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {t('terms_title')}
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto">
                        {t('terms_intro')}
                    </p>
                    <p className="text-white/60 text-sm mt-4">
                        {t('last_updated')}
                    </p>
                </div>
            </div>

            {/* Content */}
            <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Sidebar Navigation */}
                    <nav className="md:col-span-1">
                        <div className="sticky top-24 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">{t('contents')}</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#users" className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-pink-500 transition-colors py-1">
                                        <Icon name="User" size={14} />
                                        {t('terms_users')}
                                    </a>
                                </li>
                                <li>
                                    <a href="#sellers" className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-pink-500 transition-colors py-1">
                                        <Icon name="Store" size={14} />
                                        {t('terms_sellers')}
                                    </a>
                                </li>
                                <li>
                                    <a href="#general" className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-pink-500 transition-colors py-1">
                                        <Icon name="Scale" size={14} />
                                        {t('terms_general')}
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
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('terms_users')}</h2>
                                    <p className="text-slate-500 text-sm">{t('terms_users_sub')}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <TermsCard
                                    number="1"
                                    title={t('terms_user_1_title')}
                                    content={t('terms_user_1_content')}
                                />
                                <TermsCard
                                    number="2"
                                    title={t('terms_user_2_title')}
                                    content={t('terms_user_2_content')}
                                />
                                <TermsCard
                                    number="3"
                                    title={t('terms_user_3_title')}
                                    content={t('terms_user_3_content')}
                                />
                                <TermsCard
                                    number="4"
                                    title={t('terms_user_4_title')}
                                    content={t('terms_user_4_content')}
                                />
                                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4">
                                    <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2">
                                        <Icon name="AlertTriangle" size={16} />
                                        {t('terms_acceptable_use')}
                                    </h3>
                                    <ul className="text-amber-700 dark:text-amber-300 text-sm space-y-1">
                                        <li>• {t('terms_acceptable_use_1')}</li>
                                        <li>• {t('terms_acceptable_use_2')}</li>
                                        <li>• {t('terms_acceptable_use_3')}</li>
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
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('terms_sellers')}</h2>
                                    <p className="text-slate-500 text-sm">{t('terms_sellers_sub')}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <TermsCard
                                    number="1"
                                    title={t('terms_seller_1_title')}
                                    content={t('terms_seller_1_content')}
                                    color="purple"
                                />
                                <TermsCard
                                    number="2"
                                    title={t('terms_seller_2_title')}
                                    content={t('terms_seller_2_content')}
                                    color="purple"
                                />
                                <TermsCard
                                    number="3"
                                    title={t('terms_seller_3_title')}
                                    content={t('terms_seller_3_content')}
                                    color="purple"
                                />
                                <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl p-4">
                                    <h3 className="font-semibold text-green-800 dark:text-green-400 mb-2 flex items-center gap-2">
                                        <Icon name="Gift" size={16} />
                                        {t('terms_trial_period')}
                                    </h3>
                                    <p className="text-green-700 dark:text-green-300 text-sm">
                                        {t('terms_trial_period_content')}
                                    </p>
                                </div>
                                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-4">
                                    <h3 className="font-semibold text-red-800 dark:text-red-400 mb-2 flex items-center gap-2">
                                        <Icon name="Ban" size={16} />
                                        {t('terms_account_suspension')}
                                    </h3>
                                    <p className="text-red-700 dark:text-red-300 text-sm mb-2">{t('terms_suspension_intro')}</p>
                                    <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                                        <li>• {t('terms_suspension_1')}</li>
                                        <li>• {t('terms_suspension_2')}</li>
                                        <li>• {t('terms_suspension_3')}</li>
                                        <li>• {t('terms_suspension_4')}</li>
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
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('terms_general')}</h2>
                                    <p className="text-slate-500 text-sm">{t('terms_general_sub')}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <TermsCard
                                    number="1"
                                    title={t('terms_general_1_title')}
                                    content={t('terms_general_1_content')}
                                    color="blue"
                                />
                                <TermsCard
                                    number="2"
                                    title={t('terms_general_2_title')}
                                    content={t('terms_general_2_content')}
                                    color="blue"
                                />
                            </div>
                        </section>

                        {/* Agreement */}
                        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-center text-white">
                            <Icon name="CheckCircle" size={40} className="mx-auto mb-4 opacity-80" />
                            <h3 className="text-xl font-bold mb-2">{t('terms_agreement')}</h3>
                            <p className="text-white/90 max-w-md mx-auto">
                                {t('terms_agreement_content')}
                            </p>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors"
                            >
                                <Icon name="HelpCircle" size={16} />
                                {t('have_questions')}
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
