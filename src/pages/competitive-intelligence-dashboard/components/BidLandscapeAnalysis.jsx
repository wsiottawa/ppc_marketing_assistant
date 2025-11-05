import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';

const BidLandscapeAnalysis = ({ selectedCompetitor }) => {
  const [chartType, setChartType] = useState('position');
  const [timeRange, setTimeRange] = useState('30d');
  const [keywordFilter, setKeywordFilter] = useState('all');

  // Mock bid landscape data
  const bidLandscapeData = [
    {
      keyword: 'enterprise software solutions',
      volume: 8900,
      difficulty: 72,
      competitors: [
        { name: 'Your Account', position: 3.2, bid: 4.50, impressionShare: 15.2, cpc: 4.25 },
        { name: 'Tech Solutions Inc', position: 1.8, bid: 6.20, impressionShare: 28.5, cpc: 5.95 },
        { name: 'Innovate Corp', position: 2.4, bid: 5.10, impressionShare: 22.1, cpc: 4.85 },
        { name: 'Digital First', position: 4.1, bid: 3.80, impressionShare: 12.8, cpc: 3.65 },
        { name: 'Smart Business', position: 3.8, bid: 4.10, impressionShare: 14.3, cpc: 3.95 }
      ]
    },
    {
      keyword: 'business automation tools',
      volume: 5600,
      difficulty: 68,
      competitors: [
        { name: 'Your Account', position: 2.9, bid: 3.75, impressionShare: 18.7, cpc: 3.60 },
        { name: 'Tech Solutions Inc', position: 2.4, bid: 4.20, impressionShare: 21.3, cpc: 4.05 },
        { name: 'Innovate Corp', position: 3.1, bid: 3.50, impressionShare: 16.9, cpc: 3.35 },
        { name: 'Digital First', position: 1.9, bid: 5.80, impressionShare: 25.4, cpc: 5.65 },
        { name: 'Smart Business', position: 4.2, bid: 2.90, impressionShare: 11.2, cpc: 2.75 }
      ]
    },
    {
      keyword: 'cloud computing services',
      volume: 12000,
      difficulty: 75,
      competitors: [
        { name: 'Your Account', position: 4.1, bid: 5.20, impressionShare: 12.8, cpc: 4.95 },
        { name: 'Tech Solutions Inc', position: 1.9, bid: 7.50, impressionShare: 32.1, cpc: 7.25 },
        { name: 'Innovate Corp', position: 2.8, bid: 6.10, impressionShare: 19.7, cpc: 5.85 },
        { name: 'Digital First', position: 3.5, bid: 4.80, impressionShare: 15.3, cpc: 4.60 },
        { name: 'Smart Business', position: 5.2, bid: 3.20, impressionShare: 8.9, cpc: 3.05 }
      ]
    }
  ];

  // Mock historical position data
  const positionTrendData = [
    { date: '2025-10-06', yourPosition: 3.5, competitor1: 2.1, competitor2: 2.8, competitor3: 4.2 },
    { date: '2025-10-13', yourPosition: 3.2, competitor1: 1.9, competitor2: 2.6, competitor3: 4.1 },
    { date: '2025-10-20', yourPosition: 3.1, competitor1: 1.8, competitor2: 2.7, competitor3: 3.9 },
    { date: '2025-10-27', yourPosition: 2.9, competitor1: 1.8, competitor2: 2.5, competitor3: 3.8 },
    { date: '2025-11-03', yourPosition: 3.2, competitor1: 1.8, competitor2: 2.4, competitor3: 4.1 }
  ];

  const chartTypeOptions = [
    { value: 'position', label: 'Position Analysis' },
    { value: 'bid', label: 'Bid Comparison' },
    { value: 'impression', label: 'Impression Share' },
    { value: 'trend', label: 'Position Trends' }
  ];

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  const keywordFilterOptions = [
    { value: 'all', label: 'All Keywords' },
    { value: 'high-volume', label: 'High Volume (>5K)' },
    { value: 'competitive', label: 'Highly Competitive' },
    { value: 'opportunities', label: 'Opportunities' }
  ];

  const getFilteredKeywords = () => {
    let filtered = [...bidLandscapeData];

    switch (keywordFilter) {
      case 'high-volume':
        filtered = filtered?.filter(item => item?.volume > 5000);
        break;
      case 'competitive':
        filtered = filtered?.filter(item => item?.difficulty > 70);
        break;
      case 'opportunities':
        filtered = filtered?.filter(item => {
          const yourData = item?.competitors?.find(c => c?.name === 'Your Account');
          return yourData && yourData?.position > 3;
        });
        break;
    }

    return filtered;
  };

  const getPositionColor = (position) => {
    if (position <= 2) return '#10b981'; // success
    if (position <= 4) return '#f59e0b'; // warning
    return '#ef4444'; // error
  };

  const formatCurrency = (amount) => {
    return `$${amount?.toFixed(2)}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevated">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const filteredKeywords = getFilteredKeywords();

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Bid Landscape Analysis</h3>
          <p className="text-sm text-muted-foreground">Position tracking and competitive bidding insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconSize={16}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconSize={16}
          >
            Export
          </Button>
        </div>
      </div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Select
            options={chartTypeOptions}
            value={chartType}
            onChange={setChartType}
            placeholder="Select chart type"
          />
        </div>
        <div className="flex-1">
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={setTimeRange}
            placeholder="Select time range"
          />
        </div>
        <div className="flex-1">
          <Select
            options={keywordFilterOptions}
            value={keywordFilter}
            onChange={setKeywordFilter}
            placeholder="Filter keywords"
          />
        </div>
      </div>
      {/* Chart Section */}
      <div className="mb-6">
        {chartType === 'trend' ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={positionTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  domain={[1, 6]}
                  reversed
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="yourPosition" 
                  stroke="var(--color-primary)" 
                  strokeWidth={2}
                  name="Your Position"
                />
                <Line 
                  type="monotone" 
                  dataKey="competitor1" 
                  stroke="var(--color-success)" 
                  strokeWidth={2}
                  name="Tech Solutions Inc"
                />
                <Line 
                  type="monotone" 
                  dataKey="competitor2" 
                  stroke="var(--color-warning)" 
                  strokeWidth={2}
                  name="Innovate Corp"
                />
                <Line 
                  type="monotone" 
                  dataKey="competitor3" 
                  stroke="var(--color-error)" 
                  strokeWidth={2}
                  name="Digital First"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredKeywords?.map((keywordData, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-foreground">{keywordData?.keyword}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Volume: {keywordData?.volume?.toLocaleString()}</span>
                      <span>Difficulty: {keywordData?.difficulty}</span>
                    </div>
                  </div>
                </div>

                {chartType === 'position' && (
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={keywordData?.competitors}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis 
                          dataKey="name" 
                          stroke="var(--color-muted-foreground)"
                          fontSize={11}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis 
                          stroke="var(--color-muted-foreground)"
                          fontSize={12}
                          domain={[1, 6]}
                          reversed
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="position" 
                          fill="var(--color-primary)"
                          name="Position"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {chartType === 'bid' && (
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={keywordData?.competitors}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis 
                          dataKey="name" 
                          stroke="var(--color-muted-foreground)"
                          fontSize={11}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis 
                          stroke="var(--color-muted-foreground)"
                          fontSize={12}
                        />
                        <Tooltip 
                          content={<CustomTooltip />}
                          formatter={(value) => [formatCurrency(value), 'Bid']}
                        />
                        <Bar 
                          dataKey="bid" 
                          fill="var(--color-accent)"
                          name="Bid"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {chartType === 'impression' && (
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={keywordData?.competitors}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis 
                          dataKey="name" 
                          stroke="var(--color-muted-foreground)"
                          fontSize={11}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis 
                          stroke="var(--color-muted-foreground)"
                          fontSize={12}
                        />
                        <Tooltip 
                          content={<CustomTooltip />}
                          formatter={(value) => [`${value}%`, 'Impression Share']}
                        />
                        <Area 
                          type="monotone"
                          dataKey="impressionShare" 
                          stroke="var(--color-success)"
                          fill="var(--color-success)"
                          fillOpacity={0.3}
                          name="Impression Share"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Competitor Table */}
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-muted-foreground">Competitor</th>
                        <th className="text-center py-2 text-muted-foreground">Position</th>
                        <th className="text-center py-2 text-muted-foreground">Bid</th>
                        <th className="text-center py-2 text-muted-foreground">Impression %</th>
                        <th className="text-center py-2 text-muted-foreground">CPC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keywordData?.competitors?.map((competitor, cidx) => (
                        <tr key={cidx} className="border-b border-border">
                          <td className="py-2">
                            <span className={competitor?.name === 'Your Account' ? 'font-medium text-primary' : 'text-foreground'}>
                              {competitor?.name}
                            </span>
                          </td>
                          <td className="text-center py-2">
                            <span style={{ color: getPositionColor(competitor?.position) }}>
                              {competitor?.position}
                            </span>
                          </td>
                          <td className="text-center py-2 text-foreground">{formatCurrency(competitor?.bid)}</td>
                          <td className="text-center py-2 text-foreground">{competitor?.impressionShare}%</td>
                          <td className="text-center py-2 text-foreground">{formatCurrency(competitor?.cpc)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Summary Statistics */}
      <div className="pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">{filteredKeywords?.length}</p>
            <p className="text-sm text-muted-foreground">Keywords Tracked</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">
              {filteredKeywords?.length > 0 ? 
                (filteredKeywords?.reduce((sum, kw) => {
                  const yourData = kw?.competitors?.find(c => c?.name === 'Your Account');
                  return sum + (yourData ? yourData?.position : 0);
                }, 0) / filteredKeywords?.length)?.toFixed(1) : '0'
              }
            </p>
            <p className="text-sm text-muted-foreground">Avg Position</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">
              {filteredKeywords?.length > 0 ? 
                formatCurrency(filteredKeywords?.reduce((sum, kw) => {
                  const yourData = kw?.competitors?.find(c => c?.name === 'Your Account');
                  return sum + (yourData ? yourData?.bid : 0);
                }, 0) / filteredKeywords?.length) : '$0.00'
              }
            </p>
            <p className="text-sm text-muted-foreground">Avg Bid</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success">
              {filteredKeywords?.length > 0 ? 
                (filteredKeywords?.reduce((sum, kw) => {
                  const yourData = kw?.competitors?.find(c => c?.name === 'Your Account');
                  return sum + (yourData ? yourData?.impressionShare : 0);
                }, 0) / filteredKeywords?.length)?.toFixed(1) : '0'
              }%
            </p>
            <p className="text-sm text-muted-foreground">Avg Impression Share</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidLandscapeAnalysis;