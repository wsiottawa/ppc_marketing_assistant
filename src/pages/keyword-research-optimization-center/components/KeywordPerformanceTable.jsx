import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const KeywordPerformanceTable = ({ keywords, onKeywordUpdate, onBulkAction }) => {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'impressions', direction: 'desc' });
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Mock keyword performance data
  const mockKeywords = [
    {
      id: 'kw-1',
      keyword: 'ppc management services',
      matchType: 'Exact',
      status: 'Active',
      impressions: 12450,
      clicks: 387,
      ctr: 3.11,
      avgCpc: 4.25,
      cost: 1644.75,
      conversions: 23,
      conversionRate: 5.94,
      costPerConversion: 71.51,
      qualityScore: 8,
      searchImpressionShare: 67.3,
      avgPosition: 1.8,
      lastUpdated: '2 hours ago'
    },
    {
      id: 'kw-2',
      keyword: 'google ads optimization',
      matchType: 'Phrase',
      status: 'Active',
      impressions: 8920,
      clicks: 234,
      ctr: 2.62,
      avgCpc: 3.89,
      cost: 910.26,
      conversions: 18,
      conversionRate: 7.69,
      costPerConversion: 50.57,
      qualityScore: 9,
      searchImpressionShare: 45.2,
      avgPosition: 2.1,
      lastUpdated: '1 hour ago'
    },
    {
      id: 'kw-3',
      keyword: 'paid search management',
      matchType: 'Broad Modified',
      status: 'Active',
      impressions: 15670,
      clicks: 298,
      ctr: 1.90,
      avgCpc: 2.95,
      cost: 879.10,
      conversions: 12,
      conversionRate: 4.03,
      costPerConversion: 73.26,
      qualityScore: 6,
      searchImpressionShare: 78.9,
      avgPosition: 2.8,
      lastUpdated: '30 minutes ago'
    },
    {
      id: 'kw-4',
      keyword: 'ppc campaign management',
      matchType: 'Exact',
      status: 'Paused',
      impressions: 5430,
      clicks: 89,
      ctr: 1.64,
      avgCpc: 5.12,
      cost: 455.68,
      conversions: 4,
      conversionRate: 4.49,
      costPerConversion: 113.92,
      qualityScore: 5,
      searchImpressionShare: 23.1,
      avgPosition: 3.2,
      lastUpdated: '4 hours ago'
    },
    {
      id: 'kw-5',
      keyword: 'digital marketing ppc',
      matchType: 'Phrase',
      status: 'Active',
      impressions: 9850,
      clicks: 445,
      ctr: 4.52,
      avgCpc: 2.34,
      cost: 1041.30,
      conversions: 31,
      conversionRate: 6.97,
      costPerConversion: 33.59,
      qualityScore: 10,
      searchImpressionShare: 89.4,
      avgPosition: 1.3,
      lastUpdated: '15 minutes ago'
    }
  ];

  // Status filter options
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Paused', label: 'Paused' },
    { value: 'Removed', label: 'Removed' }
  ];

  // Filter and sort keywords
  const filteredAndSortedKeywords = useMemo(() => {
    let filtered = mockKeywords?.filter(keyword => {
      const matchesText = keyword?.keyword?.toLowerCase()?.includes(filterText?.toLowerCase());
      const matchesStatus = !statusFilter || keyword?.status === statusFilter;
      return matchesText && matchesStatus;
    });

    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        let aValue = a?.[sortConfig?.key];
        let bValue = b?.[sortConfig?.key];
        
        if (typeof aValue === 'string') {
          aValue = aValue?.toLowerCase();
          bValue = bValue?.toLowerCase();
        }
        
        if (aValue < bValue) return sortConfig?.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig?.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [filterText, statusFilter, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectKeyword = (keywordId) => {
    setSelectedKeywords(prev =>
      prev?.includes(keywordId)
        ? prev?.filter(id => id !== keywordId)
        : [...prev, keywordId]
    );
  };

  const handleSelectAll = () => {
    if (selectedKeywords?.length === filteredAndSortedKeywords?.length) {
      setSelectedKeywords([]);
    } else {
      setSelectedKeywords(filteredAndSortedKeywords?.map(kw => kw?.id));
    }
  };

  const handleCellEdit = (keywordId, field, value) => {
    setEditingCell({ keywordId, field });
    setEditValue(value);
  };

  const handleCellSave = () => {
    if (editingCell && onKeywordUpdate) {
      onKeywordUpdate(editingCell?.keywordId, editingCell?.field, editValue);
    }
    setEditingCell(null);
    setEditValue('');
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-success';
      case 'Paused': return 'text-warning';
      case 'Removed': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getQualityScoreColor = (score) => {
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-warning';
    return 'text-error';
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const renderEditableCell = (keyword, field, value) => {
    const isEditing = editingCell?.keywordId === keyword?.id && editingCell?.field === field;
    
    if (isEditing) {
      return (
        <div className="flex items-center space-x-1">
          <Input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e?.target?.value)}
            className="w-20 h-6 text-xs"
            onKeyPress={(e) => {
              if (e?.key === 'Enter') handleCellSave();
              if (e?.key === 'Escape') handleCellCancel();
            }}
            autoFocus
          />
          <Button
            variant="ghost"
            size="xs"
            onClick={handleCellSave}
            iconName="Check"
            iconSize={12}
            className="h-6 w-6 p-0"
          />
          <Button
            variant="ghost"
            size="xs"
            onClick={handleCellCancel}
            iconName="X"
            iconSize={12}
            className="h-6 w-6 p-0"
          />
        </div>
      );
    }

    return (
      <button
        onClick={() => handleCellEdit(keyword?.id, field, value)}
        className="text-left hover:bg-muted/50 rounded px-1 py-0.5 transition-colors"
        title="Click to edit"
      >
        {typeof value === 'number' ? value?.toLocaleString() : value}
      </button>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Table" size={20} className="mr-2 text-primary" />
          Keyword Performance
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Download"
            iconSize={16}
            className="text-muted-foreground"
          >
            Export
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="RefreshCw"
            iconSize={16}
            className="text-muted-foreground"
          >
            Refresh
          </Button>
        </div>
      </div>
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search keywords..."
            value={filterText}
            onChange={(e) => setFilterText(e?.target?.value)}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
          />
        </div>
      </div>
      {/* Bulk Actions */}
      {selectedKeywords?.length > 0 && (
        <div className="flex items-center justify-between mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <span className="text-sm text-foreground">
            {selectedKeywords?.length} keyword(s) selected
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Play"
              iconSize={14}
              onClick={() => onBulkAction('activate', selectedKeywords)}
            >
              Activate
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Pause"
              iconSize={14}
              onClick={() => onBulkAction('pause', selectedKeywords)}
            >
              Pause
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Trash2"
              iconSize={14}
              onClick={() => onBulkAction('remove', selectedKeywords)}
            >
              Remove
            </Button>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="flex-1 overflow-auto border border-border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 sticky top-0">
            <tr>
              <th className="p-3 text-left">
                <Checkbox
                  checked={selectedKeywords?.length === filteredAndSortedKeywords?.length}
                  indeterminate={selectedKeywords?.length > 0 && selectedKeywords?.length < filteredAndSortedKeywords?.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-3 text-left">
                <button
                  onClick={() => handleSort('keyword')}
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
                >
                  <span>Keyword</span>
                  <Icon name={getSortIcon('keyword')} size={14} />
                </button>
              </th>
              <th className="p-3 text-left">Match Type</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort('impressions')}
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
                >
                  <span>Impressions</span>
                  <Icon name={getSortIcon('impressions')} size={14} />
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort('clicks')}
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
                >
                  <span>Clicks</span>
                  <Icon name={getSortIcon('clicks')} size={14} />
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort('ctr')}
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
                >
                  <span>CTR</span>
                  <Icon name={getSortIcon('ctr')} size={14} />
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort('avgCpc')}
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
                >
                  <span>Avg. CPC</span>
                  <Icon name={getSortIcon('avgCpc')} size={14} />
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort('cost')}
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
                >
                  <span>Cost</span>
                  <Icon name={getSortIcon('cost')} size={14} />
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort('conversions')}
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
                >
                  <span>Conv.</span>
                  <Icon name={getSortIcon('conversions')} size={14} />
                </button>
              </th>
              <th className="p-3 text-right">
                <button
                  onClick={() => handleSort('qualityScore')}
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
                >
                  <span>QS</span>
                  <Icon name={getSortIcon('qualityScore')} size={14} />
                </button>
              </th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedKeywords?.map((keyword) => (
              <tr key={keyword?.id} className="border-b border-border hover:bg-muted/25">
                <td className="p-3">
                  <Checkbox
                    checked={selectedKeywords?.includes(keyword?.id)}
                    onChange={() => handleSelectKeyword(keyword?.id)}
                  />
                </td>
                <td className="p-3">
                  <div>
                    <div className="font-medium text-foreground">{keyword?.keyword}</div>
                    <div className="text-xs text-muted-foreground">{keyword?.lastUpdated}</div>
                  </div>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                    {keyword?.matchType}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`font-medium ${getStatusColor(keyword?.status)}`}>
                    {keyword?.status}
                  </span>
                </td>
                <td className="p-3 text-right font-mono">
                  {renderEditableCell(keyword, 'impressions', keyword?.impressions)}
                </td>
                <td className="p-3 text-right font-mono">
                  {renderEditableCell(keyword, 'clicks', keyword?.clicks)}
                </td>
                <td className="p-3 text-right font-mono">{keyword?.ctr?.toFixed(2)}%</td>
                <td className="p-3 text-right font-mono">
                  ${renderEditableCell(keyword, 'avgCpc', keyword?.avgCpc?.toFixed(2))}
                </td>
                <td className="p-3 text-right font-mono">${keyword?.cost?.toFixed(2)}</td>
                <td className="p-3 text-right font-mono">{keyword?.conversions}</td>
                <td className="p-3 text-right">
                  <span className={`font-medium ${getQualityScoreColor(keyword?.qualityScore)}`}>
                    {keyword?.qualityScore}/10
                  </span>
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      iconSize={14}
                      className="h-8 w-8 p-0"
                      title="Edit keyword"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="BarChart3"
                      iconSize={14}
                      className="h-8 w-8 p-0"
                      title="View details"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MoreHorizontal"
                      iconSize={14}
                      className="h-8 w-8 p-0"
                      title="More actions"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Table Footer */}
      <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
        <div>
          Showing {filteredAndSortedKeywords?.length} of {mockKeywords?.length} keywords
        </div>
        <div className="flex items-center space-x-4">
          <span>
            Total Cost: ${mockKeywords?.reduce((sum, kw) => sum + kw?.cost, 0)?.toFixed(2)}
          </span>
          <span>
            Total Conversions: {mockKeywords?.reduce((sum, kw) => sum + kw?.conversions, 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default KeywordPerformanceTable;