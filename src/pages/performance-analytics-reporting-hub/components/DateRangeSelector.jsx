import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DateRangeSelector = ({ selectedRange, onRangeChange, onCustomDateChange }) => {
  const [showCustom, setShowCustom] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const predefinedRanges = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 days' },
    { value: 'last30days', label: 'Last 30 days' },
    { value: 'last90days', label: 'Last 90 days' },
    { value: 'thisMonth', label: 'This month' },
    { value: 'lastMonth', label: 'Last month' },
    { value: 'thisQuarter', label: 'This quarter' },
    { value: 'lastQuarter', label: 'Last quarter' },
    { value: 'thisYear', label: 'This year' },
    { value: 'lastYear', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];

  const comparisonOptions = [
    { value: 'none', label: 'No comparison' },
    { value: 'previousPeriod', label: 'Previous period' },
    { value: 'yearOverYear', label: 'Year over year' },
    { value: 'quarterOverQuarter', label: 'Quarter over quarter' }
  ];

  const handleRangeChange = (value) => {
    if (value === 'custom') {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      onRangeChange(value);
    }
  };

  const handleCustomApply = () => {
    if (customStartDate && customEndDate) {
      onCustomDateChange(customStartDate, customEndDate);
      setShowCustom(false);
    }
  };

  const getDateRangeDisplay = () => {
    const today = new Date();
    const formatDate = (date) => date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });

    switch (selectedRange) {
      case 'today':
        return formatDate(today);
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday?.setDate(yesterday?.getDate() - 1);
        return formatDate(yesterday);
      case 'last7days':
        const week = new Date(today);
        week?.setDate(week?.getDate() - 7);
        return `${formatDate(week)} - ${formatDate(today)}`;
      case 'last30days':
        const month = new Date(today);
        month?.setDate(month?.getDate() - 30);
        return `${formatDate(month)} - ${formatDate(today)}`;
      default:
        return 'Select date range';
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Icon name="Calendar" size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Date Range:</span>
      </div>
      <div className="flex items-center space-x-2">
        <Select
          options={predefinedRanges}
          value={selectedRange}
          onChange={handleRangeChange}
          className="min-w-40"
        />

        <Button
          variant="outline"
          size="sm"
          iconName="Calendar"
          iconPosition="left"
          iconSize={14}
          className="text-sm"
        >
          {getDateRangeDisplay()}
        </Button>
      </div>
      <Select
        options={comparisonOptions}
        value="none"
        onChange={() => {}}
        placeholder="Compare to..."
        className="min-w-36"
      />
      {showCustom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1100">
          <div className="bg-card border border-border rounded-lg p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Custom Date Range</h3>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                iconSize={16}
                onClick={() => setShowCustom(false)}
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">End Date</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCustom(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCustomApply}
                  disabled={!customStartDate || !customEndDate}
                  className="flex-1"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;