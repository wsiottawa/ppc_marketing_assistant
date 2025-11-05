import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AlertCategoryTree from './components/AlertCategoryTree';
import AlertFeed from './components/AlertFeed';
import AlertDetails from './components/AlertDetails';
import AlertConfiguration from './components/AlertConfiguration';
import SystemHealthIndicator from './components/SystemHealthIndicator';

const AlertManagementNotificationCenter = () => {
  const [selectedClient, setSelectedClient] = useState('acme-corp');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [showConfiguration, setShowConfiguration] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  // Mock alert categories with hierarchical structure
  const alertCategories = [
    {
      id: 'all',
      name: 'All Alerts',
      icon: 'Bell',
      severity: 'medium',
      children: []
    },
    {
      id: 'performance',
      name: 'Performance Issues',
      icon: 'TrendingDown',
      severity: 'high',
      children: [
        { id: 'ctr-drop', name: 'CTR Drop', icon: 'MousePointer', severity: 'medium' },
        { id: 'conversion-drop', name: 'Conversion Drop', icon: 'Target', severity: 'high' },
        { id: 'quality-score', name: 'Quality Score', icon: 'Star', severity: 'medium' }
      ]
    },
    {
      id: 'budget',
      name: 'Budget & Spend',
      icon: 'DollarSign',
      severity: 'critical',
      children: [
        { id: 'budget-exhaustion', name: 'Budget Exhaustion', icon: 'AlertTriangle', severity: 'critical' },
        { id: 'high-cpc', name: 'High CPC', icon: 'TrendingUp', severity: 'high' },
        { id: 'overspend', name: 'Overspend Risk', icon: 'AlertCircle', severity: 'medium' }
      ]
    },
    {
      id: 'technical',
      name: 'Technical Issues',
      icon: 'Settings',
      severity: 'medium',
      children: [
        { id: 'api-errors', name: 'API Errors', icon: 'Wifi', severity: 'high' },
        { id: 'sync-issues', name: 'Sync Issues', icon: 'RefreshCw', severity: 'medium' },
        { id: 'tracking-problems', name: 'Tracking Problems', icon: 'Eye', severity: 'low' }
      ]
    },
    {
      id: 'competitive',
      name: 'Competitive Intelligence',
      icon: 'Users',
      severity: 'low',
      children: [
        { id: 'competitor-changes', name: 'Competitor Changes', icon: 'TrendingUp', severity: 'low' },
        { id: 'market-shifts', name: 'Market Shifts', icon: 'BarChart3', severity: 'medium' }
      ]
    }
  ];

  // Mock alert counts for categories
  const alertCounts = {
    'all': 47,
    'performance': 18,
    'budget': 12,
    'technical': 8,
    'competitive': 9,
    'ctr-drop': 7,
    'conversion-drop': 6,
    'quality-score': 5,
    'budget-exhaustion': 3,
    'high-cpc': 5,
    'overspend': 4,
    'api-errors': 2,
    'sync-issues': 4,
    'tracking-problems': 2,
    'competitor-changes': 4,
    'market-shifts': 5
  };

  // Mock alerts data
  const mockAlerts = [
    {
      id: 'alert-001',
      title: 'Critical CPC Spike Detected in Holiday Campaign',
      description: 'Cost per click has increased by 45% in the last 2 hours, exceeding the $3.50 threshold. This may indicate increased competition or bidding issues.',
      campaign: 'Holiday Sale 2024 - Electronics',
      metric: 'Cost Per Click',
      currentValue: '$5.12',
      threshold: '$3.50',
      severity: 'critical',
      status: 'new',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      category: 'budget',
      recommendedAction: 'Reduce keyword bids by 20% or pause high-cost keywords until investigation is complete',
      assignedTo: null,
      tags: ['high-priority', 'budget-impact']
    },
    {
      id: 'alert-002',
      title: 'Conversion Rate Drop in Mobile Campaign',
      description: 'Mobile campaign conversion rate has dropped from 3.2% to 1.8% over the past 24 hours. This represents a statistically significant decline.',
      campaign: 'Mobile App Downloads - Q4',
      metric: 'Conversion Rate',
      currentValue: '1.8%',
      threshold: '2.5%',
      severity: 'high',
      status: 'acknowledged',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      category: 'performance',
      recommendedAction: 'Review mobile landing page performance and check for technical issues',
      assignedTo: 'sarah-johnson',
      tags: ['mobile', 'conversion-optimization']
    },
    {
      id: 'alert-003',
      title: 'Budget Exhaustion Warning - Search Campaign',
      description: 'Daily budget for search campaign is 87% spent with 6 hours remaining in the day. Current pace suggests budget will be exhausted by 4 PM.',
      campaign: 'Brand Search - Core Keywords',
      metric: 'Daily Spend',
      currentValue: '$435.60',
      threshold: '$500.00',
      severity: 'medium',
      status: 'new',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      category: 'budget',
      recommendedAction: 'Consider increasing daily budget by 25% or adjust bid strategies to extend reach',
      assignedTo: null,
      tags: ['budget-management', 'search-campaigns']
    },
    {
      id: 'alert-004',
      title: 'Quality Score Decline for High-Volume Keywords',
      description: 'Average quality score for top 10 keywords has decreased from 8.2 to 6.4 over the past week, affecting ad rank and costs.',
      campaign: 'Display Network - Remarketing',
      metric: 'Quality Score',
      currentValue: '6.4',
      threshold: '7.0',
      severity: 'medium',
      status: 'assigned',
      timestamp: new Date(Date.now() - 5400000), // 1.5 hours ago
      category: 'performance',
      recommendedAction: 'Review ad copy relevance and landing page experience for affected keywords',
      assignedTo: 'mike-chen',
      tags: ['quality-score', 'keyword-optimization']
    },
    {
      id: 'alert-005',
      title: 'API Sync Error - Google Ads Connection',
      description: 'Failed to sync campaign data from Google Ads API. Last successful sync was 45 minutes ago. Error code: RATE_LIMIT_EXCEEDED.',
      campaign: 'System Integration',
      metric: 'API Status',
      currentValue: 'Error',
      threshold: 'Connected',
      severity: 'high',
      status: 'new',
      timestamp: new Date(Date.now() - 2700000), // 45 minutes ago
      category: 'technical',
      recommendedAction: 'Check API quota usage and implement exponential backoff retry mechanism',
      assignedTo: null,
      tags: ['api-integration', 'system-health']
    },
    {
      id: 'alert-006',
      title: 'Competitor Bid Increase Detected',
      description: 'Competitor "TechRival Inc." has increased bids on 15 shared keywords by an average of 30%, affecting our impression share.',
      campaign: 'Competitive Analysis',
      metric: 'Impression Share',
      currentValue: '68%',
      threshold: '75%',
      severity: 'low',
      status: 'new',
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      category: 'competitive',
      recommendedAction: 'Analyze competitor strategy and consider bid adjustments for high-value keywords',
      assignedTo: null,
      tags: ['competitive-intelligence', 'bid-management']
    }
  ];

  // Browser notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Simulate real-time alert updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new alerts or status changes
      if (Math.random() > 0.95) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('New PPC Alert', {
            body: 'High CPC detected in campaign',
            icon: '/favicon.ico'
          });
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedAlert(null);
    setSelectedAlerts([]);
  };

  const handleAlertSelect = (alertId) => {
    setSelectedAlert(alertId);
  };

  const handleAlertToggle = (alertId) => {
    setSelectedAlerts(prev => 
      prev?.includes(alertId) 
        ? prev?.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const handleBulkAction = (action, alertIds, options = {}) => {
    console.log(`Bulk action: ${action}`, alertIds, options);
    
    // Simulate action processing
    switch (action) {
      case 'acknowledge': console.log('Acknowledging alerts:', alertIds);
        break;
      case 'assign': console.log('Assigning alerts:', alertIds, 'to:', options?.assignee);
        break;
      case 'resolve': console.log('Resolving alerts:', alertIds);
        break;
      case 'escalate': console.log('Escalating alerts:', alertIds);
        break;
      case 'snooze': console.log('Snoozing alerts:', alertIds);
        break;
      default:
        console.log('Unknown action:', action);
    }
    
    // Clear selections after action
    setSelectedAlerts([]);
  };

  const handleAlertAction = (action, alertId, options = {}) => {
    handleBulkAction(action, [alertId], options);
  };

  const filteredAlerts = selectedCategory === 'all' 
    ? mockAlerts 
    : mockAlerts?.filter(alert => alert?.category === selectedCategory);

  const selectedAlertData = mockAlerts?.find(alert => alert?.id === selectedAlert);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        selectedClient={selectedClient}
        onClientChange={setSelectedClient}
      />
      
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className={`pt-16 layout-transition ${
        isSidebarCollapsed ? 'pl-16' : 'pl-64'
      }`}>
        <div className="h-screen flex flex-col">
          {/* Page Header */}
          <div className="p-6 border-b border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Alert Management & Notification Center</h1>
                <p className="text-muted-foreground mt-1">
                  Monitor campaign performance and respond to critical issues in real-time
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="Settings"
                  iconPosition="left"
                  iconSize={16}
                  onClick={() => setShowConfiguration(true)}
                >
                  Configure Alerts
                </Button>
                <Button
                  variant="outline"
                  iconName="Bell"
                  iconPosition="left"
                  iconSize={16}
                  onClick={() => setShowNotificationSettings(true)}
                >
                  Notifications
                </Button>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={16}
                >
                  Create Rule
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-background p-4 rounded-lg border border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={20} className="text-error" />
                  <div>
                    <div className="text-2xl font-semibold text-foreground">12</div>
                    <div className="text-sm text-muted-foreground">Critical Alerts</div>
                  </div>
                </div>
              </div>
              <div className="bg-background p-4 rounded-lg border border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={20} className="text-warning" />
                  <div>
                    <div className="text-2xl font-semibold text-foreground">23</div>
                    <div className="text-sm text-muted-foreground">Pending Review</div>
                  </div>
                </div>
              </div>
              <div className="bg-background p-4 rounded-lg border border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={20} className="text-success" />
                  <div>
                    <div className="text-2xl font-semibold text-foreground">156</div>
                    <div className="text-sm text-muted-foreground">Resolved Today</div>
                  </div>
                </div>
              </div>
              <div className="bg-background p-4 rounded-lg border border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="TrendingUp" size={20} className="text-accent" />
                  <div>
                    <div className="text-2xl font-semibold text-foreground">2.3m</div>
                    <div className="text-sm text-muted-foreground">Avg Response Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Three-Panel Layout */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Alert Categories (25%) */}
            <div className="w-1/4 min-w-80">
              <AlertCategoryTree
                categories={alertCategories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                alertCounts={alertCounts}
              />
            </div>

            {/* Center Panel - Alert Feed (50%) */}
            <div className="w-1/2">
              <AlertFeed
                alerts={filteredAlerts}
                selectedAlert={selectedAlert}
                onAlertSelect={handleAlertSelect}
                onBulkAction={handleBulkAction}
                selectedAlerts={selectedAlerts}
                onAlertToggle={handleAlertToggle}
              />
            </div>

            {/* Right Panel - Alert Details (25%) */}
            <div className="w-1/4 min-w-80 flex flex-col">
              <AlertDetails
                alert={selectedAlertData}
                onAction={handleAlertAction}
                onClose={() => setSelectedAlert(null)}
              />
              
              {/* System Health Indicator */}
              <div className="p-4 border-t border-border">
                <SystemHealthIndicator />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Alert Configuration Modal */}
      <AlertConfiguration
        isOpen={showConfiguration}
        onClose={() => setShowConfiguration(false)}
        onSave={(rule) => {
          console.log('New rule created:', rule);
          setShowConfiguration(false);
        }}
      />
    </div>
  );
};

export default AlertManagementNotificationCenter;