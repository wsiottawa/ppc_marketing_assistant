import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
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
  const [menuPosition, setMenuPosition] = useState(null);
  const buttonRefs = useRef({});

  const updateMenuPosition = useCallback((categoryId) => {
    const trigger = buttonRefs?.current?.[categoryId];
    if (!trigger) return;

    const rect = trigger?.getBoundingClientRect();
    const dropdownWidth = 320; // 20rem from w-80
    const offset = 4; // mt-1 equivalent spacing
    const viewportWidth = window.innerWidth || dropdownWidth;
    const maxLeft = viewportWidth - dropdownWidth - 16;
    const calculatedLeft = Math.max(16, Math.min(rect?.left, maxLeft));

    setMenuPosition({
      categoryId,
      top: rect?.bottom + offset,
      left: calculatedLeft,
    });
  }, []);

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
      id: 'campaigns',
      label: 'Campaigns',
      icon: 'Target',
      items: [
        {
          label: 'Campaign Dashboard',
          path: '/campaign-management-dashboard',
          icon: 'BarChart3',
          description: 'Monitor and manage advertising campaigns'
        }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'TrendingUp',
      items: [
        {
          label: 'Performance Hub',
          path: '/performance-analytics-reporting-hub',
          icon: 'PieChart',
          description: 'View comprehensive performance analytics'
        },
        {
          label: 'Competitive Intelligence',
          path: '/competitive-intelligence-dashboard',
          icon: 'Users2',
          description: 'Analyze competitor strategies and performance'
        }
      ]
    },
    {
      id: 'research',
      label: 'Research',
      icon: 'Search',
      items: [
        {
          label: 'Keyword Research',
          path: '/keyword-research-optimization-center',
          icon: 'Hash',
          description: 'Research and optimize keyword strategies'
        }
      ]
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: 'Link',
      items: [
        {
          label: 'Google Ads',
          path: '/google-adwords-integration',
          icon: 'ExternalLink',
          description: 'Connect and manage Google Ads accounts'
        }
      ]
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: 'Bell',
      items: [
        {
          label: 'Alert Center',
          path: '/alert-management-notification-center',
          icon: 'AlertTriangle',
          description: 'Manage notifications and alerts',
          badge: alertCount
        }
      ]
    }
  ];

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
      if (!event?.target?.closest('.mega-menu-container') && !event?.target?.closest('.mega-menu-dropdown')) {
        setOpenMegaMenu(null);
        setMenuPosition(null);
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
    if (openMegaMenu === categoryId) {
      setOpenMegaMenu(null);
      setMenuPosition(null);
    } else {
      updateMenuPosition(categoryId);
      setOpenMegaMenu(categoryId);
    }
  };

  useEffect(() => {
    if (!openMegaMenu) return;

    const handleWindowChange = () => updateMenuPosition(openMegaMenu);

    window.addEventListener('resize', handleWindowChange);
    window.addEventListener('scroll', handleWindowChange, true);

    return () => {
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange, true);
    };
  }, [openMegaMenu, updateMenuPosition]);

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
          {megaMenuCategories?.map((category) => {
            const isMegaMenuOpen = openMegaMenu === category?.id;
            const shouldRenderDropdown =
              isMegaMenuOpen && menuPosition?.categoryId === category?.id && typeof document !== 'undefined';

            return (
              <React.Fragment key={category?.id}>
                <div className="relative">
                  <Button
                    ref={(el) => {
                      if (el) {
                        buttonRefs.current[category?.id] = el;
                      } else {
                        delete buttonRefs?.current?.[category?.id];
                      }
                    }}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMegaMenuToggle(category?.id)}
                    className={`text-sm font-medium flex items-center space-x-2 nav-transition ${
                      isMegaMenuOpen
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
                        isMegaMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>
                </div>
                {shouldRenderDropdown &&
                  createPortal(
                    <div
                      className="mega-menu-dropdown fixed w-80 bg-popover border border-border rounded-md shadow-elevated"
                      style={{
                        top: menuPosition?.top ?? 0,
                        left: menuPosition?.left ?? 0,
                        zIndex: 2000,
                      }}
                    >
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
                              onClick={() => {
                                setOpenMegaMenu(null);
                                setMenuPosition(null);
                              }}
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
                    </div>,
                    document.body
                  )}
              </React.Fragment>
            );
          })}
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

          {/* Alert Center */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="relative hover:bg-muted"
          >
            <a href="/alert-management-notification-center">
              <Icon name="Bell" size={18} />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              )}
            </a>
          </Button>

          {/* User Menu */}
          <div className="relative user-menu-container">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 hover:bg-muted"
            >
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-accent-foreground">
                  {currentUser?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                </span>
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-sm font-medium text-foreground">{currentUser?.name}</div>
                <div className="text-xs text-muted-foreground">{currentUser?.role}</div>
              </div>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
              />
            </Button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-popover border border-border rounded-md shadow-elevated z-[10001]">
                <div className="p-4 border-b border-border">
                  <div className="text-sm font-medium text-popover-foreground">{currentUser?.name}</div>
                  <div className="text-xs text-muted-foreground">{currentUser?.email}</div>
                  <div className="text-xs text-muted-foreground mt-1">{currentUser?.role}</div>
                </div>
                
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    asChild
                  >
                    <a href="/profile">
                      <Icon name="User" size={16} className="mr-2" />
                      Profile Settings
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    asChild
                  >
                    <a href="/preferences">
                      <Icon name="Settings" size={16} className="mr-2" />
                      Preferences
                    </a>
                  </Button>
                  <div className="border-t border-border my-2"></div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start text-sm text-error hover:bg-error/10"
                  >
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Sign out
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border mobile-menu-container">
          <div className="px-6 py-4 space-y-2">
            {/* Client Selector - Mobile */}
            <div className="mb-4">
              <Select
                options={clientOptions}
                value={selectedClient || clientOptions?.[0]?.value}
                onChange={handleClientChange}
                placeholder="Select client"
                searchable
                className="text-sm w-full"
              />
            </div>

            {/* Navigation Items - Mobile */}
            {getAllNavigationItems()?.map((item) => (
              <a
                key={item?.path}
                href={item?.path}
                className={`block px-4 py-3 rounded-md text-sm nav-transition ${
                  isActiveRoute(item?.path)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <Icon name={item?.icon} size={18} />
                  <span className="font-medium">{item?.label}</span>
                  {item?.badge && item?.badge > 0 && (
                    <span className="ml-auto w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                      {item?.badge > 9 ? '9+' : item?.badge}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;