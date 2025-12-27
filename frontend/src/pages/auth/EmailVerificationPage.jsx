import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

const EmailVerificationPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const { t } = useI18n();

    const email = searchParams.get('email') || '';

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [countdown, setCountdown] = useState(0);

    const inputRefs = useRef([]);

    // Countdown timer for resend
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Auto-focus first input
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleCodeChange = (index, value) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace - move to previous input
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (/^\d+$/.test(pastedData)) {
            const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
            setCode(newCode);
            // Focus the last filled input or the next empty one
            const lastIndex = Math.min(pastedData.length - 1, 5);
            inputRefs.current[lastIndex]?.focus();
        }
    };

    const handleVerify = async () => {
        const fullCode = code.join('');
        if (fullCode.length !== 6) {
            setError(t('incomplete_code'));
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${API_BASE}/auth/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: fullCode })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || t('verification_failed'));
                setLoading(false);
                return;
            }

            setSuccess(t('verification_success'));

            // Login the user
            if (data.data?.token) {
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));

                // Redirect based on role
                setTimeout(() => {
                    if (data.data.user?.role === 'seller') {
                        navigate('/seller');
                    } else if (data.data.user?.role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }
                }, 1500);
            }
        } catch (err) {
            setError(t('network_error'));
        }

        setLoading(false);
    };

    const handleResend = async () => {
        if (countdown > 0) return;

        setResendLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE}/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(t('resend_success'));
                setCountdown(60); // 60 seconds cooldown
                setCode(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            } else {
                setError(data.error || t('resend_failed'));
            }
        } catch (err) {
            setError(t('network_error'));
        }

        setResendLoading(false);
    };

    // Auto-submit when all digits entered
    useEffect(() => {
        if (code.every(digit => digit !== '') && code.join('').length === 6) {
            handleVerify();
        }
    }, [code]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-gradient-to-br from-accent/20 to-pink-500/20 rounded-full mb-4">
                        <Icon name="Mail" size={40} className="text-accent" />
                    </div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-2">
                        {t('verify_email_title')}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        {t('code_sent_to')}
                    </p>
                    <p className="text-foreground font-medium mt-1">{email}</p>
                </div>

                {/* Card */}
                <div className="bg-card border border-border/50 rounded-2xl shadow-lg overflow-hidden">
                    {/* Header gradient */}
                    <div className="h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600" />

                    <div className="p-8 space-y-6">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                {t('enter_code_desc')}
                            </p>
                        </div>

                        {/* Code Input */}
                        <div className="flex justify-center gap-2" onPaste={handlePaste}>
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-border rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all bg-background"
                                />
                            ))}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg flex items-start gap-3">
                                <Icon name="AlertTriangle" size={18} className="flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3">
                                <Icon name="CheckCircle2" size={18} className="flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{success}</span>
                            </div>
                        )}

                        {/* Verify Button */}
                        <Button
                            onClick={handleVerify}
                            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-lg hover:shadow-pink-500/40 transition-all disabled:opacity-50"
                            disabled={loading || code.some(d => d === '')}
                            iconName={loading ? "Loader2" : "CheckCircle"}
                            iconClassName={loading ? "animate-spin" : ""}
                        >
                            {loading ? t('verifying') : t('verify_btn')}
                        </Button>

                        {/* Resend Section */}
                        <div className="text-center space-y-3">
                            <p className="text-sm text-muted-foreground">
                                {t('didnt_receive_code')}
                            </p>
                            <button
                                onClick={handleResend}
                                disabled={countdown > 0 || resendLoading}
                                className="text-accent hover:underline font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                            >
                                {resendLoading ? (
                                    <>
                                        <Icon name="Loader2" size={16} className="animate-spin" />
                                        {t('sending')}
                                    </>
                                ) : countdown > 0 ? (
                                    <>
                                        <Icon name="Clock" size={16} />
                                        {t('resend_in')} {countdown}s
                                    </>
                                ) : (
                                    <>
                                        <Icon name="RefreshCw" size={16} />
                                        {t('resend_code')}
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Back to Login */}
                        <div className="text-center pt-4 border-t border-border/50">
                            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                ← {t('back_to_login')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationPage;
