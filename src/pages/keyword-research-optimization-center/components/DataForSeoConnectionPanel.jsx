import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import dataForSeoService from '../../../utils/dataForSeoService';

const DataForSeoConnectionPanel = ({ onConnectionChange }) => {
  const [connectionStatus, setConnectionStatus] = useState('unknown');
  const [isConnecting, setIsConnecting] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showCredentials, setShowCredentials] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState(null);
  const [testResults, setTestResults] = useState(null);

  useEffect(() => {
    // Test connection on component mount
    testConnection();
  }, []);

  // Test DataForSEO API connection
  const testConnection = async () => {
    setIsConnecting(true);
    
    try {
      const result = await dataForSeoService?.testConnection();
      setConnectionStatus(result?.success ? 'connected' : 'disconnected');
      setConnectionDetails(result);
      setTestResults(result);
      
      // Notify parent component
      if (onConnectionChange) {
        onConnectionChange(result);
      }
      
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus('error');
      setConnectionDetails({ success: false, error: error?.message });
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle credential input changes
  const handleCredentialChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save credentials to environment (in a real app, this would be handled differently)
  const saveCredentials = () => {
    // In a production app, credentials would be saved securely
    // For now, we'll show instructions for adding to .env
    alert(`Add these credentials to your .env file:\n\nVITE_DATAFORSEO_USERNAME=${credentials?.username}\nVITE_DATAFORSEO_PASSWORD=${credentials?.password}\n\nThen restart your application.`);
  };

  // Get status indicator
  const getStatusIndicator = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: 'CheckCircle',
          text: 'Connected',
          color: 'text-success',
          bgColor: 'bg-success/10'
        };
      case 'disconnected':
        return {
          icon: 'AlertTriangle',
          text: 'Not Connected',
          color: 'text-warning',
          bgColor: 'bg-warning/10'
        };
      case 'error':
        return {
          icon: 'XCircle',
          text: 'Connection Error',
          color: 'text-destructive',
          bgColor: 'bg-destructive/10'
        };
      default:
        return {
          icon: 'Loader',
          text: 'Checking...',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/50'
        };
    }
  };

  const statusInfo = getStatusIndicator();

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${statusInfo?.bgColor}`}>
            <Icon name={statusInfo?.icon} size={20} className={statusInfo?.color} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              DataForSEO API Connection
            </h3>
            <p className={`text-sm ${statusInfo?.color}`}>
              {statusInfo?.text}
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={testConnection}
          loading={isConnecting}
          iconName="RefreshCw"
          iconSize={16}
        >
          Test Connection
        </Button>
      </div>
      {/* Connection Details */}
      {testResults && (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Info" size={16} className="text-muted-foreground" />
            <span className="font-medium text-sm">Connection Test Results</span>
          </div>
          
          {testResults?.success ? (
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-success">
                <Icon name="CheckCircle" size={14} className="mr-2" />
                <span>Successfully connected to DataForSEO API</span>
              </div>
              <div className="text-muted-foreground ml-6">
                • Keyword research data available
              </div>
              <div className="text-muted-foreground ml-6">
                • SERP analysis enabled
              </div>
              <div className="text-muted-foreground ml-6">
                • Competition analysis ready
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-destructive">
                <Icon name="XCircle" size={14} className="mr-2" />
                <span>{testResults?.message || 'Connection failed'}</span>
              </div>
              {testResults?.needsSetup && (
                <div className="text-muted-foreground ml-6">
                  Configure your DataForSEO credentials below
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {/* Credentials Configuration */}
      {connectionStatus !== 'connected' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">API Credentials</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCredentials(!showCredentials)}
              iconName={showCredentials ? "EyeOff" : "Eye"}
              iconSize={14}
            >
              {showCredentials ? 'Hide' : 'Show'} Setup
            </Button>
          </div>

          {showCredentials && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/30">
              <div className="text-sm text-muted-foreground mb-3">
                <p className="font-medium mb-2">Setup Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Sign up for a DataForSEO account at <a href="https://dataforseo.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">dataforseo.com</a></li>
                  <li>Get your API credentials from the dashboard</li>
                  <li>Add them to your <code className="bg-muted px-1 rounded">.env</code> file</li>
                  <li>Restart your application</li>
                </ol>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Username"
                  type="text"
                  placeholder="Your DataForSEO username"
                  value={credentials?.username}
                  onChange={(e) => handleCredentialChange('username', e?.target?.value)}
                />
                
                <Input
                  label="Password"
                  type="password"
                  placeholder="Your DataForSEO password"
                  value={credentials?.password}
                  onChange={(e) => handleCredentialChange('password', e?.target?.value)}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <div className="text-xs font-mono text-blue-800">
                  <div className="font-medium mb-1">Add to .env file:</div>
                  <div>VITE_DATAFORSEO_USERNAME={credentials?.username || 'your-username'}</div>
                  <div>VITE_DATAFORSEO_PASSWORD={credentials?.password || 'your-password'}</div>
                  <div>VITE_DATAFORSEO_API_URL=https://api.dataforseo.com/v3</div>
                </div>
              </div>

              <Button
                variant="default"
                onClick={saveCredentials}
                iconName="Save"
                iconPosition="left"
                iconSize={14}
                disabled={!credentials?.username || !credentials?.password}
              >
                Show Setup Instructions
              </Button>
            </div>
          )}
        </div>
      )}
      {/* Features Available */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="font-medium text-foreground mb-3">Available Features</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className={`flex items-center space-x-2 ${connectionStatus === 'connected' ? 'text-foreground' : 'text-muted-foreground'}`}>
            <Icon name={connectionStatus === 'connected' ? 'CheckCircle' : 'Circle'} size={14} />
            <span>Keyword Research</span>
          </div>
          <div className={`flex items-center space-x-2 ${connectionStatus === 'connected' ? 'text-foreground' : 'text-muted-foreground'}`}>
            <Icon name={connectionStatus === 'connected' ? 'CheckCircle' : 'Circle'} size={14} />
            <span>Search Volume Data</span>
          </div>
          <div className={`flex items-center space-x-2 ${connectionStatus === 'connected' ? 'text-foreground' : 'text-muted-foreground'}`}>
            <Icon name={connectionStatus === 'connected' ? 'CheckCircle' : 'Circle'} size={14} />
            <span>Competition Analysis</span>
          </div>
          <div className={`flex items-center space-x-2 ${connectionStatus === 'connected' ? 'text-foreground' : 'text-muted-foreground'}`}>
            <Icon name={connectionStatus === 'connected' ? 'CheckCircle' : 'Circle'} size={14} />
            <span>SERP Analysis</span>
          </div>
          <div className={`flex items-center space-x-2 ${connectionStatus === 'connected' ? 'text-foreground' : 'text-muted-foreground'}`}>
            <Icon name={connectionStatus === 'connected' ? 'CheckCircle' : 'Circle'} size={14} />
            <span>Keyword Suggestions</span>
          </div>
          <div className={`flex items-center space-x-2 ${connectionStatus === 'connected' ? 'text-foreground' : 'text-muted-foreground'}`}>
            <Icon name={connectionStatus === 'connected' ? 'CheckCircle' : 'Circle'} size={14} />
            <span>Competitor Insights</span>
          </div>
        </div>
      </div>
      {/* Status Message */}
      <div className="mt-4 p-3 bg-muted/30 rounded text-sm text-muted-foreground text-center">
        {connectionStatus === 'connected' ? (
          '✅ DataForSEO API is connected and ready to provide real keyword data'
        ) : (
          '⚠️ Using demo data until DataForSEO API is configured'
        )}
      </div>
    </div>
  );
};

export default DataForSeoConnectionPanel;