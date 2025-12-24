import React, { useEffect, useRef, useState } from 'react';
import AccountTypeModal from './AccountTypeModal';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

// Google Client ID - Replace with your actual Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = import.meta.env?.VITE_GOOGLE_CLIENT_ID || '';

/**
 * Google Sign-In Button Component
 * Uses Google Identity Services for authentication
 */
const GoogleSignInButton = ({ onSuccess, onError, accountType = 'user' }) => {
    const buttonRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [renderError, setRenderError] = useState(false);

    // State for new user flow
    const [showAccountTypeModal, setShowAccountTypeModal] = useState(false);
    const [pendingCredential, setPendingCredential] = useState(null);
    const [pendingUserInfo, setPendingUserInfo] = useState({ email: '', name: '' });

    useEffect(() => {
        // If no client ID, show error
        if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
            console.warn('[GoogleSignIn] No valid VITE_GOOGLE_CLIENT_ID found');
            setRenderError(true);
            return;
        }

        // Check if script already loaded
        if (window.google?.accounts?.id) {
            setScriptLoaded(true);
            initializeGoogle();
            return;
        }

        // Load Google Identity Services script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            setScriptLoaded(true);
            setTimeout(() => initializeGoogle(), 100); // Small delay to ensure DOM is ready
        };
        script.onerror = () => {
            console.error('Failed to load Google Sign-In script');
            setRenderError(true);
            onError?.({ message: 'Failed to load Google Sign-In' });
        };
        document.body.appendChild(script);

        return () => {
            // Cleanup if needed
        };
    }, []);

    useEffect(() => {
        if (scriptLoaded && buttonRef.current) {
            initializeGoogle();
        }
    }, [scriptLoaded]);

    const initializeGoogle = () => {
        if (!window.google?.accounts?.id) {
            console.warn('[GoogleSignIn] Google SDK not loaded yet');
            return;
        }

        try {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: true,
            });

            // Render the button
            if (buttonRef.current) {
                window.google.accounts.id.renderButton(buttonRef.current, {
                    theme: 'outline',
                    size: 'large',
                    width: 300,
                    text: 'continue_with',
                    shape: 'rectangular',
                    logo_alignment: 'left',
                });
            }
        } catch (e) {
            console.error('Google init error:', e);
            setRenderError(true);
        }
    };

    const handleCredentialResponse = async (response) => {
        if (!response.credential) {
            onError?.({ message: 'No Google data received' });
            return;
        }

        setLoading(true);

        try {
            // First, check if user exists (without creating account)
            const checkRes = await fetch(`${API_BASE}/auth/google-check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: response.credential })
            });

            const checkData = await checkRes.json();

            if (checkRes.ok && checkData.exists) {
                // User exists - proceed with login
                await completeGoogleAuth(response.credential, null);
            } else if (checkRes.ok && !checkData.exists) {
                // New user - show account type selection modal
                setPendingCredential(response.credential);
                setPendingUserInfo({
                    email: checkData.email || '',
                    name: checkData.name || ''
                });
                setShowAccountTypeModal(true);
                setLoading(false);
            } else {
                throw new Error(checkData.error || 'Failed to check user');
            }
        } catch (error) {
            console.error('Google auth error:', error);
            // Fallback: try normal auth flow
            await completeGoogleAuth(response.credential, accountType);
        }
    };

    const completeGoogleAuth = async (credential, selectedAccountType) => {
        setLoading(true);
        try {
            console.log('[GoogleSignIn] Starting auth with accountType:', selectedAccountType || accountType);

            const res = await fetch(`${API_BASE}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    credential: credential,
                    accountType: selectedAccountType || accountType
                })
            });

            const data = await res.json();
            console.log('[GoogleSignIn] Response status:', res.status, 'data:', data);

            if (!res.ok) {
                const errorMsg = data.message || data.error || data.details || 'Google sign-in failed';
                console.error('[GoogleSignIn] Auth failed:', errorMsg);
                throw new Error(errorMsg);
            }

            // Store auth data
            if (data.data?.token) {
                console.log('[GoogleSignIn] Storing token and user data');
                localStorage.setItem('gm_auth', JSON.stringify({
                    token: data.data.token,
                    user: data.data.user
                }));

                // Force a brief delay before callback to ensure storage is complete
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            setShowAccountTypeModal(false);

            console.log('[GoogleSignIn] Auth successful, calling onSuccess');

            // Call onSuccess which should trigger navigation
            onSuccess?.(data.data);

            // If we're still on the same page after a moment, force reload to refresh auth state
            setTimeout(() => {
                // Page reload ensures AuthContext reinitializes with new token
                window.location.reload();
            }, 500);

        } catch (error) {
            console.error('[GoogleSignIn] Auth error:', error);
            onError?.({ message: error.message || 'Google sign-in failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleAccountTypeSelect = async (selectedType) => {
        if (!pendingCredential) return;
        await completeGoogleAuth(pendingCredential, selectedType);
    };

    // Show error if no client ID or script failed
    if (renderError || !GOOGLE_CLIENT_ID) {
        return (
            <button
                type="button"
                disabled
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-border/50 rounded-lg bg-muted/30 text-muted-foreground cursor-not-allowed"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continue with Google</span>
                <span className="text-xs text-red-400">(unavailable)</span>
            </button>
        );
    }

    // Show loading state if Google script not loaded yet
    if (!scriptLoaded) {
        return (
            <div className="w-full h-[44px] bg-muted/50 rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>
            <div className="w-full">
                {/* Google's rendered button */}
                <div ref={buttonRef} className="w-full flex justify-center min-h-[44px]" />

                {/* Loading overlay */}
                {loading && (
                    <div className="mt-2 text-center text-sm text-muted-foreground">
                        Signing in...
                    </div>
                )}
            </div>

            {/* Account Type Selection Modal for new users */}
            <AccountTypeModal
                isOpen={showAccountTypeModal}
                onSelect={handleAccountTypeSelect}
                userEmail={pendingUserInfo.email}
                userName={pendingUserInfo.name}
            />
        </>
    );
};

export default GoogleSignInButton;
