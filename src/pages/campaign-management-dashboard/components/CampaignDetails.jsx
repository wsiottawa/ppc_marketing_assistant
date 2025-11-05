import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CampaignDetails = ({ selectedCampaign, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({});

  // Mock detailed campaign data
  const campaignDetails = {
    'acme-search-1': {
      id: 'acme-search-1',
      name: 'Search - Brand Terms',
      client: 'Acme Corporation',
      status: 'active',
      type: 'Search',
      budget: 15000,
      dailyBudget: 500,
      bidStrategy: 'Target CPA',
      targetCpa: 140,
      spend: 12450.30,
      impressions: 245680,
      clicks: 3420,
      ctr: 1.39,
      cpc: 3.64,
      conversions: 89,
      conversionRate: 2.60,
      costPerConversion: 139.89,
      roi: 245.5,
      qualityScore: 8.2,
      adGroups: 12,
      keywords: 156,
      ads: 24,
      extensions: 8,
      startDate: '2024-10-01',
      endDate: '2024-12-31',
      lastModified: new Date(Date.now() - 3600000),
      performance: 'good',
      alerts: [
        { type: 'warning', message: 'CPC increased by 15% in last 7 days' },
        { type: 'info', message: 'Quality score improved for 8 keywords' }
      ]
    }
  };

  const currentCampaign = campaignDetails?.[selectedCampaign] || null;

  if (!currentCampaign) {
    return (
      <div className="bg-card border-l border-border h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Icon name="Target" size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No Campaign Selected</p>
          <p className="text-sm">Select a campaign from the grid to view details</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })?.format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US')?.format(num);
  };

  const formatPercentage = (num) => {
    return `${num?.toFixed(2)}%`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'paused': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      case 'info': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return 'AlertTriangle';
      case 'error': return 'AlertCircle';
      case 'info': return 'Info';
      default: return 'Bell';
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditValues({
      dailyBudget: currentCampaign?.dailyBudget,
      targetCpa: currentCampaign?.targetCpa,
      status: currentCampaign?.status
    });
  };

  const handleSave = () => {
    // Save logic would go here
    console.log('Saving changes:', editValues);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({});
  };

  return (
    <div className="bg-card border-l border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {currentCampaign?.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-muted-foreground">{currentCampaign?.client}</span>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center space-x-1">
                <Icon
                  name="Circle"
                  size={8}
                  className={getStatusColor(currentCampaign?.status)}
                />
                <span className={`text-sm font-medium capitalize ${getStatusColor(currentCampaign?.status)}`}>
                  {currentCampaign?.status}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={16}
            className="text-muted-foreground hover:text-foreground"
          />
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {!isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                iconName="Edit"
                iconPosition="left"
                iconSize={16}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName={currentCampaign?.status === 'active' ? 'Pause' : 'Play'}
                iconPosition="left"
                iconSize={16}
              >
                {currentCampaign?.status === 'active' ? 'Pause' : 'Resume'}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                iconName="Check"
                iconPosition="left"
                iconSize={16}
              >
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                iconName="X"
                iconPosition="left"
                iconSize={16}
              >
                Cancel
              </Button>
            </>
          )}
        </div>

        {/* Performance Metrics */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Performance Overview</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(currentCampaign?.spend)}
              </div>
              <div className="text-sm text-muted-foreground">Total Spend</div>
              <div className="text-xs text-muted-foreground mt-1">
                {((currentCampaign?.spend / currentCampaign?.budget) * 100)?.toFixed(1)}% of budget
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-foreground">
                {currentCampaign?.conversions}
              </div>
              <div className="text-sm text-muted-foreground">Conversions</div>
              <div className="text-xs text-success mt-1">
                {formatPercentage(currentCampaign?.conversionRate)} rate
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-foreground">
                {formatPercentage(currentCampaign?.ctr)}
              </div>
              <div className="text-sm text-muted-foreground">Click-through Rate</div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatNumber(currentCampaign?.clicks)} clicks
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-foreground">
                {formatPercentage(currentCampaign?.roi)}
              </div>
              <div className="text-sm text-muted-foreground">Return on Investment</div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatCurrency(currentCampaign?.cpc)} avg CPC
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Settings */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Campaign Settings</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Daily Budget</label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editValues?.dailyBudget}
                    onChange={(e) => setEditValues(prev => ({
                      ...prev,
                      dailyBudget: parseFloat(e?.target?.value)
                    }))}
                    className="mt-1"
                  />
                ) : (
                  <div className="text-sm text-muted-foreground mt-1">
                    {formatCurrency(currentCampaign?.dailyBudget)}
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Target CPA</label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editValues?.targetCpa}
                    onChange={(e) => setEditValues(prev => ({
                      ...prev,
                      targetCpa: parseFloat(e?.target?.value)
                    }))}
                    className="mt-1"
                  />
                ) : (
                  <div className="text-sm text-muted-foreground mt-1">
                    {formatCurrency(currentCampaign?.targetCpa)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Bid Strategy</label>
                <div className="text-sm text-muted-foreground mt-1">
                  {currentCampaign?.bidStrategy}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Quality Score</label>
                <div className="text-sm text-muted-foreground mt-1">
                  {currentCampaign?.qualityScore}/10
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Structure */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Campaign Structure</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="Layers" size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">Ad Groups</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {currentCampaign?.adGroups}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="Key" size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">Keywords</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {currentCampaign?.keywords}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="FileText" size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">Ads</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {currentCampaign?.ads}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="Plus" size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground">Extensions</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {currentCampaign?.extensions}
              </span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {currentCampaign?.alerts && currentCampaign?.alerts?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Recent Alerts</h4>
            <div className="space-y-2">
              {currentCampaign?.alerts?.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg"
                >
                  <Icon
                    name={getAlertIcon(alert?.type)}
                    size={16}
                    className={`mt-0.5 ${getAlertColor(alert?.type)}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{alert?.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Campaign Timeline */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Campaign Timeline</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Start Date:</span>
              <span className="text-foreground">{currentCampaign?.startDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">End Date:</span>
              <span className="text-foreground">{currentCampaign?.endDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Modified:</span>
              <span className="text-foreground">
                {currentCampaign?.lastModified?.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;