import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const KeywordOverlapMatrix = ({ selectedCompetitor }) => {
  const [viewMode, setViewMode] = useState('matrix');
  const [metricType, setMetricType] = useState('overlap');
  const [minOverlap, setMinOverlap] = useState(5);

  // Mock keyword overlap data
  const overlapData = [
    {
      competitor1: 'Your Account',
      competitor2: 'Tech Solutions Inc',
      sharedKeywords: 245,
      totalKeywords1: 1200,
      totalKeywords2: 1250,
      overlapPercentage: 20.4,
      opportunities: 156,
      gaps: 89,
      avgPosition1: 2.8,
      avgPosition2: 2.1,
      topSharedKeywords: [
        { keyword: 'enterprise software solutions', volume: 8900, difficulty: 72, yourPos: 3.2, theirPos: 1.8 },
        { keyword: 'business automation tools', volume: 5600, difficulty: 68, yourPos: 2.9, theirPos: 2.4 },
        { keyword: 'cloud computing services', volume: 12000, difficulty: 75, yourPos: 4.1, theirPos: 1.9 }
      ]
    },
    {
      competitor1: 'Your Account',
      competitor2: 'Innovate Corp',
      sharedKeywords: 189,
      totalKeywords1: 1200,
      totalKeywords2: 890,
      overlapPercentage: 15.8,
      opportunities: 123,
      gaps: 67,
      avgPosition1: 2.8,
      avgPosition2: 2.8,
      topSharedKeywords: [
        { keyword: 'digital transformation consulting', volume: 4200, difficulty: 65, yourPos: 2.1, theirPos: 3.2 },
        { keyword: 'it consulting services', volume: 7800, difficulty: 70, yourPos: 3.8, theirPos: 2.6 },
        { keyword: 'technology solutions provider', volume: 3400, difficulty: 62, yourPos: 2.4, theirPos: 3.1 }
      ]
    },
    {
      competitor1: 'Your Account',
      competitor2: 'Digital First',
      sharedKeywords: 167,
      totalKeywords1: 1200,
      totalKeywords2: 675,
      overlapPercentage: 13.9,
      opportunities: 98,
      gaps: 45,
      avgPosition1: 2.8,
      avgPosition2: 3.2,
      topSharedKeywords: [
        { keyword: 'marketing automation platform', volume: 6700, difficulty: 73, yourPos: 4.2, theirPos: 1.7 },
        { keyword: 'crm software solutions', volume: 9200, difficulty: 68, yourPos: 2.3, theirPos: 2.9 },
        { keyword: 'lead generation tools', volume: 5100, difficulty: 64, yourPos: 3.1, theirPos: 2.8 }
      ]
    },
    {
      competitor1: 'Your Account',
      competitor2: 'Smart Business',
      sharedKeywords: 134,
      totalKeywords1: 1200,
      totalKeywords2: 542,
      overlapPercentage: 11.2,
      opportunities: 76,
      gaps: 34,
      avgPosition1: 2.8,
      avgPosition2: 3.5,
      topSharedKeywords: [
        { keyword: 'business management software', volume: 4800, difficulty: 66, yourPos: 2.7, theirPos: 3.8 },
        { keyword: 'project management tools', volume: 8900, difficulty: 71, yourPos: 3.4, theirPos: 2.9 },
        { keyword: 'workflow automation', volume: 3600, difficulty: 59, yourPos: 2.1, theirPos: 4.2 }
      ]
    }
  ];

  const metricOptions = [
    { value: 'overlap', label: 'Keyword Overlap' },
    { value: 'opportunities', label: 'Opportunities' },
    { value: 'gaps', label: 'Keyword Gaps' },
    { value: 'position', label: 'Position Comparison' }
  ];

  const minOverlapOptions = [
    { value: 1, label: '1+ Keywords' },
    { value: 5, label: '5+ Keywords' },
    { value: 10, label: '10+ Keywords' },
    { value: 25, label: '25+ Keywords' },
    { value: 50, label: '50+ Keywords' }
  ];

  const getFilteredData = () => {
    return overlapData?.filter(item => item?.sharedKeywords >= minOverlap);
  };

  const getOpportunityColor = (opportunities) => {
    if (opportunities > 100) return 'text-success';
    if (opportunities > 50) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getPositionColor = (yourPos, theirPos) => {
    if (yourPos < theirPos) return 'text-success';
    if (yourPos > theirPos) return 'text-error';
    return 'text-warning';
  };

  const filteredData = getFilteredData();

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Keyword Overlap Matrix</h3>
          <p className="text-sm text-muted-foreground">Competitive keyword analysis and opportunities</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'matrix' ? 'default' : 'outline'}
            size="sm"
            iconName="Grid3X3"
            iconSize={16}
            onClick={() => setViewMode('matrix')}
          >
            Matrix
          </Button>
          <Button
            variant={viewMode === 'detailed' ? 'default' : 'outline'}
            size="sm"
            iconName="List"
            iconSize={16}
            onClick={() => setViewMode('detailed')}
          >
            Detailed
          </Button>
        </div>
      </div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Select
            options={metricOptions}
            value={metricType}
            onChange={setMetricType}
            placeholder="Select metric"
          />
        </div>
        <div className="flex-1">
          <Select
            options={minOverlapOptions}
            value={minOverlap}
            onChange={setMinOverlap}
            placeholder="Minimum overlap"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          iconPosition="left"
          iconSize={16}
        >
          Export Matrix
        </Button>
      </div>
      {/* Matrix View */}
      {viewMode === 'matrix' && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredData?.map((item, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-foreground">{item?.competitor2}</h4>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{item?.overlapPercentage}%</p>
                    <p className="text-xs text-muted-foreground">Overlap</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                  <div className="text-center">
                    <p className="font-medium text-foreground">{item?.sharedKeywords}</p>
                    <p className="text-muted-foreground">Shared</p>
                  </div>
                  <div className={`text-center ${getOpportunityColor(item?.opportunities)}`}>
                    <p className="font-medium">{item?.opportunities}</p>
                    <p className="text-muted-foreground">Opportunities</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-foreground">{item?.gaps}</p>
                    <p className="text-muted-foreground">Gaps</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Your Pos: {item?.avgPosition1}</span>
                  <span>Their Pos: {item?.avgPosition2}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Detailed View */}
      {viewMode === 'detailed' && (
        <div className="space-y-6">
          {filteredData?.map((item, index) => (
            <div key={index} className="border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-foreground">{item?.competitor2}</h4>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-primary">{item?.overlapPercentage}%</p>
                    <p className="text-muted-foreground">Overlap</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-foreground">{item?.sharedKeywords}</p>
                    <p className="text-muted-foreground">Keywords</p>
                  </div>
                </div>
              </div>

              {/* Top Shared Keywords */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-foreground mb-3">Top Shared Keywords</h5>
                <div className="space-y-2">
                  {item?.topSharedKeywords?.map((keyword, kidx) => (
                    <div key={kidx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{keyword?.keyword}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Volume: {keyword?.volume?.toLocaleString()}</span>
                          <span>Difficulty: {keyword?.difficulty}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="text-center">
                          <p className={`font-medium ${getPositionColor(keyword?.yourPos, keyword?.theirPos)}`}>
                            {keyword?.yourPos}
                          </p>
                          <p className="text-muted-foreground">You</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-foreground">{keyword?.theirPos}</p>
                          <p className="text-muted-foreground">Them</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opportunity Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="TrendingUp" size={16} className="text-success" />
                    <span className="text-sm font-medium text-success">Opportunities</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">{item?.opportunities}</p>
                  <p className="text-xs text-muted-foreground">Keywords to target</p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="AlertTriangle" size={16} className="text-warning" />
                    <span className="text-sm font-medium text-warning">Gaps</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">{item?.gaps}</p>
                  <p className="text-xs text-muted-foreground">Missing keywords</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Target" size={16} className="text-primary" />
                    <span className="text-sm font-medium text-primary">Shared</span>
                  </div>
                  <p className="text-lg font-bold text-foreground">{item?.sharedKeywords}</p>
                  <p className="text-xs text-muted-foreground">Common keywords</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Summary Statistics */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">
              {filteredData?.reduce((sum, item) => sum + item?.sharedKeywords, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Shared</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success">
              {filteredData?.reduce((sum, item) => sum + item?.opportunities, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Opportunities</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-warning">
              {filteredData?.reduce((sum, item) => sum + item?.gaps, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Gaps</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {(filteredData?.reduce((sum, item) => sum + item?.overlapPercentage, 0) / filteredData?.length)?.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">Avg Overlap</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordOverlapMatrix;