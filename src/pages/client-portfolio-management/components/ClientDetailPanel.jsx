import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';


const ClientDetailPanel = ({ client, loading, aiInsights, loadingAI, onUpdateClient }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editingClient, setEditingClient] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-card">
        <div className="text-center">
          <Icon name="RefreshCw" size={48} className="text-muted-foreground mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-foreground mb-2">Loading Client Details</h3>
          <p className="text-muted-foreground">
            Fetching client information and performance data...
          </p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="h-full flex items-center justify-center bg-card">
        <div className="text-center">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Client Selected</h3>
          <p className="text-muted-foreground mb-4">
            Select a client from the list to view details, or add a new client with Customer ID 853-238-2011
          </p>
        </div>
      </div>
    );
  }

  // Handle special instruction clients
  if (client?.id === 'ENTER_YOUR_ID') {
    return (
      <div className="h-full flex items-center justify-center bg-card">
        <div className="text-center max-w-md">
          <Icon name="Plus" size={64} className="text-primary mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-foreground mb-4">Ready to Add Your Client?</h3>
          <p className="text-muted-foreground mb-6">
            Click the "Add Client" button in the sidebar and enter your Google Ads Customer ID:
          </p>
          <div className="bg-muted p-4 rounded-lg mb-6">
            <code className="text-lg font-mono text-foreground">853-238-2011</code>
            <p className="text-sm text-muted-foreground mt-2">
              This is your MCP account Customer ID
            </p>
          </div>
          <div className="text-left bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">💡 How to find your Customer ID:</h4>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1. Log into Google Ads</li>
              <li>2. Click Settings → Account Settings</li>
              <li>3. Look for "Customer ID" in the account information</li>
              <li>4. Copy the 10-digit number (with or without dashes)</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'campaigns', label: 'Campaigns', icon: 'Target' },
    { id: 'billing', label: 'Billing', icon: 'CreditCard' },
    { id: 'communications', label: 'Communications', icon: 'MessageSquare' },
    { id: 'reports', label: 'Reports', icon: 'FileText' }
  ];

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'paused': return 'text-warning';
      case 'at-risk': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'campaign': return 'bg-primary/20 text-primary';
      case 'billing': return 'bg-success/20 text-success';
      case 'communication': return 'bg-accent/20 text-accent';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'campaign': return 'Target';
      case 'billing': return 'CreditCard';
      case 'communication': return 'MessageSquare';
      default: return 'MessageSquare';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value?.toFixed(1)}%`;
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Spend</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(client?.monthlySpend)}
              </p>
            </div>
            <Icon name="DollarSign" size={24} className="text-muted-foreground" />
          </div>
          <div className="flex items-center mt-2">
            <Icon 
              name={client?.spendTrend > 0 ? "TrendingUp" : "TrendingDown"} 
              size={14} 
              className={client?.spendTrend > 0 ? "text-success" : "text-error"} 
            />
            <span className={`text-xs ml-1 ${client?.spendTrend > 0 ? "text-success" : "text-error"}`}>
              {formatPercentage(client?.spendTrend)}
            </span>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Performance Score</p>
              <p className="text-2xl font-bold text-foreground">{client?.performanceScore}%</p>
            </div>
            <Icon name="BarChart3" size={24} className="text-muted-foreground" />
          </div>
          <div className="flex items-center mt-2">
            <Icon 
              name={client?.performanceTrend > 0 ? "TrendingUp" : "TrendingDown"} 
              size={14} 
              className={client?.performanceTrend > 0 ? "text-success" : "text-error"} 
            />
            <span className={`text-xs ml-1 ${client?.performanceTrend > 0 ? "text-success" : "text-error"}`}>
              {formatPercentage(client?.performanceTrend)}
            </span>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Health Score</p>
              <p className={`text-2xl font-bold ${getHealthScoreColor(client?.healthScore)}`}>
                {client?.healthScore}/100
              </p>
            </div>
            <Icon name="Heart" size={24} className="text-muted-foreground" />
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full ${
                client?.healthScore >= 80 ? 'bg-success' : 
                client?.healthScore >= 60 ? 'bg-warning' : 'bg-error'
              }`}
              style={{ width: `${client?.healthScore}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Campaigns</p>
              <p className="text-2xl font-bold text-foreground">{client?.activeCampaigns}</p>
            </div>
            <Icon name="Target" size={24} className="text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {client?.pausedCampaigns} paused
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {client?.recentActivity?.slice(0, 5)?.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity?.type)}`}>
                <Icon name={getActivityIcon(activity?.type)} size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground">{activity?.description}</p>
                <p className="text-xs text-muted-foreground">{activity?.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Status */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Integration Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Database" size={20} className={client?.integrationStatus?.crm ? 'text-success' : 'text-muted-foreground'} />
              <span className="text-sm font-medium">CRM Integration</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              client?.integrationStatus?.crm ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
            }`}>
              {client?.integrationStatus?.crm ? 'Connected' : 'Not Connected'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="CreditCard" size={20} className={client?.integrationStatus?.billing ? 'text-success' : 'text-muted-foreground'} />
              <span className="text-sm font-medium">Billing</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              client?.integrationStatus?.billing ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
            }`}>
              {client?.integrationStatus?.billing ? 'Connected' : 'Setup Required'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Globe" size={20} className={client?.integrationStatus?.portal ? 'text-success' : 'text-muted-foreground'} />
              <span className="text-sm font-medium">Client Portal</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              client?.integrationStatus?.portal ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
            }`}>
              {client?.integrationStatus?.portal ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCampaignsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Campaign Overview</h3>
        <Button variant="outline" iconName="Plus" iconPosition="left" iconSize={16}>
          New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {client?.campaigns?.map((campaign) => (
          <div key={campaign?.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground">{campaign?.name}</h4>
              <div className={`flex items-center space-x-1 ${getStatusColor(campaign?.status)}`}>
                <Icon name="Circle" size={8} className="fill-current" />
                <span className="text-xs capitalize">{campaign?.status}</span>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Budget:</span>
                <span className="text-foreground">{formatCurrency(campaign?.budget)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Spent:</span>
                <span className="text-foreground">{formatCurrency(campaign?.spent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CTR:</span>
                <span className="text-foreground">{campaign?.ctr}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Conversions:</span>
                <span className="text-foreground">{campaign?.conversions}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Billing Information</h3>
        <Button variant="outline" iconName="Download" iconPosition="left" iconSize={16}>
          Download Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="font-semibold text-foreground mb-4">Current Billing Period</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Period:</span>
              <span className="text-foreground">{client?.billing?.currentPeriod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ad Spend:</span>
              <span className="text-foreground">{formatCurrency(client?.billing?.adSpend)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Management Fee:</span>
              <span className="text-foreground">{formatCurrency(client?.billing?.managementFee)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-foreground">Total:</span>
              <span className="text-foreground">{formatCurrency(client?.billing?.total)}</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="font-semibold text-foreground mb-4">Payment Information</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method:</span>
              <span className="text-foreground">{client?.billing?.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next Payment:</span>
              <span className="text-foreground">{client?.billing?.nextPayment}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className={`${client?.billing?.status === 'current' ? 'text-success' : 'text-error'}`}>
                {client?.billing?.status === 'current' ? 'Current' : 'Overdue'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCommunicationsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Communication History</h3>
        <Button variant="outline" iconName="Plus" iconPosition="left" iconSize={16}>
          New Message
        </Button>
      </div>

      <div className="space-y-4">
        {client?.communications?.map((comm, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Icon name={comm?.type === 'email' ? 'Mail' : 'Phone'} size={16} className="text-primary" />
                <span className="font-medium text-foreground">{comm?.subject}</span>
              </div>
              <span className="text-sm text-muted-foreground">{comm?.date}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{comm?.summary}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">From: {comm?.from}</span>
              {comm?.followUp && (
                <span className="text-xs text-warning">Follow-up required</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Reports & Analytics</h3>
        <Button variant="outline" iconName="Download" iconPosition="left" iconSize={16}>
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {client?.reports?.map((report, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-foreground">{report?.name}</h4>
              <Button variant="ghost" size="sm" iconName="Download" iconSize={14} />
            </div>
            <p className="text-sm text-muted-foreground mb-3">{report?.description}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Generated: {report?.generated}</span>
              <span>Size: {report?.size}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-semibold text-primary">
                {client?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{client?.name}</h1>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-muted-foreground">ID: {client?.id}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client?.status)}`}>
                  <Icon name="Circle" size={8} className="mr-1 fill-current" />
                  {client?.status?.charAt(0)?.toUpperCase() + client?.status?.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* AI Insights Button */}
            {aiInsights && (
              <Button
                variant="outline"
                size="sm"
                iconName="Brain"
                iconPosition="left"
                iconSize={16}
                onClick={() => setShowAIInsights(!showAIInsights)}
                className={showAIInsights ? 'bg-primary/10 border-primary' : ''}
              >
                AI Insights
              </Button>
            )}
            {loadingAI && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="RefreshCw" size={16} className="animate-spin" />
                <span className="text-sm">AI analyzing...</span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              iconName="Edit"
              iconPosition="left"
              iconSize={16}
              onClick={() => setEditingClient(true)}
            >
              Edit Client
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Mail"
              iconPosition="left"
              iconSize={16}
            >
              Contact
            </Button>
          </div>
        </div>

        {/* AI Insights Panel */}
        {showAIInsights && aiInsights && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-blue-900 flex items-center">
                <Icon name="Brain" size={16} className="mr-2" />
                AI Performance Analysis
              </h3>
              <button
                onClick={() => setShowAIInsights(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            <div className="text-sm text-blue-800 whitespace-pre-wrap max-h-64 overflow-y-auto">
              {aiInsights?.analysis}
            </div>
            <div className="mt-3 text-xs text-blue-600">
              Generated by {aiInsights?.model} • {new Date(aiInsights?.timestamp)?.toLocaleString()}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-6">
          {tabs?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'campaigns' && renderCampaignsTab()}
        {activeTab === 'billing' && renderBillingTab()}
        {activeTab === 'communications' && renderCommunicationsTab()}
        {activeTab === 'reports' && renderReportsTab()}
      </div>
    </div>
  );
};

export default ClientDetailPanel;