import React from "react";
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
import Home from './pages/home';
import LandingPage from './pages/landing-page';
import About from './pages/about';
import Blog from './pages/blog';
import BlogPost from './pages/blog/[slug]';
import Contact from './pages/contact';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminBlogs from './pages/admin/Blogs';
import AdminMessages from './pages/admin/Messages';
import AdminSessions from './pages/admin/Sessions';
import AdminNotifications from './pages/admin/Notifications';
import NotificationsPage from './pages/notifications/Index';
import AdminRoute from './components/AdminRoute';
import ResultsDashboard from './pages/results-dashboard';
import ImageUploadAnalysis from './pages/image-upload-analysis';
import InteractiveSkinQuiz from './pages/interactive-skin-quiz';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ProfilePage from './pages/ProfilePage';
// Subscription page removed per new referral-only model
import QuizHistory from './pages/quiz-history';

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
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/quiz-history" element={<QuizHistory />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            
            {/* Admin routes (simple client-side access, server enforces admin token) */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/blogs" element={<AdminRoute><AdminBlogs /></AdminRoute>} />
            <Route path="/admin/messages" element={<AdminRoute><AdminMessages /></AdminRoute>} />
            <Route path="/admin/notifications" element={<AdminRoute><AdminNotifications /></AdminRoute>} />
            <Route path="/admin/sessions" element={<AdminRoute><AdminSessions /></AdminRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
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
