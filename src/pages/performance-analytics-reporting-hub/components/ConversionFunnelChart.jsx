import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const ConversionFunnelChart = ({ data, isLoading = false }) => {
  const funnelData = [
    { stage: 'Impressions', value: 125000, percentage: 100, color: '#1e3a8a' },
    { stage: 'Clicks', value: 8750, percentage: 7.0, color: '#0ea5e9' },
    { stage: 'Landing Page Views', value: 7525, percentage: 6.02, color: '#059669' },
    { stage: 'Form Submissions', value: 1128, percentage: 0.90, color: '#d97706' },
    { stage: 'Qualified Leads', value: 564, percentage: 0.45, color: '#dc2626' },
    { stage: 'Conversions', value: 112, percentage: 0.09, color: '#475569' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevated">
          <p className="font-medium text-popover-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">
            Value: <span className="font-medium text-foreground">{data?.value?.toLocaleString()}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Conversion Rate: <span className="font-medium text-foreground">{data?.percentage}%</span>
          </p>
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
            <Icon name="TrendingDown" size={20} className="text-primary" />
            <span>Conversion Funnel Analysis</span>
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Track user journey from impression to conversion
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
            iconName="MoreVertical"
            iconSize={16}
          />
        </div>
      </div>
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={funnelData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="stage" 
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              tickFormatter={(value) => value?.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {funnelData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry?.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {funnelData?.map((stage, index) => (
          <div key={stage?.stage} className="text-center">
            <div className="text-lg font-bold text-foreground">
              {stage?.value?.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mb-1">
              {stage?.stage}
            </div>
            <div className="text-sm font-medium" style={{ color: stage?.color }}>
              {stage?.percentage}%
            </div>
            {index < funnelData?.length - 1 && (
              <div className="text-xs text-muted-foreground mt-1">
                Drop: {((funnelData?.[index]?.percentage - funnelData?.[index + 1]?.percentage) / funnelData?.[index]?.percentage * 100)?.toFixed(1)}%
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversionFunnelChart;