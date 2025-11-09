import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';


import GoogleAdsService from '../../utils/googleAdsService';



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
  const [activeTab, setActiveTab] = useState('overview');
  const [integrationData, setIntegrationData] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard', description: 'View integration overview' },
    { id: 'keywords', label: 'Keywords', icon: 'Hash', description: 'Manage keywords' },
    { id: 'audience', label: 'Audience', icon: 'Users', description: 'Manage audience' },
    { id: 'budget', label: 'Budget', icon: 'DollarSign', description: 'Manage budget' },
    { id: 'creative', label: 'Creative', icon: 'Image', description: 'Manage creative assets' },
    { id: 'server', label: 'Server', icon: 'Server', description: 'Server configuration' }
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'connected':
      case 'ready':
        return { icon: 'CheckCircle', color: 'text-green-600' };
      case 'oauth_only':
      case 'partially_connected':
        return { icon: 'AlertTriangle', color: 'text-yellow-600' };
      case 'testing':
        return { icon: 'Loader', color: 'text-blue-600' };
      case 'disconnected':
      case 'no_credentials':
      case 'credentials_missing':
      case 'auth_failed':
      case 'error':
      case 'unknown':
        return { icon: 'XCircle', color: 'text-red-600' };
      default:
        return { icon: 'Clock', color: 'text-gray-600' };
    }
  };

  const statusStyle = getStatusStyle(connectionStatus);

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

  const renderOverviewTab = () => {
    return (
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Connection Status</h3>
          {renderConnectionStatus()}
          <div className="mt-6 space-y-4">
            {renderApiServiceStatus('googleAds', apiServices.googleAds)}
            {renderApiServiceStatus('googleAnalytics', apiServices.googleAnalytics)}
          </div>
          <div className="mt-6 flex space-x-3">
            <Button onClick={handleTestConnection} disabled={isLoading}>
              Test Connection
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderKeywordsTab = () => {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground">Keywords Management</h3>
        <p className="text-muted-foreground mt-2">Manage your keywords here.</p>
      </div>
    );
  };

  const renderAudienceTab = () => {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground">Audience Management</h3>
        <p className="text-muted-foreground mt-2">Manage your audience here.</p>
      </div>
    );
  };

  const renderBudgetTab = () => {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground">Budget Management</h3>
        <p className="text-muted-foreground mt-2">Manage your budget here.</p>
      </div>
    );
  };

  const renderCreativeTab = () => {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground">Creative Assets</h3>
        <p className="text-muted-foreground mt-2">Manage your creative assets here.</p>
      </div>
    );
  };

  const renderServerTab = () => {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground">Server Configuration</h3>
        <p className="text-muted-foreground mt-2">Configure your server settings here.</p>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>API Integration Center - PPC Assistant</title>
        <meta name="description" content="Configure and test connections to Google Ads, Google Analytics, and other API services for your PPC management needs." />
      </Helmet>
      <main className={`pt-16 w-full`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3">
                <Icon name="ExternalLink" size={24} className="text-primary" />
                <h1 className="text-2xl font-semibold text-foreground">
                  Google AdWords Integration
                </h1>
                <div className="flex items-center space-x-2">
                  <Icon name={statusStyle?.icon} size={16} className={statusStyle?.color} />
                  <span className={`text-sm font-medium ${statusStyle?.color}`}>
                    {connectionStatus?.charAt(0)?.toUpperCase() + connectionStatus?.slice(1)}
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground mt-1">
                Connect your Google AdWords account for advanced campaign management and insights
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Integration Status */}
              {integrationData && (
                <div className="text-sm text-muted-foreground">
                  Last sync: {integrationData?.lastSync?.toLocaleTimeString()}
                </div>
              )}

              {/* Quick Actions */}
              <Button
                variant="outline"
                iconName="RefreshCw"
                iconPosition="left"
                iconSize={16}
                disabled={connectionStatus !== 'connected'}
              >
                Sync Data
              </Button>
              <Button
                variant="default"
                iconName="Settings"
                iconPosition="left"
                iconSize={16}
              >
                Configure
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title={tab?.description}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>

          {/* Connection Warning */}
          {connectionStatus !== 'connected' && activeTab !== 'overview' && (
            <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <span className="text-sm font-medium text-warning">
                  AdWords Connection Required
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Please connect your Google AdWords account in the Overview tab to access this feature.
              </p>
            </div>
          )}

          {/* Tab Content */}
          <div className="min-h-0 flex-1">
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'keywords' && renderKeywordsTab()}
            {activeTab === 'audience' && renderAudienceTab()}
            {activeTab === 'budget' && renderBudgetTab()}
            {activeTab === 'creative' && renderCreativeTab()}
            {activeTab === 'server' && renderServerTab()}
          </div>
        </div>
      </main>
    </>
  );
};

export default GoogleAdWordsIntegration;