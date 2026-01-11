import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './AppIcon';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                                <Icon name="Sparkles" size={20} className="text-white" />
                            </div>
                            <span className="font-bold text-xl">Glowimatch</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            AI-powered skin analysis to help you discover your perfect skincare routine.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3 mt-4">
                            <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-pink-500 flex items-center justify-center transition-colors">
                                <Icon name="Instagram" size={18} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-pink-500 flex items-center justify-center transition-colors">
                                <Icon name="Twitter" size={18} />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-pink-500 flex items-center justify-center transition-colors">
                                <Icon name="Facebook" size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link to="/interactive-skin-quiz" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">
                                    Skin Quiz
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Account</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/login" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link to="/signup" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">
                                    Create Account
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Support</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/contact" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-slate-400 hover:text-pink-400 text-sm transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-slate-500 text-xs sm:text-sm text-center sm:text-left">
                        © {currentYear} Glowimatch. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                        <Link to="/terms" className="text-slate-500 hover:text-pink-400 transition-colors">
                            Terms
                        </Link>
                        <span className="text-slate-700">•</span>
                        <Link to="/contact" className="text-slate-500 hover:text-pink-400 transition-colors">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
