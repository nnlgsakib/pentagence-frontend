import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { RequireAuth, RequireAdmin, RequireGuest } from "@/components/RouteGuards";

// Layouts
import { PublicLayout } from "@/layouts/PublicLayout";
import { AppLayout } from "@/layouts/AppLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AuthLayout } from "@/layouts/AuthLayout";

// Public pages
import LandingPage from "@/pages/LandingPage";
import FeaturesPage from "@/pages/FeaturesPage";
import HowItWorksPage from "@/pages/HowItWorksPage";
import SecurityPage from "@/pages/SecurityPage";
import PricingPage from "@/pages/PricingPage";
import DocsPage from "@/pages/DocsPage";
import ContactPage from "@/pages/ContactPage";

// Auth pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";

// App pages
import AppDashboard from "@/pages/app/AppDashboard";
import SessionsListPage from "@/pages/app/SessionsListPage";
import NewSessionPage from "@/pages/app/NewSessionPage";
import SessionDetailPage from "@/pages/app/SessionDetailPage";
import SessionLogsPage from "@/pages/app/SessionLogsPage";
import SessionArtifactsPage from "@/pages/app/SessionArtifactsPage";
import FindingsListPage from "@/pages/app/FindingsListPage";
import FindingDetailPage from "@/pages/app/FindingDetailPage";
import ReportsListPage from "@/pages/app/ReportsListPage";
import ReportDetailPage from "@/pages/app/ReportDetailPage";
import ProfileSettingsPage from "@/pages/app/ProfileSettingsPage";
import SecuritySettingsPage from "@/pages/app/SecuritySettingsPage";
import ApiKeysPage from "@/pages/app/ApiKeysPage";
import BillingPage from "@/pages/app/BillingPage";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminAuditPage from "@/pages/admin/AdminAuditPage";
import AdminPlaceholderPage from "@/pages/admin/AdminPlaceholderPage";

// Error pages
import ForbiddenPage from "@/pages/errors/ForbiddenPage";
import NotFoundPage from "@/pages/errors/NotFoundPage";
import ServerErrorPage from "@/pages/errors/ServerErrorPage";
import MaintenancePage from "@/pages/errors/MaintenancePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* Auth routes */}
            <Route element={<RequireGuest><AuthLayout /></RequireGuest>}>
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            </Route>

            {/* App routes */}
            <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
              <Route path="/app" element={<AppDashboard />} />
              <Route path="/app/sessions" element={<SessionsListPage />} />
              <Route path="/app/sessions/new" element={<NewSessionPage />} />
              <Route path="/app/sessions/:sessionId" element={<SessionDetailPage />} />
              <Route path="/app/sessions/:sessionId/logs" element={<SessionLogsPage />} />
              <Route path="/app/sessions/:sessionId/artifacts" element={<SessionArtifactsPage />} />
              <Route path="/app/findings" element={<FindingsListPage />} />
              <Route path="/app/findings/:findingId" element={<FindingDetailPage />} />
              <Route path="/app/reports" element={<ReportsListPage />} />
              <Route path="/app/reports/:reportId" element={<ReportDetailPage />} />
              <Route path="/app/settings/profile" element={<ProfileSettingsPage />} />
              <Route path="/app/settings/security" element={<SecuritySettingsPage />} />
              <Route path="/app/settings/api-keys" element={<ApiKeysPage />} />
              <Route path="/app/billing" element={<BillingPage />} />
            </Route>

            {/* Admin routes */}
            <Route element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/users/:userId" element={<AdminPlaceholderPage title="User Detail" />} />
              <Route path="/admin/sessions" element={<AdminPlaceholderPage title="All Sessions" />} />
              <Route path="/admin/sessions/:sessionId" element={<AdminPlaceholderPage title="Session Admin Detail" />} />
              <Route path="/admin/workers" element={<AdminPlaceholderPage title="Workers" />} />
              <Route path="/admin/clusters" element={<AdminPlaceholderPage title="Clusters" />} />
              <Route path="/admin/queue" element={<AdminPlaceholderPage title="Queue" />} />
              <Route path="/admin/system" element={<AdminPlaceholderPage title="System Health" />} />
              <Route path="/admin/audit" element={<AdminAuditPage />} />
              <Route path="/admin/settings" element={<AdminPlaceholderPage title="System Settings" />} />
            </Route>

            {/* Error/system routes */}
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/500" element={<ServerErrorPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
