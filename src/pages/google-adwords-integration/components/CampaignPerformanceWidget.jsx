import React, { useState, useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import GoogleAdsService from '../../../utils/googleAdsService';

const CampaignPerformanceWidget = ({ campaigns, isLoading }) => {
  const [viewType, setViewType] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('impressions');
  const [sortBy, setSortBy] = useState('impressions');
  const [sortOrder, setSortOrder] = useState('desc');

  const viewOptions = [
    { value: 'overview', label: 'Overview' },
    { value: 'chart', label: 'Performance Chart' },
    { value: 'detailed', label: 'Detailed Table' }
  ];

  const metricOptions = [
    { value: 'impressions', label: 'Impressions' },
    { value: 'clicks', label: 'Clicks' },
    { value: 'cost', label: 'Cost' },
    { value: 'conversions', label: 'Conversions' },
    { value: 'ctr', label: 'CTR' },
    { value: 'averageCpc', label: 'Avg. CPC' }
  ];

  const sortOptions = [
    { value: 'impressions', label: 'Impressions' },
    { value: 'clicks', label: 'Clicks' },
    { value: 'cost', label: 'Cost' },
    { value: 'conversions', label: 'Conversions' },
    { value: 'ctr', label: 'CTR' },
    { value: 'name', label: 'Campaign Name' }
  ];

  // Calculate summary metrics
  const summaryMetrics = {
    totalCampaigns: campaigns?.length || 0,
    totalImpressions: campaigns?.reduce((sum, campaign) => sum + (campaign?.impressions || 0), 0) || 0,
    totalClicks: campaigns?.reduce((sum, campaign) => sum + (campaign?.clicks || 0), 0) || 0,
    totalCost: campaigns?.reduce((sum, campaign) => sum + (campaign?.cost || 0), 0) || 0,
    totalConversions: campaigns?.reduce((sum, campaign) => sum + (campaign?.conversions || 0), 0) || 0,
    averageCtr: campaigns?.length > 0 ? 
      (campaigns?.reduce((sum, campaign) => sum + (campaign?.ctr || 0), 0) / campaigns?.length) : 0,
    averageCpc: campaigns?.length > 0 ? 
      (campaigns?.reduce((sum, campaign) => sum + (campaign?.averageCpc || 0), 0) / campaigns?.length) : 0
  };

  // Sort campaigns
  const sortedCampaigns = React.useMemo(() => {
    if (!campaigns?.length) return [];
    
    return [...campaigns]?.sort((a, b) => {
      let aValue = a?.[sortBy] || 0;
      let bValue = b?.[sortBy] || 0;
      
      if (sortBy === 'name') {
        aValue = a?.name?.toLowerCase() || '';
        bValue = b?.name?.toLowerCase() || '';
        return sortOrder === 'asc' ? aValue?.localeCompare(bValue) : bValue?.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [campaigns, sortBy, sortOrder]);

  // Prepare chart data
  const chartData = sortedCampaigns?.map(campaign => ({
    name: campaign?.name?.length > 20 ? 
      `${campaign?.name?.substring(0, 20)}...` : 
      campaign?.name,
    fullName: campaign?.name,
    impressions: campaign?.impressions || 0,
    clicks: campaign?.clicks || 0,
    cost: campaign?.cost || 0,
    conversions: campaign?.conversions || 0,
    ctr: parseFloat((campaign?.ctr || 0)?.toFixed(2)),
    averageCpc: parseFloat((campaign?.averageCpc || 0)?.toFixed(2))
  }));

  const getStatusColor = (status) => {
    switch (status) {
      case 'ENABLED': return 'text-green-600 bg-green-100';
      case 'PAUSED': return 'text-yellow-600 bg-yellow-100';
      case 'REMOVED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'SEARCH': return 'Search';
      case 'DISPLAY': return 'Monitor';
      case 'VIDEO': return 'Video';
      case 'SHOPPING': return 'ShoppingCart';
      default: return 'Globe';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <Icon name="BarChart3" size={20} className="text-primary" />
              <span>Campaign Performance</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Loading campaign data...
            </p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)]?.map((_, i) => (
              <div key={i} className="bg-muted h-20 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-muted h-64 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="BarChart3" size={20} className="text-primary" />
            <span>Campaign Performance</span>
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your Google Ads campaign performance
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Select
            label="View"
            options={viewOptions}
            value={viewType}
            onChange={setViewType}
            className="min-w-32"
          />
          
          {viewType === 'chart' && (
            <Select
              label="Metric"
              options={metricOptions}
              value={selectedMetric}
              onChange={setSelectedMetric}
              className="min-w-32"
            />
          )}
          
          {viewType === 'detailed' && (
            <div className="flex items-center space-x-2">
              <Select
                label="Sort By"
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                className="min-w-32"
              />
              <Button
                variant="ghost"
                size="sm"
                iconName={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
                iconSize={16}
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              />
            </div>
          )}
        </div>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Campaigns</p>
              <p className="text-2xl font-bold text-foreground">
                {summaryMetrics?.totalCampaigns}
              </p>
            </div>
            <Icon name="Layers" size={24} className="text-primary" />
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Impressions</p>
              <p className="text-2xl font-bold text-foreground">
                {GoogleAdsService?.formatNumber(summaryMetrics?.totalImpressions)}
              </p>
            </div>
            <Icon name="Eye" size={24} className="text-primary" />
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Clicks</p>
              <p className="text-2xl font-bold text-foreground">
                {GoogleAdsService?.formatNumber(summaryMetrics?.totalClicks)}
              </p>
            </div>
            <Icon name="MousePointer" size={24} className="text-primary" />
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Spend</p>
              <p className="text-2xl font-bold text-foreground">
                {GoogleAdsService?.formatCurrency(summaryMetrics?.totalCost)}
              </p>
            </div>
            <Icon name="DollarSign" size={24} className="text-primary" />
          </div>
        </div>
      </div>
      {/* Content Based on View Type */}
      {viewType === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-foreground mb-3">Performance Metrics</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-background border border-border rounded-lg">
                <span className="text-sm text-muted-foreground">Average CTR</span>
                <span className="font-medium text-foreground">
                  {GoogleAdsService?.formatPercentage(summaryMetrics?.averageCtr)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background border border-border rounded-lg">
                <span className="text-sm text-muted-foreground">Average CPC</span>
                <span className="font-medium text-foreground">
                  {GoogleAdsService?.formatCurrency(summaryMetrics?.averageCpc)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background border border-border rounded-lg">
                <span className="text-sm text-muted-foreground">Total Conversions</span>
                <span className="font-medium text-foreground">
                  {summaryMetrics?.totalConversions}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-3">Top Performing Campaigns</h4>
            <div className="space-y-2">
              {sortedCampaigns?.slice(0, 5)?.map((campaign) => (
                <div 
                  key={campaign?.id} 
                  className="flex items-center justify-between p-3 bg-background border border-border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Icon name={getTypeIcon(campaign?.type)} size={16} className="text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {campaign?.name?.length > 25 ? 
                          `${campaign?.name?.substring(0, 25)}...` : 
                          campaign?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {GoogleAdsService?.formatNumber(campaign?.impressions)} impressions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {GoogleAdsService?.formatPercentage(campaign?.ctr)}
                    </p>
                    <p className="text-xs text-muted-foreground">CTR</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {viewType === 'chart' && (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'cost') return [GoogleAdsService?.formatCurrency(value), 'Cost'];
                  if (name === 'ctr') return [GoogleAdsService?.formatPercentage(value), 'CTR'];
                  if (name === 'averageCpc') return [GoogleAdsService?.formatCurrency(value), 'Avg. CPC'];
                  return [GoogleAdsService?.formatNumber(value), name];
                }}
                labelFormatter={(label) => chartData?.find(d => d?.name === label)?.fullName || label}
              />
              <Bar 
                dataKey={selectedMetric} 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {viewType === 'detailed' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-medium text-muted-foreground">Campaign</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Impressions</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Clicks</th>
                <th className="text-right p-3 font-medium text-muted-foreground">CTR</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Cost</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Conversions</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Avg. CPC</th>
              </tr>
            </thead>
            <tbody>
              {sortedCampaigns?.map((campaign) => (
                <tr key={campaign?.id} className="border-b border-border hover:bg-muted/50">
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <Icon name={getTypeIcon(campaign?.type)} size={16} className="text-primary" />
                      <span className="font-medium text-foreground">{campaign?.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{campaign?.type}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(campaign?.status)}`}>
                      {campaign?.status}
                    </span>
                  </td>
                  <td className="p-3 text-right text-foreground">
                    {GoogleAdsService?.formatNumber(campaign?.impressions)}
                  </td>
                  <td className="p-3 text-right text-foreground">
                    {GoogleAdsService?.formatNumber(campaign?.clicks)}
                  </td>
                  <td className="p-3 text-right text-foreground">
                    {GoogleAdsService?.formatPercentage(campaign?.ctr)}
                  </td>
                  <td className="p-3 text-right text-foreground">
                    {GoogleAdsService?.formatCurrency(campaign?.cost)}
                  </td>
                  <td className="p-3 text-right text-foreground">
                    {campaign?.conversions}
                  </td>
                  <td className="p-3 text-right text-foreground">
                    {GoogleAdsService?.formatCurrency(campaign?.averageCpc)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {(!campaigns || campaigns?.length === 0) && !isLoading && (
        <div className="text-center py-8">
          <Icon name="BarChart3" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No campaign data available</p>
          <p className="text-sm text-muted-foreground mt-1">
            Check your connection or try refreshing the data
          </p>
        </div>
      )}
    </div>
  );
};

export default CampaignPerformanceWidget;