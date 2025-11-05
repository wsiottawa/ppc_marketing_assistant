import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AlertDetails = ({ alert, onAction, onClose }) => {
  const [assignee, setAssignee] = useState('');
  const [notes, setNotes] = useState('');
  const [showAutomatedResponse, setShowAutomatedResponse] = useState(false);

  if (!alert) {
    return (
      <div className="h-full bg-card flex flex-col items-center justify-center text-center p-8">
        <Icon name="Bell" size={48} className="text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Alert Selected</h3>
        <p className="text-muted-foreground">
          Select an alert from the feed to view details and take action
        </p>
      </div>
    );
  }

  const teamMembers = [
    { value: 'sarah-johnson', label: 'Sarah Johnson (PPC Manager)' },
    { value: 'mike-chen', label: 'Mike Chen (Campaign Specialist)' },
    { value: 'lisa-rodriguez', label: 'Lisa Rodriguez (Analytics Lead)' },
    { value: 'david-kim', label: 'David Kim (Account Manager)' }
  ];

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return 'AlertCircle';
      case 'acknowledged': return 'Eye';
      case 'assigned': return 'User';
      case 'resolved': return 'CheckCircle';
      default: return 'AlertCircle';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleQuickAction = (action) => {
    onAction(action, alert?.id, { assignee, notes });
  };

  const automatedResponses = [
    {
      id: 'pause-campaign',
      title: 'Pause Campaign',
      description: 'Immediately pause the affected campaign to prevent further spend',
      icon: 'Pause',
      severity: 'critical'
    },
    {
      id: 'reduce-bids',
      title: 'Reduce Bids by 20%',
      description: 'Lower keyword bids to improve cost efficiency',
      icon: 'TrendingDown',
      severity: 'medium'
    },
    {
      id: 'increase-budget',
      title: 'Increase Daily Budget',
      description: 'Raise budget by 15% to capture more opportunities',
      icon: 'TrendingUp',
      severity: 'low'
    }
  ];

  return (
    <div className="h-full bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Alert Details</h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconSize={16}
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          />
        </div>

        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSeverityBg(alert?.severity)} text-white`}>
            {alert?.severity?.toUpperCase()}
          </span>
          <Icon 
            name={getStatusIcon(alert?.status)} 
            size={16} 
            className={getSeverityColor(alert?.severity)}
          />
          <span className="text-sm text-muted-foreground">
            {formatTimestamp(alert?.timestamp)}
          </span>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Alert Information */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-3">{alert?.title}</h3>
          <p className="text-muted-foreground mb-4">{alert?.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-foreground">Campaign:</span>
              <p className="text-muted-foreground">{alert?.campaign}</p>
            </div>
            <div>
              <span className="font-medium text-foreground">Metric:</span>
              <p className="text-muted-foreground">{alert?.metric}</p>
            </div>
            <div>
              <span className="font-medium text-foreground">Current Value:</span>
              <p className="text-muted-foreground">{alert?.currentValue}</p>
            </div>
            <div>
              <span className="font-medium text-foreground">Threshold:</span>
              <p className="text-muted-foreground">{alert?.threshold}</p>
            </div>
          </div>
        </div>

        {/* Recommended Action */}
        {alert?.recommendedAction && (
          <div className="p-4 bg-accent/10 border border-accent/20 rounded-md">
            <div className="flex items-start space-x-3">
              <Icon name="Lightbulb" size={20} className="text-accent mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Recommended Action</h4>
                <p className="text-sm text-muted-foreground">{alert?.recommendedAction}</p>
              </div>
            </div>
          </div>
        )}

        {/* Performance Impact */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Performance Impact</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted rounded-md">
              <div className="text-lg font-semibold text-error">-12.5%</div>
              <div className="text-xs text-muted-foreground">CTR Change</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-md">
              <div className="text-lg font-semibold text-warning">+23.4%</div>
              <div className="text-xs text-muted-foreground">CPC Increase</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-md">
              <div className="text-lg font-semibold text-error">-8.9%</div>
              <div className="text-xs text-muted-foreground">Conversion Rate</div>
            </div>
          </div>
        </div>

        {/* Automated Response Options */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">Automated Response</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAutomatedResponse(!showAutomatedResponse)}
              iconName={showAutomatedResponse ? "ChevronUp" : "ChevronDown"}
              iconPosition="right"
              iconSize={14}
            >
              {showAutomatedResponse ? 'Hide' : 'Show'} Options
            </Button>
          </div>

          {showAutomatedResponse && (
            <div className="space-y-2">
              {automatedResponses?.map((response) => (
                <div
                  key={response?.id}
                  className="p-3 border border-border rounded-md hover:bg-muted/50 cursor-pointer nav-transition"
                  onClick={() => handleQuickAction(`automated-${response?.id}`)}
                >
                  <div className="flex items-start space-x-3">
                    <Icon name={response?.icon} size={16} className="text-accent mt-0.5" />
                    <div className="flex-1">
                      <h5 className="font-medium text-foreground text-sm">{response?.title}</h5>
                      <p className="text-xs text-muted-foreground">{response?.description}</p>
                    </div>
                    <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assignment */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Assignment</h4>
          <Select
            label="Assign to team member"
            options={teamMembers}
            value={assignee}
            onChange={setAssignee}
            placeholder="Select team member"
            searchable
            className="mb-4"
          />
        </div>

        {/* Notes */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Notes</h4>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e?.target?.value)}
            placeholder="Add notes about this alert or actions taken..."
            rows={4}
            className="w-full p-3 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        {/* Alert History */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Alert History</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-muted rounded-md">
              <Icon name="AlertCircle" size={16} className="text-warning mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Alert Created</span>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
                <p className="text-xs text-muted-foreground">System detected performance threshold breach</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-muted rounded-md">
              <Icon name="Eye" size={16} className="text-accent mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Alert Acknowledged</span>
                  <span className="text-xs text-muted-foreground">1 hour ago</span>
                </div>
                <p className="text-xs text-muted-foreground">Acknowledged by Sarah Johnson</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center space-x-3">
          <Button
            variant="default"
            onClick={() => handleQuickAction('acknowledge')}
            iconName="Eye"
            iconPosition="left"
            iconSize={16}
            className="flex-1"
          >
            Acknowledge
          </Button>
          <Button
            variant="outline"
            onClick={() => handleQuickAction('assign')}
            iconName="User"
            iconPosition="left"
            iconSize={16}
            className="flex-1"
          >
            Assign
          </Button>
          <Button
            variant="success"
            onClick={() => handleQuickAction('resolve')}
            iconName="CheckCircle"
            iconPosition="left"
            iconSize={16}
            className="flex-1"
          >
            Resolve
          </Button>
        </div>
        
        <div className="flex items-center space-x-3 mt-3">
          <Button
            variant="outline"
            onClick={() => handleQuickAction('escalate')}
            iconName="ArrowUp"
            iconPosition="left"
            iconSize={16}
            className="flex-1"
          >
            Escalate
          </Button>
          <Button
            variant="outline"
            onClick={() => handleQuickAction('snooze')}
            iconName="Clock"
            iconPosition="left"
            iconSize={16}
            className="flex-1"
          >
            Snooze
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertDetails;