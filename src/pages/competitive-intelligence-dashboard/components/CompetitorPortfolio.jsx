import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const CompetitorPortfolio = ({ selectedClient, onCompetitorSelect }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('market-share');
  const [filterBy, setFilterBy] = useState('all');

  // Mock competitor data
  const competitorData = [
  {
    id: 'comp-1',
    domain: 'techsolutions.com',
    name: 'Tech Solutions Inc',
    marketShare: 24.5,
    estimatedSpend: 125000,
    impressionShare: 18.2,
    avgPosition: 2.1,
    activeAds: 47,
    keywords: 1250,
    trend: 'up',
    trendValue: 12.3,
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_145b46d9f-1762350411638.png",
    logoAlt: 'Tech Solutions company logo with blue geometric design'
  },
  {
    id: 'comp-2',
    domain: 'innovatecorp.com',
    name: 'Innovate Corp',
    marketShare: 19.8,
    estimatedSpend: 98000,
    impressionShare: 15.7,
    avgPosition: 2.8,
    activeAds: 32,
    keywords: 890,
    trend: 'down',
    trendValue: -5.2,
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_189e740c8-1762350412307.png",
    logoAlt: 'Innovate Corp circular logo with orange and white branding'
  },
  {
    id: 'comp-3',
    domain: 'digitalfirst.com',
    name: 'Digital First',
    marketShare: 16.3,
    estimatedSpend: 87500,
    impressionShare: 12.4,
    avgPosition: 3.2,
    activeAds: 28,
    keywords: 675,
    trend: 'up',
    trendValue: 8.7,
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_17fce4f81-1762350414824.png",
    logoAlt: 'Digital First modern logo with purple gradient and clean typography'
  },
  {
    id: 'comp-4',
    domain: 'smartbiz.com',
    name: 'Smart Business',
    marketShare: 14.2,
    estimatedSpend: 76000,
    impressionShare: 11.8,
    avgPosition: 3.5,
    activeAds: 24,
    keywords: 542,
    trend: 'stable',
    trendValue: 1.2,
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_138f19f3e-1762350413197.png",
    logoAlt: 'Smart Business logo featuring green checkmark and professional font'
  },
  {
    id: 'comp-5',
    domain: 'nextgentech.com',
    name: 'NextGen Tech',
    marketShare: 12.7,
    estimatedSpend: 68000,
    impressionShare: 9.3,
    avgPosition: 4.1,
    activeAds: 19,
    keywords: 423,
    trend: 'up',
    trendValue: 15.8,
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_10c5ff017-1762350412489.png",
    logoAlt: 'NextGen Tech futuristic logo with silver metallic finish and tech elements'
  },
  {
    id: 'comp-6',
    domain: 'primeservices.com',
    name: 'Prime Services',
    marketShare: 8.9,
    estimatedSpend: 45000,
    impressionShare: 7.2,
    avgPosition: 4.8,
    activeAds: 15,
    keywords: 298,
    trend: 'down',
    trendValue: -3.4,
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1b9d6660a-1762350412646.png",
    logoAlt: 'Prime Services elegant logo with gold crown symbol and serif typography'
  }];


  const sortOptions = [
  { value: 'market-share', label: 'Market Share' },
  { value: 'spend', label: 'Estimated Spend' },
  { value: 'impression-share', label: 'Impression Share' },
  { value: 'position', label: 'Average Position' },
  { value: 'keywords', label: 'Keyword Count' }];


  const filterOptions = [
  { value: 'all', label: 'All Competitors' },
  { value: 'top-tier', label: 'Top Tier (>15%)' },
  { value: 'mid-tier', label: 'Mid Tier (5-15%)' },
  { value: 'emerging', label: 'Emerging (<5%)' },
  { value: 'trending-up', label: 'Trending Up' },
  { value: 'trending-down', label: 'Trending Down' }];


  const getSortedAndFilteredData = () => {
    let filtered = [...competitorData];

    // Apply filters
    switch (filterBy) {
      case 'top-tier':
        filtered = filtered?.filter((comp) => comp?.marketShare > 15);
        break;
      case 'mid-tier':
        filtered = filtered?.filter((comp) => comp?.marketShare >= 5 && comp?.marketShare <= 15);
        break;
      case 'emerging':
        filtered = filtered?.filter((comp) => comp?.marketShare < 5);
        break;
      case 'trending-up':
        filtered = filtered?.filter((comp) => comp?.trend === 'up');
        break;
      case 'trending-down':
        filtered = filtered?.filter((comp) => comp?.trend === 'down');
        break;
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'market-share':
          return b?.marketShare - a?.marketShare;
        case 'spend':
          return b?.estimatedSpend - a?.estimatedSpend;
        case 'impression-share':
          return b?.impressionShare - a?.impressionShare;
        case 'position':
          return a?.avgPosition - b?.avgPosition;
        case 'keywords':
          return b?.keywords - a?.keywords;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':return 'TrendingUp';
      case 'down':return 'TrendingDown';
      case 'stable':return 'Minus';
      default:return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':return 'text-success';
      case 'down':return 'text-error';
      case 'stable':return 'text-muted-foreground';
      default:return 'text-muted-foreground';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const handleCompetitorClick = (competitor) => {
    if (onCompetitorSelect) {
      onCompetitorSelect(competitor);
    }
  };

  const filteredData = getSortedAndFilteredData();

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Competitor Portfolio</h3>
          <p className="text-sm text-muted-foreground">Market share and competitive landscape</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            iconName="Grid3X3"
            iconSize={16}
            onClick={() => setViewMode('grid')} />

          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            iconName="List"
            iconSize={16}
            onClick={() => setViewMode('list')} />

        </div>
      </div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by..."
            className="w-full" />

        </div>
        <div className="flex-1">
          <Select
            options={filterOptions}
            value={filterBy}
            onChange={setFilterBy}
            placeholder="Filter by..."
            className="w-full" />

        </div>
        <Button
          variant="outline"
          size="sm"
          iconName="Download"
          iconPosition="left"
          iconSize={16}>

          Export
        </Button>
      </div>
      {/* Market Share Overview */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-3">Market Share Distribution</h4>
        <div className="space-y-2">
          {filteredData?.slice(0, 5)?.map((competitor) =>
          <div key={competitor?.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-primary rounded-sm"></div>
                <span className="text-sm text-foreground">{competitor?.name}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{competitor?.marketShare}%</span>
            </div>
          )}
        </div>
      </div>
      {/* Competitor Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
        {filteredData?.map((competitor) =>
        <div
          key={competitor?.id}
          className="p-4 border border-border rounded-lg hover:shadow-elevated nav-transition cursor-pointer"
          onClick={() => handleCompetitorClick(competitor)}>

            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  <img
                  src={competitor?.logo}
                  alt={competitor?.logoAlt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/images/no_image.png';
                  }} />

                </div>
                <div>
                  <h4 className="font-medium text-foreground">{competitor?.name}</h4>
                  <p className="text-sm text-muted-foreground">{competitor?.domain}</p>
                </div>
              </div>
              <div className={`flex items-center space-x-1 ${getTrendColor(competitor?.trend)}`}>
                <Icon name={getTrendIcon(competitor?.trend)} size={16} />
                <span className="text-sm font-medium">{competitor?.trendValue}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Market Share</p>
                <p className="font-medium text-foreground">{competitor?.marketShare}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Est. Spend</p>
                <p className="font-medium text-foreground">{formatCurrency(competitor?.estimatedSpend)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Impression Share</p>
                <p className="font-medium text-foreground">{competitor?.impressionShare}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg Position</p>
                <p className="font-medium text-foreground">{competitor?.avgPosition}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>{competitor?.activeAds} ads</span>
                <span>{competitor?.keywords} keywords</span>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </div>
          </div>
        )}
      </div>
      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">{filteredData?.length}</p>
            <p className="text-sm text-muted-foreground">Competitors</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {filteredData?.reduce((sum, comp) => sum + comp?.marketShare, 0)?.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">Total Share</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(filteredData?.reduce((sum, comp) => sum + comp?.estimatedSpend, 0))}
            </p>
            <p className="text-sm text-muted-foreground">Total Spend</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {filteredData?.reduce((sum, comp) => sum + comp?.keywords, 0)?.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Keywords</p>
          </div>
        </div>
      </div>
    </div>);

};

export default CompetitorPortfolio;