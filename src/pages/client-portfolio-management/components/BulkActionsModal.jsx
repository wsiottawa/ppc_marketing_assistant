import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkActionsModal = ({ isOpen, onClose, selectedClients, clients, actionType }) => {
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [reportType, setReportType] = useState('performance');
  const [reportPeriod, setReportPeriod] = useState('30d');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const selectedClientData = clients?.filter(client => selectedClients?.includes(client?.id));

  const reportTypeOptions = [
    { value: 'performance', label: 'Performance Summary' },
    { value: 'billing', label: 'Billing Report' },
    { value: 'campaign', label: 'Campaign Analysis' },
    { value: 'competitive', label: 'Competitive Intelligence' },
    { value: 'custom', label: 'Custom Report' }
  ];

  const reportPeriodOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];

  const emailTemplates = [
    { value: 'monthly-update', label: 'Monthly Performance Update' },
    { value: 'campaign-alert', label: 'Campaign Alert Notification' },
    { value: 'billing-reminder', label: 'Billing Reminder' },
    { value: 'strategy-meeting', label: 'Strategy Meeting Request' },
    { value: 'custom', label: 'Custom Message' }
  ];

  const handleEmailTemplateChange = (template) => {
    switch (template) {
      case 'monthly-update': setEmailSubject('Monthly Performance Update - November 2025');
        setEmailMessage(`Dear [Client Name],\n\nI hope this message finds you well. I wanted to share your campaign performance highlights for November 2025.\n\nKey Metrics:\n• Total Spend: [Amount]\n• Conversions: [Count]\n• Cost per Conversion: [Amount]\n• Performance Score: [Score]%\n\nWe've identified several optimization opportunities that I'd like to discuss with you. Would you be available for a brief call this week?\n\nBest regards,\n[Your Name]`);
        break;
      case 'campaign-alert': setEmailSubject('Campaign Performance Alert - Action Required');
        setEmailMessage(`Dear [Client Name],\n\nI'm reaching out regarding some performance changes in your campaigns that require immediate attention.\n\nAlert Details:\n• Campaign: [Campaign Name]\n• Issue: [Issue Description]\n• Recommended Action: [Action]\n• Urgency: [Level]\n\nI've already implemented some preliminary optimizations, but I'd like to discuss the strategy with you. Please let me know when you're available for a quick call.\n\nBest regards,\n[Your Name]`);
        break;
      case 'billing-reminder': setEmailSubject('Billing Reminder - Payment Due');
        setEmailMessage(`Dear [Client Name],\n\nThis is a friendly reminder that your payment for the current billing period is due.\n\nInvoice Details:\n• Invoice Number: [Number]\n• Amount Due: [Amount]\n• Due Date: [Date]\n\nYou can make your payment through our client portal or contact our billing department if you have any questions.\n\nThank you for your business!\n\nBest regards,\n[Your Name]`);
        break;
      case 'strategy-meeting': setEmailSubject('Strategy Meeting Request - Q4 Planning');
        setEmailMessage(`Dear [Client Name],\n\nAs we approach the end of Q4, I'd like to schedule a strategy meeting to review your campaign performance and plan for the upcoming quarter.\n\nMeeting Agenda:\n• Q4 Performance Review\n• Q1 2026 Strategy Planning\n• Budget Allocation Discussion\n• New Opportunities\n\nPlease let me know your availability for next week. The meeting should take approximately 45 minutes.\n\nLooking forward to our discussion!\n\nBest regards,\n[Your Name]`);
        break;
      default:
        setEmailSubject('');
        setEmailMessage('');
    }
  };

  const handleSendEmails = async () => {
    setIsProcessing(true);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Sending emails to:', selectedClientData?.map(c => c?.name));
    console.log('Subject:', emailSubject);
    console.log('Message:', emailMessage);
    
    setIsProcessing(false);
    onClose();
  };

  const handleGenerateReports = async () => {
    setIsProcessing(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('Generating reports for:', selectedClientData?.map(c => c?.name));
    console.log('Report type:', reportType);
    console.log('Period:', reportPeriod);
    console.log('Include charts:', includeCharts);
    
    setIsProcessing(false);
    onClose();
  };

  const renderEmailForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Email Template
        </label>
        <Select
          options={[{ value: '', label: 'Select a template...' }, ...emailTemplates]}
          value=""
          onChange={handleEmailTemplateChange}
          placeholder="Choose a template"
        />
      </div>

      <Input
        label="Subject"
        type="text"
        value={emailSubject}
        onChange={(e) => setEmailSubject(e?.target?.value)}
        placeholder="Enter email subject"
        required
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Message
        </label>
        <textarea
          value={emailMessage}
          onChange={(e) => setEmailMessage(e?.target?.value)}
          placeholder="Enter your message..."
          rows={8}
          className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Use [Client Name] to personalize messages automatically
        </p>
      </div>

      <div className="bg-muted/50 p-3 rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">Recipients ({selectedClientData?.length})</h4>
        <div className="space-y-1">
          {selectedClientData?.slice(0, 5)?.map(client => (
            <div key={client?.id} className="text-sm text-muted-foreground">
              {client?.name} - {client?.contactEmail}
            </div>
          ))}
          {selectedClientData?.length > 5 && (
            <div className="text-sm text-muted-foreground">
              +{selectedClientData?.length - 5} more clients
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderReportForm = () => (
    <div className="space-y-4">
      <Select
        label="Report Type"
        options={reportTypeOptions}
        value={reportType}
        onChange={setReportType}
        required
      />

      <Select
        label="Time Period"
        options={reportPeriodOptions}
        value={reportPeriod}
        onChange={setReportPeriod}
        required
      />

      <Checkbox
        label="Include charts and visualizations"
        checked={includeCharts}
        onChange={(e) => setIncludeCharts(e?.target?.checked)}
      />

      <div className="bg-muted/50 p-3 rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">Report Recipients ({selectedClientData?.length})</h4>
        <div className="space-y-1">
          {selectedClientData?.slice(0, 5)?.map(client => (
            <div key={client?.id} className="text-sm text-muted-foreground">
              {client?.name} - {reportType} report
            </div>
          ))}
          {selectedClientData?.length > 5 && (
            <div className="text-sm text-muted-foreground">
              +{selectedClientData?.length - 5} more reports
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1200">
      <div className="bg-card border border-border rounded-lg shadow-elevated w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Icon 
                name={actionType === 'email' ? 'Mail' : 'FileText'} 
                size={20} 
                className="text-primary" 
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {actionType === 'email' ? 'Send Bulk Email' : 'Generate Bulk Reports'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedClientData?.length} client{selectedClientData?.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={20}
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {actionType === 'email' ? renderEmailForm() : renderReportForm()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">
            This action will affect {selectedClientData?.length} client{selectedClientData?.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={actionType === 'email' ? handleSendEmails : handleGenerateReports}
              loading={isProcessing}
              iconName={actionType === 'email' ? 'Send' : 'Download'}
              iconPosition="left"
              iconSize={16}
            >
              {isProcessing 
                ? (actionType === 'email' ? 'Sending...' : 'Generating...') 
                : (actionType === 'email' ? 'Send Emails' : 'Generate Reports')
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsModal;