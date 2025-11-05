import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertFeed = ({ alerts, selectedAlert, onAlertSelect, onBulkAction, selectedAlerts, onAlertToggle }) => {
  const [sortBy, setSortBy] = useState('timestamp');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.target?.tagName === 'INPUT') return;
      
      const currentIndex = alerts?.findIndex(alert => alert?.id === selectedAlert);
      
      switch (e?.key) {
        case 'j':
          e?.preventDefault();
          if (currentIndex < alerts?.length - 1) {
            onAlertSelect(alerts?.[currentIndex + 1]?.id);
          }
          break;
        case 'k':
          e?.preventDefault();
          if (currentIndex > 0) {
            onAlertSelect(alerts?.[currentIndex - 1]?.id);
          }
          break;
        case 'x':
          e?.preventDefault();
          if (selectedAlert) {
            onBulkAction('acknowledge', [selectedAlert]);
          }
          break;
        case 'a':
          e?.preventDefault();
          if (selectedAlert) {
            onBulkAction('assign', [selectedAlert]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedAlert, alerts, onAlertSelect, onBulkAction]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-accent';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-error';
      case 'high': return 'bg-warning';
      case 'medium': return 'bg-accent';
      case 'low': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return 'AlertCircle';
      case 'acknowledged': return 'Eye';
      case 'assigned': return 'User';
      case 'resolved': return 'CheckCircle';
      default: return 'AlertCircle';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now - alertTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return alertTime?.toLocaleDateString();
  };

  const filteredAlerts = alerts?.filter(alert => {
    const matchesSearch = alert?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         alert?.campaign?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || alert?.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const sortedAlerts = [...filteredAlerts]?.sort((a, b) => {
    switch (sortBy) {
      case 'timestamp':
        return new Date(b.timestamp) - new Date(a.timestamp);
      case 'severity':
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder?.[b?.severity] - severityOrder?.[a?.severity];
      case 'campaign':
        return a?.campaign?.localeCompare(b?.campaign);
      default:
        return 0;
    }
  });

  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Alert Feed</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              iconSize={14}
              onClick={() => window.location?.reload()}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Settings"
              iconSize={14}
            >
              Configure
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="px-3 py-1.5 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="timestamp">Sort by Time</option>
              <option value="severity">Sort by Severity</option>
              <option value="campaign">Sort by Campaign</option>
            </select>

            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e?.target?.value)}
              className="px-3 py-1.5 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedAlerts?.length > 0 && (
          <div className="mt-3 p-3 bg-muted rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {selectedAlerts?.length} alert{selectedAlerts?.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBulkAction('acknowledge', selectedAlerts)}
                >
                  Acknowledge
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBulkAction('assign', selectedAlerts)}
                >
                  Assign
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onBulkAction('resolve', selectedAlerts)}
                >
                  Resolve
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Alert List */}
      <div className="flex-1 overflow-y-auto">
        {sortedAlerts?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Icon name="Bell" size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No alerts found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterSeverity !== 'all' ?'Try adjusting your search or filters' :'All systems are running smoothly'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sortedAlerts?.map((alert) => (
              <div
                key={alert?.id}
                className={`p-4 cursor-pointer nav-transition ${
                  selectedAlert === alert?.id 
                    ? 'bg-accent/10 border-l-4 border-l-accent' :'hover:bg-muted/50'
                }`}
                onClick={() => onAlertSelect(alert?.id)}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedAlerts?.includes(alert?.id)}
                    onChange={(e) => {
                      e?.stopPropagation();
                      onAlertToggle(alert?.id);
                    }}
                    className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-ring"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityBg(alert?.severity)} text-white`}>
                        {alert?.severity?.toUpperCase()}
                      </span>
                      <Icon 
                        name={getStatusIcon(alert?.status)} 
                        size={14} 
                        className={getSeverityColor(alert?.severity)}
                      />
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(alert?.timestamp)}
                      </span>
                    </div>

                    <h3 className="text-sm font-medium text-foreground mb-1 line-clamp-2">
                      {alert?.title}
                    </h3>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center space-x-1">
                        <Icon name="Target" size={12} />
                        <span>{alert?.campaign}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="TrendingDown" size={12} />
                        <span>{alert?.metric}</span>
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {alert?.description}
                    </p>

                    {alert?.recommendedAction && (
                      <div className="mt-2 p-2 bg-accent/10 rounded-md">
                        <p className="text-xs font-medium text-accent">
                          Recommended: {alert?.recommendedAction}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Keyboard Shortcuts Help */}
      <div className="p-3 border-t border-border bg-muted/30">
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Shortcuts:</span> j/k navigate, x acknowledge, a assign
        </div>
      </div>
    </div>
  );
};

export default AlertFeed;