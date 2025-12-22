import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
            {/* Header */}
            <header className="bg-card border-b border-border/50 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                            <Icon name="Sparkles" size={20} className="text-white" />
                        </div>
                        <span className="font-bold text-xl text-foreground">Glowimatch</span>
                    </Link>
                    <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <Icon name="ArrowLeft" size={16} />
                        Back to Home
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-card border border-border/50 rounded-2xl shadow-lg overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600" />

                    <div className="p-8 md:p-12">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
                        <p className="text-muted-foreground mb-8">Last updated: December 2024</p>

                        {/* User Terms */}
                        <section className="mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center">
                                    <Icon name="User" size={20} className="text-pink-500" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">For Users</h2>
                            </div>

                            <div className="space-y-4 text-muted-foreground">
                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h3 className="font-semibold text-foreground mb-2">1. Account Registration</h3>
                                    <p>By creating an account, you agree to provide accurate information and keep your credentials secure. You are responsible for all activities under your account.</p>
                                </div>

                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h3 className="font-semibold text-foreground mb-2">2. Skin Analysis Service</h3>
                                    <p>Our AI-powered skin analysis is for informational purposes only and should not replace professional dermatological advice. Results may vary and are based on the images you provide.</p>
                                </div>

                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h3 className="font-semibold text-foreground mb-2">3. Product Recommendations</h3>
                                    <p>Product recommendations are generated based on your skin analysis. We do not guarantee results from any recommended products. Always check ingredients for allergies.</p>
                                </div>

                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h3 className="font-semibold text-foreground mb-2">4. Privacy & Data</h3>
                                    <p>Your uploaded images and personal data are stored securely. We do not share your information with third parties without consent. You can request data deletion anytime.</p>
                                </div>

                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h3 className="font-semibold text-foreground mb-2">5. Acceptable Use</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Do not upload inappropriate or offensive content</li>
                                        <li>Do not attempt to abuse or exploit the service</li>
                                        <li>Do not create multiple accounts to bypass limits</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Seller Terms */}
                        <section className="mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                                    <Icon name="Store" size={20} className="text-purple-500" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">For Sellers</h2>
                            </div>

                            <div className="space-y-4 text-muted-foreground">
                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h3 className="font-semibold text-foreground mb-2">1. Seller Registration</h3>
                                    <p>Sellers must provide accurate business information. We reserve the right to verify and approve seller accounts before activation.</p>
                                </div>

                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h3 className="font-semibold text-foreground mb-2">2. Product Listings</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>All product information must be accurate and truthful</li>
                                        <li>Product images must represent the actual product</li>
                                        <li>Ingredient lists must be complete and accurate</li>
                                        <li>Misleading claims are strictly prohibited</li>
                                    </ul>
                                </div>

                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h3 className="font-semibold text-foreground mb-2">3. Product Quality</h3>
                                    <p>Sellers are responsible for the quality and safety of their products. Products must comply with all applicable regulations and standards.</p>
                                </div>

                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h3 className="font-semibold text-foreground mb-2">4. Fees & Trial Period</h3>
                                    <p>New sellers receive a 3-month free trial. After the trial, applicable fees will be communicated. Glowimatch reserves the right to modify fee structures with notice.</p>
                                </div>

                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h3 className="font-semibold text-foreground mb-2">5. Account Suspension</h3>
                                    <p>We may suspend or terminate seller accounts for:</p>
                                    <ul className="list-disc list-inside space-y-1 mt-2">
                                        <li>Violation of these terms</li>
                                        <li>Fraudulent or misleading practices</li>
                                        <li>Customer complaints and poor reviews</li>
                                        <li>Selling prohibited or unsafe products</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* General Terms */}
                        <section className="mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                                    <Icon name="Scale" size={20} className="text-blue-500" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">General Terms</h2>
                            </div>

                            <div className="space-y-4 text-muted-foreground">
                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h3 className="font-semibold text-foreground mb-2">Limitation of Liability</h3>
                                    <p>Glowimatch is not liable for any damages arising from the use of our service, recommended products, or seller products. We provide the platform "as is" without warranties.</p>
                                </div>

                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h3 className="font-semibold text-foreground mb-2">Modifications</h3>
                                    <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
                                </div>

                                <div className="p-4 bg-muted/30 rounded-xl">
                                    <h3 className="font-semibold text-foreground mb-2">Contact</h3>
                                    <p>For questions about these terms, please contact us through our <Link to="/contact" className="text-accent hover:underline">Contact Page</Link>.</p>
                                </div>
                            </div>
                        </section>

                        {/* Agreement */}
                        <div className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-500/10 dark:to-rose-500/10 rounded-2xl border border-pink-200 dark:border-pink-500/30">
                            <p className="text-center text-foreground">
                                By using Glowimatch, you agree to these Terms of Service.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center py-8 text-sm text-muted-foreground">
                © {new Date().getFullYear()} Glowimatch. All rights reserved.
            </footer>
        </div>
    );
};

export default TermsOfService;
