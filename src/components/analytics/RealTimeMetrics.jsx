import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';


const RealTimeMetrics = ({ clientId }) => {
  const [metrics, setMetrics] = useState({});
  const [trends, setTrends] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Real-time metrics simulation
  useEffect(() => {
    const fetchMetrics = () => {
      // Simulate real-time data with variations
      const baseMetrics = {
        impressions: 15420 + Math.floor(Math.random() * 1000),
        clicks: 890 + Math.floor(Math.random() * 50),
        conversions: 23 + Math.floor(Math.random() * 5),
        spend: 1245.30 + Math.random() * 100,
        ctr: 5.77 + (Math.random() - 0.5) * 0.5,
        cpc: 1.40 + (Math.random() - 0.5) * 0.2,
        conversionRate: 2.58 + (Math.random() - 0.5) * 0.3,
        costPerConversion: 54.14 + (Math.random() - 0.5) * 10,
        qualityScore: 8.2 + (Math.random() - 0.5) * 0.4,
        impressionShare: 67.8 + (Math.random() - 0.5) * 5
      };

      // Calculate trends (mock)
      const newTrends = {};
      Object.keys(baseMetrics)?.forEach(key => {
        const change = (Math.random() - 0.5) * 20; // Random change between -10% and +10%
        newTrends[key] = {
          value: change,
          direction: change >= 0 ? 'up' : 'down',
          isSignificant: Math.abs(change) > 5
        };
      });

      setMetrics(baseMetrics);
      setTrends(newTrends);
      setLastUpdate(new Date());
      setIsLoading(false);
    };

    // Initial load
    fetchMetrics();

    // Update every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    
    return () => clearInterval(interval);
  }, [clientId]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US')?.format(Math.round(num));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const formatPercentage = (num) => {
    return `${num?.toFixed(2)}%`;
  };

  const getTrendIcon = (trend) => {
    if (!trend) return null;
    
    if (trend?.direction === 'up') {
      return <Icon name="TrendingUp" size={12} className={`${trend?.isSignificant ? 'text-success' : 'text-muted-foreground'}`} />;
    } else {
      return <Icon name="TrendingDown" size={12} className={`${trend?.isSignificant ? 'text-error' : 'text-muted-foreground'}`} />;
    }
  };

  const getTrendColor = (trend) => {
    if (!trend) return 'text-muted-foreground';
    
    if (trend?.isSignificant) {
      return trend?.direction === 'up' ? 'text-success' : 'text-error';
    }
    return 'text-muted-foreground';
  };

  const MetricCard = ({ title, value, trend, icon, formatter = (v) => v, subtitle }) => (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon name={icon} size={16} className="text-primary" />
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
        </div>
        <div className="flex items-center space-x-1">
          {getTrendIcon(trend)}
          {trend && (
            <span className={`text-xs font-medium ${getTrendColor(trend)}`}>
              {trend?.value > 0 ? '+' : ''}{trend?.value?.toFixed(1)}%
            </span>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-20 mb-1"></div>
          {subtitle && <div className="h-4 bg-muted rounded w-16"></div>}
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold text-foreground mb-1">
            {formatter(value)}
          </div>
          {subtitle && (
            <div className="text-sm text-muted-foreground">
              {subtitle}
            </div>
          )}
        </>
      )}
    </div>
  );

  const getTimeString = (date) => {
    return date?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Real-Time Performance</h2>
          <p className="text-sm text-muted-foreground">
            Last updated: {getTimeString(lastUpdate)} • Auto-refresh: 30s
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-success">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Impressions"
          value={metrics?.impressions}
          trend={trends?.impressions}
          icon="Eye"
          formatter={formatNumber}
          subtitle="Last hour"
        />
        <MetricCard
          title="Clicks"
          value={metrics?.clicks}
          trend={trends?.clicks}
          icon="MousePointer"
          formatter={formatNumber}
          subtitle={`${formatPercentage(metrics?.ctr || 0)} CTR`}
        />
        <MetricCard
          title="Conversions"
          value={metrics?.conversions}
          trend={trends?.conversions}
          icon="Target"
          formatter={formatNumber}
          subtitle={`${formatPercentage(metrics?.conversionRate || 0)} rate`}
        />
        <MetricCard
          title="Spend"
          value={metrics?.spend}
          trend={trends?.spend}
          icon="DollarSign"
          formatter={formatCurrency}
          subtitle="Today"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard
          title="Cost Per Click"
          value={metrics?.cpc}
          trend={trends?.cpc}
          icon="CreditCard"
          formatter={formatCurrency}
          subtitle=""
        />
        <MetricCard
          title="Cost Per Conversion"
          value={metrics?.costPerConversion}
          trend={trends?.costPerConversion}
          icon="Calculator"
          formatter={formatCurrency}
          subtitle=""
        />
        <MetricCard
          title="Quality Score"
          value={metrics?.qualityScore}
          trend={trends?.qualityScore}
          icon="Star"
          formatter={(v) => v?.toFixed(1)}
          subtitle=""
        />
      </div>

      {/* Performance Indicators */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Activity" size={16} className="mr-2" />
          Performance Indicators
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Impression Share */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Impression Share</span>
              <span className="font-medium text-foreground">
                {formatPercentage(metrics?.impressionShare || 0)}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="h-2 bg-primary rounded-full transition-all duration-1000"
                style={{ width: `${metrics?.impressionShare || 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.impressionShare > 80 ? 'Excellent coverage' : 
               metrics?.impressionShare > 60 ? 'Good coverage' : 'Consider increasing bids'}
            </p>
          </div>

          {/* Quality Distribution */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Quality</span>
              <span className="font-medium text-foreground">
                {metrics?.qualityScore?.toFixed(1) || 0}/10
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${
                  (metrics?.qualityScore || 0) > 7 ? 'bg-success' :
                  (metrics?.qualityScore || 0) > 5 ? 'bg-warning' : 'bg-error'
                }`}
                style={{ width: `${((metrics?.qualityScore || 0) / 10) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">
              {(metrics?.qualityScore || 0) > 7 ? 'High quality keywords' :
               (metrics?.qualityScore || 0) > 5 ? 'Average quality' : 'Needs optimization'}
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Alerts */}
      <div className="bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Zap" size={16} className="text-accent mt-1" />
          <div>
            <h4 className="font-medium text-foreground mb-1">Real-time AI Monitoring</h4>
            <p className="text-sm text-muted-foreground mb-3">
              AI is actively monitoring your campaigns and will alert you to any significant changes or optimization opportunities.
            </p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                <span>Performance tracking</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-info rounded-full"></div>
                <span>Anomaly detection</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-warning rounded-full"></div>
                <span>Optimization alerts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMetrics;