import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CampaignSidebar = ({ isCollapsed, onToggle, selectedClient, onClientSelect, selectedCampaign, onCampaignSelect }) => {
  const [expandedClients, setExpandedClients] = useState(new Set(['acme-corp']));
  const [searchTerm, setSearchTerm] = useState('');

  // Mock client and campaign data
  const clientsData = [
    {
      id: 'acme-corp',
      name: 'Acme Corporation',
      status: 'active',
      totalSpend: 45230.50,
      campaigns: [
        { id: 'acme-search-1', name: 'Search - Brand Terms', status: 'active', spend: 12450.30, performance: 'good' },
        { id: 'acme-search-2', name: 'Search - Product Keywords', status: 'active', spend: 18920.15, performance: 'excellent' },
        { id: 'acme-display-1', name: 'Display - Remarketing', status: 'paused', spend: 8760.25, performance: 'poor' },
        { id: 'acme-shopping-1', name: 'Shopping - All Products', status: 'active', spend: 5099.80, performance: 'good' }
      ]
    },
    {
      id: 'tech-solutions',
      name: 'Tech Solutions Inc.',
      status: 'active',
      totalSpend: 32180.75,
      campaigns: [
        { id: 'tech-search-1', name: 'Search - Software Terms', status: 'active', spend: 15230.40, performance: 'excellent' },
        { id: 'tech-video-1', name: 'Video - Product Demos', status: 'active', spend: 9850.20, performance: 'good' },
        { id: 'tech-display-1', name: 'Display - Competitor Targeting', status: 'active', spend: 7100.15, performance: 'poor' }
      ]
    },
    {
      id: 'retail-plus',
      name: 'Retail Plus',
      status: 'warning',
      totalSpend: 28950.25,
      campaigns: [
        { id: 'retail-search-1', name: 'Search - Seasonal Products', status: 'active', spend: 18450.75, performance: 'good' },
        { id: 'retail-shopping-1', name: 'Shopping - Holiday Sale', status: 'active', spend: 10499.50, performance: 'excellent' }
      ]
    },
    {
      id: 'startup-hub',
      name: 'Startup Hub',
      status: 'active',
      totalSpend: 15670.80,
      campaigns: [
        { id: 'startup-search-1', name: 'Search - B2B Keywords', status: 'active', spend: 8920.30, performance: 'good' },
        { id: 'startup-display-1', name: 'Display - Industry Targeting', status: 'paused', spend: 6750.50, performance: 'poor' }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'paused': return 'text-warning';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'excellent': return 'bg-success';
      case 'good': return 'bg-accent';
      case 'poor': return 'bg-error';
      default: return 'bg-muted';
    }
  };

  const toggleClientExpansion = (clientId) => {
    const newExpanded = new Set(expandedClients);
    if (newExpanded?.has(clientId)) {
      newExpanded?.delete(clientId);
    } else {
      newExpanded?.add(clientId);
    }
    setExpandedClients(newExpanded);
  };

  const filteredClients = clientsData?.filter(client => 
    client?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    client?.campaigns?.some(campaign => 
      campaign?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    )
  );

  return (
    <div className={`bg-card border-r border-border h-full flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-foreground">Campaigns</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
          iconSize={16}
          className="text-muted-foreground hover:text-foreground"
        />
      </div>
      {/* Search */}
      {!isCollapsed && (
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search clients & campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      )}
      {/* Client Tree */}
      <div className="flex-1 overflow-y-auto">
        {isCollapsed ? (
          <div className="p-2 space-y-2">
            {filteredClients?.map((client) => (
              <div key={client?.id} className="relative group">
                <Button
                  variant={selectedClient === client?.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onClientSelect(client?.id)}
                  className="w-full p-2 h-10"
                >
                  <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-foreground">
                      {client?.name?.charAt(0)}
                    </span>
                  </div>
                </Button>
                
                {/* Tooltip */}
                <div className="absolute left-full top-0 ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-elevated opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                  {client?.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredClients?.map((client) => (
              <div key={client?.id}>
                {/* Client Header */}
                <div
                  className={`flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-muted transition-colors ${
                    selectedClient === client?.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => {
                    toggleClientExpansion(client?.id);
                    onClientSelect(client?.id);
                  }}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <Icon
                      name={expandedClients?.has(client?.id) ? "ChevronDown" : "ChevronRight"}
                      size={16}
                      className="text-muted-foreground flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-foreground truncate">
                          {client?.name}
                        </span>
                        <Icon
                          name="Circle"
                          size={8}
                          className={`${getStatusColor(client?.status)} flex-shrink-0`}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ${client?.totalSpend?.toLocaleString()} total
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaign List */}
                {expandedClients?.has(client?.id) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {client?.campaigns?.map((campaign) => (
                      <div
                        key={campaign?.id}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${
                          selectedCampaign === campaign?.id ? 'bg-accent text-accent-foreground' : ''
                        }`}
                        onClick={() => onCampaignSelect(campaign?.id)}
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <div className={`w-2 h-2 rounded-full ${getPerformanceColor(campaign?.performance)} flex-shrink-0`}></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {campaign?.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ${campaign?.spend?.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <Icon
                          name="Circle"
                          size={6}
                          className={`${getStatusColor(campaign?.status)} flex-shrink-0`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer Stats */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Active Campaigns:</span>
              <span className="font-medium">
                {filteredClients?.reduce((acc, client) => 
                  acc + client?.campaigns?.filter(c => c?.status === 'active')?.length, 0
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Spend:</span>
              <span className="font-medium">
                ${filteredClients?.reduce((acc, client) => acc + client?.totalSpend, 0)?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignSidebar;