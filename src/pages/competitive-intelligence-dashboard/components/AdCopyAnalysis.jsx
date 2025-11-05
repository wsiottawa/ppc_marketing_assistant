import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AdCopyAnalysis = ({ selectedCompetitor }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [adType, setAdType] = useState('all');
  const [showChanges, setShowChanges] = useState(true);

  // Mock ad copy data
  const adCopyData = [
    {
      id: 'ad-1',
      competitor: 'Tech Solutions Inc',
      headline1: 'Professional IT Services',
      headline2: 'Trusted by 1000+ Companies',
      headline3: 'Get Started Today',
      description1: 'Transform your business with our comprehensive IT solutions. Expert support, cutting-edge technology.',
      description2: 'Call now for a free consultation and discover how we can streamline your operations.',
      displayUrl: 'techsolutions.com/services',
      finalUrl: 'https://techsolutions.com/professional-it-services',
      adType: 'search',
      status: 'active',
      firstSeen: '2025-10-28',
      lastSeen: '2025-11-05',
      changeType: 'new',
      impressions: 12500,
      clicks: 875,
      ctr: 7.0,
      position: 2.1
    },
    {
      id: 'ad-2',
      competitor: 'Tech Solutions Inc',
      headline1: 'Enterprise Cloud Solutions',
      headline2: 'Secure & Scalable',
      headline3: 'Free Migration Support',
      description1: 'Move to the cloud with confidence. Our enterprise-grade solutions ensure security and performance.',
      description2: 'Join thousands of satisfied customers. Contact us for your personalized cloud strategy.',
      displayUrl: 'techsolutions.com/cloud',
      finalUrl: 'https://techsolutions.com/cloud-solutions',
      adType: 'search',
      status: 'active',
      firstSeen: '2025-10-15',
      lastSeen: '2025-11-05',
      changeType: 'modified',
      impressions: 8900,
      clicks: 623,
      ctr: 7.0,
      position: 1.8,
      changes: [
        { field: 'headline2', old: 'Safe & Reliable', new: 'Secure & Scalable', date: '2025-11-01' },
        { field: 'description1', old: 'Move to cloud safely', new: 'Move to the cloud with confidence', date: '2025-11-01' }
      ]
    },
    {
      id: 'ad-3',
      competitor: 'Innovate Corp',
      headline1: 'Digital Transformation Experts',
      headline2: 'ROI-Driven Results',
      headline3: 'Book Free Consultation',
      description1: 'Accelerate your digital journey with proven strategies that deliver measurable business outcomes.',
      description2: 'Our certified experts have helped 500+ companies achieve their transformation goals.',
      displayUrl: 'innovatecorp.com/digital',
      finalUrl: 'https://innovatecorp.com/digital-transformation',
      adType: 'search',
      status: 'paused',
      firstSeen: '2025-10-20',
      lastSeen: '2025-11-03',
      changeType: 'paused',
      impressions: 6750,
      clicks: 405,
      ctr: 6.0,
      position: 2.8
    },
    {
      id: 'ad-4',
      competitor: 'Digital First',
      headline1: 'Marketing Automation Platform',
      headline2: 'Increase Leads by 300%',
      headline3: 'Start Free Trial',
      description1: 'Streamline your marketing with AI-powered automation. Generate more qualified leads effortlessly.',
      description2: 'Join 10,000+ marketers who trust our platform. No setup fees, cancel anytime.',
      displayUrl: 'digitalfirst.com/automation',
      finalUrl: 'https://digitalfirst.com/marketing-automation',
      adType: 'search',
      status: 'active',
      firstSeen: '2025-11-02',
      lastSeen: '2025-11-05',
      changeType: 'new',
      impressions: 4200,
      clicks: 294,
      ctr: 7.0,
      position: 3.2
    },
    {
      id: 'ad-5',
      competitor: 'Smart Business',
      headline1: 'CRM Software Solutions',
      headline2: 'Boost Sales by 40%',
      headline3: 'Free Demo Available',
      description1: 'Manage customer relationships like never before. Our CRM increases sales team productivity.',
      description2: 'Trusted by sales teams worldwide. See why customers choose us over the competition.',
      displayUrl: 'smartbiz.com/crm',
      finalUrl: 'https://smartbiz.com/crm-software',
      adType: 'search',
      status: 'active',
      firstSeen: '2025-10-25',
      lastSeen: '2025-11-05',
      changeType: 'stable',
      impressions: 5600,
      clicks: 392,
      ctr: 7.0,
      position: 3.5
    }
  ];

  const timeRangeOptions = [
    { value: '1d', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  const adTypeOptions = [
    { value: 'all', label: 'All Ad Types' },
    { value: 'search', label: 'Search Ads' },
    { value: 'display', label: 'Display Ads' },
    { value: 'shopping', label: 'Shopping Ads' },
    { value: 'video', label: 'Video Ads' }
  ];

  const getFilteredData = () => {
    let filtered = [...adCopyData];

    if (selectedCompetitor) {
      filtered = filtered?.filter(ad => ad?.competitor === selectedCompetitor?.name);
    }

    if (adType !== 'all') {
      filtered = filtered?.filter(ad => ad?.adType === adType);
    }

    if (showChanges) {
      filtered = filtered?.filter(ad => ad?.changeType !== 'stable');
    }

    return filtered;
  };

  const getChangeTypeColor = (changeType) => {
    switch (changeType) {
      case 'new': return 'text-success';
      case 'modified': return 'text-warning';
      case 'paused': return 'text-error';
      case 'removed': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getChangeTypeIcon = (changeType) => {
    switch (changeType) {
      case 'new': return 'Plus';
      case 'modified': return 'Edit';
      case 'paused': return 'Pause';
      case 'removed': return 'Trash2';
      default: return 'Minus';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'paused': return 'text-warning';
      case 'removed': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredData = getFilteredData();

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Ad Copy Analysis</h3>
          <p className="text-sm text-muted-foreground">
            {selectedCompetitor ? `${selectedCompetitor?.name} ad variations` : 'Competitor ad copy monitoring'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={showChanges ? 'default' : 'outline'}
            size="sm"
            iconName="AlertTriangle"
            iconSize={16}
            onClick={() => setShowChanges(!showChanges)}
          >
            Changes Only
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconSize={16}
          >
            Export
          </Button>
        </div>
      </div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={setTimeRange}
            placeholder="Select time range"
          />
        </div>
        <div className="flex-1">
          <Select
            options={adTypeOptions}
            value={adType}
            onChange={setAdType}
            placeholder="Select ad type"
          />
        </div>
      </div>
      {/* Change Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-muted rounded-lg text-center">
          <p className="text-lg font-bold text-success">
            {filteredData?.filter(ad => ad?.changeType === 'new')?.length}
          </p>
          <p className="text-sm text-muted-foreground">New Ads</p>
        </div>
        <div className="p-3 bg-muted rounded-lg text-center">
          <p className="text-lg font-bold text-warning">
            {filteredData?.filter(ad => ad?.changeType === 'modified')?.length}
          </p>
          <p className="text-sm text-muted-foreground">Modified</p>
        </div>
        <div className="p-3 bg-muted rounded-lg text-center">
          <p className="text-lg font-bold text-error">
            {filteredData?.filter(ad => ad?.changeType === 'paused')?.length}
          </p>
          <p className="text-sm text-muted-foreground">Paused</p>
        </div>
        <div className="p-3 bg-muted rounded-lg text-center">
          <p className="text-lg font-bold text-foreground">{filteredData?.length}</p>
          <p className="text-sm text-muted-foreground">Total Ads</p>
        </div>
      </div>
      {/* Ad Copy List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredData?.map((ad) => (
          <div key={ad?.id} className="p-4 border border-border rounded-lg">
            {/* Ad Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 ${getChangeTypeColor(ad?.changeType)}`}>
                  <Icon name={getChangeTypeIcon(ad?.changeType)} size={16} />
                  <span className="text-sm font-medium capitalize">{ad?.changeType}</span>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(ad?.status)}`}>
                  {ad?.status}
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>First: {formatDate(ad?.firstSeen)}</p>
                <p>Last: {formatDate(ad?.lastSeen)}</p>
              </div>
            </div>

            {/* Ad Content */}
            <div className="mb-3">
              <div className="space-y-1 mb-2">
                <h4 className="font-medium text-foreground">{ad?.headline1}</h4>
                <p className="text-sm text-foreground">{ad?.headline2}</p>
                <p className="text-sm text-foreground">{ad?.headline3}</p>
              </div>
              <div className="space-y-1 mb-2">
                <p className="text-sm text-muted-foreground">{ad?.description1}</p>
                <p className="text-sm text-muted-foreground">{ad?.description2}</p>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-success">{ad?.displayUrl}</span>
                <Icon name="ExternalLink" size={14} className="text-muted-foreground" />
              </div>
            </div>

            {/* Changes */}
            {ad?.changes && ad?.changes?.length > 0 && (
              <div className="mb-3 p-3 bg-warning/10 rounded-lg">
                <h5 className="text-sm font-medium text-warning mb-2">Recent Changes:</h5>
                <div className="space-y-1">
                  {ad?.changes?.map((change, index) => (
                    <div key={index} className="text-xs text-muted-foreground">
                      <span className="font-medium">{change?.field}:</span>
                      <span className="line-through ml-1">{change?.old}</span>
                      <span className="text-foreground ml-1">→ {change?.new}</span>
                      <span className="ml-2">({formatDate(change?.date)})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Impressions</p>
                <p className="font-medium text-foreground">{ad?.impressions?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Clicks</p>
                <p className="font-medium text-foreground">{ad?.clicks?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">CTR</p>
                <p className="font-medium text-foreground">{ad?.ctr}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg Position</p>
                <p className="font-medium text-foreground">{ad?.position}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredData?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No ad copy data found for the selected criteria</p>
        </div>
      )}
    </div>
  );
};

export default AdCopyAnalysis;