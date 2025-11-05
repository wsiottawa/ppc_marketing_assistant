import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import GoogleAdsService from '../../../utils/googleAdsService';

const KeywordInsightsTable = ({ keywords, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMatchType, setFilterMatchType] = useState('all');
  const [sortBy, setSortBy] = useState('impressions');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const matchTypeOptions = [
    { value: 'all', label: 'All Match Types' },
    { value: 'EXACT', label: 'Exact Match' },
    { value: 'PHRASE', label: 'Phrase Match' },
    { value: 'BROAD', label: 'Broad Match' }
  ];

  const sortOptions = [
    { value: 'impressions', label: 'Impressions' },
    { value: 'clicks', label: 'Clicks' },
    { value: 'ctr', label: 'CTR' },
    { value: 'cost', label: 'Cost' },
    { value: 'conversions', label: 'Conversions' },
    { value: 'averageCpc', label: 'Avg. CPC' },
    { value: 'keyword', label: 'Keyword' }
  ];

  // Filter and sort keywords
  const filteredAndSortedKeywords = useMemo(() => {
    if (!keywords?.length) return [];

    let filtered = keywords?.filter(keyword => {
      const matchesSearch = !searchTerm || 
        keyword?.keyword?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        keyword?.campaignName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        keyword?.adGroupName?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      
      const matchesType = filterMatchType === 'all' || keyword?.matchType === filterMatchType;
      
      return matchesSearch && matchesType;
    });

    // Sort filtered results
    filtered?.sort((a, b) => {
      let aValue = a?.[sortBy] || 0;
      let bValue = b?.[sortBy] || 0;
      
      if (sortBy === 'keyword') {
        aValue = a?.keyword?.toLowerCase() || '';
        bValue = b?.keyword?.toLowerCase() || '';
        return sortOrder === 'asc' ? aValue?.localeCompare(bValue) : bValue?.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [keywords, searchTerm, filterMatchType, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedKeywords?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedKeywords = filteredAndSortedKeywords?.slice(startIndex, endIndex);

  // Calculate summary metrics for filtered keywords
  const summaryMetrics = useMemo(() => {
    if (!filteredAndSortedKeywords?.length) return {};
    
    return {
      totalKeywords: filteredAndSortedKeywords?.length,
      totalImpressions: filteredAndSortedKeywords?.reduce((sum, kw) => sum + (kw?.impressions || 0), 0),
      totalClicks: filteredAndSortedKeywords?.reduce((sum, kw) => sum + (kw?.clicks || 0), 0),
      totalCost: filteredAndSortedKeywords?.reduce((sum, kw) => sum + (kw?.cost || 0), 0),
      averageCtr: filteredAndSortedKeywords?.reduce((sum, kw) => sum + (kw?.ctr || 0), 0) / filteredAndSortedKeywords?.length,
      averageCpc: filteredAndSortedKeywords?.reduce((sum, kw) => sum + (kw?.averageCpc || 0), 0) / filteredAndSortedKeywords?.length
    };
  }, [filteredAndSortedKeywords]);

  const getMatchTypeColor = (matchType) => {
    switch (matchType) {
      case 'EXACT': return 'bg-green-100 text-green-800';
      case 'PHRASE': return 'bg-blue-100 text-blue-800';
      case 'BROAD': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchTypeSymbol = (matchType) => {
    switch (matchType) {
      case 'EXACT': return '[keyword]';
      case 'PHRASE': return '"keyword"';
      case 'BROAD': return 'keyword';
      default: return 'keyword';
    }
  };

  const getPerformanceRating = (keyword) => {
    const ctr = keyword?.ctr || 0;
    const conversions = keyword?.conversions || 0;
    
    if (ctr >= 5 && conversions > 0) return { rating: 'Excellent', color: 'text-green-600' };
    if (ctr >= 3 && conversions > 0) return { rating: 'Good', color: 'text-blue-600' };
    if (ctr >= 1) return { rating: 'Average', color: 'text-yellow-600' };
    return { rating: 'Poor', color: 'text-red-600' };
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Target" size={20} className="text-primary" />
            <span>Keyword Insights</span>
          </h3>
        </div>
        
        <div className="animate-pulse space-y-4">
          <div className="flex space-x-4">
            <div className="bg-muted h-10 rounded-lg flex-1"></div>
            <div className="bg-muted h-10 w-40 rounded-lg"></div>
          </div>
          <div className="bg-muted h-64 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Target" size={20} className="text-primary" />
            <span>Keyword Insights</span>
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Analyze keyword performance and optimization opportunities
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          iconPosition="left"
          iconSize={14}
        >
          Export Keywords
        </Button>
      </div>
      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-background border border-border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Keywords</p>
          <p className="text-lg font-semibold text-foreground">
            {GoogleAdsService?.formatNumber(summaryMetrics?.totalKeywords || 0)}
          </p>
        </div>
        <div className="bg-background border border-border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Impressions</p>
          <p className="text-lg font-semibold text-foreground">
            {GoogleAdsService?.formatNumber(summaryMetrics?.totalImpressions || 0)}
          </p>
        </div>
        <div className="bg-background border border-border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Clicks</p>
          <p className="text-lg font-semibold text-foreground">
            {GoogleAdsService?.formatNumber(summaryMetrics?.totalClicks || 0)}
          </p>
        </div>
        <div className="bg-background border border-border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Avg. CTR</p>
          <p className="text-lg font-semibold text-foreground">
            {GoogleAdsService?.formatPercentage(summaryMetrics?.averageCtr || 0)}
          </p>
        </div>
        <div className="bg-background border border-border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Total Cost</p>
          <p className="text-lg font-semibold text-foreground">
            {GoogleAdsService?.formatCurrency(summaryMetrics?.totalCost || 0)}
          </p>
        </div>
      </div>
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Search keywords, campaigns, or ad groups..."
              value={searchTerm}
              onChange={setSearchTerm}
              iconName="Search"
              iconPosition="left"
            />
          </div>
          
          <Select
            label="Match Type"
            options={matchTypeOptions}
            value={filterMatchType}
            onChange={setFilterMatchType}
            className="min-w-40"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Select
            label="Sort By"
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            className="min-w-32"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
            iconSize={16}
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          />
        </div>
      </div>
      {/* Keywords Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 font-medium text-muted-foreground">Keyword</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Campaign</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Match Type</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Impressions</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Clicks</th>
              <th className="text-right p-3 font-medium text-muted-foreground">CTR</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Cost</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Conversions</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Performance</th>
            </tr>
          </thead>
          <tbody>
            {paginatedKeywords?.map((keyword, index) => {
              const performance = getPerformanceRating(keyword);
              return (
                <tr key={`${keyword?.campaignId}-${keyword?.keyword}-${index}`} className="border-b border-border hover:bg-muted/50">
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{keyword?.keyword}</span>
                      <span className="text-xs text-muted-foreground">
                        {keyword?.adGroupName}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-muted-foreground">{keyword?.campaignName}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col space-y-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${getMatchTypeColor(keyword?.matchType)}`}>
                        {keyword?.matchType}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {getMatchTypeSymbol(keyword?.matchType)?.replace('keyword', keyword?.keyword?.slice(0, 10) + '...')}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-right text-foreground">
                    {GoogleAdsService?.formatNumber(keyword?.impressions)}
                  </td>
                  <td className="p-3 text-right text-foreground">
                    {GoogleAdsService?.formatNumber(keyword?.clicks)}
                  </td>
                  <td className="p-3 text-right text-foreground">
                    {GoogleAdsService?.formatPercentage(keyword?.ctr)}
                  </td>
                  <td className="p-3 text-right text-foreground">
                    {GoogleAdsService?.formatCurrency(keyword?.cost)}
                  </td>
                  <td className="p-3 text-right text-foreground">
                    {keyword?.conversions || 0}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-xs font-medium ${performance?.color}`}>
                      {performance?.rating}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedKeywords?.length)} of {filteredAndSortedKeywords?.length} keywords
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronLeft"
              iconSize={16}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            />
            
            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, totalPages))]?.map((_, i) => {
                const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronRight"
              iconSize={16}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            />
          </div>
        </div>
      )}
      {(!keywords || keywords?.length === 0) && !isLoading && (
        <div className="text-center py-8">
          <Icon name="Target" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No keyword data available</p>
          <p className="text-sm text-muted-foreground mt-1">
            Keywords will appear here once your campaigns are active
          </p>
        </div>
      )}
    </div>
  );
};

export default KeywordInsightsTable;