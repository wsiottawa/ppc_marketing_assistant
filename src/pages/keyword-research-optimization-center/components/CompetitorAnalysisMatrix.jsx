import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const CompetitorAnalysisMatrix = ({ selectedKeyword, competitorData }) => {
  const [selectedCompetitor, setSelectedCompetitor] = useState('');
  const [viewMode, setViewMode] = useState('overview');

  // Mock competitor data
  const mockCompetitors = [
    {
      id: 'competitor-1',
      name: 'MarketingPro Solutions',
      domain: 'marketingpro.com',
      adPosition: 1.2,
      estimatedCpc: 4.25,
      adCopy: `Professional PPC Management Services\nBoost Your ROI with Expert Campaign Management\nGet Started Today - Free Consultation Available`,
      keywordCount: 1247,
      qualityScore: 8.5,
      impressionShare: 23.4,
      clickThroughRate: 3.2,
      conversionRate: 2.8,
      adStrength: 'Excellent',
      lastSeen: '2 hours ago'
    },
    {
      id: 'competitor-2',
      name: 'Digital Growth Agency',
      domain: 'digitalgrowth.co',
      adPosition: 1.8,
      estimatedCpc: 3.89,
      adCopy: `Scale Your Business with Smart PPC\nData-Driven Google Ads Management\nProven Results - 300% Average ROI Increase`,
      keywordCount: 892,
      qualityScore: 7.8,
      impressionShare: 18.7,
      clickThroughRate: 2.9,
      conversionRate: 3.1,
      adStrength: 'Good',
      lastSeen: '1 hour ago'
    },
    {
      id: 'competitor-3',
      name: 'AdMax Performance',
      domain: 'admaxperformance.net',
      adPosition: 2.3,
      estimatedCpc: 3.12,
      adCopy: `Transform Your PPC Campaigns\nExpert Google Ads Optimization\nFree Audit - Discover Hidden Opportunities`,
      keywordCount: 654,
      qualityScore: 7.2,
      impressionShare: 15.2,
      clickThroughRate: 2.6,
      conversionRate: 2.4,
      adStrength: 'Good',
      lastSeen: '30 minutes ago'
    }
  ];

  // View mode options
  const viewOptions = [
    { value: 'overview', label: 'Overview' },
    { value: 'ad-copy', label: 'Ad Copy Analysis' },
    { value: 'keywords', label: 'Keyword Overlap' },
    { value: 'performance', label: 'Performance Metrics' }
  ];

  // Competitor options for detailed view
  const competitorOptions = [
    { value: '', label: 'All Competitors' },
    ...mockCompetitors?.map(comp => ({
      value: comp?.id,
      label: comp?.name
    }))
  ];

  const getPositionColor = (position) => {
    if (position <= 1.5) return 'text-success';
    if (position <= 3) return 'text-warning';
    return 'text-error';
  };

  const getQualityScoreColor = (score) => {
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-warning';
    return 'text-error';
  };

  const renderOverviewMode = () => (
    <div className="space-y-4">
      {mockCompetitors?.map((competitor) => (
        <div key={competitor?.id} className="bg-muted/50 rounded-lg p-4 border border-border">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-medium text-foreground">{competitor?.name}</h4>
              <p className="text-sm text-muted-foreground">{competitor?.domain}</p>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${getPositionColor(competitor?.adPosition)}`}>
                Pos. {competitor?.adPosition}
              </div>
              <div className="text-xs text-muted-foreground">{competitor?.lastSeen}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Est. CPC:</span>
              <div className="font-medium">${competitor?.estimatedCpc}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Quality Score:</span>
              <div className={`font-medium ${getQualityScoreColor(competitor?.qualityScore)}`}>
                {competitor?.qualityScore}/10
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Impression Share:</span>
              <div className="font-medium">{competitor?.impressionShare}%</div>
            </div>
            <div>
              <span className="text-muted-foreground">CTR:</span>
              <div className="font-medium">{competitor?.clickThroughRate}%</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAdCopyMode = () => (
    <div className="space-y-4">
      {mockCompetitors?.map((competitor) => (
        <div key={competitor?.id} className="bg-muted/50 rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">{competitor?.name}</h4>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              competitor?.adStrength === 'Excellent' ? 'bg-success/10 text-success' :
              competitor?.adStrength === 'Good'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
            }`}>
              {competitor?.adStrength}
            </span>
          </div>
          
          <div className="bg-card border border-border rounded p-3 mb-3">
            <div className="text-sm text-primary font-medium mb-1">{competitor?.domain}</div>
            <div className="text-sm text-foreground whitespace-pre-line">
              {competitor?.adCopy}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Position: {competitor?.adPosition}</span>
            <span>Est. CPC: ${competitor?.estimatedCpc}</span>
            <span>Last seen: {competitor?.lastSeen}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPerformanceMode = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 text-muted-foreground">Competitor</th>
            <th className="text-right py-2 text-muted-foreground">Position</th>
            <th className="text-right py-2 text-muted-foreground">CPC</th>
            <th className="text-right py-2 text-muted-foreground">CTR</th>
            <th className="text-right py-2 text-muted-foreground">Conv. Rate</th>
            <th className="text-right py-2 text-muted-foreground">Imp. Share</th>
          </tr>
        </thead>
        <tbody>
          {mockCompetitors?.map((competitor) => (
            <tr key={competitor?.id} className="border-b border-border/50">
              <td className="py-3">
                <div>
                  <div className="font-medium text-foreground">{competitor?.name}</div>
                  <div className="text-xs text-muted-foreground">{competitor?.domain}</div>
                </div>
              </td>
              <td className={`text-right py-3 font-medium ${getPositionColor(competitor?.adPosition)}`}>
                {competitor?.adPosition}
              </td>
              <td className="text-right py-3 font-medium">${competitor?.estimatedCpc}</td>
              <td className="text-right py-3">{competitor?.clickThroughRate}%</td>
              <td className="text-right py-3">{competitor?.conversionRate}%</td>
              <td className="text-right py-3">{competitor?.impressionShare}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderContent = () => {
    switch (viewMode) {
      case 'ad-copy':
        return renderAdCopyMode();
      case 'performance':
        return renderPerformanceMode();
      default:
        return renderOverviewMode();
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Users" size={20} className="mr-2 text-accent" />
          Competitor Analysis
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="RefreshCw"
            iconSize={16}
            className="text-muted-foreground"
          >
            Refresh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Download"
            iconSize={16}
            className="text-muted-foreground"
          >
            Export
          </Button>
        </div>
      </div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Select
            label="View Mode"
            options={viewOptions}
            value={viewMode}
            onChange={setViewMode}
          />
        </div>
        <div className="flex-1">
          <Select
            label="Focus Competitor"
            options={competitorOptions}
            value={selectedCompetitor}
            onChange={setSelectedCompetitor}
            placeholder="All competitors"
          />
        </div>
      </div>
      {/* Current Keyword Context */}
      {selectedKeyword && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Icon name="Target" size={16} className="mr-2 text-primary" />
            <span className="text-sm text-muted-foreground">Analyzing for keyword:</span>
            <span className="ml-2 font-medium text-foreground">"{selectedKeyword}"</span>
          </div>
        </div>
      )}
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
      {/* Summary Stats */}
      <div className="border-t border-border pt-4 mt-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-foreground">{mockCompetitors?.length}</div>
            <div className="text-xs text-muted-foreground">Active Competitors</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              ${Math.min(...mockCompetitors?.map(c => c?.estimatedCpc))?.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">Lowest CPC</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {Math.max(...mockCompetitors?.map(c => c?.qualityScore))?.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Highest Quality Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitorAnalysisMatrix;