import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PerformanceDataTable = ({ isLoading = false }) => {
  const [sortField, setSortField] = useState('impressions');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const performanceData = [
    {
      id: 1,
      campaign: 'Black Friday Sale 2024',
      adGroup: 'Electronics Deals',
      keyword: 'black friday electronics',
      impressions: 45678,
      clicks: 2834,
      ctr: 6.21,
      cpc: 1.45,
      cost: 4110.30,
      conversions: 89,
      conversionRate: 3.14,
      revenue: 12450.00,
      roas: 3.03,
      qualityScore: 8
    },
    {
      id: 2,
      campaign: 'Holiday Shopping Campaign',
      adGroup: 'Gift Ideas',
      keyword: 'holiday gifts 2024',
      impressions: 38921,
      clicks: 1956,
      ctr: 5.03,
      cpc: 1.78,
      cost: 3482.68,
      conversions: 67,
      conversionRate: 3.43,
      revenue: 9890.00,
      roas: 2.84,
      qualityScore: 7
    },
    {
      id: 3,
      campaign: 'Winter Collection Launch',
      adGroup: 'Seasonal Apparel',
      keyword: 'winter clothing sale',
      impressions: 52341,
      clicks: 3127,
      ctr: 5.97,
      cpc: 1.23,
      cost: 3846.21,
      conversions: 112,
      conversionRate: 3.58,
      revenue: 15680.00,
      roas: 4.08,
      qualityScore: 9
    },
    {
      id: 4,
      campaign: 'Tech Gadgets Promotion',
      adGroup: 'Smart Devices',
      keyword: 'smart home devices',
      impressions: 29876,
      clicks: 1789,
      ctr: 5.99,
      cpc: 2.15,
      cost: 3846.35,
      conversions: 45,
      conversionRate: 2.52,
      revenue: 8920.00,
      roas: 2.32,
      qualityScore: 6
    },
    {
      id: 5,
      campaign: 'Fitness Equipment Sale',
      adGroup: 'Home Gym',
      keyword: 'home fitness equipment',
      impressions: 41234,
      clicks: 2467,
      ctr: 5.98,
      cpc: 1.89,
      cost: 4662.63,
      conversions: 78,
      conversionRate: 3.16,
      revenue: 13560.00,
      roas: 2.91,
      qualityScore: 8
    }
  ];

  const columns = [
    { key: 'campaign', label: 'Campaign', sortable: true, width: '200px' },
    { key: 'adGroup', label: 'Ad Group', sortable: true, width: '150px' },
    { key: 'keyword', label: 'Keyword', sortable: true, width: '180px' },
    { key: 'impressions', label: 'Impressions', sortable: true, width: '120px', align: 'right' },
    { key: 'clicks', label: 'Clicks', sortable: true, width: '100px', align: 'right' },
    { key: 'ctr', label: 'CTR (%)', sortable: true, width: '100px', align: 'right' },
    { key: 'cpc', label: 'CPC ($)', sortable: true, width: '100px', align: 'right' },
    { key: 'cost', label: 'Cost ($)', sortable: true, width: '120px', align: 'right' },
    { key: 'conversions', label: 'Conv.', sortable: true, width: '80px', align: 'right' },
    { key: 'conversionRate', label: 'Conv. Rate (%)', sortable: true, width: '120px', align: 'right' },
    { key: 'revenue', label: 'Revenue ($)', sortable: true, width: '120px', align: 'right' },
    { key: 'roas', label: 'ROAS', sortable: true, width: '80px', align: 'right' },
    { key: 'qualityScore', label: 'QS', sortable: true, width: '60px', align: 'center' }
  ];

  const pageSizeOptions = [
    { value: 10, label: '10 per page' },
    { value: 25, label: '25 per page' },
    { value: 50, label: '50 per page' },
    { value: 100, label: '100 per page' }
  ];

  const filteredAndSortedData = useMemo(() => {
    let filtered = performanceData?.filter(row =>
      Object.values(row)?.some(value =>
        value?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      )
    );

    if (sortField) {
      filtered?.sort((a, b) => {
        const aVal = a?.[sortField];
        const bVal = b?.[sortField];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = aVal?.toString()?.toLowerCase();
        const bStr = bVal?.toString()?.toLowerCase();
        
        if (sortDirection === 'asc') {
          return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
        } else {
          return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
        }
      });
    }

    return filtered;
  }, [searchTerm, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedData?.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedData?.length / pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev =>
      prev?.includes(id)
        ? prev?.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows?.length === paginatedData?.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData?.map(row => row?.id));
    }
  };

  const formatValue = (value, key) => {
    if (key === 'cost' || key === 'revenue' || key === 'cpc') {
      return `$${value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (key === 'ctr' || key === 'conversionRate') {
      return `${value?.toFixed(2)}%`;
    }
    if (key === 'roas') {
      return value?.toFixed(2);
    }
    if (key === 'impressions' || key === 'clicks' || key === 'conversions') {
      return value?.toLocaleString();
    }
    return value;
  };

  const getQualityScoreColor = (score) => {
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-warning';
    return 'text-error';
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-5 bg-muted rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[...Array(10)]?.map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <Icon name="Table" size={20} className="text-primary" />
              <span>Performance Data Table</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Detailed performance metrics with sorting and filtering
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              iconSize={14}
            >
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Filter"
              iconPosition="left"
              iconSize={14}
            >
              Filters
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search campaigns, keywords, or ad groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Select
              options={pageSizeOptions}
              value={pageSize}
              onChange={setPageSize}
              className="min-w-32"
            />
            
            {selectedRows?.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                iconName="Trash2"
                iconPosition="left"
                iconSize={14}
              >
                Delete ({selectedRows?.length})
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows?.length === paginatedData?.length && paginatedData?.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              {columns?.map((column) => (
                <th
                  key={column?.key}
                  className={`px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide ${
                    column?.align === 'right' ? 'text-right' : column?.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                  style={{ width: column?.width }}
                >
                  {column?.sortable ? (
                    <button
                      onClick={() => handleSort(column?.key)}
                      className="flex items-center space-x-1 hover:text-foreground nav-transition"
                    >
                      <span>{column?.label}</span>
                      <Icon
                        name={
                          sortField === column?.key
                            ? sortDirection === 'asc' ?'ChevronUp' :'ChevronDown' :'ChevronsUpDown'
                        }
                        size={12}
                      />
                    </button>
                  ) : (
                    column?.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData?.map((row) => (
              <tr
                key={row?.id}
                className={`hover:bg-muted nav-transition ${
                  selectedRows?.includes(row?.id) ? 'bg-accent bg-opacity-10' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows?.includes(row?.id)}
                    onChange={() => handleSelectRow(row?.id)}
                    className="rounded border-border"
                  />
                </td>
                {columns?.map((column) => (
                  <td
                    key={column?.key}
                    className={`px-4 py-3 text-sm ${
                      column?.align === 'right' ? 'text-right' : column?.align === 'center' ? 'text-center' : 'text-left'
                    } ${
                      column?.key === 'qualityScore' ? getQualityScoreColor(row?.[column?.key]) : 'text-foreground'
                    }`}
                  >
                    {column?.key === 'campaign' || column?.key === 'adGroup' || column?.key === 'keyword' ? (
                      <div className="truncate" title={row?.[column?.key]}>
                        {row?.[column?.key]}
                      </div>
                    ) : (
                      formatValue(row?.[column?.key], column?.key)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredAndSortedData?.length)} of {filteredAndSortedData?.length} results
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              iconName="ChevronLeft"
              iconSize={14}
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, totalPages))]?.map((_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              iconName="ChevronRight"
              iconSize={14}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDataTable;