import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import CampaignSidebar from './components/CampaignSidebar';
import FilterToolbar from './components/FilterToolbar';
import QuickStats from './components/QuickStats';
import CampaignGrid from './components/CampaignGrid';
import CampaignDetails from './components/CampaignDetails';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const CampaignManagementDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [campaignSidebarCollapsed, setCampaignSidebarCollapsed] = useState(false);
  const [selectedClient, setSelectedClient] = useState('acme-corp');
  const [selectedCampaign, setSelectedCampaign] = useState('acme-search-1');
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [filters, setFilters] = useState({});
  const [showDetails, setShowDetails] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastSync, setLastSync] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSync(new Date());
      // Simulate connection status changes
      const statuses = ['connected', 'connected', 'connected', 'syncing'];
      const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
      setConnectionStatus(randomStatus);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.ctrlKey || e?.metaKey) {
        switch (e?.key) {
          case 'e':
            e?.preventDefault();
            // Quick edit functionality
            console.log('Quick edit triggered');
            break;
          case 'r':
            e?.preventDefault();
            // Refresh data
            setLastSync(new Date());
            break;
          default:
            break;
        }
      }
      
      // Navigation shortcuts
      if (!e?.ctrlKey && !e?.metaKey && !e?.altKey) {
        switch (e?.key) {
          case 'j':
            // Next row selection
            e?.preventDefault();
            break;
          case 'k':
            // Previous row selection
            e?.preventDefault();
            break;
          case ' ':
            // Toggle selection
            e?.preventDefault();
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        selectedClient={selectedClient}
        onClientChange={handleClientChange}
      />
      {/* Main Layout */}
      <div className="flex pt-16">
        {/* Main Sidebar */}
        <Sidebar 
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Campaign Sidebar */}
        <CampaignSidebar
          isCollapsed={campaignSidebarCollapsed}
          onToggle={() => setCampaignSidebarCollapsed(!campaignSidebarCollapsed)}
          selectedClient={selectedClient}
          onClientSelect={handleClientChange}
          selectedCampaign={selectedCampaign}
          onCampaignSelect={handleCampaignSelect}
        />
        
        {/* Main Content */}
        <main className="flex-1">
          <div className="p-6 space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Campaign Management</h1>
                <p className="text-muted-foreground">
                  Monitor and optimize your PPC campaigns across all clients
                </p>
              </div>
              
              {/* Status & Actions */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Icon 
                    name={getConnectionStatusIcon()} 
                    size={16} 
                    className={`${getConnectionStatusColor()} ${
                      connectionStatus === 'syncing' ? 'animate-spin' : ''
                    }`}
                  />
                  <span className="text-muted-foreground">
                    Last sync: {lastSync?.toLocaleTimeString()}
                  </span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Settings"
                  iconPosition="left"
                  iconSize={16}
                >
                  Settings
                </Button>
                
                <Button
                  variant="default"
                  size="sm"
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={16}
                >
                  New Campaign
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <QuickStats selectedClient={selectedClient} />

            {/* Filter Toolbar */}
            <FilterToolbar
              onFiltersChange={handleFiltersChange}
              selectedCampaigns={selectedCampaigns}
              onBulkAction={handleBulkAction}
            />

            {/* Main Content Grid */}
            <div className="flex space-x-6">
              {/* Campaign Grid */}
              <div className={`transition-all duration-300 ${
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
                <div className="w-96 flex-shrink-0">
                  <CampaignDetails
                    selectedCampaign={selectedCampaign}
                    onClose={() => setShowDetails(false)}
                  />
                </div>
              )}
            </div>

            {/* Keyboard Shortcuts Help */}
            <div className="fixed bottom-4 right-4 z-50">
              <Button
                variant="outline"
                size="sm"
                iconName="Keyboard"
                iconSize={16}
                className="bg-card shadow-elevated"
                title="Keyboard Shortcuts: Ctrl+E (Edit), Ctrl+R (Refresh), J/K (Navigate), Space (Select)"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CampaignManagementDashboard;