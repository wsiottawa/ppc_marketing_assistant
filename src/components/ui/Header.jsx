import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Select from './Select';

const Header = ({ onClientChange, selectedClient, clients = [] }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Mock user data
  const currentUser = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@agency.com',
    role: 'PPC Manager',
    avatar: null
  };

  // Navigation items
  const navigationItems = [
    {
      label: 'Clients',
      path: '/client-portfolio-management',
      icon: 'Users',
      description: 'Client portfolio management and oversight'
    },
    {
      label: 'Campaigns',
      path: '/campaign-management-dashboard',
      icon: 'Target',
      description: 'Campaign management and monitoring'
    },
    {
      label: 'Keywords',
      path: '/keyword-research-optimization-center',
      icon: 'Search',
      description: 'Keyword research and optimization'
    },
    {
      label: 'Competitors',
      path: '/competitive-intelligence-dashboard',
      icon: 'TrendingUp',
      description: 'Competitive intelligence and analysis'
    },
    {
      label: 'Analytics',
      path: '/performance-analytics-reporting-hub',
      icon: 'BarChart3',
      description: 'Performance analytics and reporting'
    }
  ];

  // Secondary navigation items for overflow menu
  const secondaryItems = [
    {
      label: 'Alerts',
      path: '/alert-management-notification-center',
      icon: 'Bell',
      description: 'Alert management and notifications'
    }
  ];

  // Mock client options
  const clientOptions = clients?.length > 0 ? clients : [
    { value: 'acme-corp', label: 'Acme Corporation' },
    { value: 'tech-solutions', label: 'Tech Solutions Inc.' },
    { value: 'retail-plus', label: 'Retail Plus' },
    { value: 'startup-hub', label: 'Startup Hub' }
  ];

  // Simulate connection status monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional connection issues
      const statuses = ['connected', 'connected', 'connected', 'syncing', 'error'];
      const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
      setConnectionStatus(randomStatus);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-success';
      case 'syncing': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return 'Wifi';
      case 'syncing': return 'RefreshCw';
      case 'error': return 'WifiOff';
      default: return 'Wifi';
    }
  };

  const handleClientChange = (value) => {
    if (onClientChange) {
      onClientChange(value);
    }
  };

  const handleLogout = () => {
    // Logout logic would go here
    console.log('Logging out...');
  };

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-1000">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <span className="text-lg font-semibold text-foreground">PPC Assistant</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <a
              key={item?.path}
              href={item?.path}
              className={`nav-transition px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${
                isActiveRoute(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title={item?.description}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </a>
          ))}
          
          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              iconName="MoreHorizontal"
              iconSize={16}
              className="text-muted-foreground hover:text-foreground"
            >
              More
            </Button>
            
            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-popover border border-border rounded-md shadow-elevated z-1100">
                {secondaryItems?.map((item) => (
                  <a
                    key={item?.path}
                    href={item?.path}
                    className={`block px-4 py-2 text-sm nav-transition flex items-center space-x-2 ${
                      isActiveRoute(item?.path)
                        ? 'bg-accent text-accent-foreground'
                        : 'text-popover-foreground hover:bg-muted'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon name={item?.icon} size={16} />
                    <span>{item?.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Client Selector */}
          <div className="hidden md:block min-w-48">
            <Select
              options={clientOptions}
              value={selectedClient || clientOptions?.[0]?.value}
              onChange={handleClientChange}
              placeholder="Select client"
              searchable
              className="text-sm"
            />
          </div>

          {/* Connection Status */}
          <div 
            className={`flex items-center space-x-1 ${getStatusColor()}`}
            title={`Connection status: ${connectionStatus}`}
          >
            <Icon 
              name={getStatusIcon()} 
              size={16} 
              className={connectionStatus === 'syncing' ? 'animate-spin' : ''}
            />
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <span className="hidden lg:block text-sm font-medium">{currentUser?.name}</span>
              <Icon name="ChevronDown" size={14} />
            </Button>

            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-64 bg-popover border border-border rounded-md shadow-elevated z-1100">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} color="white" />
                    </div>
                    <div>
                      <div className="font-medium text-popover-foreground">{currentUser?.name}</div>
                      <div className="text-sm text-muted-foreground">{currentUser?.email}</div>
                      <div className="text-xs text-muted-foreground">{currentUser?.role}</div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md nav-transition flex items-center space-x-2">
                    <Icon name="Settings" size={16} />
                    <span>Settings</span>
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-md nav-transition flex items-center space-x-2">
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                  <hr className="my-2 border-border" />
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-error hover:bg-muted rounded-md nav-transition flex items-center space-x-2"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            iconName="Menu"
            iconSize={20}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          />
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <div className="p-4 space-y-2">
            {/* Mobile Client Selector */}
            <div className="mb-4">
              <Select
                options={clientOptions}
                value={selectedClient || clientOptions?.[0]?.value}
                onChange={handleClientChange}
                placeholder="Select client"
                searchable
                className="text-sm"
              />
            </div>

            {/* Mobile Navigation Items */}
            {[...navigationItems, ...secondaryItems]?.map((item) => (
              <a
                key={item?.path}
                href={item?.path}
                className={`block px-4 py-3 rounded-md text-sm font-medium nav-transition flex items-center space-x-3 ${
                  isActiveRoute(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;