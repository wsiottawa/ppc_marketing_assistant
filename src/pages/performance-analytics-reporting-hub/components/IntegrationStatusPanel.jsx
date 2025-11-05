import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IntegrationStatusPanel = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 'google-ads',
      name: 'Google Ads',
      status: 'connected',
      lastSync: new Date(Date.now() - 300000), // 5 minutes ago
      dataQuality: 98,
      icon: 'Search',
      description: 'Campaign and keyword performance data with AdWords API',
      features: ['Campaign Data', 'Keyword Performance', 'Ad Groups', 'Extensions', 'Audience Insights'],
      accounts: 3,
      campaigns: 45
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      status: 'connected',
      lastSync: new Date(Date.now() - 600000), // 10 minutes ago
      dataQuality: 95,
      icon: 'BarChart3',
      description: 'Website traffic and conversion tracking',
      features: ['Traffic Analysis', 'Conversion Tracking', 'User Behavior'],
      accounts: 2,
      campaigns: 0
    },
    {
      id: 'conversion-tracking',
      name: 'Conversion Tracking',
      status: 'syncing',
      lastSync: new Date(Date.now() - 120000), // 2 minutes ago
      dataQuality: 92,
      icon: 'TrendingUp',
      description: 'E-commerce and lead conversion data',
      features: ['E-commerce', 'Lead Generation', 'Goal Tracking'],
      accounts: 1,
      campaigns: 0
    },
    {
      id: 'crm-integration',
      name: 'CRM Integration',
      status: 'error',
      lastSync: new Date(Date.now() - 3600000), // 1 hour ago
      dataQuality: 0,
      icon: 'Users',
      description: 'Customer relationship management data',
      error: 'Authentication expired',
      features: ['Customer Data', 'Sales Pipeline', 'Lead Scoring'],
      accounts: 0,
      campaigns: 0
    },
    {
      id: 'facebook-ads',
      name: 'Facebook Ads',
      status: 'disconnected',
      lastSync: null,
      dataQuality: 0,
      icon: 'Share2',
      description: 'Social media advertising performance',
      features: ['Facebook Campaigns', 'Instagram Ads', 'Audience Network'],
      accounts: 0,
      campaigns: 0
    }
  ]);

  // Simulate real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIntegrations(prev => prev?.map(integration => {
        if (integration?.status === 'syncing') {
          return {
            ...integration,
            status: Math.random() > 0.3 ? 'connected' : 'syncing',
            lastSync: integration?.status === 'connected' ? new Date() : integration?.lastSync
          };
        }
        return integration;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'syncing': return 'text-warning';
      case 'error': return 'text-error';
      case 'disconnected': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle';
      case 'syncing': return 'RefreshCw';
      case 'error': return 'AlertCircle';
      case 'disconnected': return 'Circle';
      default: return 'Circle';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'connected': return 'bg-success text-success-foreground';
      case 'syncing': return 'bg-warning text-warning-foreground';
      case 'error': return 'bg-error text-error-foreground';
      case 'disconnected': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatLastSync = (date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleConnect = (integrationId) => {
    if (integrationId === 'google-ads') {
      // Navigate to Google AdWords integration page
      window.location.href = '/google-adwords-integration';
      return;
    }
    console.log(`Connecting to ${integrationId}`);
    // Connection logic would go here
  };

  const handleDisconnect = (integrationId) => {
    console.log(`Disconnecting from ${integrationId}`);
    // Disconnection logic would go here
  };

  const handleRefresh = (integrationId) => {
    setIntegrations(prev => prev?.map(integration =>
      integration?.id === integrationId
        ? { ...integration, status: 'syncing', lastSync: new Date() }
        : integration
    ));
  };

  const handleConfigure = (integrationId) => {
    if (integrationId === 'google-ads') {
      // Navigate to Google AdWords integration page
      window.location.href = '/google-adwords-integration';
      return;
    }
    console.log(`Configuring ${integrationId}`);
  };

  const connectedCount = integrations?.filter(i => i?.status === 'connected')?.length;
  const totalCount = integrations?.length;
  const overallHealth = Math.round((connectedCount / totalCount) * 100);
  const totalDataPoints = integrations?.filter(i => i?.status === 'connected')?.reduce((sum, i) => sum + (i?.campaigns || 0), 0) || 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Zap" size={20} className="text-primary" />
            <span>Integration Status</span>
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time data sync and quality monitoring with enhanced AdWords integration
          </p>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-muted-foreground">
              {connectedCount} Connected
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="BarChart3" size={16} className="text-primary" />
            <span className="text-muted-foreground">
              {totalDataPoints} Campaigns
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">{overallHealth}%</div>
            <div className="text-xs text-muted-foreground">System Health</div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {integrations?.map((integration) => (
          <div
            key={integration?.id}
            className="flex items-center justify-between p-4 bg-muted bg-opacity-50 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Icon 
                  name={integration?.icon} 
                  size={24} 
                  className="text-primary" 
                />
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
                  integration?.status === 'syncing' ? 'animate-spin' : ''
                }`}>
                  <Icon
                    name={getStatusIcon(integration?.status)}
                    size={12}
                    className={getStatusColor(integration?.status)}
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-foreground">{integration?.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(integration?.status)}`}>
                    {integration?.status?.charAt(0)?.toUpperCase() + integration?.status?.slice(1)}
                  </span>
                  {integration?.id === 'google-ads' && integration?.status === 'connected' && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Enhanced API
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{integration?.description}</p>
                
                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                  <span>Last sync: {formatLastSync(integration?.lastSync)}</span>
                  {integration?.status !== 'disconnected' && (
                    <span>Quality: {integration?.dataQuality}%</span>
                  )}
                  {integration?.status === 'connected' && integration?.accounts > 0 && (
                    <span>{integration?.accounts} account{integration?.accounts !== 1 ? 's' : ''}</span>
                  )}
                  {integration?.status === 'connected' && integration?.campaigns > 0 && (
                    <span>{integration?.campaigns} campaigns</span>
                  )}
                  {integration?.error && (
                    <span className="text-error">{integration?.error}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {integration?.status === 'connected' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="RefreshCw"
                    iconSize={14}
                    onClick={() => handleRefresh(integration?.id)}
                    title="Refresh data"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Settings"
                    iconSize={14}
                    onClick={() => handleConfigure(integration?.id)}
                    title="Configure integration"
                  />
                </>
              )}
              
              {integration?.status === 'disconnected' || integration?.status === 'error' ? (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Link"
                  iconPosition="left"
                  iconSize={14}
                  onClick={() => handleConnect(integration?.id)}
                >
                  Connect
                </Button>
              ) : integration?.id === 'google-ads' ? (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="ExternalLink"
                  iconPosition="left"
                  iconSize={14}
                  onClick={() => handleConfigure(integration?.id)}
                >
                  View Details
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Settings"
                  iconSize={14}
                  onClick={() => handleDisconnect(integration?.id)}
                  title="Settings"
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {connectedCount} of {totalCount} integrations active • Enhanced Google Ads integration available
          </span>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            iconSize={14}
          >
            Add Integration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationStatusPanel;