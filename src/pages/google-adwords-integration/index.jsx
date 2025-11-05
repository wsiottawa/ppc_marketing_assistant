import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

import GoogleAdsService from '../../utils/googleAdsService';
import AdWordsConnectionPanel from './components/AdWordsConnectionPanel';
import ServerApiPanel from './components/ServerApiPanel';

const GoogleAdWordsIntegration = () => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isLoading, setIsLoading] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [mcpClientAccounts, setMcpClientAccounts] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [apiServices, setApiServices] = useState({
    googleAds: { connected: false, status: 'disconnected' },
    googleAnalytics: { connected: false, status: 'disconnected' }
  });

  // Initialize connection status with enhanced testing
  useEffect(() => {
    const checkInitialConnection = async () => {
      try {
        setIsLoading(true);
        setConnectionStatus('testing');
        
        // Run comprehensive connection test
        const testResults = await GoogleAdsService?.testConnection();
        setTestResults(testResults);
        
        // Check Google Analytics connection status separately
        const analyticsConnected = checkGoogleAnalyticsConnection();
        
        // Be more strict about connection status - prevent false positives
        if (testResults?.credentials?.hasAllCredentials && 
            testResults?.tokenTest?.success && 
            testResults?.endpointTest?.success && 
            !testResults?.corsTest?.blocked) {
          // Only mark as truly connected if all tests pass
          setConnectionStatus('connected');
          setApiServices(prev => ({
            ...prev,
            googleAds: { connected: true, status: 'connected' },
            googleAnalytics: { connected: analyticsConnected, status: analyticsConnected ? 'connected' : 'not_configured' }
          }));
          
          // If Google Ads is connected, try to fetch client accounts
          fetchMcpClientAccounts();
          
        } else if (testResults?.credentials?.hasAllCredentials && testResults?.tokenTest?.success) {
          // Has credentials and OAuth works, but API is blocked (expected due to CORS)
          setConnectionStatus('partially_connected');
          setApiServices(prev => ({
            ...prev,
            googleAds: { connected: false, status: 'cors_limited' },
            googleAnalytics: { connected: analyticsConnected, status: analyticsConnected ? 'connected' : 'not_configured' }
          }));
          
          // Even with CORS limitations, try to fetch client accounts manually
          fetchMcpClientAccounts();
          
        } else {
          // No valid connection
          setConnectionStatus('disconnected');
          setApiServices(prev => ({
            ...prev,
            googleAds: { connected: false, status: 'disconnected' },
            googleAnalytics: { connected: analyticsConnected, status: analyticsConnected ? 'connected' : 'not_configured' }
          }));
        }
        
        // Show diagnostics if there are any issues
        if (testResults?.errors?.length > 0 || testResults?.warnings?.length > 0) {
          setShowDiagnostics(true);
        }
        
      } catch (error) {
        console.error('Connection test failed:', error);
        setConnectionStatus('error');
        
        // Still check Analytics connection
        const analyticsConnected = checkGoogleAnalyticsConnection();
        
        setApiServices(prev => ({
          ...prev,
          googleAds: { connected: false, status: 'error' },
          googleAnalytics: { connected: analyticsConnected, status: analyticsConnected ? 'connected' : 'not_configured' }
        }));
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialConnection();
  }, []);

  // Check Google Analytics connection status
  const checkGoogleAnalyticsConnection = () => {
    const analyticsId = import.meta.env?.VITE_GOOGLE_ANALYTICS_ID;
    // Analytics is considered connected if we have a tracking ID
    return !!(analyticsId && analyticsId !== 'your-analytics-id-here' && analyticsId !== '103448200');
  };

  // Fetch MCP client accounts to verify connection
  const fetchMcpClientAccounts = async () => {
    try {
      setLoadingClients(true);
      
      const clients = await GoogleAdsService?.getAccessibleCustomers();
      
      // Filter to show real accounts (not demo/mock data)
      const realAccounts = clients?.filter(client => 
        client?.id !== '123456789' && 
        client?.id !== 'ENTER_YOUR_ID' &&
        client?.name !== 'Demo Account - Replace with Real Data'&& !client?.name?.includes('👈 Add Your Google Ads Account')
      );
      
      setMcpClientAccounts(realAccounts || []);
      
      if (realAccounts?.length > 0) {
        console.log(`✅ Found ${realAccounts?.length} real client accounts under MCP`);
      } else {
        console.log('ℹ️ No client accounts found under MCP - add clients manually');
      }
      
    } catch (error) {
      console.error('Failed to fetch MCP client accounts:', error);
      setMcpClientAccounts([]);
    } finally {
      setLoadingClients(false);
    }
  };

  // Enhanced connection test handler with Google feedback display
  const handleTestConnection = async () => {
    setIsLoading(true);
    setShowDiagnostics(true);
    
    try {
      // Clear previous results
      setTestResults(null);
      setConnectionStatus('testing');
      
      const results = await GoogleAdsService?.testConnection();
      setTestResults(results);
      
      // Check Google Analytics status
      const analyticsConnected = checkGoogleAnalyticsConnection();
      
      // Enhanced status determination based on Google's actual feedback
      if (results?.connectionStatus === 'authenticated_cors_limited') {
        // This is the TRUE success state for browser applications
        setConnectionStatus('ready');
        setApiServices(prev => ({
          ...prev,
          googleAds: { connected: true, status: 'ready' },
          googleAnalytics: { connected: analyticsConnected, status: analyticsConnected ? 'connected' : 'not_configured' }
        }));
        
        // Fetch client accounts to verify access
        fetchMcpClientAccounts();
        
      } else if (results?.connectionStatus === 'fully_accessible') {
        // Extremely rare - full API access
        setConnectionStatus('connected');
        setApiServices(prev => ({
          ...prev,
          googleAds: { connected: true, status: 'connected' },
          googleAnalytics: { connected: analyticsConnected, status: analyticsConnected ? 'connected' : 'not_configured' }
        }));
        
        // Fetch client accounts
        fetchMcpClientAccounts();
        
      } else if (results?.connectionStatus === 'credentials_invalid') {
        // Google rejected credentials
        setConnectionStatus('auth_failed');
        setApiServices(prev => ({
          ...prev,
          googleAds: { connected: false, status: 'auth_failed' },
          googleAnalytics: { connected: analyticsConnected, status: analyticsConnected ? 'connected' : 'not_configured' }
        }));
      } else if (results?.connectionStatus === 'no_credentials') {
        // No credentials configured
        setConnectionStatus('no_credentials');
        setApiServices(prev => ({
          ...prev,
          googleAds: { connected: false, status: 'no_credentials' },
          googleAnalytics: { connected: analyticsConnected, status: analyticsConnected ? 'connected' : 'not_configured' }
        }));
      } else {
        // Unknown or error state
        setConnectionStatus('unknown');
        setApiServices(prev => ({
          ...prev,
          googleAds: { connected: false, status: 'unknown' },
          googleAnalytics: { connected: analyticsConnected, status: analyticsConnected ? 'connected' : 'not_configured' }
        }));
      }
      
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus('error');
      
      // Check Analytics status even on error
      const analyticsConnected = checkGoogleAnalyticsConnection();
      
      setTestResults({
        timestamp: new Date()?.toISOString(),
        connectionStatus: 'error',
        errors: [error?.message],
        warnings: [],
        recommendations: ['Check console for detailed error information']
      });
      setApiServices(prev => ({
        ...prev,
        googleAds: { connected: false, status: 'error' },
        googleAnalytics: { connected: analyticsConnected, status: analyticsConnected ? 'connected' : 'not_configured' }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (result) => {
    if (result?.success) {
      // Only mark as connected if we have a truly successful connection
      if (result?.method === 'stored_tokens' && GoogleAdsService?.areTokensValid()) {
        setConnectionStatus('connected');
        setApiServices(prev => ({
          ...prev,
          googleAds: { connected: true, status: 'connected' }
        }));
        
        // Fetch client accounts on successful connection
        fetchMcpClientAccounts();
        
      } else if (result?.method === 'manual_with_refresh_token') {
        // For manual setup, run a real test to verify
        await handleTestConnection();
      } else {
        // OAuth succeeded but need to verify actual API access
        setConnectionStatus('oauth_only');
        setApiServices(prev => ({
          ...prev,
          googleAds: { connected: false, status: 'oauth_only' }
        }));
      }
    }
  };

  const handleDisconnect = () => {
    setConnectionStatus('disconnected');
    setApiServices(prev => ({
      ...prev,
      googleAds: { connected: false, status: 'disconnected' }
    }));
    setTestResults(null);
    setShowDiagnostics(false);
    setMcpClientAccounts([]);
  };

  // Enhanced connection status rendering with Google feedback awareness
  const renderConnectionStatus = () => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'connected': case'ready':
          return 'text-green-600';
        case 'oauth_only': case'partially_connected':
          return 'text-yellow-600';
        case 'testing':
          return 'text-blue-600';
        case 'disconnected': case'no_credentials': case'credentials_missing': case'auth_failed': case'error': case'unknown':
          return 'text-red-600';
        default:
          return 'text-gray-600';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'connected': case'ready':
          return 'CheckCircle';
        case 'oauth_only': case'partially_connected':
          return 'AlertTriangle';
        case 'testing':
          return 'Loader';
        case 'disconnected': case'no_credentials': case'credentials_missing': case'auth_failed': case'error': case'unknown':
          return 'XCircle';
        default:
          return 'Clock';
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'connected':
          return 'Fully Connected & API Accessible';
        case 'ready':
          return 'Google Authenticated - Ready for Clients';
        case 'oauth_only':
          return 'OAuth Working - API Blocked (CORS)';
        case 'partially_connected':
          return 'Credentials Valid - API Limited';
        case 'testing':
          return 'Testing Connection...';
        case 'disconnected':
          return 'Not Connected';
        case 'no_credentials':
          return 'No API Credentials';
        case 'credentials_missing':
          return 'Missing API Credentials';
        case 'auth_failed':
          return 'Google Rejected Authentication';
        case 'error':
          return 'Connection Error';
        case 'unknown':
          return 'Unknown Status';
        default:
          return 'Checking Status...';
      }
    };

    const isAnimated = connectionStatus === 'testing';

    return (
      <div className="flex items-center space-x-2">
        <Icon 
          name={getStatusIcon(connectionStatus)} 
          size={16} 
          className={`${getStatusColor(connectionStatus)} ${isAnimated ? 'animate-spin' : ''}`} 
        />
        <span className={`text-sm font-medium ${getStatusColor(connectionStatus)}`}>
          {getStatusText(connectionStatus)}
        </span>
      </div>
    );
  };

  // Enhanced API service status with better accuracy
  const renderApiServiceStatus = (service, config) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'connected': case'ready':
          return 'text-green-600';
        case 'oauth_only': case'cors_limited':
          return 'text-yellow-600';
        case 'not_configured':
          return 'text-gray-500';
        case 'disconnected': case'no_credentials': case'credentials_missing': case'auth_failed': case'error': case'unknown':
          return 'text-red-600';
        default:
          return 'text-gray-600';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'connected': case'ready':
          return 'CheckCircle';
        case 'oauth_only': case'cors_limited':
          return 'AlertTriangle';
        case 'not_configured':
          return 'Settings';
        case 'disconnected': case'no_credentials': case'credentials_missing': case'auth_failed': case'error': case'unknown':
          return 'XCircle';
        default:
          return 'Clock';
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'connected':
          return 'Fully Connected';
        case 'ready':
          return 'Google Authenticated';
        case 'oauth_only':
          return 'OAuth Only';
        case 'cors_limited':
          return 'CORS Limited';
        case 'not_configured':
          return 'Not Configured';
        case 'no_credentials':
          return 'No Credentials';
        case 'auth_failed':
          return 'Auth Failed';
        default:
          return 'Not Connected';
      }
    };

    return (
      <div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
        <div className="flex items-center space-x-3">
          <Icon name={service === 'googleAds' ? 'Search' : 'BarChart3'} 
                size={20} className="text-primary" />
          <div>
            <h4 className="font-medium text-foreground">
              {service === 'googleAds' ? 'Google Ads API' : 'Google Analytics API'}
            </h4>
            <p className="text-sm text-muted-foreground">
              {service === 'googleAds' ? 'Campaign and keyword data access' : 'Website traffic and user analytics'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name={getStatusIcon(config?.status)} size={16} className={getStatusColor(config?.status)} />
          <span className={`text-sm font-medium ${getStatusColor(config?.status)}`}>
            {getStatusText(config?.status)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>API Integration Center - PPC Assistant</title>
        <meta name="description" content="Configure and test connections to Google Ads, Google Analytics, and other API services for your PPC management needs." />
      </Helmet>
      <div className="min-h-screen bg-background pt-16">
        {/* Header Section */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground flex items-center space-x-3">
                    <Icon name="Plug" size={28} className="text-primary" />
                    <span>API Integration Center</span>
                  </h1>
                  {renderConnectionStatus()}
                </div>
                <p className="text-muted-foreground">
                  Connect and configure Google APIs for advertising, analytics, and revenue tracking
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="TestTube"
                  iconPosition="left"
                  iconSize={16}
                  onClick={handleTestConnection}
                  loading={isLoading}
                >
                  Test Connection
                </Button>
                <Button
                  variant="outline" 
                  size="sm"
                  iconName="Activity"
                  iconPosition="left"
                  iconSize={16}
                  onClick={() => setShowDiagnostics(!showDiagnostics)}
                >
                  {showDiagnostics ? 'Hide' : 'Show'} Diagnostics
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Users"
                  iconPosition="left"
                  iconSize={16}
                  onClick={fetchMcpClientAccounts}
                  loading={loadingClients}
                >
                  Fetch MCP Clients
                </Button>
              </div>
            </div>

            {/* API Services Status Overview */}
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold text-foreground">API Services Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(apiServices)?.map(([service, config]) => (
                  <div key={service}>
                    {renderApiServiceStatus(service, config)}
                  </div>
                ))}
              </div>
            </div>

            {/* MCP Client Accounts Verification */}
            {(mcpClientAccounts?.length > 0 || loadingClients) && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                    <Icon name="Users" size={20} className="text-primary" />
                    <span>MCP Client Accounts (942-196-4548)</span>
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {loadingClients ? 'Loading...' : `${mcpClientAccounts?.length} accounts accessible`}
                  </span>
                </div>
                
                {loadingClients ? (
                  <div className="flex items-center justify-center py-8">
                    <Icon name="Loader" size={24} className="animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Fetching client accounts...</span>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <div className="grid grid-cols-5 gap-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                        <div>Customer ID</div>
                        <div>Account Name</div>
                        <div>Industry</div>
                        <div>Monthly Spend</div>
                        <div>Status</div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                      {mcpClientAccounts?.length > 0 ? (
                        mcpClientAccounts?.map((account, index) => (
                          <div key={index} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                            <div className="grid grid-cols-5 gap-4 items-center">
                              <div className="text-sm font-mono text-gray-900">{account?.id}</div>
                              <div className="text-sm text-gray-900">{account?.name}</div>
                              <div className="text-sm text-gray-600">{account?.industry}</div>
                              <div className="text-sm text-gray-900">
                                ${account?.monthlySpend?.toLocaleString() || '0'}
                              </div>
                              <div className="flex items-center space-x-1">
                                <div className={`w-2 h-2 rounded-full ${
                                  account?.status === 'active' ? 'bg-green-400' : 
                                  account?.status === 'paused' ? 'bg-yellow-400' : 'bg-red-400'
                                }`} />
                                <span className="text-xs capitalize text-gray-600">
                                  {account?.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center">
                          <Icon name="Users" size={24} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-1">No client accounts found</p>
                          <p className="text-xs text-gray-500">
                            Add clients manually using "Add Client" button in Client Portfolio Management
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Diagnostics Panel */}
            {showDiagnostics && testResults && (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center space-x-2">
                  <Icon name="Activity" size={20} className="text-primary" />
                  <span>Connection Diagnostics</span>
                  <span className="text-xs text-muted-foreground">
                    ({testResults?.timestamp})
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {/* Credentials Status */}
                  <div className="bg-white p-3 rounded border">
                    <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                      <Icon name="Key" size={16} className="text-blue-600" />
                      <span>Credentials</span>
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>All Required:</span>
                        <span className={testResults?.credentials?.hasAllCredentials ? 'text-green-600' : 'text-red-600'}>
                          {testResults?.credentials?.hasAllCredentials ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Client ID:</span>
                        <span className={testResults?.credentials?.clientId ? 'text-green-600' : 'text-red-600'}>
                          {testResults?.credentials?.clientId ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Developer Token:</span>
                        <span className={testResults?.credentials?.developerToken ? 'text-green-600' : 'text-red-600'}>
                          {testResults?.credentials?.developerToken ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* OAuth Status */}
                  {testResults?.tokenTest && (
                    <div className="bg-white p-3 rounded border">
                      <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                        <Icon name="Shield" size={16} className="text-green-600" />
                        <span>OAuth2</span>
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Token Valid:</span>
                          <span className={testResults?.tokenTest?.success ? 'text-green-600' : 'text-red-600'}>
                            {testResults?.tokenTest?.success ? '✓' : '✗'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expires:</span>
                          <span className="text-muted-foreground">{testResults?.tokenTest?.expiresIn}s</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* API Endpoint Status */}
                  {testResults?.endpointTest && (
                    <div className="bg-white p-3 rounded border">
                      <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                        <Icon name="Globe" size={16} className="text-yellow-600" />
                        <span>API Access</span>
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Endpoint:</span>
                          <span className={testResults?.endpointTest?.success ? 'text-green-600' : 'text-red-600'}>
                            {testResults?.endpointTest?.success ? 'Accessible' : 'Blocked'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>CORS:</span>
                          <span className={testResults?.corsTest?.blocked ? 'text-yellow-600' : 'text-green-600'}>
                            {testResults?.corsTest?.blocked ? 'Blocked' : 'Allowed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Google Feedback Panel */}
                {showDiagnostics && testResults?.googleFeedback && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center space-x-2">
                      <Icon name="MessageSquare" size={20} className="text-green-600" />
                      <span>Google API Response</span>
                      <span className="text-xs text-muted-foreground">
                        (Real-time feedback from Google)
                      </span>
                    </h3>

                    {/* Google Feedback Summary */}
                    {testResults?.googleFeedback?.summary && (
                      <div className="mb-4 p-3 bg-white rounded border">
                        <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                          <Icon name="Info" size={16} className="text-blue-600" />
                          <span>Google's Response Summary</span>
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Status: </span>
                            <span className={testResults?.googleFeedback?.summary?.overallStatus === 'google_authenticated' ? 'text-green-600' : 'text-red-600'}>
                              {testResults?.googleFeedback?.summary?.googleResponse}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Next Steps: </span>
                            <span className="text-muted-foreground">
                              {testResults?.googleFeedback?.summary?.userGuidance}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* OAuth Feedback */}
                    {testResults?.googleFeedback?.oauth && (
                      <div className="mb-3 p-3 bg-white rounded border">
                        <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                          <Icon name="Shield" size={16} className="text-blue-600" />
                          <span>OAuth2 Authentication</span>
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Google Response:</span>
                            <span className={testResults?.googleFeedback?.oauth?.success ? 'text-green-600' : 'text-red-600'}>
                              {testResults?.googleFeedback?.oauth?.response}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Timestamp:</span>
                            <span className="text-muted-foreground text-xs">
                              {new Date(testResults?.googleFeedback?.oauth?.timestamp)?.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CORS Feedback */}
                    {testResults?.googleFeedback?.cors && (
                      <div className="mb-3 p-3 bg-white rounded border">
                        <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                          <Icon name="Shield" size={16} className="text-yellow-600" />
                          <span>Browser Security</span>
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>CORS Status:</span>
                            <span className={testResults?.googleFeedback?.cors?.blocked ? 'text-yellow-600' : 'text-green-600'}>
                              {testResults?.googleFeedback?.cors?.response}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {testResults?.googleFeedback?.cors?.blocked ? 
                              '✅ This is expected and secure browser behavior' : '⚠️ Unusual - direct API access detected'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Errors */}
                {testResults?.errors?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-red-600 mb-2 flex items-center space-x-2">
                      <Icon name="AlertCircle" size={16} />
                      <span>Errors</span>
                    </h4>
                    <ul className="bg-red-50 border border-red-200 rounded p-3 space-y-1 text-sm">
                      {testResults?.errors?.map((error, index) => (
                        <li key={index} className="text-red-700">• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {testResults?.warnings?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-yellow-600 mb-2 flex items-center space-x-2">
                      <Icon name="AlertTriangle" size={16} />
                      <span>Warnings</span>
                    </h4>
                    <ul className="bg-yellow-50 border border-yellow-200 rounded p-3 space-y-1 text-sm">
                      {testResults?.warnings?.map((warning, index) => (
                        <li key={index} className="text-yellow-700">• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {testResults?.recommendations?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-blue-600 mb-2 flex items-center space-x-2">
                      <Icon name="Lightbulb" size={16} />
                      <span>Recommendations</span>
                    </h4>
                    <ul className="bg-blue-50 border border-blue-200 rounded p-3 space-y-1 text-sm">
                      {testResults?.recommendations?.map((rec, index) => (
                        <li key={index} className="text-blue-700">• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Server-Side API Integration Panel */}
          <div className="mb-8">
            <ServerApiPanel />
          </div>

          {/* Google Ads Connection Panel */}
          <div className="mb-8">
            <AdWordsConnectionPanel
              onConnect={handleConnect}
              status={connectionStatus}
              isLoading={isLoading}
            />
          </div>

          {/* Additional API Services Setup */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
            {/* Google Analytics Setup */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
                <Icon name="BarChart3" size={20} className="text-primary" />
                <span>Google Analytics Integration</span>
                <div className="flex items-center space-x-2 ml-auto">
                  <Icon name={apiServices?.googleAnalytics?.connected ? 'CheckCircle' : 'XCircle'} 
                        size={16} 
                        className={apiServices?.googleAnalytics?.connected ? 'text-green-600' : 'text-red-600'} />
                  <span className={`text-sm font-medium ${apiServices?.googleAnalytics?.connected ? 'text-green-600' : 'text-red-600'}`}>
                    {apiServices?.googleAnalytics?.connected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
              </h3>
              <p className="text-muted-foreground mb-4">
                Connect Google Analytics to track website performance and user behavior metrics.
              </p>
              
              <div className="space-y-4">
                <Input
                  label="Google Analytics Tracking ID"
                  placeholder="GA4-XXXXXXXXX or UA-XXXXXXXXX"
                  value={import.meta.env?.VITE_GOOGLE_ANALYTICS_ID || ''}
                  disabled
                />
                <Input
                  label="Google Analytics API Key"
                  placeholder="Enter your Analytics API Key"
                  type="password"
                  disabled
                />
                <Button variant="outline" className="w-full" disabled>
                  <Icon name="ExternalLink" size={16} className="mr-2" />
                  Setup Analytics (Coming Soon)
                </Button>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-sm">
                  <Icon name="Info" size={14} className="inline mr-1" />
                  {apiServices?.googleAnalytics?.connected 
                    ? 'Google Analytics tracking is configured and active.' :'Google Analytics integration will be available in a future update.'}
                </p>
              </div>
            </div>
          </div>

          {/* Implementation Guide */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center space-x-2">
              <Icon name="BookOpen" size={24} className="text-primary" />
              <span>API Setup Guide</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Google Ads API Setup</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Create a Google Cloud Project and enable the Google Ads API</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Generate OAuth2 credentials (Client ID and Secret)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Apply for and receive a Developer Token from Google Ads</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Complete OAuth2 flow to get refresh token</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Note your Google Ads Customer ID (Manager Account: 942-196-4548)</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-3">Production Deployment</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <Icon name="AlertTriangle" size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>Browser CORS restrictions require backend server implementation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="Server" size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Set up Node.js/Express server with Google Ads API client</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="Shield" size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Implement secure credential storage and token refresh</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="Globe" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Create API proxy endpoints for frontend consumption</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2 flex items-center space-x-2">
                <Icon name="MessageSquare" size={16} />
                <span>Google API Connection Feedback</span>
              </h4>
              <p className="text-amber-700 text-sm mb-2">
                <strong>Yes, Google provides real-time connection feedback:</strong>
              </p>
              <ul className="text-amber-700 text-sm space-y-1 ml-4">
                <li>• <strong>OAuth2 Response:</strong> Google returns success/error codes when authenticating</li>
                <li>• <strong>Token Validation:</strong> Google confirms if your credentials are valid</li>
                <li>• <strong>API Endpoint Response:</strong> Google tells you if API calls succeed or fail</li>
                <li>• <strong>Error Details:</strong> Specific error messages help diagnose connection issues</li>
              </ul>
              <p className="text-amber-700 text-sm mt-2">
                This integration center shows you Google's actual responses with no false positives. 
                "Ready" status means Google confirmed your credentials work correctly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GoogleAdWordsIntegration;