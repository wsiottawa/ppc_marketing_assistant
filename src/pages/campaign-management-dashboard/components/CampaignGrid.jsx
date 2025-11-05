import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const CampaignGrid = ({ selectedCampaigns, onCampaignSelect, onBulkSelect, filters }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'spend', direction: 'desc' });
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Mock campaign data with comprehensive metrics
  const campaignsData = [
    {
      id: 'acme-search-1',
      client: 'Acme Corporation',
      name: 'Search - Brand Terms',
      status: 'active',
      type: 'Search',
      spend: 12450.30,
      budget: 15000,
      impressions: 245680,
      clicks: 3420,
      ctr: 1.39,
      cpc: 3.64,
      conversions: 89,
      conversionRate: 2.60,
      costPerConversion: 139.89,
      roi: 245.5,
      qualityScore: 8.2,
      lastUpdated: new Date(Date.now() - 300000),
      performance: 'good'
    },
    {
      id: 'acme-search-2',
      client: 'Acme Corporation',
      name: 'Search - Product Keywords',
      status: 'active',
      type: 'Search',
      spend: 18920.15,
      budget: 20000,
      impressions: 456780,
      clicks: 5240,
      ctr: 1.15,
      cpc: 3.61,
      conversions: 156,
      conversionRate: 2.98,
      costPerConversion: 121.28,
      roi: 312.8,
      qualityScore: 7.8,
      lastUpdated: new Date(Date.now() - 180000),
      performance: 'excellent'
    },
    {
      id: 'acme-display-1',
      client: 'Acme Corporation',
      name: 'Display - Remarketing',
      status: 'paused',
      type: 'Display',
      spend: 8760.25,
      budget: 12000,
      impressions: 1245680,
      clicks: 1890,
      ctr: 0.15,
      cpc: 4.63,
      conversions: 23,
      conversionRate: 1.22,
      costPerConversion: 380.88,
      roi: 89.2,
      qualityScore: 5.4,
      lastUpdated: new Date(Date.now() - 7200000),
      performance: 'poor'
    },
    {
      id: 'tech-search-1',
      client: 'Tech Solutions Inc.',
      name: 'Search - Software Terms',
      status: 'active',
      type: 'Search',
      spend: 15230.40,
      budget: 18000,
      impressions: 324560,
      clicks: 4120,
      ctr: 1.27,
      cpc: 3.70,
      conversions: 134,
      conversionRate: 3.25,
      costPerConversion: 113.66,
      roi: 398.7,
      qualityScore: 8.9,
      lastUpdated: new Date(Date.now() - 120000),
      performance: 'excellent'
    },
    {
      id: 'tech-video-1',
      client: 'Tech Solutions Inc.',
      name: 'Video - Product Demos',
      status: 'active',
      type: 'Video',
      spend: 9850.20,
      budget: 12000,
      impressions: 567890,
      clicks: 2340,
      ctr: 0.41,
      cpc: 4.21,
      conversions: 67,
      conversionRate: 2.86,
      costPerConversion: 147.01,
      roi: 234.5,
      qualityScore: 7.2,
      lastUpdated: new Date(Date.now() - 240000),
      performance: 'good'
    },
    {
      id: 'retail-search-1',
      client: 'Retail Plus',
      name: 'Search - Seasonal Products',
      status: 'active',
      type: 'Search',
      spend: 18450.75,
      budget: 22000,
      impressions: 678900,
      clicks: 6780,
      ctr: 1.00,
      cpc: 2.72,
      conversions: 203,
      conversionRate: 2.99,
      costPerConversion: 90.89,
      roi: 456.8,
      qualityScore: 8.5,
      lastUpdated: new Date(Date.now() - 90000),
      performance: 'excellent'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'paused': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-accent';
      case 'poor': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })?.format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US')?.format(num);
  };

  const formatPercentage = (num) => {
    return `${num?.toFixed(2)}%`;
  };

  const getTimeSinceUpdate = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRowSelect = (campaignId) => {
    const newSelected = new Set(selectedRows);
    if (newSelected?.has(campaignId)) {
      newSelected?.delete(campaignId);
    } else {
      newSelected?.add(campaignId);
    }
    setSelectedRows(newSelected);
    onBulkSelect(Array.from(newSelected));
  };

  const handleSelectAll = () => {
    if (selectedRows?.size === campaignsData?.length) {
      setSelectedRows(new Set());
      onBulkSelect([]);
    } else {
      const allIds = new Set(campaignsData.map(c => c.id));
      setSelectedRows(allIds);
      onBulkSelect(Array.from(allIds));
    }
  };

  const sortedCampaigns = [...campaignsData]?.sort((a, b) => {
    const aValue = a?.[sortConfig?.key];
    const bValue = b?.[sortConfig?.key];
    
    if (typeof aValue === 'string') {
      return sortConfig?.direction === 'asc' 
        ? aValue?.localeCompare(bValue)
        : bValue?.localeCompare(aValue);
    }
    
    return sortConfig?.direction === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const SortIcon = ({ column }) => {
    if (sortConfig?.key !== column) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return (
      <Icon 
        name={sortConfig?.direction === 'asc' ? "ArrowUp" : "ArrowDown"} 
        size={14} 
        className="text-foreground" 
      />
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-foreground">Campaign Performance</h3>
            <div className="text-sm text-muted-foreground">
              {campaignsData?.length} campaigns • {selectedRows?.size} selected
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              iconPosition="left"
              iconSize={16}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              iconSize={16}
            >
              Export
            </Button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 p-3 text-left">
                <Checkbox
                  checked={selectedRows?.size === campaignsData?.length && campaignsData?.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Campaign</span>
                  <SortIcon column="name" />
                </button>
              </th>
              <th className="p-3 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Status</span>
                  <SortIcon column="status" />
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort('spend')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary ml-auto"
                >
                  <span>Spend</span>
                  <SortIcon column="spend" />
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort('impressions')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary ml-auto"
                >
                  <span>Impressions</span>
                  <SortIcon column="impressions" />
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort('clicks')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary ml-auto"
                >
                  <span>Clicks</span>
                  <SortIcon column="clicks" />
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort('ctr')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary ml-auto"
                >
                  <span>CTR</span>
                  <SortIcon column="ctr" />
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort('cpc')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary ml-auto"
                >
                  <span>CPC</span>
                  <SortIcon column="cpc" />
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort('conversions')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary ml-auto"
                >
                  <span>Conv.</span>
                  <SortIcon column="conversions" />
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort('roi')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary ml-auto"
                >
                  <span>ROI</span>
                  <SortIcon column="roi" />
                </button>
              </th>
              <th className="p-3 text-center">
                <span className="text-sm font-medium text-foreground">Updated</span>
              </th>
              <th className="w-12 p-3"></th>
            </tr>
          </thead>
          <tbody>
            {sortedCampaigns?.map((campaign, index) => (
              <tr
                key={campaign?.id}
                className={`border-b border-border hover:bg-muted/30 transition-colors ${
                  selectedRows?.has(campaign?.id) ? 'bg-accent/10' : ''
                } ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
              >
                <td className="p-3">
                  <Checkbox
                    checked={selectedRows?.has(campaign?.id)}
                    onChange={() => handleRowSelect(campaign?.id)}
                  />
                </td>
                <td className="p-3">
                  <div className="min-w-0">
                    <div className="font-medium text-foreground truncate">
                      {campaign?.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {campaign?.client} • {campaign?.type}
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <Icon
                      name="Circle"
                      size={8}
                      className={getStatusColor(campaign?.status)}
                    />
                    <span className={`text-sm font-medium capitalize ${getStatusColor(campaign?.status)}`}>
                      {campaign?.status}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-right">
                  <div className="font-medium text-foreground">
                    {formatCurrency(campaign?.spend)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    of {formatCurrency(campaign?.budget)}
                  </div>
                </td>
                <td className="p-3 text-right">
                  <div className="font-medium text-foreground">
                    {formatNumber(campaign?.impressions)}
                  </div>
                </td>
                <td className="p-3 text-right">
                  <div className="font-medium text-foreground">
                    {formatNumber(campaign?.clicks)}
                  </div>
                </td>
                <td className="p-3 text-right">
                  <div className={`font-medium ${getPerformanceColor(campaign?.performance)}`}>
                    {formatPercentage(campaign?.ctr)}
                  </div>
                </td>
                <td className="p-3 text-right">
                  <div className="font-medium text-foreground">
                    {formatCurrency(campaign?.cpc)}
                  </div>
                </td>
                <td className="p-3 text-right">
                  <div className="font-medium text-foreground">
                    {campaign?.conversions}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatPercentage(campaign?.conversionRate)}
                  </div>
                </td>
                <td className="p-3 text-right">
                  <div className={`font-medium ${getPerformanceColor(campaign?.performance)}`}>
                    {formatPercentage(campaign?.roi)}
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="text-sm text-muted-foreground">
                    {getTimeSinceUpdate(campaign?.lastUpdated)}
                  </div>
                </td>
                <td className="p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MoreVertical"
                    iconSize={16}
                    className="text-muted-foreground hover:text-foreground"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {campaignsData?.length} campaigns
          </div>
          <div className="flex items-center space-x-4">
            <div>
              Total Spend: <span className="font-medium text-foreground">
                {formatCurrency(campaignsData?.reduce((sum, c) => sum + c?.spend, 0))}
              </span>
            </div>
            <div>
              Total Conversions: <span className="font-medium text-foreground">
                {formatNumber(campaignsData?.reduce((sum, c) => sum + c?.conversions, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignGrid;