import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import dataForSeoService from '../../../utils/dataForSeoService';

const KeywordSearchPanel = ({ onKeywordSearch, searchResults, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVolume, setSearchVolume] = useState('');
  const [competition, setCompetition] = useState('');
  const [cpcRange, setCpcRange] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [apiStatus, setApiStatus] = useState('unknown');
  const [showApiSetup, setShowApiSetup] = useState(false);

  // Search volume options
  const volumeOptions = [
    { value: '', label: 'All Volumes' },
    { value: '0-100', label: '0 - 100' },
    { value: '100-1000', label: '100 - 1,000' },
    { value: '1000-10000', label: '1K - 10K' },
    { value: '10000-100000', label: '10K - 100K' },
    { value: '100000+', label: '100K+' }
  ];

  // Competition options
  const competitionOptions = [
    { value: '', label: 'All Competition' },
    { value: 'low', label: 'Low (0.0 - 0.33)' },
    { value: 'medium', label: 'Medium (0.34 - 0.66)' },
    { value: 'high', label: 'High (0.67 - 1.0)' }
  ];

  // CPC range options
  const cpcOptions = [
    { value: '', label: 'All CPC Ranges' },
    { value: '0-1', label: '$0.00 - $1.00' },
    { value: '1-5', label: '$1.00 - $5.00' },
    { value: '5-10', label: '$5.00 - $10.00' },
    { value: '10+', label: '$10.00+' }
  ];

  // Initialize component
  useEffect(() => {
    // Load search history from localStorage
    const savedHistory = localStorage.getItem('keyword_search_history');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }

    // Test DataForSEO API connection
    testApiConnection();
  }, []);

  // Test API connection
  const testApiConnection = async () => {
    try {
      const result = await dataForSeoService?.testConnection();
      setApiStatus(result?.success ? 'connected' : 'disconnected');
      
      if (!result?.success && result?.needsSetup) {
        setShowApiSetup(true);
      }
    } catch (error) {
      console.error('API connection test failed:', error);
      setApiStatus('error');
    }
  };

  // Handle keyword search
  const handleSearch = async () => {
    if (!searchQuery?.trim()) return;
    
    const searchParams = {
      keyword: searchQuery?.trim(),
      searchVolume: searchVolume,
      competition: competition,
      cpcRange: cpcRange,
      locationCode: 2840, // USA
      languageCode: 'en' // English
    };
    
    try {
      // Call the parent handler which will use DataForSEO service
      await onKeywordSearch(searchParams);
      
      // Add to search history
      addToSearchHistory(searchQuery?.trim());
      
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  // Add search to history
  const addToSearchHistory = (query) => {
    const newHistory = [query, ...searchHistory?.filter(item => item !== query)]?.slice(0, 10);
    setSearchHistory(newHistory);
    
    // Save to localStorage
    try {
      localStorage.setItem('keyword_search_history', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle history item click
  const handleHistoryClick = (query) => {
    setSearchQuery(query);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchVolume('');
    setCompetition('');
    setCpcRange('');
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('keyword_search_history');
  };

  // Get API status indicator
  const getApiStatusIndicator = () => {
    switch (apiStatus) {
      case 'connected':
        return (
          <div className="flex items-center text-sm text-success">
            <Icon name="CheckCircle" size={14} className="mr-1" />
            <span>DataForSEO Connected</span>
          </div>
        );
      case 'disconnected':
        return (
          <div className="flex items-center text-sm text-warning">
            <Icon name="AlertTriangle" size={14} className="mr-1" />
            <span>Using Demo Data</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center text-sm text-destructive">
            <Icon name="XCircle" size={14} className="mr-1" />
            <span>API Error</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-sm text-muted-foreground">
            <Icon name="Loader" size={14} className="mr-1 animate-spin" />
            <span>Checking Connection...</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full">
      {/* Header with API status */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="Search" size={20} className="mr-2 text-primary" />
            Keyword Research
          </h3>
          <div className="mt-1">
            {getApiStatusIndicator()}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={testApiConnection}
            iconName="RefreshCw"
            iconSize={14}
            className="text-muted-foreground"
          >
            Test API
          </Button>
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
      </div>
      {/* API Setup Notice */}
      {showApiSetup && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <Icon name="Info" size={16} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-1">DataForSEO API Setup Required</p>
              <p className="text-blue-700 mb-2">
                To access real keyword data, add your DataForSEO credentials to the environment variables:
              </p>
              <ul className="text-blue-700 text-xs space-y-1 ml-4 list-disc">
                <li>VITE_DATAFORSEO_USERNAME=your-username</li>
                <li>VITE_DATAFORSEO_PASSWORD=your-password</li>
              </ul>
              <button
                onClick={() => setShowApiSetup(false)}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Main Search Input */}
      <div className="mb-6">
        <Input
          label="Search Keywords"
          type="text"
          placeholder="Enter seed keywords or phrases... (e.g., 'digital marketing')"
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
          {isLoading ? 'Searching Keywords...' : 'Search Keywords with DataForSEO'}
        </Button>
      </div>
      {/* Advanced Filters */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-medium text-foreground flex items-center">
          <Icon name="Filter" size={14} className="mr-2" />
          Advanced Filters
        </h4>
        
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
      {searchHistory?.length > 0 && (
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-foreground flex items-center">
              <Icon name="Clock" size={14} className="mr-2" />
              Recent Searches
            </h4>
            <button
              onClick={clearHistory}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {searchHistory?.map((query, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(query)}
                className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors flex items-center"
              >
                <Icon name="Search" size={12} className="mr-2 flex-shrink-0" />
                <span className="truncate">{query}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Search Results Summary */}
      {searchResults && searchResults?.length > 0 && (
        <div className="border-t border-border pt-4 mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center">
              <Icon name="Target" size={14} className="mr-1" />
              Found {searchResults?.length} keywords
            </span>
            <div className="flex items-center text-success">
              <Icon name="CheckCircle" size={14} className="mr-1" />
              <span>Updated {new Date()?.toLocaleTimeString()}</span>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-muted/50 p-2 rounded">
              <div className="font-medium">Avg. Volume</div>
              <div className="text-muted-foreground">
                {Math.round(searchResults?.reduce((sum, k) => sum + (k?.volume || 0), 0) / searchResults?.length || 0)?.toLocaleString()}
              </div>
            </div>
            <div className="bg-muted/50 p-2 rounded">
              <div className="font-medium">Avg. CPC</div>
              <div className="text-muted-foreground">
                ${(searchResults?.reduce((sum, k) => sum + (k?.cpc || 0), 0) / searchResults?.length || 0)?.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Quick Actions */}
      <div className="border-t border-border pt-4 mt-4">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
          <Icon name="Zap" size={14} className="mr-2" />
          Quick Actions
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Download"
            iconPosition="left"
            iconSize={14}
            className="justify-start text-muted-foreground text-xs"
            disabled={!searchResults?.length}
          >
            Export CSV
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            iconSize={14}
            className="justify-start text-muted-foreground text-xs"
            disabled={!searchResults?.length}
          >
            Add to Campaign
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Share"
            iconPosition="left"
            iconSize={14}
            className="justify-start text-muted-foreground text-xs"
            disabled={!searchResults?.length}
          >
            Share Results
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="BookOpen"
            iconPosition="left"
            iconSize={14}
            className="justify-start text-muted-foreground text-xs"
          >
            Save Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KeywordSearchPanel;