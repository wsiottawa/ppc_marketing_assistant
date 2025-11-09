import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import FilterToolbar from './components/FilterToolbar';
import QuickStats from './components/QuickStats';
import CampaignGrid from './components/CampaignGrid';
import CampaignDetails from './components/CampaignDetails';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// New AI-enhanced components
import AIInsightsPanel from '../../components/ai/AIInsightsPanel';
import SmartAlertsCenter from '../../components/alerts/SmartAlertsCenter';
import RealTimeMetrics from '../../components/analytics/RealTimeMetrics';
import aiService from '../../utils/aiService';

const CampaignManagementDashboard = () => {
  const [selectedClient, setSelectedClient] = useState('acme-corp');
  const [selectedCampaign, setSelectedCampaign] = useState('acme-search-1');
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [filters, setFilters] = useState({});
  const [showDetails, setShowDetails] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastSync, setLastSync] = useState(new Date());
  
  // New AI-enhanced state
  const [activeView, setActiveView] = useState('overview'); // 'overview', 'insights', 'alerts', 'realtime'
  const [dashboardData, setDashboardData] = useState({});
  const [aiInsightsEnabled, setAiInsightsEnabled] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSync(new Date());
      // Simulate connection status changes
      const statuses = ['connected', 'connected', 'connected', 'syncing'];
      const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
      setConnectionStatus(randomStatus);
      
      // Update dashboard data for AI insights
      updateDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Update dashboard data for AI analysis
  const updateDashboardData = () => {
    const mockDashboardData = {
      totalClients: 3,
      totalSpend: 122451.25,
      activeCampaigns: 15,
      avgPerformance: 78.5,
      riskClients: 1,
      totalConversions: 549,
      avgCtr: 1.24,
      avgRoi: 289.7,
      recentAlerts: 4,
      opportunitiesCount: 7,
      timestamp: new Date()?.toISOString()
    };
    
    setDashboardData(mockDashboardData);
  };

  // Initial data load
  useEffect(() => {
    updateDashboardData();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.ctrlKey || e?.metaKey) {
        switch (e?.key) {
          case 'i':
            e?.preventDefault();
            setActiveView('insights');
            break;
          case 'a':
            e?.preventDefault();
            setActiveView('alerts');
            break;
          case 'r':
            e?.preventDefault();
            setActiveView('realtime');
            break;
          case 'o':
            e?.preventDefault();
            setActiveView('overview');
            break;
          case 'e':
            e?.preventDefault();
            console.log('Quick edit triggered');
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleClientChange = (clientId) => {
    setSelectedClient(clientId);
    setSelectedCampaign(null);
  };

  const handleCampaignSelect = (campaignId) => {
    setSelectedCampaign(campaignId);
    setShowDetails(true);
  };

  const handleBulkSelect = (campaignIds) => {
    setSelectedCampaigns(campaignIds);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleBulkAction = (action, campaigns) => {
    console.log(`Bulk action: ${action} on campaigns:`, campaigns);
    
    switch (action) {
      case 'pause':
        alert(`Pausing ${campaigns?.length} campaigns`);
        break;
      case 'resume':
        alert(`Resuming ${campaigns?.length} campaigns`);
        break;
      case 'adjust-budget':
        alert(`Adjusting budget for ${campaigns?.length} campaigns`);
        break;
      case 'change-bid':
        alert(`Changing bid strategy for ${campaigns?.length} campaigns`);
        break;
      case 'export':
        alert(`Exporting data for ${campaigns?.length} campaigns`);
        break;
      default:
        break;
    }
  };

  // Handle AI insight actions
  const handleInsightAction = async (action, insights) => {
    try {
      console.log('AI Insight Action:', action, insights);
      
      // Generate follow-up suggestions based on the action
      const followUpSuggestions = await aiService?.generateSmartSuggestions({
        action: action,
        context: 'dashboard_action',
        previousInsights: insights
      });
      
      // Show success message or navigate to appropriate view
      alert(`Action "${action?.title}" initiated. AI suggestions: ${followUpSuggestions?.suggestions?.substring(0, 100)}...`);
    } catch (error) {
      console.error('Error handling insight action:', error);
    }
  };

  // Handle alert actions
  const handleAlertAction = (alertData) => {
    console.log('Alert Action:', alertData);
    
    // Process alert action with AI insights
    if (alertData?.aiInsights) {
      alert(`Alert processed with AI guidance: ${alertData?.aiInsights?.suggestions?.substring(0, 100)}...`);
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-success';
      case 'syncing': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return 'Wifi';
      case 'syncing': return 'RefreshCw';
      case 'error': return 'WifiOff';
      default: return 'Wifi';
    }
  };

  // View navigation buttons
  const viewButtons = [
    { key: 'overview', label: 'Overview', icon: 'BarChart3', shortcut: '⌘O' },
    { key: 'insights', label: 'AI Insights', icon: 'Brain', shortcut: '⌘I' },
    { key: 'alerts', label: 'Smart Alerts', icon: 'Bell', shortcut: '⌘A' },
    { key: 'realtime', label: 'Real-time', icon: 'Activity', shortcut: '⌘R' }
  ];

  return (
    <div className="min-h-screen bg-background no-horizontal-scroll">
      {/* Header with integrated mega menu navigation */}
      <Header 
        selectedClient={selectedClient}
        onClientChange={handleClientChange}
      />
      
      {/* Main Layout Container - Full width without sidebar */}
      <div className="main-content no-horizontal-scroll">        
        {/* Main Content Area - Full width */}
        <main className="pt-16 no-horizontal-scroll">
          <div className="p-4 space-y-4 max-w-full overflow-hidden">
            {/* Enhanced Page Header with AI Status */}
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-3">
                  <h1 className="text-xl font-bold text-foreground truncate">PPC Marketing Assistant</h1>
                  {aiInsightsEnabled && (
                    <div className="flex items-center space-x-1 text-sm text-success">
                      <Icon name="Brain" size={14} />
                      <span>AI Active</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  AI-powered campaign optimization and real-time insights
                </p>
              </div>
              
              {/* Enhanced Status & Actions */}
              <div className="flex items-center space-x-3 flex-shrink-0">
                <div className="flex items-center space-x-2 text-sm">
                  <Icon 
                    name={getConnectionStatusIcon()} 
                    size={14} 
                    className={`${getConnectionStatusColor()} ${
                      connectionStatus === 'syncing' ? 'animate-spin' : ''
                    }`}
                  />
                  <span className="text-muted-foreground hidden md:inline">
                    {lastSync?.toLocaleTimeString()}
                  </span>
                </div>
                
                {/* View Navigation */}
                <div className="hidden lg:flex items-center space-x-1 bg-muted/50 p-1 rounded-lg">
                  {viewButtons?.map(button => (
                    <button
                      key={button?.key}
                      onClick={() => setActiveView(button?.key)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                        activeView === button?.key
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      title={`${button?.label} (${button?.shortcut})`}
                    >
                      <Icon name={button?.icon} size={14} />
                      <span className="hidden xl:inline">{button?.label}</span>
                    </button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={14}
                  className="flex-shrink-0"
                >
                  <span className="hidden sm:inline">New Campaign</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </div>
            </div>

            {/* Content based on active view */}
            {activeView === 'overview' && (
              <>
                {/* Quick Stats */}
                <QuickStats selectedClient={selectedClient} />

                {/* Filter Toolbar */}
                <FilterToolbar
                  onFiltersChange={handleFiltersChange}
                  selectedCampaigns={selectedCampaigns}
                  onBulkAction={handleBulkAction}
                />

                {/* Main Content Grid */}
                <div className="flex space-x-4 overflow-hidden">
                  {/* Campaign Grid */}
                  <div className={`transition-all duration-300 min-w-0 ${
                    showDetails ? 'flex-1' : 'w-full'
                  }`}>
                    <CampaignGrid
                      selectedCampaigns={selectedCampaigns}
                      onCampaignSelect={handleCampaignSelect}
                      onBulkSelect={handleBulkSelect}
                      filters={filters}
                    />
                  </div>

                  {/* Campaign Details Panel */}
                  {showDetails && (
                    <div className="w-80 flex-shrink-0">
                      <CampaignDetails
                        selectedCampaign={selectedCampaign}
                        onClose={() => setShowDetails(false)}
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {activeView === 'insights' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <AIInsightsPanel
                    data={dashboardData}
                    type="dashboard"
                    clientId={selectedClient}
                    onInsightAction={handleInsightAction}
                  />
                </div>
                <div className="space-y-4">
                  <QuickStats selectedClient={selectedClient} />
                </div>
              </div>
            )}

            {activeView === 'alerts' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <SmartAlertsCenter
                    onAlertAction={handleAlertAction}
                  />
                </div>
                <div className="space-y-4">
                  <QuickStats selectedClient={selectedClient} />
                  {aiInsightsEnabled && (
                    <AIInsightsPanel
                      data={dashboardData}
                      type="alerts"
                      clientId={selectedClient}
                      onInsightAction={handleInsightAction}
                    />
                  )}
                </div>
              </div>
            )}

            {activeView === 'realtime' && (
              <div className="space-y-6">
                <RealTimeMetrics clientId={selectedClient} />
                
                {/* Real-time grid layout */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <SmartAlertsCenter onAlertAction={handleAlertAction} />
                  {aiInsightsEnabled && (
                    <AIInsightsPanel
                      data={dashboardData}
                      type="realtime"
                      clientId={selectedClient}
                      onInsightAction={handleInsightAction}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CampaignManagementDashboard;