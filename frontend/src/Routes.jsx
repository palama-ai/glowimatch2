import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import { useLocation, useNavigate } from 'react-router-dom';
import { ModalProvider } from './contexts/ModalContext';
import AnalysisModal from './components/AnalysisModal';
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundray";
import { AuthProvider } from "./contexts/AuthContext";
import { I18nProvider } from './contexts/I18nContext';
import { ThemeProvider } from './contexts/ThemeContext';
import NotFound from "./pages/NotFound";

// ⚡ PERFORMANCE: Static imports for frequently used pages
import Home from './pages/home';
import LandingPage from './pages/landing-page';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Email verification page
const EmailVerificationPage = lazy(() => import('./pages/auth/EmailVerificationPage'));

// ⚡ PERFORMANCE: Lazy load heavy/rarely used pages (Code Splitting)
const About = lazy(() => import('./pages/about'));
const Blog = lazy(() => import('./pages/blog'));
const BlogPost = lazy(() => import('./pages/blog/[slug]'));
const Contact = lazy(() => import('./pages/contact'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const QuizHistory = lazy(() => import('./pages/quiz-history'));
const ResultsDashboard = lazy(() => import('./pages/results-dashboard'));
const ImageUploadAnalysis = lazy(() => import('./pages/image-upload-analysis'));
const InteractiveSkinQuiz = lazy(() => import('./pages/interactive-skin-quiz'));
const NotificationsPage = lazy(() => import('./pages/notifications/Index'));

// ⚡ PERFORMANCE: Lazy load admin pages (only admins need these)
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminBlogs = lazy(() => import('./pages/admin/Blogs'));
const AdminMessages = lazy(() => import('./pages/admin/Messages'));
const AdminSessions = lazy(() => import('./pages/admin/Sessions'));
const AdminNotifications = lazy(() => import('./pages/admin/Notifications'));
const AdminSafety = lazy(() => import('./pages/admin/Safety'));
const AdminRoute = lazy(() => import('./components/AdminRoute'));

// ⚡ PERFORMANCE: Lazy load seller pages (only sellers need these)
const SellerDashboard = lazy(() => import('./pages/seller/Dashboard'));
const SellerProducts = lazy(() => import('./pages/seller/Products'));
const SellerViolations = lazy(() => import('./pages/seller/Violations'));
const SellerNews = lazy(() => import('./pages/seller/News'));
const SellerProfile = lazy(() => import('./pages/seller/Profile'));

// Legal pages
const TermsOfService = lazy(() => import('./pages/legal/TermsOfService'));

// Loading component - iOS-style spinner
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="relative w-10 h-10">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-3 bg-gray-400 rounded-full left-1/2 top-0 origin-bottom"
          style={{
            transform: `translateX(-50%) rotate(${i * 30}deg) translateY(8px)`,
            opacity: 1 - (i * 0.07),
            animation: `iosSpinner 1s linear infinite`,
            animationDelay: `${-i * (1 / 12)}s`
          }}
        />
      ))}
      <style>{`
        @keyframes iosSpinner {
          0% { opacity: 1; }
          100% { opacity: 0.2; }
        }
      `}</style>
    </div>
  </div>
);

const Routes = () => {
  const ReferrerHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
      try {
        const params = new URLSearchParams(location.search);
        const r = params.get('ref');
        if (r) {
          // persist for signup and prefill
          localStorage.setItem('referral_code', r);
          // if not already on signup page, redirect there
          if (location.pathname !== '/signup') {
            navigate('/signup', { replace: true });
          }
        }
      } catch (e) {
        // ignore
      }
    }, [location.search, location.pathname, navigate]);

    return null;
  };

  return (
    <BrowserRouter>
      <ModalProvider>
        <I18nProvider>
          <ThemeProvider>
            <AuthProvider>
              <ErrorBoundary>
                <ReferrerHandler />
                <ScrollToTop />
                <Suspense fallback={<PageLoader />}>
                  <RouterRoutes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/landing-page" element={<LandingPage />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/interactive-skin-quiz" element={<InteractiveSkinQuiz />} />
                    <Route path="/image-upload-analysis" element={<ImageUploadAnalysis />} />
                    <Route path="/results-dashboard" element={<ResultsDashboard />} />
                    {/* /subscription removed - referrals replace subscription attempts */}

                    {/* Auth routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/verify-email" element={<Suspense fallback={<PageLoader />}><EmailVerificationPage /></Suspense>} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/quiz-history" element={<QuizHistory />} />
                    <Route path="/notifications" element={<NotificationsPage />} />

                    {/* Admin routes (simple client-side access, server enforces admin token) */}
                    <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminDashboard /></AdminRoute></Suspense>} />
                    <Route path="/admin/users" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminUsers /></AdminRoute></Suspense>} />
                    <Route path="/admin/products" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminProducts /></AdminRoute></Suspense>} />
                    <Route path="/admin/blogs" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminBlogs /></AdminRoute></Suspense>} />
                    <Route path="/admin/messages" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminMessages /></AdminRoute></Suspense>} />
                    <Route path="/admin/notifications" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminNotifications /></AdminRoute></Suspense>} />
                    <Route path="/admin/sessions" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminSessions /></AdminRoute></Suspense>} />
                    <Route path="/admin/safety" element={<Suspense fallback={<PageLoader />}><AdminRoute><AdminSafety /></AdminRoute></Suspense>} />

                    {/* Seller routes */}
                    <Route path="/seller" element={<SellerDashboard />} />
                    <Route path="/seller/products" element={<SellerProducts />} />
                    <Route path="/seller/violations" element={<SellerViolations />} />
                    <Route path="/seller/news" element={<SellerNews />} />
                    <Route path="/seller/profile" element={<SellerProfile />} />

                    {/* Legal pages */}
                    <Route path="/terms" element={<TermsOfService />} />

                    <Route path="*" element={<NotFound />} />
                  </RouterRoutes>
                </Suspense>
                <AnalysisModal />
              </ErrorBoundary>
            </AuthProvider>
          </ThemeProvider>
        </I18nProvider>
      </ModalProvider>
    </BrowserRouter>
  );
};

export default Routes;
