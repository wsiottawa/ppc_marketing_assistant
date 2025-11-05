import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const KeywordSearchPanel = ({ onKeywordSearch, searchResults, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVolume, setSearchVolume] = useState('');
  const [competition, setCompetition] = useState('');
  const [cpcRange, setCpcRange] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  // Mock search volume options
  const volumeOptions = [
    { value: '', label: 'All Volumes' },
    { value: '0-100', label: '0 - 100' },
    { value: '100-1000', label: '100 - 1,000' },
    { value: '1000-10000', label: '1K - 10K' },
    { value: '10000-100000', label: '10K - 100K' },
    { value: '100000+', label: '100K+' }
  ];

  // Mock competition options
  const competitionOptions = [
    { value: '', label: 'All Competition' },
    { value: 'low', label: 'Low (0.0 - 0.33)' },
    { value: 'medium', label: 'Medium (0.34 - 0.66)' },
    { value: 'high', label: 'High (0.67 - 1.0)' }
  ];

  // Mock CPC range options
  const cpcOptions = [
    { value: '', label: 'All CPC Ranges' },
    { value: '0-1', label: '$0.00 - $1.00' },
    { value: '1-5', label: '$1.00 - $5.00' },
    { value: '5-10', label: '$5.00 - $10.00' },
    { value: '10+', label: '$10.00+' }
  ];

  // Mock search history
  const mockHistory = [
    "digital marketing agency",
    "ppc management software",
    "google ads optimization",
    "keyword research tools",
    "conversion rate optimization"
  ];

  useEffect(() => {
    setSearchHistory(mockHistory);
  }, []);

  const handleSearch = () => {
    if (!searchQuery?.trim()) return;
    
    const searchParams = {
      query: searchQuery,
      volume: searchVolume,
      competition: competition,
      cpc: cpcRange
    };
    
    onKeywordSearch(searchParams);
    
    // Add to search history
    if (!searchHistory?.includes(searchQuery)) {
      setSearchHistory(prev => [searchQuery, ...prev?.slice(0, 4)]);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleSearch();
    }
  };

  const handleHistoryClick = (query) => {
    setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchVolume('');
    setCompetition('');
    setCpcRange('');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Search" size={20} className="mr-2 text-primary" />
          Keyword Research
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          iconName="RotateCcw"
          iconSize={16}
          className="text-muted-foreground"
        >
          Clear Filters
        </Button>
      </div>
      {/* Main Search Input */}
      <div className="mb-6">
        <Input
          label="Search Keywords"
          type="text"
          placeholder="Enter seed keywords or phrases..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          onKeyPress={handleKeyPress}
          className="mb-4"
        />
        <Button
          variant="default"
          onClick={handleSearch}
          loading={isLoading}
          iconName="Search"
          iconPosition="left"
          iconSize={16}
          fullWidth
          disabled={!searchQuery?.trim()}
        >
          Search Keywords
        </Button>
      </div>
      {/* Advanced Filters */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-medium text-foreground">Advanced Filters</h4>
        
        <Select
          label="Search Volume"
          options={volumeOptions}
          value={searchVolume}
          onChange={setSearchVolume}
          placeholder="Select volume range"
        />

        <Select
          label="Competition Level"
          options={competitionOptions}
          value={competition}
          onChange={setCompetition}
          placeholder="Select competition"
        />

        <Select
          label="CPC Range"
          options={cpcOptions}
          value={cpcRange}
          onChange={setCpcRange}
          placeholder="Select CPC range"
        />
      </div>
      {/* Search History */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Recent Searches</h4>
        <div className="space-y-2">
          {searchHistory?.map((query, index) => (
            <button
              key={index}
              onClick={() => handleHistoryClick(query)}
              className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors flex items-center"
            >
              <Icon name="Clock" size={14} className="mr-2" />
              <span className="truncate">{query}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Search Results Summary */}
      {searchResults && searchResults?.length > 0 && (
        <div className="border-t border-border pt-4 mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Found {searchResults?.length} keywords
            </span>
            <div className="flex items-center text-success">
              <Icon name="CheckCircle" size={14} className="mr-1" />
              <span>Updated</span>
            </div>
          </div>
        </div>
      )}
      {/* Quick Actions */}
      <div className="border-t border-border pt-4 mt-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Quick Actions</h4>
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Download"
            iconPosition="left"
            iconSize={14}
            className="w-full justify-start text-muted-foreground"
          >
            Export Keywords
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            iconSize={14}
            className="w-full justify-start text-muted-foreground"
          >
            Add to Campaign
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Share"
            iconPosition="left"
            iconSize={14}
            className="w-full justify-start text-muted-foreground"
          >
            Share Results
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KeywordSearchPanel;