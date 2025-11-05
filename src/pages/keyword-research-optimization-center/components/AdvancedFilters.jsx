import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AdvancedFilters = ({ onFiltersChange, onSaveFilter, savedFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    searchVolume: { min: '', max: '' },
    cpc: { min: '', max: '' },
    competition: '',
    qualityScore: { min: '', max: '' },
    conversionRate: { min: '', max: '' },
    impressionShare: { min: '', max: '' },
    matchTypes: [],
    status: [],
    dateRange: '30d',
    regexPattern: '',
    excludeNegatives: true,
    includeZeroVolume: false
  });

  // Filter options
  const competitionOptions = [
    { value: '', label: 'All Competition Levels' },
    { value: 'low', label: 'Low (0.0 - 0.33)' },
    { value: 'medium', label: 'Medium (0.34 - 0.66)' },
    { value: 'high', label: 'High (0.67 - 1.0)' }
  ];

  const dateRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '12m', label: 'Last 12 months' },
    { value: 'custom', label: 'Custom range' }
  ];

  const matchTypeOptions = [
    { value: 'exact', label: 'Exact Match' },
    { value: 'phrase', label: 'Phrase Match' },
    { value: 'broad', label: 'Broad Match' },
    { value: 'broad_modified', label: 'Broad Match Modified' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'removed', label: 'Removed' }
  ];

  // Mock saved filters
  const mockSavedFilters = [
    {
      id: 'filter-1',
      name: 'High Volume Low Competition',
      description: 'Keywords with 1K+ volume and low competition',
      filters: {
        searchVolume: { min: '1000', max: '' },
        competition: 'low',
        qualityScore: { min: '6', max: '' }
      }
    },
    {
      id: 'filter-2',
      name: 'Underperforming Keywords',
      description: 'Active keywords with low CTR and high CPC',
      filters: {
        cpc: { min: '5', max: '' },
        conversionRate: { min: '', max: '2' },
        status: ['active']
      }
    },
    {
      id: 'filter-3',
      name: 'Opportunity Keywords',
      description: 'High impression share but low conversion rate',
      filters: {
        impressionShare: { min: '70', max: '' },
        conversionRate: { min: '', max: '3' }
      }
    }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleRangeChange = (key, type, value) => {
    const newFilters = {
      ...filters,
      [key]: { ...filters?.[key], [type]: value }
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayChange = (key, value, checked) => {
    const currentArray = filters?.[key] || [];
    const newArray = checked
      ? [...currentArray, value]
      : currentArray?.filter(item => item !== value);
    
    handleFilterChange(key, newArray);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      searchVolume: { min: '', max: '' },
      cpc: { min: '', max: '' },
      competition: '',
      qualityScore: { min: '', max: '' },
      conversionRate: { min: '', max: '' },
      impressionShare: { min: '', max: '' },
      matchTypes: [],
      status: [],
      dateRange: '30d',
      regexPattern: '',
      excludeNegatives: true,
      includeZeroVolume: false
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const applySavedFilter = (savedFilter) => {
    setFilters(savedFilter?.filters);
    onFiltersChange(savedFilter?.filters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.searchVolume?.min || filters?.searchVolume?.max) count++;
    if (filters?.cpc?.min || filters?.cpc?.max) count++;
    if (filters?.competition) count++;
    if (filters?.qualityScore?.min || filters?.qualityScore?.max) count++;
    if (filters?.conversionRate?.min || filters?.conversionRate?.max) count++;
    if (filters?.impressionShare?.min || filters?.impressionShare?.max) count++;
    if (filters?.matchTypes?.length > 0) count++;
    if (filters?.status?.length > 0) count++;
    if (filters?.regexPattern) count++;
    return count;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="left"
          iconSize={16}
          className="text-foreground font-medium"
        >
          Advanced Filters
          {getActiveFilterCount() > 0 && (
            <span className="ml-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </Button>
        
        {getActiveFilterCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            iconName="X"
            iconSize={14}
            className="text-muted-foreground"
          >
            Clear All
          </Button>
        )}
      </div>
      {isExpanded && (
        <div className="space-y-6">
          {/* Saved Filters */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Quick Filters</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {mockSavedFilters?.map((savedFilter) => (
                <button
                  key={savedFilter?.id}
                  onClick={() => applySavedFilter(savedFilter)}
                  className="text-left p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="font-medium text-sm text-foreground mb-1">
                    {savedFilter?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {savedFilter?.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Numeric Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Search Volume */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Search Volume</h4>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters?.searchVolume?.min}
                  onChange={(e) => handleRangeChange('searchVolume', 'min', e?.target?.value)}
                  className="flex-1"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters?.searchVolume?.max}
                  onChange={(e) => handleRangeChange('searchVolume', 'max', e?.target?.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* CPC Range */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">CPC Range ($)</h4>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Min"
                  value={filters?.cpc?.min}
                  onChange={(e) => handleRangeChange('cpc', 'min', e?.target?.value)}
                  className="flex-1"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Max"
                  value={filters?.cpc?.max}
                  onChange={(e) => handleRangeChange('cpc', 'max', e?.target?.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Quality Score */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Quality Score</h4>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Min"
                  value={filters?.qualityScore?.min}
                  onChange={(e) => handleRangeChange('qualityScore', 'min', e?.target?.value)}
                  className="flex-1"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Max"
                  value={filters?.qualityScore?.max}
                  onChange={(e) => handleRangeChange('qualityScore', 'max', e?.target?.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Conversion Rate */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Conversion Rate (%)</h4>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Min"
                  value={filters?.conversionRate?.min}
                  onChange={(e) => handleRangeChange('conversionRate', 'min', e?.target?.value)}
                  className="flex-1"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Max"
                  value={filters?.conversionRate?.max}
                  onChange={(e) => handleRangeChange('conversionRate', 'max', e?.target?.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Impression Share */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Impression Share (%)</h4>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Min"
                  value={filters?.impressionShare?.min}
                  onChange={(e) => handleRangeChange('impressionShare', 'min', e?.target?.value)}
                  className="flex-1"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Max"
                  value={filters?.impressionShare?.max}
                  onChange={(e) => handleRangeChange('impressionShare', 'max', e?.target?.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Competition Level */}
            <div>
              <Select
                label="Competition Level"
                options={competitionOptions}
                value={filters?.competition}
                onChange={(value) => handleFilterChange('competition', value)}
              />
            </div>
          </div>

          {/* Categorical Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Match Types */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Match Types</h4>
              <div className="space-y-2">
                {matchTypeOptions?.map((option) => (
                  <Checkbox
                    key={option?.value}
                    label={option?.label}
                    checked={filters?.matchTypes?.includes(option?.value)}
                    onChange={(e) => handleArrayChange('matchTypes', option?.value, e?.target?.checked)}
                  />
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Status</h4>
              <div className="space-y-2">
                {statusOptions?.map((option) => (
                  <Checkbox
                    key={option?.value}
                    label={option?.label}
                    checked={filters?.status?.includes(option?.value)}
                    onChange={(e) => handleArrayChange('status', option?.value, e?.target?.checked)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Advanced Options</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Date Range"
                options={dateRangeOptions}
                value={filters?.dateRange}
                onChange={(value) => handleFilterChange('dateRange', value)}
              />
              
              <Input
                label="Regex Pattern"
                type="text"
                placeholder="e.g., ^(buy|purchase).*"
                value={filters?.regexPattern}
                onChange={(e) => handleFilterChange('regexPattern', e?.target?.value)}
                description="Use regex to match keyword patterns"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Checkbox
                label="Exclude negative keywords from results"
                checked={filters?.excludeNegatives}
                onChange={(e) => handleFilterChange('excludeNegatives', e?.target?.checked)}
              />
              <Checkbox
                label="Include zero search volume keywords"
                checked={filters?.includeZeroVolume}
                onChange={(e) => handleFilterChange('includeZeroVolume', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              iconName="Save"
              iconPosition="left"
              iconSize={16}
              onClick={() => onSaveFilter(filters)}
            >
              Save Filter
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={clearAllFilters}
              >
                Reset
              </Button>
              <Button
                variant="default"
                iconName="Filter"
                iconPosition="left"
                iconSize={16}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;