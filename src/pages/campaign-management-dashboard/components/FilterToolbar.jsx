import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const FilterToolbar = ({ onFiltersChange, selectedCampaigns, onBulkAction }) => {
  const [activeFilters, setActiveFilters] = useState({
    client: '',
    status: '',
    performance: '',
    dateRange: '7d',
    minSpend: '',
    maxSpend: ''
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedPresets] = useState([
    { value: 'high-performers', label: 'High Performers' },
    { value: 'underperforming', label: 'Underperforming' },
    { value: 'paused-campaigns', label: 'Paused Campaigns' },
    { value: 'budget-alerts', label: 'Budget Alerts' }
  ]);

  // Filter options
  const clientOptions = [
    { value: '', label: 'All Clients' },
    { value: 'acme-corp', label: 'Acme Corporation' },
    { value: 'tech-solutions', label: 'Tech Solutions Inc.' },
    { value: 'retail-plus', label: 'Retail Plus' },
    { value: 'startup-hub', label: 'Startup Hub' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'error', label: 'Error' }
  ];

  const performanceOptions = [
    { value: '', label: 'All Performance' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'poor', label: 'Poor' }
  ];

  const dateRangeOptions = [
    { value: '1d', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const bulkActions = [
    { value: 'pause', label: 'Pause Campaigns', icon: 'Pause' },
    { value: 'resume', label: 'Resume Campaigns', icon: 'Play' },
    { value: 'adjust-budget', label: 'Adjust Budget', icon: 'DollarSign' },
    { value: 'change-bid', label: 'Change Bid Strategy', icon: 'Target' },
    { value: 'export', label: 'Export Data', icon: 'Download' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePresetLoad = (presetValue) => {
    let presetFilters = {};
    
    switch (presetValue) {
      case 'high-performers':
        presetFilters = { performance: 'excellent', status: 'active' };
        break;
      case 'underperforming':
        presetFilters = { performance: 'poor', status: 'active' };
        break;
      case 'paused-campaigns':
        presetFilters = { status: 'paused' };
        break;
      case 'budget-alerts':
        presetFilters = { status: 'active', minSpend: '10000' };
        break;
      default:
        presetFilters = {};
    }
    
    setActiveFilters(prev => ({ ...prev, ...presetFilters }));
    onFiltersChange({ ...activeFilters, ...presetFilters });
  };

  const clearFilters = () => {
    const clearedFilters = {
      client: '',
      status: '',
      performance: '',
      dateRange: '7d',
      minSpend: '',
      maxSpend: ''
    };
    setActiveFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters)?.filter(value => 
      value !== '' && value !== '7d'
    )?.length;
  };

  const handleBulkAction = (action) => {
    if (selectedCampaigns?.length === 0) {
      alert('Please select campaigns first');
      return;
    }
    onBulkAction(action, selectedCampaigns);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Main Filter Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Quick Filters */}
          <div className="flex items-center space-x-3">
            <Select
              options={clientOptions}
              value={activeFilters?.client}
              onChange={(value) => handleFilterChange('client', value)}
              placeholder="Client"
              className="min-w-40"
            />
            
            <Select
              options={statusOptions}
              value={activeFilters?.status}
              onChange={(value) => handleFilterChange('status', value)}
              placeholder="Status"
              className="min-w-32"
            />
            
            <Select
              options={dateRangeOptions}
              value={activeFilters?.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
              className="min-w-36"
            />
          </div>

          {/* Filter Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
              iconPosition="right"
              iconSize={16}
            >
              Advanced
              {getActiveFilterCount() > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </Button>
            
            {getActiveFilterCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                iconName="X"
                iconPosition="left"
                iconSize={16}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCampaigns?.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {selectedCampaigns?.length} selected
            </span>
            <Select
              options={bulkActions}
              value=""
              onChange={handleBulkAction}
              placeholder="Bulk Actions"
              className="min-w-36"
            />
          </div>
        )}
      </div>
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-border pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Performance"
              options={performanceOptions}
              value={activeFilters?.performance}
              onChange={(value) => handleFilterChange('performance', value)}
            />
            
            <Input
              label="Min Spend ($)"
              type="number"
              placeholder="0"
              value={activeFilters?.minSpend}
              onChange={(e) => handleFilterChange('minSpend', e?.target?.value)}
            />
            
            <Input
              label="Max Spend ($)"
              type="number"
              placeholder="No limit"
              value={activeFilters?.maxSpend}
              onChange={(e) => handleFilterChange('maxSpend', e?.target?.value)}
            />
            
            <Select
              label="Saved Presets"
              options={savedPresets}
              value=""
              onChange={handlePresetLoad}
              placeholder="Load preset..."
            />
          </div>
          
          {/* Custom Date Range */}
          {activeFilters?.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value=""
                onChange={() => {}}
              />
              <Input
                label="End Date"
                type="date"
                value=""
                onChange={() => {}}
              />
            </div>
          )}
        </div>
      )}
      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex items-center space-x-2 pt-2 border-t border-border">
          <span className="text-sm font-medium text-foreground">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters)?.map(([key, value]) => {
              if (!value || (key === 'dateRange' && value === '7d')) return null;
              
              const getFilterLabel = () => {
                switch (key) {
                  case 'client':
                    return clientOptions?.find(opt => opt?.value === value)?.label || value;
                  case 'status':
                    return statusOptions?.find(opt => opt?.value === value)?.label || value;
                  case 'performance':
                    return performanceOptions?.find(opt => opt?.value === value)?.label || value;
                  case 'dateRange':
                    return dateRangeOptions?.find(opt => opt?.value === value)?.label || value;
                  case 'minSpend':
                    return `Min: $${value}`;
                  case 'maxSpend':
                    return `Max: $${value}`;
                  default:
                    return value;
                }
              };
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center space-x-1 px-2 py-1 bg-accent text-accent-foreground text-xs rounded-md"
                >
                  <span>{getFilterLabel()}</span>
                  <button
                    onClick={() => handleFilterChange(key, key === 'dateRange' ? '7d' : '')}
                    className="hover:bg-accent-foreground/20 rounded-sm p-0.5"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterToolbar;