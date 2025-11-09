import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import aiService from '../../utils/aiService';

const SmartAlertsCenter = ({ onAlertAction }) => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock real-time alerts data with AI insights
  const mockAlerts = [
    {
      id: 'alert-1',
      type: 'performance',
      severity: 'high',
      title: 'Campaign Performance Decline',
      message: 'ACME Search Campaign CTR dropped 25% in last 24 hours. AI suggests bid adjustments and ad copy refresh.',
      timestamp: new Date(Date.now() - 1800000),
      client: 'Acme Corporation',
      campaign: 'Search - Brand Terms',
      isRead: false,
      aiInsight: 'Pattern suggests competitor activity increase. Recommend immediate competitive analysis.',
      suggestedActions: [
        { type: 'adjust_bids', title: 'Increase Bids by 15%', priority: 'high' },
        { type: 'refresh_ads', title: 'Test New Ad Copy', priority: 'medium' }
      ]
    },
    {
      id: 'alert-2',
      type: 'budget',
      severity: 'medium',
      title: 'Budget Pacing Issue',
      message: 'Tech Solutions campaigns are under-spending by 40%. Risk of missing monthly targets.',
      timestamp: new Date(Date.now() - 3600000),
      client: 'Tech Solutions Inc.',
      campaign: 'Multiple Campaigns',
      isRead: false,
      aiInsight: 'Low search volume detected. Consider expanding keyword targeting or dayparting adjustments.',
      suggestedActions: [
        { type: 'expand_keywords', title: 'Add Related Keywords', priority: 'high' },
        { type: 'adjust_dayparting', title: 'Optimize Schedule', priority: 'medium' }
      ]
    },
    {
      id: 'alert-3',
      type: 'quality',
      severity: 'medium',
      title: 'Quality Score Drop',
      message: 'Display campaign quality scores fell below 6.0 threshold. Ad relevance needs improvement.',
      timestamp: new Date(Date.now() - 5400000),
      client: 'Acme Corporation',
      campaign: 'Display - Remarketing',
      isRead: true,
      aiInsight: 'Landing page experience score is primary factor. Consider A/B testing landing pages.',
      suggestedActions: [
        { type: 'test_landing_pages', title: 'A/B Test Landing Pages', priority: 'high' },
        { type: 'optimize_keywords', title: 'Refine Keyword Match Types', priority: 'low' }
      ]
    },
    {
      id: 'alert-4',
      type: 'competitive',
      severity: 'high',
      title: 'Competitor Advantage Detected',
      message: 'New competitor identified with aggressive bidding on your top keywords. Impression share decreased.',
      timestamp: new Date(Date.now() - 7200000),
      client: 'Tech Solutions Inc.',
      campaign: 'Search - Software Terms',
      isRead: false,
      aiInsight: 'Competitor using advanced ad extensions. Recommend implementing similar strategies immediately.',
      suggestedActions: [
        { type: 'add_extensions', title: 'Add Sitelink Extensions', priority: 'high' },
        { type: 'competitive_analysis', title: 'Full Competitive Review', priority: 'medium' }
      ]
    },
    {
      id: 'alert-5',
      type: 'opportunity',
      severity: 'low',
      title: 'Optimization Opportunity',
      message: 'Shopping campaign has high-converting products with low impression share. Budget reallocation suggested.',
      timestamp: new Date(Date.now() - 10800000),
      client: 'Retail Plus',
      campaign: 'Shopping - Seasonal Products',
      isRead: true,
      aiInsight: 'Seasonal trend analysis shows 40% higher conversion rates expected in next 2 weeks.',
      suggestedActions: [
        { type: 'increase_budget', title: 'Increase Budget by 30%', priority: 'medium' },
        { type: 'seasonal_optimization', title: 'Apply Seasonal Strategy', priority: 'low' }
      ]
    }
  ];

  useEffect(() => {
    // Simulate real-time alert loading
    setTimeout(() => {
      setAlerts(mockAlerts);
      setUnreadCount(mockAlerts?.filter(alert => !alert?.isRead)?.length);
      setIsLoading(false);
    }, 800);

    // Simulate real-time updates
    const interval = setInterval(() => {
      // Add occasional new alerts
      if (Math.random() < 0.1) {
        const newAlert = {
          id: `alert-${Date.now()}`,
          type: 'performance',
          severity: 'medium',
          title: 'Real-time Performance Update',
          message: 'Campaign metrics updated with latest data.',
          timestamp: new Date(),
          isRead: false,
          aiInsight: 'Continuous monitoring detected minor fluctuation.',
          suggestedActions: []
        };
        
        setAlerts(prev => [newAlert, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'high':
        return { color: 'text-error', bg: 'bg-error/10', border: 'border-error/20', icon: 'AlertTriangle' };
      case 'medium':
        return { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', icon: 'AlertCircle' };
      case 'low':
        return { color: 'text-info', bg: 'bg-info/10', border: 'border-info/20', icon: 'Info' };
      default:
        return { color: 'text-muted-foreground', bg: 'bg-muted/10', border: 'border-border', icon: 'Bell' };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'performance': return 'TrendingDown';
      case 'budget': return 'DollarSign';
      case 'quality': return 'Star';
      case 'competitive': return 'Users';
      case 'opportunity': return 'TrendingUp';
      default: return 'Bell';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const markAsRead = (alertId) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId 
        ? { ...alert, isRead: true }
        : alert
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleActionClick = async (alert, action) => {
    try {
      // Generate AI insights for the action
      const aiResponse = await aiService?.generateSmartSuggestions({
        alert: alert,
        action: action,
        context: 'alert_action'
      });
      
      onAlertAction?.({
        alert,
        action,
        aiInsights: aiResponse
      });
      
      markAsRead(alert?.id);
    } catch (error) {
      console.error('Error handling alert action:', error);
    }
  };

  const filteredAlerts = alerts?.filter(alert => {
    if (filter === 'unread') return !alert?.isRead;
    if (filter === 'high') return alert?.severity === 'high';
    return true;
  });

  const filterOptions = [
    { value: 'all', label: 'All Alerts', count: alerts?.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'high', label: 'High Priority', count: alerts?.filter(a => a?.severity === 'high')?.length }
  ];

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)]?.map((_, i) => (
            <div key={i} className="flex space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Icon name="Bell" size={18} className="text-primary" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </div>
              )}
            </div>
            <h3 className="font-semibold text-foreground">Smart Alerts</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
            iconSize={14}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg">
          {filterOptions?.map(option => (
            <button
              key={option?.value}
              onClick={() => setFilter(option?.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === option?.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {option?.label}
              {option?.count > 0 && (
                <span className="ml-1.5 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                  {option?.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredAlerts?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={32} className="text-success mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No alerts to show</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredAlerts?.map((alert) => {
              const severityConfig = getSeverityConfig(alert?.severity);
              
              return (
                <div
                  key={alert?.id}
                  className={`p-4 hover:bg-muted/30 transition-colors ${
                    !alert?.isRead ? 'bg-accent/5' : ''
                  }`}
                  onClick={() => markAsRead(alert?.id)}
                >
                  <div className="flex items-start space-x-3">
                    {/* Alert Icon */}
                    <div className={`p-2 rounded-lg ${severityConfig?.bg} ${severityConfig?.border} border flex-shrink-0`}>
                      <Icon 
                        name={getTypeIcon(alert?.type)} 
                        size={16} 
                        className={severityConfig?.color}
                      />
                    </div>

                    {/* Alert Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className={`font-medium ${!alert?.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {alert?.title}
                        </h4>
                        <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(alert?.timestamp)}
                          </span>
                          {!alert?.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {alert?.message}
                      </p>

                      {/* Client & Campaign Info */}
                      <div className="flex items-center space-x-3 text-xs text-muted-foreground mb-3">
                        <span>{alert?.client}</span>
                        <span>•</span>
                        <span>{alert?.campaign}</span>
                      </div>

                      {/* AI Insight */}
                      {alert?.aiInsight && (
                        <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 mb-3">
                          <div className="flex items-start space-x-2">
                            <Icon name="Brain" size={12} className="text-accent mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-accent leading-relaxed">
                              {alert?.aiInsight}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Suggested Actions */}
                      {alert?.suggestedActions && alert?.suggestedActions?.length > 0 && (
                        <div className="space-y-2">
                          {alert?.suggestedActions?.slice(0, 2)?.map((action, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-left h-auto p-2"
                              onClick={(e) => {
                                e?.stopPropagation();
                                handleActionClick(alert, action);
                              }}
                            >
                              <div className="flex items-center space-x-2">
                                <Icon name="Zap" size={12} className="text-primary flex-shrink-0" />
                                <div>
                                  <div className="text-xs font-medium">{action?.title}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {action?.priority} priority
                                  </div>
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Real-time monitoring active</span>
          <span>Powered by AI</span>
        </div>
      </div>
    </div>
  );
};

export default SmartAlertsCenter;