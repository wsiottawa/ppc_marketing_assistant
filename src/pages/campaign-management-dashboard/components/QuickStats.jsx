import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ selectedClient }) => {
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock stats data
  const mockStats = {
    'all': {
      totalSpend: 122451.25,
      totalConversions: 549,
      avgCtr: 1.24,
      avgCpc: 3.67,
      avgRoi: 289.7,
      activeCampaigns: 15,
      pausedCampaigns: 3,
      totalImpressions: 2456780,
      totalClicks: 30450,
      budgetUtilization: 78.5
    },
    'acme-corp': {
      totalSpend: 45230.50,
      totalConversions: 268,
      avgCtr: 1.39,
      avgCpc: 3.64,
      avgRoi: 245.5,
      activeCampaigns: 3,
      pausedCampaigns: 1,
      totalImpressions: 945680,
      totalClicks: 13150,
      budgetUtilization: 82.3
    },
    'tech-solutions': {
      totalSpend: 32180.75,
      totalConversions: 201,
      avgCtr: 1.15,
      avgCpc: 3.85,
      avgRoi: 312.8,
      activeCampaigns: 3,
      pausedCampaigns: 0,
      totalImpressions: 678900,
      totalClicks: 7810,
      budgetUtilization: 75.2
    }
  };

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const clientKey = selectedClient || 'all';
      setStats(mockStats?.[clientKey] || mockStats?.['all']);
      setIsLoading(false);
    }, 500);
  }, [selectedClient]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US')?.format(num);
  };

  const formatPercentage = (num) => {
    return `${num?.toFixed(2)}%`;
  };

  const getChangeIndicator = (current, previous = 0) => {
    const change = ((current - previous) / previous) * 100;
    if (change > 0) {
      return { icon: 'TrendingUp', color: 'text-success', value: `+${change?.toFixed(1)}%` };
    } else if (change < 0) {
      return { icon: 'TrendingDown', color: 'text-error', value: `${change?.toFixed(1)}%` };
    }
    return { icon: 'Minus', color: 'text-muted-foreground', value: '0%' };
  };

  const StatCard = ({ title, value, subtitle, icon, trend, isLoading }) => (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon name={icon} size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{title}</span>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${trend?.color}`}>
            <Icon name={trend?.icon} size={12} />
            <span className="text-xs font-medium">{trend?.value}</span>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-20 mb-1"></div>
          <div className="h-4 bg-muted rounded w-16"></div>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
          {subtitle && (
            <div className="text-sm text-muted-foreground">{subtitle}</div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      <StatCard
        title="Total Spend"
        value={formatCurrency(stats?.totalSpend || 0)}
        subtitle={`${formatPercentage(stats?.budgetUtilization || 0)} of budget`}
        icon="DollarSign"
        trend={getChangeIndicator(stats?.totalSpend, stats?.totalSpend * 0.85)}
        isLoading={isLoading}
      />
      <StatCard
        title="Conversions"
        value={formatNumber(stats?.totalConversions || 0)}
        subtitle={`${formatCurrency((stats?.totalSpend || 0) / (stats?.totalConversions || 1))} per conv.`}
        icon="Target"
        trend={getChangeIndicator(stats?.totalConversions, stats?.totalConversions * 0.92)}
        isLoading={isLoading}
      />
      <StatCard
        title="Click-through Rate"
        value={formatPercentage(stats?.avgCtr || 0)}
        subtitle={`${formatNumber(stats?.totalClicks || 0)} total clicks`}
        icon="MousePointer"
        trend={getChangeIndicator(stats?.avgCtr, stats?.avgCtr * 0.95)}
        isLoading={isLoading}
      />
      <StatCard
        title="Avg. Cost per Click"
        value={formatCurrency(stats?.avgCpc || 0)}
        subtitle={`${formatNumber(stats?.totalImpressions || 0)} impressions`}
        icon="CreditCard"
        trend={getChangeIndicator(stats?.avgCpc * -1, stats?.avgCpc * -0.88)}
        isLoading={isLoading}
      />
      <StatCard
        title="Return on Investment"
        value={formatPercentage(stats?.avgRoi || 0)}
        subtitle={`${stats?.activeCampaigns || 0} active campaigns`}
        icon="TrendingUp"
        trend={getChangeIndicator(stats?.avgRoi, stats?.avgRoi * 0.89)}
        isLoading={isLoading}
      />
    </div>
  );
};

export default QuickStats;