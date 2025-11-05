import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import googleAdsApiClient from '../../../utils/googleAdsApiClient';

const ServerApiPanel = () => {
  const [serverStatus, setServerStatus] = useState({
    connected: false,
    authenticated: false,
    loading: true,
    error: null
  });
  const [testResults, setTestResults] = useState(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [queryResult, setQueryResult] = useState(null);
  const [customQuery, setCustomQuery] = useState('');
  const [customCustomerId, setCustomCustomerId] = useState('');
  const [isExecutingQuery, setIsExecutingQuery] = useState(false);

  // Test connection on component mount
  useEffect(() => {
    testServerConnection();
  }, []);

  const testServerConnection = async () => {
    try {
      setIsTestingConnection(true);
      setServerStatus(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await googleAdsApiClient?.testConnection();
      
      setServerStatus({
        connected: result?.connected,
        authenticated: result?.authenticated,
        loading: false,
        error: result?.error || null
      });
      
      setTestResults(result);
      
    } catch (error) {
      console.error('Server connection test failed:', error);
      
      setServerStatus({
        connected: false,
        authenticated: false,
        loading: false,
        error: error?.message
      });
      
      setTestResults({
        connected: false,
        authenticated: false,
        error: error?.message,
        details: error?.details,
        suggestion: error?.details?.suggestion,
        timestamp: new Date()?.toISOString()
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const executeTestQuery = async () => {
    try {
      setIsExecutingQuery(true);
      setQueryResult(null);
      
      // Default test query to list client accounts
      const defaultQuery = `
        SELECT
          customer_client.client_customer,
          customer_client.descriptive_name,
          customer_client.level,
          customer_client.currency_code,
          customer_client.time_zone,
          customer_client.status
        FROM customer_client
        WHERE customer_client.hidden = FALSE
        LIMIT 10
      `;
      
      const queryToExecute = customQuery?.trim() || defaultQuery;
      
      console.log('🔍 Executing test query:', queryToExecute);
      
      const result = await googleAdsApiClient?.search(
        queryToExecute,
        customCustomerId || null
      );
      
      setQueryResult({
        success: true,
        data: result,
        query: queryToExecute,
        customerId: customCustomerId || 'Default MCP',
        timestamp: new Date()?.toISOString(),
        recordCount: result?.results?.length || 0
      });
      
    } catch (error) {
      console.error('Test query failed:', error);
      
      setQueryResult({
        success: false,
        error: error?.message,
        details: error?.details,
        query: customQuery?.trim() || 'Default client list query',
        customerId: customCustomerId || 'Default MCP',
        timestamp: new Date()?.toISOString()
      });
    } finally {
      setIsExecutingQuery(false);
    }
  };

  const getStatusIcon = () => {
    if (serverStatus?.loading) return 'Loader';
    if (serverStatus?.connected && serverStatus?.authenticated) return 'CheckCircle';
    if (serverStatus?.connected && !serverStatus?.authenticated) return 'AlertTriangle';
    return 'XCircle';
  };

  const getStatusColor = () => {
    if (serverStatus?.loading) return 'text-blue-600';
    if (serverStatus?.connected && serverStatus?.authenticated) return 'text-green-600';
    if (serverStatus?.connected && !serverStatus?.authenticated) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusText = () => {
    if (serverStatus?.loading) return 'Testing Connection...';
    if (serverStatus?.connected && serverStatus?.authenticated) return 'Server Connected & Authenticated';
    if (serverStatus?.connected && !serverStatus?.authenticated) return 'Server Connected - Auth Failed';
    return 'Server Not Connected';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="Server" size={24} className="text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Server-Side API Proxy</h3>
            <p className="text-sm text-muted-foreground">
              Direct connection to Google Ads API via secure server endpoint
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Icon 
            name={getStatusIcon()} 
            size={16} 
            className={`${getStatusColor()} ${serverStatus?.loading ? 'animate-spin' : ''}`} 
          />
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Server Not Running Warning */}
      {testResults && !testResults?.connected && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-red-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-red-800 mb-2">Server Connection Failed</h4>
              <p className="text-sm text-red-700 mb-3">
                The Google Ads API server is not running or unreachable. The server is required to handle API requests and avoid CORS issues.
              </p>
              
              {testResults?.suggestion && (
                <div className="bg-red-100 border border-red-300 rounded p-3 mb-3">
                  <div className="text-sm text-red-800">
                    <strong>💡 Solution:</strong> {testResults?.suggestion}
                  </div>
                </div>
              )}
              
              <div className="text-sm text-red-700 space-y-1">
                <div><strong>Server URL:</strong> {testResults?.serverURL || 'http://localhost:3001'}</div>
                <div><strong>Expected Endpoints:</strong> /api/health, /api/ads/*</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection Status Details */}
      {testResults && testResults?.connected && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-foreground flex items-center space-x-2">
            <Icon name="Activity" size={16} className="text-blue-600" />
            <span>Connection Test Results</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Server:</span>
              <span className={testResults?.connected ? 'text-green-600' : 'text-red-600'}>
                {testResults?.connected ? 'Connected ✓' : 'Disconnected ✗'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Authentication:</span>
              <span className={testResults?.authenticated ? 'text-green-600' : 'text-red-600'}>
                {testResults?.authenticated ? 'Valid ✓' : 'Failed ✗'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Test:</span>
              <span className="text-gray-600">
                {testResults?.timestamp ? new Date(testResults.timestamp)?.toLocaleTimeString() : 'Never'}
              </span>
            </div>
          </div>
          
          {testResults?.error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <strong>Error:</strong> {testResults?.error}
              {testResults?.suggestion && (
                <div className="mt-2">
                  <strong>💡 Suggestion:</strong> {testResults?.suggestion}
                </div>
              )}
            </div>
          )}
          
          {testResults?.message && !testResults?.error && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
              <strong>Status:</strong> {testResults?.message}
            </div>
          )}
        </div>
      )}

      {/* Server Setup Instructions */}
      {testResults && !testResults?.connected && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-blue-800 flex items-center space-x-2">
            <Icon name="Book" size={16} className="text-blue-600" />
            <span>Server Setup Instructions</span>
          </h4>
          
          <div className="text-sm text-blue-700 space-y-2">
            <div className="font-medium">Quick Start:</div>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Open a new terminal window</li>
              <li>Navigate to server directory: <code className="bg-blue-100 px-1 rounded">cd server</code></li>
              <li>Install dependencies: <code className="bg-blue-100 px-1 rounded">npm install</code></li>
              <li>Configure .env file with your Google Ads API credentials</li>
              <li>Start server: <code className="bg-blue-100 px-1 rounded">npm start</code></li>
            </ol>
            
            <div className="mt-3 p-2 bg-blue-100 border border-blue-300 rounded text-xs">
              <strong>Note:</strong> The server must be running on port 3001 for the frontend to communicate with Google Ads API.
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          iconName="RefreshCw"
          iconPosition="left"
          iconSize={16}
          onClick={testServerConnection}
          loading={isTestingConnection}
        >
          Test Connection
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          iconName="Play"
          iconPosition="left"
          iconSize={16}
          onClick={executeTestQuery}
          loading={isExecutingQuery}
          disabled={!serverStatus?.connected || !serverStatus?.authenticated}
        >
          Run Test Query
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          iconName="ExternalLink"
          iconPosition="left"
          iconSize={16}
          onClick={() => window.open(`${testResults?.serverURL || 'http://localhost:3001'}/api/health`, '_blank')}
          disabled={!serverStatus?.connected}
        >
          Server Health
        </Button>
      </div>
      {/* Query Testing Section */}
      {serverStatus?.connected && serverStatus?.authenticated && (
        <div className="border-t border-border pt-6 space-y-4">
          <h4 className="font-semibold text-foreground flex items-center space-x-2">
            <Icon name="Search" size={16} className="text-primary" />
            <span>Test GAQL Query</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Custom Customer ID (Optional)"
              placeholder="e.g., 942-196-4548 or leave empty for MCP"
              value={customCustomerId}
              onChange={(e) => setCustomCustomerId(e?.target?.value)}
            />
            
            <div className="flex items-end">
              <Button
                variant="primary"
                size="sm"
                iconName="Play"
                iconPosition="left"
                iconSize={16}
                onClick={executeTestQuery}
                loading={isExecutingQuery}
                className="w-full"
              >
                Execute Query
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              GAQL Query (leave empty for default client list)
            </label>
            <textarea
              className="w-full h-24 px-3 py-2 border border-border rounded-lg resize-none text-sm font-mono"
              placeholder="SELECT customer_client.client_customer, customer_client.descriptive_name FROM customer_client WHERE customer_client.hidden = FALSE"
              value={customQuery}
              onChange={(e) => setCustomQuery(e?.target?.value)}
            />
          </div>

          {/* Query Results */}
          {queryResult && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-foreground flex items-center space-x-2">
                  <Icon 
                    name={queryResult?.success ? 'CheckCircle' : 'XCircle'} 
                    size={16} 
                    className={queryResult?.success ? 'text-green-600' : 'text-red-600'} 
                  />
                  <span>Query Results</span>
                </h5>
                <span className="text-sm text-muted-foreground">
                  {queryResult?.timestamp ? new Date(queryResult.timestamp)?.toLocaleTimeString() : ''}
                </span>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="font-medium">Customer ID:</span> {queryResult?.customerId}
                  </div>
                  <div>
                    <span className="font-medium">Records:</span> {queryResult?.recordCount || 'N/A'}
                  </div>
                </div>
                
                {queryResult?.success ? (
                  <div className="space-y-2">
                    <pre className="bg-white border rounded p-3 text-xs overflow-auto max-h-64">
                      {JSON.stringify(queryResult?.data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                    <div className="font-medium mb-1">Error:</div>
                    <div>{queryResult?.error}</div>
                    {queryResult?.details && (
                      <div className="mt-2 text-xs">
                        <strong>Details:</strong> {JSON.stringify(queryResult?.details, null, 2)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Server Info */}
      <div className="border-t border-border pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-foreground">Server URL:</span>
            <div className="text-muted-foreground">{testResults?.serverURL || 'http://localhost:3001'}</div>
          </div>
          <div>
            <span className="font-medium text-foreground">API Endpoints:</span>
            <div className="text-muted-foreground">/api/ads/*</div>
          </div>
          <div>
            <span className="font-medium text-foreground">CORS Status:</span>
            <div className={serverStatus?.connected ? 'text-green-600' : 'text-red-600'}>
              {serverStatus?.connected ? 'Enabled ✓' : 'Server Down ✗'}
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <Icon name="Info" size={14} className="inline mr-1" />
          Server handles OAuth tokens, CORS headers, and Google Ads API communication securely.
          {serverStatus?.connected 
            ? 'No browser CORS limitations when using this proxy.' :' Start the server to enable secure API communication.'
          }
        </div>
      </div>
    </div>
  );
};

export default ServerApiPanel;