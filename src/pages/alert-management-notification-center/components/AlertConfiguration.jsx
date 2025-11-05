import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AlertConfiguration = ({ isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('rules');
  const [newRule, setNewRule] = useState({
    name: '',
    metric: '',
    condition: '',
    threshold: '',
    severity: 'medium',
    enabled: true
  });

  const metricOptions = [
    { value: 'ctr', label: 'Click-Through Rate (CTR)' },
    { value: 'cpc', label: 'Cost Per Click (CPC)' },
    { value: 'conversion_rate', label: 'Conversion Rate' },
    { value: 'cost_per_conversion', label: 'Cost Per Conversion' },
    { value: 'impression_share', label: 'Impression Share' },
    { value: 'quality_score', label: 'Quality Score' },
    { value: 'daily_spend', label: 'Daily Spend' },
    { value: 'roas', label: 'Return on Ad Spend (ROAS)' }
  ];

  const conditionOptions = [
    { value: 'less_than', label: 'Less than' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'equals', label: 'Equals' },
    { value: 'percentage_change', label: 'Percentage change' },
    { value: 'statistical_significance', label: 'Statistical significance' }
  ];

  const severityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  const ruleTemplates = [
    {
      id: 'high-cpc',
      name: 'High CPC Alert',
      description: 'Alert when cost per click exceeds threshold',
      metric: 'cpc',
      condition: 'greater_than',
      threshold: '5.00',
      severity: 'high'
    },
    {
      id: 'low-ctr',
      name: 'Low CTR Alert',
      description: 'Alert when click-through rate drops below threshold',
      metric: 'ctr',
      condition: 'less_than',
      threshold: '2.0',
      severity: 'medium'
    },
    {
      id: 'budget-exhaustion',
      name: 'Budget Exhaustion',
      description: 'Alert when daily budget is 90% spent',
      metric: 'daily_spend',
      condition: 'percentage_change',
      threshold: '90',
      severity: 'critical'
    },
    {
      id: 'conversion-drop',
      name: 'Conversion Rate Drop',
      description: 'Alert when conversion rate drops significantly',
      metric: 'conversion_rate',
      condition: 'statistical_significance',
      threshold: '20',
      severity: 'high'
    }
  ];

  const existingRules = [
    {
      id: 1,
      name: 'High CPC Alert',
      metric: 'Cost Per Click',
      condition: 'Greater than $3.00',
      severity: 'high',
      enabled: true,
      lastTriggered: '2 hours ago'
    },
    {
      id: 2,
      name: 'Low CTR Warning',
      metric: 'Click-Through Rate',
      condition: 'Less than 1.5%',
      severity: 'medium',
      enabled: true,
      lastTriggered: '1 day ago'
    },
    {
      id: 3,
      name: 'Budget Exhaustion',
      metric: 'Daily Spend',
      condition: '90% of budget spent',
      severity: 'critical',
      enabled: false,
      lastTriggered: 'Never'
    }
  ];

  if (!isOpen) return null;

  const handleSaveRule = () => {
    if (newRule?.name && newRule?.metric && newRule?.condition && newRule?.threshold) {
      onSave(newRule);
      setNewRule({
        name: '',
        metric: '',
        condition: '',
        threshold: '',
        severity: 'medium',
        enabled: true
      });
    }
  };

  const handleTemplateSelect = (template) => {
    setNewRule({
      name: template?.name,
      metric: template?.metric,
      condition: template?.condition,
      threshold: template?.threshold,
      severity: template?.severity,
      enabled: true
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-accent';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-error';
      case 'high': return 'bg-warning';
      case 'medium': return 'bg-accent';
      case 'low': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1200">
      <div className="bg-card rounded-lg shadow-elevated w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Alert Configuration</h2>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconSize={20}
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            />
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 mt-4">
            {[
              { id: 'rules', label: 'Alert Rules', icon: 'Settings' },
              { id: 'templates', label: 'Templates', icon: 'FileText' },
              { id: 'notifications', label: 'Notifications', icon: 'Bell' }
            ]?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium nav-transition ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'rules' && (
            <div className="h-full flex">
              {/* Create New Rule */}
              <div className="w-1/2 p-6 border-r border-border overflow-y-auto">
                <h3 className="text-lg font-medium text-foreground mb-4">Create New Rule</h3>
                
                <div className="space-y-4">
                  <Input
                    label="Rule Name"
                    type="text"
                    placeholder="Enter rule name"
                    value={newRule?.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e?.target?.value })}
                    required
                  />

                  <Select
                    label="Metric to Monitor"
                    options={metricOptions}
                    value={newRule?.metric}
                    onChange={(value) => setNewRule({ ...newRule, metric: value })}
                    placeholder="Select metric"
                    searchable
                  />

                  <Select
                    label="Condition"
                    options={conditionOptions}
                    value={newRule?.condition}
                    onChange={(value) => setNewRule({ ...newRule, condition: value })}
                    placeholder="Select condition"
                  />

                  <Input
                    label="Threshold Value"
                    type="text"
                    placeholder="Enter threshold value"
                    value={newRule?.threshold}
                    onChange={(e) => setNewRule({ ...newRule, threshold: e?.target?.value })}
                    description="Enter numeric value or percentage"
                    required
                  />

                  <Select
                    label="Severity Level"
                    options={severityOptions}
                    value={newRule?.severity}
                    onChange={(value) => setNewRule({ ...newRule, severity: value })}
                  />

                  <Checkbox
                    label="Enable this rule"
                    checked={newRule?.enabled}
                    onChange={(e) => setNewRule({ ...newRule, enabled: e?.target?.checked })}
                  />

                  <div className="flex space-x-3 pt-4">
                    <Button
                      variant="default"
                      onClick={handleSaveRule}
                      iconName="Plus"
                      iconPosition="left"
                      iconSize={16}
                      className="flex-1"
                    >
                      Create Rule
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setNewRule({
                        name: '',
                        metric: '',
                        condition: '',
                        threshold: '',
                        severity: 'medium',
                        enabled: true
                      })}
                      className="flex-1"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>

              {/* Existing Rules */}
              <div className="w-1/2 p-6 overflow-y-auto">
                <h3 className="text-lg font-medium text-foreground mb-4">Existing Rules</h3>
                
                <div className="space-y-3">
                  {existingRules?.map((rule) => (
                    <div key={rule?.id} className="p-4 border border-border rounded-md">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{rule?.name}</h4>
                          <p className="text-sm text-muted-foreground">{rule?.metric}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityBg(rule?.severity)} text-white`}>
                            {rule?.severity?.toUpperCase()}
                          </span>
                          <Checkbox
                            checked={rule?.enabled}
                            onChange={() => {}}
                            size="sm"
                          />
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{rule?.condition}</p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Last triggered: {rule?.lastTriggered}</span>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" iconName="Edit" iconSize={14} />
                          <Button variant="ghost" size="sm" iconName="Trash2" iconSize={14} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="p-6 overflow-y-auto">
              <h3 className="text-lg font-medium text-foreground mb-4">Rule Templates</h3>
              <p className="text-muted-foreground mb-6">
                Use these pre-configured templates to quickly create common alert rules
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {ruleTemplates?.map((template) => (
                  <div
                    key={template?.id}
                    className="p-4 border border-border rounded-md hover:bg-muted/50 cursor-pointer nav-transition"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-foreground">{template?.name}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityBg(template?.severity)} text-white`}>
                        {template?.severity?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{template?.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {metricOptions?.find(m => m?.value === template?.metric)?.label}
                      </span>
                      <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="p-6 overflow-y-auto">
              <h3 className="text-lg font-medium text-foreground mb-4">Notification Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-foreground mb-3">Delivery Methods</h4>
                  <div className="space-y-3">
                    <Checkbox
                      label="Browser notifications"
                      description="Show desktop notifications in your browser"
                      checked
                    />
                    <Checkbox
                      label="Email notifications"
                      description="Send alerts to your email address"
                      checked
                    />
                    <Checkbox
                      label="SMS notifications"
                      description="Send critical alerts via SMS"
                     
                    />
                    <Checkbox
                      label="Slack integration"
                      description="Post alerts to designated Slack channels"
                      checked
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-3">Notification Frequency</h4>
                  <Select
                    label="Alert frequency"
                    options={[
                      { value: 'immediate', label: 'Immediate' },
                      { value: 'hourly', label: 'Hourly digest' },
                      { value: 'daily', label: 'Daily digest' },
                      { value: 'weekly', label: 'Weekly digest' }
                    ]}
                    value="immediate"
                    onChange={() => {}}
                  />
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-3">Quiet Hours</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Start time"
                      type="time"
                      value="22:00"
                      onChange={() => {}}
                    />
                    <Input
                      label="End time"
                      type="time"
                      value="08:00"
                      onChange={() => {}}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Non-critical alerts will be suppressed during these hours
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="default" onClick={() => onClose()}>
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertConfiguration;