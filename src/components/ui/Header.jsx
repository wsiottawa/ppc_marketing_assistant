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
  const [openMegaMenu, setOpenMegaMenu] = useState(null);
  const [alertCount, setAlertCount] = useState(3);

  // Mock user data
  const currentUser = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@agency.com',
    role: 'PPC Manager',
    avatar: null
  };

  // Organized navigation items into logical mega menu categories
  const megaMenuCategories = [
    {
      id: 'management',
      label: 'Management',
      icon: 'FolderOpen',
      items: [
        {
          label: 'Client Portfolio',
          path: '/client-portfolio-management',
          icon: 'Users',
          description: 'Manage client accounts and portfolios'
        }
      ]
    },
    {
      id: 'intelligence',
      label: 'Intelligence',
      icon: 'Brain',
      items: [
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
        }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'BarChart3',
      items: [
        {
          label: 'Performance Hub',
          path: '/performance-analytics-reporting-hub',
          icon: 'BarChart3',
          description: 'Performance analytics and reporting'
        },
        {
          label: 'Google AdWords',
          path: '/google-adwords-integration',
          icon: 'ExternalLink',
          description: 'AdWords integration and insights'
        }
      ]
    },
    {
      id: 'operations',
      label: 'Operations',
      icon: 'Settings',
      items: [
        {
          label: 'Alerts',
          path: '/alert-management-notification-center',
          icon: 'Bell',
          description: 'Alert management and notifications',
          badge: alertCount
        }
      ]
    }
  ];

  // Mock client options
  const clientOptions = clients?.length > 0 ? clients : [
    { value: 'acme-corp', label: 'Acme Corporation' },
    { value: 'tech-solutions', label: 'Tech Solutions Inc.' },
    { value: 'retail-plus', label: 'Retail Plus' },
    { value: 'startup-hub', label: 'Startup Hub' }
  ];

  // Simulate connection status monitoring and alert updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional connection issues
      const statuses = ['connected', 'connected', 'connected', 'syncing', 'error'];
      const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
      setConnectionStatus(randomStatus);
      
      // Simulate alert count changes
      setAlertCount(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event?.target?.closest('.mega-menu-container')) {
        setOpenMegaMenu(null);
      }
      if (!event?.target?.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
      if (!event?.target?.closest('.mobile-menu-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const handleMegaMenuToggle = (categoryId) => {
    setOpenMegaMenu(openMegaMenu === categoryId ? null : categoryId);
  };

  const getAllNavigationItems = () => {
    return megaMenuCategories?.flatMap(category => category?.items);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-[10000] no-horizontal-scroll">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <span className="text-lg font-semibold text-foreground">PPC Assistant</span>
          </div>
        </div>

        {/* Desktop Mega Menu Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center mega-menu-container">
          {megaMenuCategories?.map((category) => (
            <div key={category?.id} className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMegaMenuToggle(category?.id)}
                className={`text-sm font-medium flex items-center space-x-2 nav-transition ${
                  openMegaMenu === category?.id
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={category?.icon} size={16} />
                <span>{category?.label}</span>
                <Icon 
                  name="ChevronDown" 
                  size={14} 
                  className={`transition-transform duration-200 ${
                    openMegaMenu === category?.id ? 'rotate-180' : ''
                  }`}
                />
              </Button>
              
              {/* Mega Menu Dropdown */}
              {openMegaMenu === category?.id && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-popover border border-border rounded-md shadow-elevated z-[10001]">
                  <div className="p-4">
                    <div className="text-sm font-medium text-popover-foreground mb-3 flex items-center space-x-2">
                      <Icon name={category?.icon} size={16} />
                      <span>{category?.label}</span>
                    </div>
                    <div className="space-y-1">
                      {category?.items?.map((item) => (
                        <a
                          key={item?.path}
                          href={item?.path}
                          className={`block px-3 py-3 rounded-md text-sm nav-transition group ${
                            isActiveRoute(item?.path)
                              ? 'bg-accent text-accent-foreground'
                              : 'text-popover-foreground hover:bg-muted'
                          }`}
                          onClick={() => setOpenMegaMenu(null)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="relative flex-shrink-0 mt-0.5">
                              <Icon name={item?.icon} size={16} />
                              {item?.badge && item?.badge > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                                  {item?.badge > 9 ? '9+' : item?.badge}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{item?.label}</div>
                              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {item?.description}
                              </div>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4 flex-shrink-0">
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
          <div className="relative user-menu-container">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <span className="hidden xl:block text-sm font-medium">{currentUser?.name}</span>
              <Icon name="ChevronDown" size={14} />
            </Button>

            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-64 bg-popover border border-border rounded-md shadow-elevated z-[10001]">
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
            className="lg:hidden text-muted-foreground hover:text-foreground mobile-menu-container"
          />
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border mobile-menu-container z-[10001]">
          <div className="p-4 space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
            {/* Mobile Client Selector */}
            <div className="mb-4 md:hidden">
              <Select
                options={clientOptions}
                value={selectedClient || clientOptions?.[0]?.value}
                onChange={handleClientChange}
                placeholder="Select client"
                searchable
                className="text-sm"
              />
            </div>

            {/* Mobile Navigation Items - Organized by Category */}
            {megaMenuCategories?.map((category) => (
              <div key={category?.id} className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1 flex items-center space-x-2">
                  <Icon name={category?.icon} size={12} />
                  <span>{category?.label}</span>
                </div>
                {category?.items?.map((item) => (
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
                    <div className="relative flex-shrink-0">
                      <Icon name={item?.icon} size={18} />
                      {item?.badge && item?.badge > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                          {item?.badge > 9 ? '9+' : item?.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{item?.label}</div>
                      <div className="text-xs opacity-75 truncate">{item?.description}</div>
                    </div>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;