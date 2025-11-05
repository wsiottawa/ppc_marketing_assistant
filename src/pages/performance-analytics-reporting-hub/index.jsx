import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import MetricWidget from './components/MetricWidget';
import DateRangeSelector from './components/DateRangeSelector';
import ConversionFunnelChart from './components/ConversionFunnelChart';
import ROITrendChart from './components/ROITrendChart';
import PerformanceDataTable from './components/PerformanceDataTable';
import ReportGenerator from './components/ReportGenerator';
import IntegrationStatusPanel from './components/IntegrationStatusPanel';

const PerformanceAnalyticsReportingHub = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('last30days');
  const [selectedClient, setSelectedClient] = useState('acme-corp');
  const [isLoading, setIsLoading] = useState(false);
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [dashboardLayout, setDashboardLayout] = useState('default');
  const [activeFilters, setActiveFilters] = useState({});

  // Mock client data
  const clientOptions = [
    { value: 'acme-corp', label: 'Acme Corporation' },
    { value: 'tech-solutions', label: 'Tech Solutions Inc.' },
    { value: 'retail-plus', label: 'Retail Plus' },
    { value: 'startup-hub', label: 'Startup Hub' }
  ];

  const layoutOptions = [
    { value: 'default', label: 'Default Layout' },
    { value: 'executive', label: 'Executive Summary' },
    { value: 'detailed', label: 'Detailed Analysis' },
    { value: 'custom', label: 'Custom Layout' }
  ];

  // Mock performance metrics
  const performanceMetrics = [
    {
      title: 'Total Impressions',
      value: 2456789,
      change: 12.5,
      changeType: 'positive',
      icon: 'Eye',
      trend: [2100000, 2200000, 2300000, 2400000, 2456789],
      format: 'number'
    },
    {
      title: 'Total Clicks',
      value: 145678,
      change: 8.3,
      changeType: 'positive',
      icon: 'MousePointer',
      trend: [130000, 135000, 140000, 142000, 145678],
      format: 'number'
    },
    {
      title: 'Average CTR',
      value: 5.93,
      change: -2.1,
      changeType: 'negative',
      icon: 'Target',
      trend: [6.1, 6.0, 5.95, 5.94, 5.93],
      format: 'percentage'
    },
    {
      title: 'Total Cost',
      value: 89456,
      change: 15.7,
      changeType: 'negative',
      icon: 'DollarSign',
      trend: [75000, 78000, 82000, 86000, 89456],
      format: 'currency'
    },
    {
      title: 'Conversions',
      value: 3456,
      change: 22.4,
      changeType: 'positive',
      icon: 'TrendingUp',
      trend: [2800, 2900, 3100, 3300, 3456],
      format: 'number'
    },
    {
      title: 'Revenue',
      value: 456789,
      change: 18.9,
      changeType: 'positive',
      icon: 'Banknote',
      trend: [380000, 400000, 420000, 440000, 456789],
      format: 'currency'
    },
    {
      title: 'ROAS',
      value: 5.11,
      change: 3.2,
      changeType: 'positive',
      icon: 'Calculator',
      trend: [4.8, 4.9, 5.0, 5.05, 5.11],
      format: 'number'
    },
    {
      title: 'Avg. CPC',
      value: 0.61,
      change: 7.2,
      changeType: 'negative',
      icon: 'CreditCard',
      trend: [0.55, 0.57, 0.59, 0.60, 0.61],
      format: 'currency'
    }
  ];

  // Simulate data loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [selectedClient, selectedDateRange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.ctrlKey && e?.key === 'd') {
        e?.preventDefault();
        // Focus date picker
        console.log('Date picker shortcut activated');
      }
      if (e?.altKey && e?.key === 'f') {
        e?.preventDefault();
        // Open filter panel
        console.log('Filter panel shortcut activated');
      }
      if (e?.shiftKey && e?.key === 'E') {
        e?.preventDefault();
        // Open export dialog
        setShowReportGenerator(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleDateRangeChange = (range) => {
    setSelectedDateRange(range);
  };

  const handleCustomDateChange = (startDate, endDate) => {
    console.log('Custom date range:', startDate, endDate);
    setSelectedDateRange('custom');
  };

  const handleClientChange = (clientId) => {
    setSelectedClient(clientId);
  };

  const handleExportData = (format) => {
    console.log(`Exporting data in ${format} format`);
    // Export logic would go here
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Performance Analytics & Reporting Hub - PPC Assistant</title>
        <meta name="description" content="Comprehensive analytics platform delivering actionable insights through customizable dashboards and automated reporting for data-driven campaign optimization." />
      </Helmet>
      <div className="min-h-screen bg-background pt-16">
        {/* Header Section */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center space-x-3">
                  <Icon name="BarChart3" size={28} className="text-primary" />
                  <span>Performance Analytics & Reporting Hub</span>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Comprehensive analytics platform delivering actionable insights through customizable dashboards and automated reporting
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RefreshCw"
                  iconPosition="left"
                  iconSize={16}
                  onClick={handleRefreshData}
                  loading={isLoading}
                >
                  Refresh Data
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                  iconSize={16}
                  onClick={() => setShowReportGenerator(true)}
                >
                  Generate Report
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  iconName="Settings"
                  iconPosition="left"
                  iconSize={16}
                >
                  Dashboard Settings
                </Button>
              </div>
            </div>

            {/* Controls Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mt-6 pt-6 border-t border-border">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="min-w-48">
                  <Select
                    label="Client"
                    options={clientOptions}
                    value={selectedClient}
                    onChange={handleClientChange}
                    searchable
                  />
                </div>
                
                <div className="min-w-32">
                  <Select
                    label="Layout"
                    options={layoutOptions}
                    value={dashboardLayout}
                    onChange={setDashboardLayout}
                  />
                </div>
              </div>

              <DateRangeSelector
                selectedRange={selectedDateRange}
                onRangeChange={handleDateRangeChange}
                onCustomDateChange={handleCustomDateChange}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {performanceMetrics?.map((metric, index) => (
              <MetricWidget
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                trend={metric?.trend}
                format={metric?.format}
                isLoading={isLoading}
                onClick={() => console.log(`Clicked on ${metric?.title}`)}
              />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <ConversionFunnelChart isLoading={isLoading} data={[]} />
            <ROITrendChart isLoading={isLoading} data={[]} />
          </div>

          {/* Integration Status */}
          <div className="mb-8">
            <IntegrationStatusPanel />
          </div>

          {/* Performance Data Table */}
          <div className="mb-8">
            <PerformanceDataTable isLoading={isLoading} />
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
              <Icon name="Zap" size={20} className="text-primary" />
              <span>Quick Actions</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => handleExportData('csv')}
              >
                <Icon name="FileSpreadsheet" size={24} className="text-primary" />
                <span className="text-sm">Export CSV</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => handleExportData('pdf')}
              >
                <Icon name="FileText" size={24} className="text-primary" />
                <span className="text-sm">Export PDF</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => setShowReportGenerator(true)}
              >
                <Icon name="Calendar" size={24} className="text-primary" />
                <span className="text-sm">Schedule Report</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2"
                onClick={() => console.log('Share dashboard')}
              >
                <Icon name="Share2" size={24} className="text-primary" />
                <span className="text-sm">Share Dashboard</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg p-3 text-xs text-muted-foreground shadow-elevated">
          <div className="font-medium mb-1">Keyboard Shortcuts:</div>
          <div>Ctrl+D: Date picker | Alt+F: Filters | Shift+E: Export</div>
        </div>

        {/* Report Generator Modal */}
        <ReportGenerator
          isOpen={showReportGenerator}
          onClose={() => setShowReportGenerator(false)}
        />
      </div>
    </>
  );
};

export default PerformanceAnalyticsReportingHub;