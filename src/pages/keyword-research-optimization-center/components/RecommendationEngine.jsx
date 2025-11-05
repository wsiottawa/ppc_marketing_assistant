import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const RecommendationEngine = ({ selectedKeywords, onApplyRecommendations }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedRecs, setSelectedRecs] = useState([]);
  const [filterType, setFilterType] = useState('all');

  // Mock recommendation data
  const mockRecommendations = [
    {
      id: 'rec-1',
      type: 'keyword-expansion',
      priority: 'high',
      title: 'Add Long-tail Variations',
      description: 'Expand "ppc management" with location-based long-tail keywords',
      impact: 'Potential 35% increase in qualified traffic',
      effort: 'Low',
      keywords: [
        'ppc management services near me',
        'local ppc management company',
        'ppc management consultant city'
      ],
      estimatedCpc: 2.85,
      estimatedVolume: 1240,
      confidence: 92,
      action: 'Add 3 keywords to campaign'
    },
    {
      id: 'rec-2',
      type: 'bid-optimization',
      priority: 'high',
      title: 'Increase Bids for High-Performers',
      description: 'Boost bids on keywords with conversion rates above 4%',
      impact: 'Expected 22% increase in conversions',
      effort: 'Low',
      keywords: [
        'google ads management',
        'ppc optimization services',
        'paid search management'
      ],
      currentBid: 3.25,
      recommendedBid: 4.10,
      confidence: 88,
      action: 'Increase bids by 26%'
    },
    {
      id: 'rec-3',
      type: 'negative-keywords',
      priority: 'medium',
      title: 'Add Negative Keywords',
      description: 'Block irrelevant traffic from "free" and "cheap" searches',
      impact: 'Reduce wasted spend by $340/month',
      effort: 'Low',
      keywords: [
        'free ppc management',
        'cheap google ads',
        'diy ppc tools'
      ],
      wastedSpend: 340,
      confidence: 85,
      action: 'Add 8 negative keywords'
    },
    {
      id: 'rec-4',
      type: 'quality-improvement',
      priority: 'medium',
      title: 'Improve Quality Scores',
      description: 'Optimize ad copy and landing pages for better relevance',
      impact: 'Reduce CPC by 15-25%',
      effort: 'Medium',
      keywords: [
        'ppc campaign management',
        'google ads consultant',
        'paid advertising services'
      ],
      currentQualityScore: 6.2,
      targetQualityScore: 8.5,
      confidence: 78,
      action: 'Update 5 ad groups'
    },
    {
      id: 'rec-5',
      type: 'competitor-opportunity',
      priority: 'low',
      title: 'Target Competitor Keywords',
      description: 'Compete on keywords where competitors have weak ad copy',
      impact: 'Capture 12% market share',
      effort: 'High',
      keywords: [
        'digital marketing agency ppc',
        'enterprise ppc management',
        'b2b google ads services'
      ],
      competitorWeakness: 'Low ad relevance scores',
      confidence: 71,
      action: 'Create 2 new campaigns'
    }
  ];

  useEffect(() => {
    setRecommendations(mockRecommendations);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error/10 border-error/20';
      case 'medium': return 'bg-warning/10 border-warning/20';
      case 'low': return 'bg-muted/50 border-border';
      default: return 'bg-muted/50 border-border';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'keyword-expansion': return 'Plus';
      case 'bid-optimization': return 'TrendingUp';
      case 'negative-keywords': return 'Minus';
      case 'quality-improvement': return 'Star';
      case 'competitor-opportunity': return 'Target';
      default: return 'Lightbulb';
    }
  };

  const filteredRecommendations = recommendations?.filter(rec => {
    if (filterType === 'all') return true;
    return rec?.priority === filterType;
  });

  const handleSelectRecommendation = (recId) => {
    setSelectedRecs(prev => 
      prev?.includes(recId) 
        ? prev?.filter(id => id !== recId)
        : [...prev, recId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRecs?.length === filteredRecommendations?.length) {
      setSelectedRecs([]);
    } else {
      setSelectedRecs(filteredRecommendations?.map(rec => rec?.id));
    }
  };

  const handleApplySelected = () => {
    const selectedRecommendations = recommendations?.filter(rec => 
      selectedRecs?.includes(rec?.id)
    );
    onApplyRecommendations(selectedRecommendations);
    setSelectedRecs([]);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Lightbulb" size={20} className="mr-2 text-secondary" />
          AI Recommendations
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
            iconName="Settings"
            iconSize={16}
            className="text-muted-foreground"
          >
            Settings
          </Button>
        </div>
      </div>
      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
        {[
          { value: 'all', label: 'All', count: recommendations?.length },
          { value: 'high', label: 'High Priority', count: recommendations?.filter(r => r?.priority === 'high')?.length },
          { value: 'medium', label: 'Medium', count: recommendations?.filter(r => r?.priority === 'medium')?.length },
          { value: 'low', label: 'Low', count: recommendations?.filter(r => r?.priority === 'low')?.length }
        ]?.map((filter) => (
          <button
            key={filter?.value}
            onClick={() => setFilterType(filter?.value)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              filterType === filter?.value
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {filter?.label}
            <span className="ml-1 text-xs">({filter?.count})</span>
          </button>
        ))}
      </div>
      {/* Bulk Actions */}
      {filteredRecommendations?.length > 0 && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={selectedRecs?.length === filteredRecommendations?.length}
              indeterminate={selectedRecs?.length > 0 && selectedRecs?.length < filteredRecommendations?.length}
              onChange={handleSelectAll}
              label={`Select All (${selectedRecs?.length})`}
            />
          </div>
          {selectedRecs?.length > 0 && (
            <Button
              variant="default"
              size="sm"
              onClick={handleApplySelected}
              iconName="Check"
              iconPosition="left"
              iconSize={16}
            >
              Apply Selected ({selectedRecs?.length})
            </Button>
          )}
        </div>
      )}
      {/* Recommendations List */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {filteredRecommendations?.map((rec) => (
          <div
            key={rec?.id}
            className={`border rounded-lg p-4 ${getPriorityBg(rec?.priority)} hover:shadow-sm transition-shadow`}
          >
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={selectedRecs?.includes(rec?.id)}
                onChange={() => handleSelectRecommendation(rec?.id)}
                className="mt-1"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getTypeIcon(rec?.type)} 
                      size={16} 
                      className={getPriorityColor(rec?.priority)} 
                    />
                    <h4 className="font-medium text-foreground">{rec?.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      rec?.priority === 'high' ? 'bg-error/20 text-error' :
                      rec?.priority === 'medium'? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'
                    }`}>
                      {rec?.priority}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Icon name="Zap" size={12} />
                    <span>{rec?.confidence}% confidence</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{rec?.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="bg-card/50 rounded p-3">
                    <div className="text-xs text-muted-foreground mb-1">Expected Impact</div>
                    <div className="text-sm font-medium text-success">{rec?.impact}</div>
                  </div>
                  <div className="bg-card/50 rounded p-3">
                    <div className="text-xs text-muted-foreground mb-1">Implementation</div>
                    <div className="text-sm font-medium text-foreground">{rec?.effort} effort</div>
                  </div>
                </div>

                {/* Keywords Preview */}
                {rec?.keywords && (
                  <div className="mb-3">
                    <div className="text-xs text-muted-foreground mb-2">Affected Keywords:</div>
                    <div className="flex flex-wrap gap-1">
                      {rec?.keywords?.slice(0, 3)?.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                      {rec?.keywords?.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                          +{rec?.keywords?.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {rec?.action}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="ArrowRight"
                    iconPosition="right"
                    iconSize={14}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Summary Stats */}
      <div className="border-t border-border pt-4 mt-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-foreground">
              {recommendations?.filter(r => r?.priority === 'high')?.length}
            </div>
            <div className="text-xs text-muted-foreground">High Priority</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {selectedRecs?.length}
            </div>
            <div className="text-xs text-muted-foreground">Selected</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {recommendations?.reduce((sum, rec) => sum + (rec?.confidence || 0), 0) / recommendations?.length}%
            </div>
            <div className="text-xs text-muted-foreground">Avg. Confidence</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationEngine;