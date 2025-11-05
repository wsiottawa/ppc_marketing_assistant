import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import KeywordSearchPanel from './components/KeywordSearchPanel';
import CompetitorAnalysisMatrix from './components/CompetitorAnalysisMatrix';
import RecommendationEngine from './components/RecommendationEngine';
import KeywordPerformanceTable from './components/KeywordPerformanceTable';
import AdvancedFilters from './components/AdvancedFilters';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const KeywordResearchOptimizationCenter = () => {
  const [activeTab, setActiveTab] = useState('research');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedClient, setSelectedClient] = useState('acme-corp');
  const [selectedKeyword, setSelectedKeyword] = useState('ppc management services');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keywordData, setKeywordData] = useState([]);
  const [filters, setFilters] = useState({});

  // Mock clients data
  const clients = [
    { value: 'acme-corp', label: 'Acme Corporation' },
    { value: 'tech-solutions', label: 'Tech Solutions Inc.' },
    { value: 'retail-plus', label: 'Retail Plus' },
    { value: 'startup-hub', label: 'Startup Hub' }
  ];

  // Tab configuration
  const tabs = [
    {
      id: 'research',
      label: 'Research',
      icon: 'Search',
      description: 'Keyword discovery and competitive analysis'
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: 'BarChart3',
      description: 'Monitor keyword performance metrics'
    }
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboardShortcuts = (e) => {
      // Ctrl+K for keyword search
      if (e?.ctrlKey && e?.key === 'k') {
        e?.preventDefault();
        // Focus on search input (would need ref in real implementation)
        console.log('Focus keyword search');
      }
      
      // Alt+A for add to campaign
      if (e?.altKey && e?.key === 'a') {
        e?.preventDefault();
        console.log('Add selected keywords to campaign');
      }
      
      // Tab switching with Ctrl+1, Ctrl+2
      if (e?.ctrlKey && e?.key === '1') {
        e?.preventDefault();
        setActiveTab('research');
      }
      if (e?.ctrlKey && e?.key === '2') {
        e?.preventDefault();
        setActiveTab('performance');
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts);
  }, []);

  // Mock keyword search function
  const handleKeywordSearch = async (searchParams) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        {
          keyword: searchParams?.query,
          volume: 12450,
          competition: 0.67,
          cpc: 4.25,
          difficulty: 'Medium',
          trend: 'Stable'
        },
        {
          keyword: `${searchParams?.query} services`,
          volume: 8920,
          competition: 0.45,
          cpc: 3.89,
          difficulty: 'Low',
          trend: 'Rising'
        },
        {
          keyword: `best ${searchParams?.query}`,
          volume: 5670,
          competition: 0.78,
          cpc: 5.12,
          difficulty: 'High',
          trend: 'Declining'
        }
      ];
      
      setSearchResults(mockResults);
      setIsLoading(false);
    }, 1500);
  };

  // Handle recommendation application
  const handleApplyRecommendations = (recommendations) => {
    console.log('Applying recommendations:', recommendations);
    // In real implementation, this would update campaigns
  };

  // Handle keyword updates
  const handleKeywordUpdate = (keywordId, field, value) => {
    console.log('Updating keyword:', keywordId, field, value);
    // In real implementation, this would update the keyword data
  };

  // Handle bulk actions
  const handleBulkAction = (action, keywordIds) => {
    console.log('Bulk action:', action, keywordIds);
    // In real implementation, this would perform bulk operations
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    console.log('Filters updated:', newFilters);
  };

  // Handle save filter
  const handleSaveFilter = (filterConfig) => {
    console.log('Saving filter:', filterConfig);
    // In real implementation, this would save to user preferences
  };

  const renderResearchTab = () => (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
      {/* Left Column - Search Panel */}
      <div className="xl:col-span-1">
        <KeywordSearchPanel
          onKeywordSearch={handleKeywordSearch}
          searchResults={searchResults}
          isLoading={isLoading}
        />
      </div>

      {/* Center Column - Competitor Analysis */}
      <div className="xl:col-span-1">
        <CompetitorAnalysisMatrix
          selectedKeyword={selectedKeyword}
          competitorData={[]}
        />
      </div>

      {/* Right Column - Recommendations */}
      <div className="xl:col-span-1">
        <RecommendationEngine
          selectedKeywords={[selectedKeyword]}
          onApplyRecommendations={handleApplyRecommendations}
        />
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6 h-full flex flex-col">
      {/* Advanced Filters */}
      <AdvancedFilters
        onFiltersChange={handleFiltersChange}
        onSaveFilter={handleSaveFilter}
        savedFilters={[]}
      />

      {/* Performance Table */}
      <div className="flex-1">
        <KeywordPerformanceTable
          keywords={keywordData}
          onKeywordUpdate={handleKeywordUpdate}
          onBulkAction={handleBulkAction}
        />
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Keyword Research & Optimization Center - PPC Assistant</title>
        <meta name="description" content="Comprehensive keyword intelligence platform for PPC campaign optimization and competitive analysis" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header 
          onClientChange={setSelectedClient}
          selectedClient={selectedClient}
          clients={clients}
        />
        
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className={`pt-16 transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          <div className="p-6 h-screen">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground flex items-center">
                  <Icon name="Search" size={24} className="mr-3 text-primary" />
                  Keyword Research & Optimization Center
                </h1>
                <p className="text-muted-foreground mt-1">
                  Discover high-value keywords and optimize campaign performance with AI-powered insights
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {/* Sync Status */}
                <div className="flex items-center space-x-2 text-sm text-success">
                  <Icon name="Wifi" size={16} />
                  <span>Live Data</span>
                </div>

                {/* Quick Actions */}
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                  iconSize={16}
                >
                  Export Data
                </Button>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={16}
                >
                  Add Keywords
                </Button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 ${
                    activeTab === tab?.id
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title={tab?.description}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>

            {/* Keyboard Shortcuts Info */}
            <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center text-sm text-muted-foreground">
                <Icon name="Keyboard" size={16} className="mr-2" />
                <span>Shortcuts: </span>
                <kbd className="ml-2 px-2 py-1 bg-muted rounded text-xs">Ctrl+K</kbd>
                <span className="mx-1">Search</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt+A</kbd>
                <span className="mx-1">Add to Campaign</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Shift+Click</kbd>
                <span className="mx-1">Range Select</span>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'research' && renderResearchTab()}
              {activeTab === 'performance' && renderPerformanceTab()}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default KeywordResearchOptimizationCenter;