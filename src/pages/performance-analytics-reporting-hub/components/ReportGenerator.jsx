import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ReportGenerator = ({ isOpen, onClose }) => {
  const [reportConfig, setReportConfig] = useState({
    name: '',
    description: '',
    format: 'pdf',
    schedule: 'manual',
    recipients: [],
    metrics: [],
    dateRange: 'last30days',
    includeCharts: true,
    includeTables: true,
    whiteLabelBranding: false
  });

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report' },
    { value: 'excel', label: 'Excel Workbook' },
    { value: 'csv', label: 'CSV Data Export' },
    { value: 'powerpoint', label: 'PowerPoint Presentation' }
  ];

  const scheduleOptions = [
    { value: 'manual', label: 'Manual Generation' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const dateRangeOptions = [
    { value: 'last7days', label: 'Last 7 days' },
    { value: 'last30days', label: 'Last 30 days' },
    { value: 'last90days', label: 'Last 90 days' },
    { value: 'thisMonth', label: 'This month' },
    { value: 'lastMonth', label: 'Last month' },
    { value: 'thisQuarter', label: 'This quarter' },
    { value: 'custom', label: 'Custom range' }
  ];

  const availableMetrics = [
    { id: 'impressions', label: 'Impressions', category: 'Traffic' },
    { id: 'clicks', label: 'Clicks', category: 'Traffic' },
    { id: 'ctr', label: 'Click-through Rate', category: 'Performance' },
    { id: 'cpc', label: 'Cost per Click', category: 'Cost' },
    { id: 'cost', label: 'Total Cost', category: 'Cost' },
    { id: 'conversions', label: 'Conversions', category: 'Performance' },
    { id: 'conversionRate', label: 'Conversion Rate', category: 'Performance' },
    { id: 'revenue', label: 'Revenue', category: 'Revenue' },
    { id: 'roas', label: 'Return on Ad Spend', category: 'Revenue' },
    { id: 'roi', label: 'Return on Investment', category: 'Revenue' },
    { id: 'qualityScore', label: 'Quality Score', category: 'Quality' },
    { id: 'searchImpressionShare', label: 'Search Impression Share', category: 'Competitive' }
  ];

  const metricCategories = [...new Set(availableMetrics.map(m => m.category))];

  const [newRecipient, setNewRecipient] = useState('');

  const handleMetricToggle = (metricId) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: prev?.metrics?.includes(metricId)
        ? prev?.metrics?.filter(id => id !== metricId)
        : [...prev?.metrics, metricId]
    }));
  };

  const handleAddRecipient = () => {
    if (newRecipient && !reportConfig?.recipients?.includes(newRecipient)) {
      setReportConfig(prev => ({
        ...prev,
        recipients: [...prev?.recipients, newRecipient]
      }));
      setNewRecipient('');
    }
  };

  const handleRemoveRecipient = (email) => {
    setReportConfig(prev => ({
      ...prev,
      recipients: prev?.recipients?.filter(r => r !== email)
    }));
  };

  const handleGenerateReport = () => {
    console.log('Generating report with config:', reportConfig);
    // Report generation logic would go here
    onClose();
  };

  const handleSaveTemplate = () => {
    console.log('Saving report template:', reportConfig);
    // Template saving logic would go here
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1100 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
              <Icon name="FileText" size={24} className="text-primary" />
              <span>Generate Custom Report</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Create customized performance reports with automated delivery
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconSize={20}
            onClick={onClose}
          />
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Report Name"
              placeholder="Enter report name"
              value={reportConfig?.name}
              onChange={(e) => setReportConfig(prev => ({ ...prev, name: e?.target?.value }))}
              required
            />
            <Input
              label="Description"
              placeholder="Brief description of the report"
              value={reportConfig?.description}
              onChange={(e) => setReportConfig(prev => ({ ...prev, description: e?.target?.value }))}
            />
          </div>

          {/* Format and Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Report Format"
              options={formatOptions}
              value={reportConfig?.format}
              onChange={(value) => setReportConfig(prev => ({ ...prev, format: value }))}
            />
            <Select
              label="Schedule"
              options={scheduleOptions}
              value={reportConfig?.schedule}
              onChange={(value) => setReportConfig(prev => ({ ...prev, schedule: value }))}
            />
            <Select
              label="Date Range"
              options={dateRangeOptions}
              value={reportConfig?.dateRange}
              onChange={(value) => setReportConfig(prev => ({ ...prev, dateRange: value }))}
            />
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Recipients
            </label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e?.target?.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddRecipient}
                  disabled={!newRecipient}
                  iconName="Plus"
                  iconSize={16}
                >
                  Add
                </Button>
              </div>
              
              {reportConfig?.recipients?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {reportConfig?.recipients?.map((email) => (
                    <div
                      key={email}
                      className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-md"
                    >
                      <span className="text-sm text-foreground">{email}</span>
                      <button
                        onClick={() => handleRemoveRecipient(email)}
                        className="text-muted-foreground hover:text-error nav-transition"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Metrics Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-4">
              Select Metrics to Include
            </label>
            <div className="space-y-4">
              {metricCategories?.map((category) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    {category}
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {availableMetrics?.filter(metric => metric?.category === category)?.map((metric) => (
                        <Checkbox
                          key={metric?.id}
                          label={metric?.label}
                          checked={reportConfig?.metrics?.includes(metric?.id)}
                          onChange={() => handleMetricToggle(metric?.id)}
                          size="sm"
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report Options */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-4">
              Report Options
            </label>
            <div className="space-y-3">
              <Checkbox
                label="Include Charts and Visualizations"
                checked={reportConfig?.includeCharts}
                onChange={(e) => setReportConfig(prev => ({ ...prev, includeCharts: e?.target?.checked }))}
              />
              <Checkbox
                label="Include Data Tables"
                checked={reportConfig?.includeTables}
                onChange={(e) => setReportConfig(prev => ({ ...prev, includeTables: e?.target?.checked }))}
              />
              <Checkbox
                label="Apply White-label Branding"
                description="Remove PPC Assistant branding and use client branding"
                checked={reportConfig?.whiteLabelBranding}
                onChange={(e) => setReportConfig(prev => ({ ...prev, whiteLabelBranding: e?.target?.checked }))}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleSaveTemplate}
              iconName="Save"
              iconPosition="left"
              iconSize={16}
            >
              Save as Template
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateReport}
              disabled={!reportConfig?.name || reportConfig?.metrics?.length === 0}
              iconName="Download"
              iconPosition="left"
              iconSize={16}
            >
              Generate Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;