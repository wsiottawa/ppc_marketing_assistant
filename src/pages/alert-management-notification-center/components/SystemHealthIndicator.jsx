import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SystemHealthIndicator = () => {
  const [systemStatus, setSystemStatus] = useState({
    googleAds: { status: 'connected', lastSync: new Date(Date.now() - 300000) },
    googleAnalytics: { status: 'connected', lastSync: new Date(Date.now() - 180000) },
    webSocket: { status: 'connected', lastSync: new Date() },
    database: { status: 'connected', lastSync: new Date(Date.now() - 60000) },
    alertEngine: { status: 'processing', lastSync: new Date(Date.now() - 30000) }
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Simulate real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        webSocket: { 
          ...prev?.webSocket, 
          lastSync: new Date(),
          status: Math.random() > 0.95 ? 'error' : 'connected'
        },
        alertEngine: {
          ...prev?.alertEngine,
          lastSync: new Date(Date.now() - Math.random() * 60000),
          status: Math.random() > 0.9 ? 'warning' : 'processing'
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'processing': return 'text-accent';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      case 'disconnected': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle';
      case 'processing': return 'RefreshCw';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      case 'disconnected': return 'Wifi';
      default: return 'Circle';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'connected': return 'bg-success/10 border-success/20';
      case 'processing': return 'bg-accent/10 border-accent/20';
      case 'warning': return 'bg-warning/10 border-warning/20';
      case 'error': return 'bg-error/10 border-error/20';
      case 'disconnected': return 'bg-muted border-border';
      default: return 'bg-muted border-border';
    }
  };

  const formatLastSync = (timestamp) => {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor(diffMs / 1000);

    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    return timestamp?.toLocaleTimeString();
  };

  const systemItems = [
    { key: 'googleAds', label: 'Google Ads API', description: 'Campaign data synchronization' },
    { key: 'googleAnalytics', label: 'Google Analytics', description: 'Performance metrics' },
    { key: 'webSocket', label: 'Real-time Connection', description: 'Live alert delivery' },
    { key: 'database', label: 'Database', description: 'Data storage and retrieval' },
    { key: 'alertEngine', label: 'Alert Engine', description: 'Rule processing and notifications' }
  ];

  const overallStatus = Object.values(systemStatus)?.every(s => s?.status === 'connected') 
    ? 'healthy' 
    : Object.values(systemStatus)?.some(s => s?.status === 'error') 
    ? 'critical' :'warning';

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              overallStatus === 'healthy' ? 'bg-success animate-pulse' :
              overallStatus === 'critical'? 'bg-error animate-pulse' : 'bg-warning animate-pulse'
            }`}></div>
            <div>
              <h3 className="font-medium text-foreground">System Health</h3>
              <p className="text-sm text-muted-foreground">
                {overallStatus === 'healthy' ? 'All systems operational' :
                 overallStatus === 'critical'? 'System issues detected' : 'Some systems need attention'}
              </p>
            </div>
          </div>
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            className="text-muted-foreground"
          />
        </div>
      </div>
      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border">
          <div className="p-4 space-y-3">
            {systemItems?.map((item) => {
              const status = systemStatus?.[item?.key];
              return (
                <div 
                  key={item?.key}
                  className={`p-3 rounded-md border ${getStatusBg(status?.status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon 
                        name={getStatusIcon(status?.status)} 
                        size={16} 
                        className={`${getStatusColor(status?.status)} ${
                          status?.status === 'processing' ? 'animate-spin' : ''
                        }`}
                      />
                      <div>
                        <h4 className="text-sm font-medium text-foreground">{item?.label}</h4>
                        <p className="text-xs text-muted-foreground">{item?.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getStatusColor(status?.status)}`}>
                        {status?.status?.charAt(0)?.toUpperCase() + status?.status?.slice(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatLastSync(status?.lastSync)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Health Check Actions */}
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Last health check: {new Date()?.toLocaleTimeString()}
              </span>
              <div className="flex space-x-2">
                <button className="text-sm text-accent hover:text-accent/80 nav-transition">
                  Run Diagnostics
                </button>
                <button className="text-sm text-accent hover:text-accent/80 nav-transition">
                  Refresh Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemHealthIndicator;