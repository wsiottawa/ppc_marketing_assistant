import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import CompetitorPortfolio from './components/CompetitorPortfolio';
import AdCopyAnalysis from './components/AdCopyAnalysis';
import KeywordOverlapMatrix from './components/KeywordOverlapMatrix';
import BidLandscapeAnalysis from './components/BidLandscapeAnalysis';

const CompetitiveIntelligenceDashboard = () => {
  const [selectedClient, setSelectedClient] = useState('acme-corp');
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock client data
  const clients = [
    { value: 'acme-corp', label: 'Acme Corporation' },
    { value: 'tech-solutions', label: 'Tech Solutions Inc.' },
    { value: 'retail-plus', label: 'Retail Plus' },
    { value: 'startup-hub', label: 'Startup Hub' }
  ];

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const handleClientChange = (clientValue) => {
    setSelectedClient(clientValue);
    setSelectedCompetitor(null); // Reset competitor selection when client changes
  };

  const handleCompetitorSelect = (competitor) => {
    setSelectedCompetitor(competitor);
  };

  const handleRefreshData = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastUpdated(new Date());
    setRefreshing(false);
  };

  const formatLastUpdated = (date) => {
    return date?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        onClientChange={handleClientChange}
        selectedClient={selectedClient}
        clients={clients}
      />
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      {/* Main Content */}
      <main className={`pt-16 layout-transition ${
        isSidebarCollapsed ? 'pl-16' : 'pl-64'
      }`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Competitive Intelligence Dashboard</h1>
                <p className="text-muted-foreground">
                  Strategic analysis and competitor monitoring for {clients?.find(c => c?.value === selectedClient)?.label}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-muted-foreground">
                  Last updated: {formatLastUpdated(lastUpdated)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  loading={refreshing}
                  iconName="RefreshCw"
                  iconPosition="left"
                  iconSize={16}
                  onClick={handleRefreshData}
                >
                  Refresh Data
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={20} className="text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">24</p>
                    <p className="text-sm text-muted-foreground">Competitors Tracked</p>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="TrendingUp" size={20} className="text-success" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">156</p>
                    <p className="text-sm text-muted-foreground">New Opportunities</p>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={20} className="text-warning" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">12</p>
                    <p className="text-sm text-muted-foreground">Recent Changes</p>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Target" size={20} className="text-accent" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">68.5%</p>
                    <p className="text-sm text-muted-foreground">Market Coverage</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Competitor Info */}
            {selectedCompetitor && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon name="Target" size={20} className="text-primary" />
                    <div>
                      <h3 className="font-medium text-foreground">Analyzing: {selectedCompetitor?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedCompetitor?.marketShare}% market share • {selectedCompetitor?.keywords} keywords
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="X"
                    iconSize={16}
                    onClick={() => setSelectedCompetitor(null)}
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Four-Quadrant Dashboard Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Top Left: Competitor Portfolio Overview */}
            <div className="order-1">
              <CompetitorPortfolio 
                selectedClient={selectedClient}
                onCompetitorSelect={handleCompetitorSelect}
              />
            </div>

            {/* Top Right: Ad Copy Analysis */}
            <div className="order-2">
              <AdCopyAnalysis 
                selectedCompetitor={selectedCompetitor}
              />
            </div>

            {/* Bottom Left: Keyword Overlap Matrix */}
            <div className="order-3">
              <KeywordOverlapMatrix 
                selectedCompetitor={selectedCompetitor}
              />
            </div>

            {/* Bottom Right: Bid Landscape Analysis */}
            <div className="order-4">
              <BidLandscapeAnalysis 
                selectedCompetitor={selectedCompetitor}
              />
            </div>
          </div>

          {/* Action Center */}
          <div className="mt-8 bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
                className="justify-start"
              >
                Add New Competitor
              </Button>
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                iconSize={16}
                className="justify-start"
              >
                Export Intelligence Report
              </Button>
              <Button
                variant="outline"
                iconName="Settings"
                iconPosition="left"
                iconSize={16}
                className="justify-start"
              >
                Configure Alerts
              </Button>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; {new Date()?.getFullYear()} PPC Marketing Assistant. All rights reserved.</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default CompetitiveIntelligenceDashboard;