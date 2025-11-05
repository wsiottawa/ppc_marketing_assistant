import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import KeywordResearchOptimizationCenter from './pages/keyword-research-optimization-center';
import CompetitiveIntelligenceDashboard from './pages/competitive-intelligence-dashboard';
import AlertManagementNotificationCenter from './pages/alert-management-notification-center';
import ClientPortfolioManagement from './pages/client-portfolio-management';
import PerformanceAnalyticsReportingHub from './pages/performance-analytics-reporting-hub';
import CampaignManagementDashboard from './pages/campaign-management-dashboard';
import GoogleAdWordsIntegration from './pages/google-adwords-integration';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CampaignManagementDashboard />} />
        <Route path="/keyword-research-optimization-center" element={<KeywordResearchOptimizationCenter />} />
        <Route path="/competitive-intelligence-dashboard" element={<CompetitiveIntelligenceDashboard />} />
        <Route path="/alert-management-notification-center" element={<AlertManagementNotificationCenter />} />
        <Route path="/client-portfolio-management" element={<ClientPortfolioManagement />} />
        <Route path="/performance-analytics-reporting-hub" element={<PerformanceAnalyticsReportingHub />} />
        <Route path="/campaign-management-dashboard" element={<CampaignManagementDashboard />} />
        <Route path="/google-adwords-integration" element={<GoogleAdWordsIntegration />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;