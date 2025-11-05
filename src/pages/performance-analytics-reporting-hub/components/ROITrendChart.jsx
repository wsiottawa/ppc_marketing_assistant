import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ROITrendChart = ({ isLoading = false }) => {
  const [selectedMetrics, setSelectedMetrics] = useState(['roi', 'roas']);

  const trendData = [
    { date: '2024-10-01', roi: 245, roas: 3.2, cpa: 45, revenue: 12500 },
    { date: '2024-10-02', roi: 268, roas: 3.4, cpa: 42, revenue: 13200 },
    { date: '2024-10-03', roi: 234, roas: 3.1, cpa: 48, revenue: 11800 },
    { date: '2024-10-04', roi: 289, roas: 3.6, cpa: 39, revenue: 14100 },
    { date: '2024-10-05', roi: 312, roas: 3.8, cpa: 36, revenue: 15600 },
    { date: '2024-10-06', roi: 298, roas: 3.7, cpa: 38, revenue: 14900 },
    { date: '2024-10-07', roi: 325, roas: 4.1, cpa: 34, revenue: 16800 },
    { date: '2024-10-08', roi: 341, roas: 4.3, cpa: 32, revenue: 17500 },
    { date: '2024-10-09', roi: 318, roas: 3.9, cpa: 35, revenue: 16200 },
    { date: '2024-10-10', roi: 356, roas: 4.5, cpa: 30, revenue: 18900 },
    { date: '2024-10-11', roi: 378, roas: 4.7, cpa: 28, revenue: 19800 },
    { date: '2024-10-12', roi: 365, roas: 4.4, cpa: 31, revenue: 18600 },
    { date: '2024-10-13', roi: 392, roas: 4.9, cpa: 26, revenue: 20500 },
    { date: '2024-10-14', roi: 385, roas: 4.8, cpa: 27, revenue: 20100 }
  ];

  const metrics = [
    { key: 'roi', label: 'ROI (%)', color: '#1e3a8a', yAxisId: 'left' },
    { key: 'roas', label: 'ROAS', color: '#0ea5e9', yAxisId: 'right' },
    { key: 'cpa', label: 'CPA ($)', color: '#dc2626', yAxisId: 'right' },
    { key: 'revenue', label: 'Revenue ($)', color: '#059669', yAxisId: 'right' }
  ];

  const toggleMetric = (metricKey) => {
    setSelectedMetrics(prev => 
      prev?.includes(metricKey) 
        ? prev?.filter(m => m !== metricKey)
        : [...prev, metricKey]
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const date = new Date(label)?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevated">
          <p className="font-medium text-popover-foreground mb-2">{date}</p>
          {payload?.map((entry) => (
            <p key={entry?.dataKey} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.dataKey === 'revenue' ? `$${entry?.value?.toLocaleString()}` : entry?.value}
              {entry?.dataKey === 'roi' ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="animate-pulse">
            <div className="h-5 bg-muted rounded w-48 mb-2"></div>
            <div className="h-3 bg-muted rounded w-32"></div>
          </div>
        </div>
        <div className="h-80 animate-pulse bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="TrendingUp" size={20} className="text-primary" />
            <span>ROI & Performance Trends</span>
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Track return on investment and key performance indicators over time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            iconSize={14}
          >
            Export
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
            iconSize={16}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {metrics?.map((metric) => (
          <Button
            key={metric?.key}
            variant={selectedMetrics?.includes(metric?.key) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleMetric(metric?.key)}
            className="text-xs"
          >
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: metric?.color }}
            ></div>
            {metric?.label}
          </Button>
        ))}
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trendData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              tickFormatter={(value) => new Date(value)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {metrics?.map((metric) => 
              selectedMetrics?.includes(metric?.key) && (
                <Line
                  key={metric?.key}
                  yAxisId={metric?.yAxisId}
                  type="monotone"
                  dataKey={metric?.key}
                  stroke={metric?.color}
                  strokeWidth={2}
                  dot={{ fill: metric?.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: metric?.color, strokeWidth: 2 }}
                  name={metric?.label}
                />
              )
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        {metrics?.map((metric) => {
          const latestValue = trendData?.[trendData?.length - 1]?.[metric?.key];
          const previousValue = trendData?.[trendData?.length - 2]?.[metric?.key];
          const change = ((latestValue - previousValue) / previousValue * 100)?.toFixed(1);
          
          return (
            <div key={metric?.key} className="text-center">
              <div className="text-lg font-bold text-foreground">
                {metric?.key === 'revenue' ? `$${latestValue?.toLocaleString()}` : latestValue}
                {metric?.key === 'roi' ? '%' : ''}
              </div>
              <div className="text-xs text-muted-foreground mb-1">
                {metric?.label}
              </div>
              <div className={`text-sm font-medium flex items-center justify-center space-x-1 ${
                change > 0 ? 'text-success' : change < 0 ? 'text-error' : 'text-muted-foreground'
              }`}>
                <Icon 
                  name={change > 0 ? 'TrendingUp' : change < 0 ? 'TrendingDown' : 'Minus'} 
                  size={12} 
                />
                <span>{Math.abs(change)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ROITrendChart;