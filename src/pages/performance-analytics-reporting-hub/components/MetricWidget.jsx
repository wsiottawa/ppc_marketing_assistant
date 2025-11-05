import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricWidget = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  trend = [], 
  format = 'number',
  size = 'default',
  onClick,
  isLoading = false 
}) => {
  const formatValue = (val) => {
    if (format === 'currency') return `$${val?.toLocaleString()}`;
    if (format === 'percentage') return `${val}%`;
    return val?.toLocaleString();
  };

  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  if (isLoading) {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 ${size === 'large' ? 'col-span-2' : ''}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-muted rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-card border border-border rounded-lg p-6 hover:shadow-elevated nav-transition cursor-pointer ${
        size === 'large' ? 'col-span-2' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name={icon} size={20} className="text-primary" />
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        {trend?.length > 0 && (
          <div className="w-16 h-8">
            <svg viewBox="0 0 64 32" className="w-full h-full">
              <polyline
                points={trend?.map((val, idx) => `${(idx / (trend?.length - 1)) * 64},${32 - (val / Math.max(...trend)) * 32}`)?.join(' ')}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={getChangeColor()}
              />
            </svg>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="text-2xl font-bold text-foreground">
          {formatValue(value)}
        </div>
        
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-sm ${getChangeColor()}`}>
            <Icon name={getChangeIcon()} size={14} />
            <span>{Math.abs(change)}%</span>
            <span className="text-muted-foreground">vs last period</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricWidget;