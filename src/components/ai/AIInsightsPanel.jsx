import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';
import aiService from '../../utils/aiService';

const AIInsightsPanel = ({ data, type = 'dashboard', clientId, onInsightAction }) => {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (data && Object.keys(data)?.length > 0) {
      generateInsights();
    }
  }, [data, type, clientId, refreshKey]);

  const generateInsights = async () => {
    if (!data || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      
      switch (type) {
        case 'client':
          result = await aiService?.analyzeClientPerformance(data);
          break;
        case 'campaign':
          result = await aiService?.optimizeCampaign(data);
          break;
        case 'portfolio':
          result = await aiService?.analyzeClientPortfolio(data);
          break;
        case 'competitive':
          result = await aiService?.analyzeCompetitiveIntelligence(data);
          break;
        case 'keyword':
          result = await aiService?.analyzeKeywordPerformance(data);
          break;
        default:
          result = await aiService?.generateDashboardInsights(data);
      }
      
      setInsights(result);
    } catch (error) {
      console.error('AI Insights Error:', error);
      setError(error?.message || 'Failed to generate insights');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleActionClick = (action) => {
    onInsightAction?.(action, insights);
  };

  const renderInsightContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-4">
          <Icon name="AlertCircle" size={32} className="text-error mx-auto mb-2" />
          <p className="text-sm text-error mb-3">{error}</p>
          <Button size="sm" variant="outline" onClick={handleRefresh}>
            Try Again
          </Button>
        </div>
      );
    }

    if (!insights) {
      return (
        <div className="text-center py-4">
          <Icon name="Zap" size={32} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No insights available</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* AI Analysis Summary */}
        {insights?.analysis && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Brain" size={16} className="text-accent mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-foreground mb-2">AI Analysis</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insights?.analysis}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Key Recommendations */}
        {insights?.recommendations && insights?.recommendations?.length > 0 && (
          <div>
            <h4 className="font-medium text-foreground mb-3 flex items-center">
              <Icon name="Target" size={16} className="mr-2" />
              Key Recommendations
            </h4>
            <div className="space-y-2">
              {insights?.recommendations?.slice(0, 3)?.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Alerts */}
        {insights?.alerts && insights?.alerts?.length > 0 && (
          <div>
            <h4 className="font-medium text-foreground mb-3 flex items-center">
              <Icon name="AlertTriangle" size={16} className="text-warning mr-2" />
              Performance Alerts
            </h4>
            <div className="space-y-2">
              {insights?.alerts?.slice(0, 2)?.map((alert, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <Icon name="AlertCircle" size={14} className="text-warning mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-warning">{alert?.type}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert?.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {insights?.actions && insights?.actions?.length > 0 && (
          <div>
            <h4 className="font-medium text-foreground mb-3 flex items-center">
              <Icon name="Zap" size={16} className="mr-2" />
              Suggested Actions
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {insights?.actions?.slice(0, 3)?.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left h-auto p-3"
                  onClick={() => handleActionClick(action)}
                >
                  <div>
                    <div className="font-medium">{action?.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {action?.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Confidence Score */}
        {insights?.confidence && (
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Confidence Level</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success transition-all duration-500"
                    style={{ width: `${(insights?.confidence * 100)}%` }}
                  />
                </div>
                <span className="font-medium text-foreground">
                  {(insights?.confidence * 100)?.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Brain" size={18} className="text-primary" />
            <h3 className="font-semibold text-foreground">AI Insights</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="RefreshCw"
              iconSize={14}
              onClick={handleRefresh}
              disabled={isLoading}
              className={isLoading ? 'animate-spin' : ''}
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="Settings"
              iconSize={14}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {renderInsightContent()}
      </div>

      {/* Footer */}
      {insights && (
        <div className="px-4 pb-3">
          <div className="text-xs text-muted-foreground flex items-center justify-between">
            <span>Generated by GPT-5</span>
            <span>{new Date(insights?.timestamp)?.toLocaleTimeString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsightsPanel;