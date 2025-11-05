import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const [alertCount, setAlertCount] = useState(3);

  // Navigation items with detailed structure
  const navigationItems = [
    {
      label: 'Client Portfolio',
      path: '/client-portfolio-management',
      icon: 'Users',
      description: 'Manage client relationships and portfolios',
      category: 'management'
    },
    {
      label: 'Campaign Dashboard',
      path: '/campaign-management-dashboard',
      icon: 'Target',
      description: 'Monitor and manage active campaigns',
      category: 'operations'
    },
    {
      label: 'Keyword Center',
      path: '/keyword-research-optimization-center',
      icon: 'Search',
      description: 'Research and optimize keywords',
      category: 'intelligence'
    },
    {
      label: 'Competitive Intel',
      path: '/competitive-intelligence-dashboard',
      icon: 'TrendingUp',
      description: 'Analyze competitor strategies',
      category: 'intelligence'
    },
    {
      label: 'Analytics Hub',
      path: '/performance-analytics-reporting-hub',
      icon: 'BarChart3',
      description: 'Performance insights and reporting',
      category: 'intelligence'
    },
    {
      label: 'Alert Center',
      path: '/alert-management-notification-center',
      icon: 'Bell',
      description: 'Manage alerts and notifications',
      category: 'operations',
      badge: alertCount
    }
  ];

  // Quick actions for contextual toolbar
  const quickActions = [
    { icon: 'Plus', label: 'New Campaign', action: 'create-campaign' },
    { icon: 'Download', label: 'Export Report', action: 'export-report' },
    { icon: 'RefreshCw', label: 'Sync Data', action: 'sync-data' }
  ];

  // Simulate real-time alert updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAlertCount(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  const handleQuickAction = (action) => {
    console.log(`Quick action: ${action}`);
    // Implement specific action logic here
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'management': return 'text-primary';
      case 'operations': return 'text-accent';
      case 'intelligence': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <aside className={`fixed left-0 top-16 bottom-0 bg-card border-r border-border z-1000 layout-transition ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <h2 className="text-sm font-semibold text-foreground">Navigation</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
            iconSize={16}
            className="text-muted-foreground hover:text-foreground"
          />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems?.map((item) => (
            <div key={item?.path} className="relative">
              <a
                href={item?.path}
                className={`nav-transition flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium group ${
                  isActiveRoute(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title={isCollapsed ? item?.label : item?.description}
              >
                <div className="relative">
                  <Icon 
                    name={item?.icon} 
                    size={18} 
                    className={isActiveRoute(item?.path) ? '' : getCategoryColor(item?.category)}
                  />
                  {item?.badge && item?.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                      {item?.badge > 9 ? '9+' : item?.badge}
                    </span>
                  )}
                </div>
                
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <span className="block truncate">{item?.label}</span>
                  </div>
                )}
              </a>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full top-0 ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-elevated opacity-0 group-hover:opacity-100 nav-transition pointer-events-none z-1100 whitespace-nowrap">
                  {item?.label}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {quickActions?.map((action) => (
                <Button
                  key={action?.action}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickAction(action?.action)}
                  iconName={action?.icon}
                  iconPosition="left"
                  iconSize={16}
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                >
                  {action?.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Collapsed Quick Actions */}
        {isCollapsed && (
          <div className="p-2 border-t border-border space-y-2">
            {quickActions?.map((action) => (
              <div key={action?.action} className="relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickAction(action?.action)}
                  iconName={action?.icon}
                  iconSize={16}
                  className="w-full text-muted-foreground hover:text-foreground"
                />
                <div className="absolute left-full top-0 ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-elevated opacity-0 group-hover:opacity-100 nav-transition pointer-events-none z-1100 whitespace-nowrap">
                  {action?.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Status Indicator */}
        <div className="p-4 border-t border-border">
          <div className={`flex items-center space-x-2 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            {!isCollapsed && (
              <span className="text-xs text-muted-foreground">System Online</span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;