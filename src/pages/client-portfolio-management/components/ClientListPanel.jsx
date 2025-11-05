import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ClientListPanel = ({ clients, selectedClient, onClientSelect, onBulkAction, loading, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedClients, setSelectedClients] = useState([]);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [newClientData, setNewClientData] = useState({
    customerId: '',
    name: '',
    industry: 'Other'
  });
  const [addingClient, setAddingClient] = useState(false);
  const [bulkImporting, setBulkImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({
    total: 0,
    imported: 0,
    failed: 0,
    current: '',
    details: []
  });

  // Filter and sort options
  const filterOptions = [
    { value: 'all', label: 'All Clients' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'high-spend', label: 'High Spend (>$10k)' },
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'small-business', label: 'Small Business' },
    { value: 'at-risk', label: 'At Risk' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'spend', label: 'Monthly Spend' },
    { value: 'performance', label: 'Performance Score' },
    { value: 'health', label: 'Health Score' },
    { value: 'contract', label: 'Contract End Date' }
  ];

  // Filtered and sorted clients
  const filteredClients = useMemo(() => {
    let filtered = clients?.filter(client => {
      const matchesSearch = client?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           client?.industry?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      
      if (!matchesSearch) return false;

      switch (filterBy) {
        case 'active': return client?.status === 'active';
        case 'paused': return client?.status === 'paused';
        case 'high-spend': return client?.monthlySpend > 10000;
        case 'enterprise': return client?.tier === 'enterprise';
        case 'small-business': return client?.tier === 'small-business';
        case 'at-risk': return client?.healthScore < 60;
        default: return true;
      }
    });

    // Sort clients
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a?.name?.localeCompare(b?.name);
        case 'spend': return b?.monthlySpend - a?.monthlySpend;
        case 'performance': return b?.performanceScore - a?.performanceScore;
        case 'health': return b?.healthScore - a?.healthScore;
        case 'contract': return new Date(a.contractEndDate) - new Date(b.contractEndDate);
        default: return 0;
      }
    });

    return filtered;
  }, [clients, searchTerm, filterBy, sortBy]);

  // Enhanced bulk import functionality with MCP account discovery
  const handleBulkImport = async () => {
    setBulkImporting(true);
    setImportProgress({
      total: 0,
      imported: 0,
      failed: 0,
      current: 'Connecting to Google Ads API...',
      details: []
    });

    try {
      // Import GoogleAdsService dynamically
      const { default: googleAdsService } = await import('../../../utils/googleAdsService');
      
      // Test connection first
      setImportProgress(prev => ({
        ...prev,
        current: 'Testing Google Ads API connection...'
      }));

      const connectionTest = await googleAdsService?.testConnection();
      
      if (connectionTest?.connectionStatus !== 'authenticated_cors_limited' && 
          connectionTest?.connectionStatus !== 'fully_accessible') {
        
        // Show connection issues but still allow manual import
        setImportProgress(prev => ({
          ...prev,
          current: 'API connection limited - using manual import method',
          details: [
            {
              type: 'warning',
              message: `Connection Status: ${connectionTest?.connectionStatus}`,
              timestamp: new Date()?.toLocaleString()
            },
            {
              type: 'info',
              message: 'Will attempt to fetch available accounts through alternative methods',
              timestamp: new Date()?.toLocaleString()
            }
          ]
        }));
      }

      // Get MCP client list - this will try API first, then fall back to other methods
      setImportProgress(prev => ({
        ...prev,
        current: 'Fetching all accounts under MCP 942-196-4548...'
      }));

      const mcpList = await googleAdsService?.getMcpClientList();
      
      if (mcpList?.error) {
        throw new Error(`MCP fetch failed: ${mcpList?.error}`);
      }

      const availableClients = mcpList?.clients || [];
      
      // Filter out clients that are already imported (not demo accounts)
      const existingClientIds = clients?.map(c => c?.id?.replace(/\D/g, '')) || [];
      const newClients = availableClients?.filter(client => 
        !existingClientIds?.includes(client?.id?.replace(/\D/g, '')) &&
        client?.id !== '123456789' && 
        client?.id !== 'ENTER_YOUR_ID'
      );

      if (newClients?.length === 0) {
        setImportProgress(prev => ({
          ...prev,
          current: 'No new accounts found to import',
          details: [
            ...prev?.details,
            {
              type: 'info',
              message: `Found ${availableClients?.length} total accounts, but all are already imported`,
              timestamp: new Date()?.toLocaleString()
            }
          ]
        }));
        // Keep the modal open and show completion status
        setBulkImporting(false);
        return;
      }

      // Start bulk import process
      setImportProgress(prev => ({
        ...prev,
        total: newClients?.length,
        current: `Found ${newClients?.length} new accounts to import`,
        details: [
          ...prev?.details,
          {
            type: 'success',
            message: `Discovered ${newClients?.length} accounts under MCP 942-196-4548`,
            timestamp: new Date()?.toLocaleString()
          }
        ]
      }));

      // Import each client with progress updates
      for (let i = 0; i < newClients?.length; i++) {
        const client = newClients?.[i];
        
        setImportProgress(prev => ({
          ...prev,
          current: `Importing ${client?.name} (${client?.id})...`
        }));

        try {
          // Add client using existing method
          const importedClient = await googleAdsService?.addClientByCustomerId(
            client?.id,
            client?.name,
            client?.industry
          );

          setImportProgress(prev => ({
            ...prev,
            imported: prev?.imported + 1,
            details: [
              ...prev?.details,
              {
                type: 'success',
                message: `✅ Imported: ${importedClient?.name} (ID: ${importedClient?.id})`,
                timestamp: new Date()?.toLocaleString()
              }
            ]
          }));

          // Small delay to prevent rate limiting and show progress
          await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
          console.error(`Failed to import client ${client?.id}:`, error);
          
          setImportProgress(prev => ({
            ...prev,
            failed: prev?.failed + 1,
            details: [
              ...prev?.details,
              {
                type: 'error',
                message: `❌ Failed: ${client?.name} - ${error?.message}`,
                timestamp: new Date()?.toLocaleString()
              }
            ]
          }));
        }
      }

      // Final status
      setImportProgress(prev => ({
        ...prev,
        current: `Import complete: ${prev?.imported} successful, ${prev?.failed} failed`,
        details: [
          ...prev?.details,
          {
            type: 'summary',
            message: `📊 Import Summary: ${prev?.imported}/${prev?.total} accounts imported successfully`,
            timestamp: new Date()?.toISOString()
          }
        ]
      }));

      // Refresh the client list to show imported accounts
      onRefresh();

    } catch (error) {
      console.error('Bulk import failed:', error);
      
      // Enhanced error handling - show detailed error information and don't close modal
      const errorMessage = error?.message || 'Unknown error occurred';
      const isNetworkError = errorMessage?.includes('Network Error') || errorMessage?.includes('Failed to fetch');
      const isCorsError = errorMessage?.includes('CORS') || errorMessage?.includes('CORS_ERROR');
      
      setImportProgress(prev => ({
        ...prev,
        current: 'Import failed - See detailed error information below',
        details: [
          ...prev?.details,
          {
            type: 'error',
            message: `❌ Critical Error: ${errorMessage}`,
            timestamp: new Date()?.toLocaleString()
          },
          ...(isCorsError ? [
            {
              type: 'info',
              message: '🔗 CORS Restriction: Browser security prevents direct Google Ads API calls',
              timestamp: new Date()?.toLocaleString()
            },
            {
              type: 'info',
              message: '✅ Your Google Ads credentials are working correctly',
              timestamp: new Date()?.toLocaleString()
            },
            {
              type: 'info',
              message: '💡 Solution: Add clients manually using their Customer IDs',
              timestamp: new Date()?.toLocaleString()
            },
            {
              type: 'warning',
              message: '📋 Example: Click "Add Client" and enter Customer ID: 942-196-4548',
              timestamp: new Date()?.toLocaleString()
            }
          ] : isNetworkError ? [
            {
              type: 'info',
              message: '🔗 Network Issue: Unable to connect to Google Ads API',
              timestamp: new Date()?.toLocaleString()
            },
            {
              type: 'info',
              message: '💡 Check your internet connection and try again',
              timestamp: new Date()?.toLocaleString()
            },
            {
              type: 'warning',
              message: '📋 Alternative: Add clients manually using Customer IDs',
              timestamp: new Date()?.toLocaleString()
            }
          ] : [
            {
              type: 'warning',
              message: '⚠️ You can still add clients manually using their Customer IDs',
              timestamp: new Date()?.toLocaleString()
            }
          ])
        ]
      }));
    } finally {
      // Always set bulkImporting to false when done (success or error)
      setBulkImporting(false);
    }
  };

  // Enhanced add client functionality with specific Customer ID support
  const handleAddClient = () => {
    setShowAddClientModal(true);
    setNewClientData({ customerId: '', name: '', industry: 'Other' });
  };

  const handleSaveNewClient = async () => {
    if (!newClientData?.customerId?.trim()) {
      alert('Please enter a valid Google Ads Customer ID (e.g., 942-196-4548)');
      return;
    }

    setAddingClient(true);
    
    try {
      // Import GoogleAdsService dynamically
      const { default: googleAdsService } = await import('../../../utils/googleAdsService');
      
      // Try to add the client using the enhanced service method
      const addedClient = await googleAdsService?.addClientByCustomerId(
        newClientData?.customerId,
        newClientData?.name,
        newClientData?.industry
      );
      
      if (addedClient) {
        // Trigger refresh to reload data with the new client
        onRefresh();
        setShowAddClientModal(false);
        setNewClientData({ customerId: '', name: '', industry: 'Other' });
        
        // Show success message
        alert(`✅ Successfully added client: ${addedClient?.name} (ID: ${addedClient?.id})`);
      }
      
    } catch (error) {
      console.error('Error adding client:', error);
      alert(`❌ Failed to add client: ${error?.message}`);
    } finally {
      setAddingClient(false);
    }
  };

  const getCurrentPeriod = () => {
    const now = new Date();
    const firstDay = new Date(now?.getFullYear(), now?.getMonth(), 1);
    const lastDay = new Date(now?.getFullYear(), now?.getMonth() + 1, 0);
    return `${firstDay?.toLocaleDateString()} - ${lastDay?.toLocaleDateString()}`;
  };

  const handleClientSelection = (clientId, checked) => {
    if (checked) {
      setSelectedClients(prev => [...prev, clientId]);
    } else {
      setSelectedClients(prev => prev?.filter(id => id !== clientId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedClients(filteredClients?.map(client => client?.id));
    } else {
      setSelectedClients([]);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'paused': return 'text-warning';
      case 'at-risk': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value?.toFixed(1)}%`;
  };

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Client Portfolio
            {loading && (
              <span className="ml-2 text-sm text-muted-foreground">
                Loading...
              </span>
            )}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              iconPosition="left"
              iconSize={14}
              onClick={onRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="secondary"
              size="sm"
              iconName="Download"
              iconPosition="left"
              iconSize={14}
              onClick={() => setShowBulkImportModal(true)}
              disabled={loading || bulkImporting}
            >
              Import All MCP Accounts
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Plus"
              iconPosition="left"
              iconSize={16}
              onClick={handleAddClient}
            >
              Add Client
            </Button>
          </div>
        </div>

        {/* Search with enhanced placeholder */}
        <Input
          type="search"
          placeholder="Search clients, Customer IDs (942-196-4548), or industries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="mb-3"
          disabled={loading}
        />

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2">
          <Select
            options={filterOptions}
            value={filterBy}
            onChange={setFilterBy}
            placeholder="Filter by"
            disabled={loading}
          />
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
            disabled={loading}
          />
        </div>
      </div>
      {/* Bulk Actions */}
      {selectedClients?.length > 0 && !loading && (
        <div className="p-3 bg-muted border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {selectedClients?.length} client{selectedClients?.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Mail"
                iconSize={14}
                onClick={() => onBulkAction('email', selectedClients)}
              >
                Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="FileText"
                iconSize={14}
                onClick={() => onBulkAction('report', selectedClients)}
              >
                Report
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Client List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          // Loading state
          (<div className="p-8 text-center">
            <Icon name="RefreshCw" size={48} className="text-muted-foreground mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium text-foreground mb-2">Loading Clients</h3>
            <p className="text-muted-foreground">
              Fetching client data from your Google Ads account...
            </p>
          </div>)
        ) : (
          <>
            {/* Select All */}
            {filteredClients?.length > 0 && (
              <div className="p-3 border-b border-border bg-muted/50">
                <Checkbox
                  label={`Select all (${filteredClients?.length})`}
                  checked={selectedClients?.length === filteredClients?.length && filteredClients?.length > 0}
                  indeterminate={selectedClients?.length > 0 && selectedClients?.length < filteredClients?.length}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </div>
            )}

            {/* Client Items */}
            {filteredClients?.map((client) => (
              <div
                key={client?.id}
                className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedClient?.id === client?.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                }`}
                onClick={() => onClientSelect(client)}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={selectedClients?.includes(client?.id)}
                    onChange={(e) => {
                      e?.stopPropagation();
                      handleClientSelection(client?.id, e?.target?.checked);
                    }}
                    onClick={(e) => e?.stopPropagation()}
                  />

                  <div className="flex-1 min-w-0">
                    {/* Client Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground truncate">{client?.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          ID: {client?.id}
                          {client?.id === 'ENTER_YOUR_ID' && <span className="text-primary ml-1">← Click "Add Client"</span>}
                        </p>
                      </div>
                      <div className={`flex items-center space-x-1 ${getStatusColor(client?.status)}`}>
                        <Icon name="Circle" size={8} className="fill-current" />
                        <span className="text-xs capitalize">{client?.status}</span>
                      </div>
                    </div>

                    {/* Client Details */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{client?.industry}</span>
                        <span className="font-medium text-foreground">
                          {formatCurrency(client?.monthlySpend)}/mo
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Performance</span>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">{client?.performanceScore}%</span>
                          <span className={client?.performanceTrend > 0 ? 'text-success' : 'text-error'}>
                            {formatPercentage(client?.performanceTrend)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Health Score</span>
                        <span className={`font-medium ${getHealthScoreColor(client?.healthScore)}`}>
                          {client?.healthScore}/100
                        </span>
                      </div>

                      {/* Contract Info */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {client?.id?.includes('demo') ? 
                            'Demo Account' : 
                            client?.id === 'ENTER_YOUR_ID' ? 'Setup Instructions' :
                            client?.billing?.status === 'setup_required'? 'Setup Required' :
                            `Contract ends ${new Date(client.contractEndDate)?.toLocaleDateString()}`
                          }
                        </span>
                        <div className="flex items-center space-x-1">
                          {client?.integrationStatus?.crm && (
                            <Icon name="Database" size={12} className="text-success" title="CRM Connected" />
                          )}
                          {client?.integrationStatus?.billing && (
                            <Icon name="CreditCard" size={12} className="text-success" title="Billing Connected" />
                          )}
                          {client?.integrationStatus?.portal && (
                            <Icon name="Globe" size={12} className="text-success" title="Portal Active" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {filteredClients?.length === 0 && (
              <div className="p-8 text-center">
                <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No clients found</h3>
                <p className="text-muted-foreground mb-4">
                  {clients?.length === 0 ? 
                    'Add your Google Ads clients using their Customer IDs (e.g., 942-196-4548)' : 'Try adjusting your search or filter criteria'
                  }
                </p>
                {clients?.length === 0 && (
                  <Button
                    variant="default"
                    onClick={handleAddClient}
                    iconName="Plus"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Add Client by Customer ID
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
      {/* Footer Stats */}
      {!loading && filteredClients?.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-foreground">{filteredClients?.length}</div>
              <div className="text-xs text-muted-foreground">Clients</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {formatCurrency(filteredClients?.reduce((sum, client) => sum + client?.monthlySpend, 0))}
              </div>
              <div className="text-xs text-muted-foreground">Total Spend</div>
            </div>
          </div>
        </div>
      )}
      {/* Enhanced Bulk Import Modal */}
      {showBulkImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Import All MCP Accounts
              </h3>
              {!bulkImporting && (
                <button
                  onClick={() => setShowBulkImportModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon name="X" size={20} />
                </button>
              )}
            </div>
            
            {!bulkImporting ? (
              // Pre-import confirmation
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    <Icon name="Info" size={16} className="inline mr-2" />
                    About MCP Account Import
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Automatically discovers all accounts under your MCP (942-196-4548)</li>
                    <li>• Fetches real campaign data and performance metrics from Google Ads API</li>
                    <li>• Skips accounts that are already imported</li>
                    <li>• Creates comprehensive client profiles with billing and activity data</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">
                    <Icon name="AlertTriangle" size={16} className="inline mr-2" />
                    What to Expect
                  </h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Import may take 1-2 minutes depending on number of accounts</li>
                    <li>• Each account will be verified and processed individually</li>
                    <li>• Real-time progress tracking will show import status</li>
                    <li>• Failed imports can be retried manually later</li>
                  </ul>
                </div>
                <div className="flex items-center space-x-3 pt-4">
                  <Button
                    variant="default"
                    onClick={handleBulkImport}
                    iconName="Download"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Start Import
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowBulkImportModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // Import progress display - ALWAYS show when bulkImporting is true
              <div className="space-y-4 flex-1 flex flex-col">
                {/* Progress Header */}
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">
                      {importProgress?.current}
                    </span>
                    <div className="flex items-center space-x-2">
                      {bulkImporting && (
                        <Icon name="RefreshCw" size={16} className="text-primary animate-spin" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {importProgress?.total > 0 && 
                          `${importProgress?.imported + importProgress?.failed}/${importProgress?.total}`
                        }
                      </span>
                    </div>
                  </div>
                  
                  {importProgress?.total > 0 && (
                    <div className="w-full bg-border rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${((importProgress?.imported + importProgress?.failed) / importProgress?.total) * 100}%`
                        }}
                      />
                    </div>
                  )}
                </div>
                
                {/* Progress Stats */}
                {importProgress?.total > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">
                        {importProgress?.imported}
                      </div>
                      <div className="text-sm text-muted-foreground">Imported</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-error">
                        {importProgress?.failed}
                      </div>
                      <div className="text-sm text-muted-foreground">Failed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {importProgress?.total}
                      </div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </div>
                  </div>
                )}
                
                {/* Import Details Log - Always visible */}
                <div className="flex-1 bg-muted rounded-lg p-4 overflow-y-auto max-h-60">
                  <h4 className="font-medium text-foreground mb-3">Import Details</h4>
                  <div className="space-y-2">
                    {importProgress?.details?.length > 0 ? (
                      importProgress?.details?.map((detail, index) => (
                        <div 
                          key={index} 
                          className={`text-sm p-2 rounded ${
                            detail?.type === 'success' ? 'bg-success/10 text-success' :
                            detail?.type === 'error' ? 'bg-error/10 text-error' :
                            detail?.type === 'warning' ? 'bg-warning/10 text-warning' :
                            detail?.type === 'summary'? 'bg-primary/10 text-primary font-medium' : 'bg-card text-muted-foreground'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="flex-1">{detail?.message}</span>
                            <span className="text-xs opacity-75 ml-2">
                              {detail?.timestamp}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground p-2">
                        Waiting for import process to begin...
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons - Always show when not actively importing */}
                <div className="flex justify-end space-x-2 pt-4">
                  {!bulkImporting && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          // Reset and close modal
                          setShowBulkImportModal(false);
                          setImportProgress({
                            total: 0,
                            imported: 0,
                            failed: 0,
                            current: '',
                            details: []
                          });
                        }}
                      >
                        Close
                      </Button>
                      {importProgress?.failed > 0 && (
                        <Button
                          variant="default"
                          onClick={handleBulkImport}
                          iconName="RefreshCw"
                          iconPosition="left"
                          iconSize={16}
                        >
                          Retry Import
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Enhanced Add Client Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Add Google Ads Client</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Google Ads Customer ID *
                </label>
                <Input
                  placeholder="942-196-4548 (your MCP account)"
                  value={newClientData?.customerId}
                  onChange={(e) => setNewClientData(prev => ({ ...prev, customerId: e?.target?.value }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  💡 Find in Google Ads → Settings → Account Settings → Customer ID
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Account Name (Optional)
                </label>
                <Input
                  placeholder="e.g., My Business Ads Account"
                  value={newClientData?.name}
                  onChange={(e) => setNewClientData(prev => ({ ...prev, name: e?.target?.value }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave blank to use name from Google Ads
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Industry
                </label>
                <Select
                  options={[
                    { value: 'Technology', label: 'Technology' },
                    { value: 'Healthcare', label: 'Healthcare' },
                    { value: 'E-commerce', label: 'E-commerce' },
                    { value: 'Finance', label: 'Finance' },
                    { value: 'Food & Beverage', label: 'Food & Beverage' },
                    { value: 'Travel', label: 'Travel' },
                    { value: 'Education', label: 'Education' },
                    { value: 'Other', label: 'Other' }
                  ]}
                  value={newClientData?.industry}
                  onChange={(value) => setNewClientData(prev => ({ ...prev, industry: value }))}
                />
              </div>

              {/* Help text */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-800">
                  <Icon name="Info" size={12} className="inline mr-1" />
                  The system will attempt to fetch real data from Google Ads. If blocked by browser security, 
                  a placeholder will be created that you can manage manually.
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mt-6">
              <Button
                variant="default"
                onClick={handleSaveNewClient}
                disabled={!newClientData?.customerId?.trim() || addingClient}
                iconName={addingClient ? "RefreshCw" : "Plus"}
                iconPosition="left"
                iconSize={16}
                className={addingClient ? "animate-spin" : ""}
              >
                {addingClient ? 'Adding Client...' : 'Add Client'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddClientModal(false)}
                disabled={addingClient}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientListPanel;