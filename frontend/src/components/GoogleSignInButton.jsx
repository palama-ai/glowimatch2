import React, { useEffect, useRef, useState } from 'react';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

// Google Client ID - Replace with your actual Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = import.meta.env?.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

/**
 * Google Sign-In Button Component
 * Uses Google Identity Services for authentication
 */
const GoogleSignInButton = ({ onSuccess, onError, accountType = 'user', buttonText = 'Continue with Google' }) => {
    const buttonRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
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
            initializeGoogle();
        };
        script.onerror = () => {
            console.error('Failed to load Google Sign-In script');
            onError?.({ message: 'فشل تحميل Google Sign-In' });
        };
        document.body.appendChild(script);

        return () => {
            // Cleanup if needed
        };
    }, []);

    const initializeGoogle = () => {
        if (!window.google?.accounts?.id) return;

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
                    width: buttonRef.current.offsetWidth,
                    text: 'continue_with',
                    shape: 'rectangular',
                    logo_alignment: 'left',
                });
            }
        } catch (e) {
            console.error('Google init error:', e);
        }
    };

    const handleCredentialResponse = async (response) => {
        if (!response.credential) {
            onError?.({ message: 'لم يتم استلام بيانات Google' });
            return;
        }

        setLoading(true);

        try {
            // Send credential to our backend
            const res = await fetch(`${API_BASE}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    credential: response.credential,
                    accountType: accountType
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || data.error || 'فشل تسجيل الدخول بـ Google');
            }

            // Store auth data
            if (data.data?.token) {
                localStorage.setItem('gm_auth', JSON.stringify({
                    token: data.data.token,
                    user: data.data.user
                }));
            }

            onSuccess?.(data.data);
        } catch (error) {
            console.error('Google auth error:', error);
            onError?.({ message: error.message || 'فشل تسجيل الدخول بـ Google' });
        } finally {
            setLoading(false);
        }
    };

    // Show loading state if Google script not loaded yet
    if (!scriptLoaded) {
        return (
            <div className="w-full h-[44px] bg-muted/50 rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Google's rendered button */}
            <div ref={buttonRef} className="w-full flex justify-center" />

            {/* Loading overlay */}
            {loading && (
                <div className="mt-2 text-center text-sm text-muted-foreground">
                    جاري تسجيل الدخول...
                </div>
            )}
        </div>
    );
};

export default GoogleSignInButton;
