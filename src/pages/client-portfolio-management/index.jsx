import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import ClientListPanel from './components/ClientListPanel';
import ClientDetailPanel from './components/ClientDetailPanel';
import BulkActionsModal from './components/BulkActionsModal';
import googleAdsService from '../../utils/googleAdsService';
import aiService from '../../utils/aiService';



const ClientPortfolioManagement = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [bulkActionModal, setBulkActionModal] = useState({ isOpen: false, type: null, clients: [] });
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('unknown');
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Fetch real client data on component mount
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        
        // Test connection status first
        const testResult = await googleAdsService?.testConnection();
        setConnectionStatus(testResult?.connectionStatus);
        
        // If there are connection issues, use AI to analyze them
        if (testResult?.connectionStatus !== 'fully_working' && testResult?.errors?.length > 0) {
          try {
            setLoadingAI(true);
            const troubleshooting = await aiService?.analyzeConnectionIssue(testResult);
            console.log('🤖 AI Troubleshooting:', troubleshooting);
          } catch (aiError) {
            console.warn('AI analysis failed:', aiError);
          } finally {
            setLoadingAI(false);
          }
        }
        
        // Attempt to fetch real client data
        const clientData = await googleAdsService?.getAccessibleCustomers();
        setClients(clientData || []);
        
        // Auto-select first client if available
        if (clientData?.length > 0 && !selectedClient) {
          setSelectedClient(clientData?.[0]);
        }
        
      } catch (error) {
        console.error('Failed to fetch client data:', error);
        // Fallback to mock data
        const mockData = googleAdsService?.getMockClientData();
        setClients(mockData);
        if (mockData?.length > 0) {
          setSelectedClient(mockData?.[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, []);

  // Set initial selected client when clients are loaded
  useEffect(() => {
    if (clients?.length > 0 && !selectedClient) {
      setSelectedClient(clients?.[0]);
    }
  }, [clients, selectedClient]);

  // Generate AI insights when client changes
  useEffect(() => {
    const generateClientInsights = async () => {
      if (selectedClient && !selectedClient?.id?.includes('demo') && !selectedClient?.id?.includes('ENTER_YOUR_ID')) {
        try {
          setLoadingAI(true);
          const insights = await aiService?.analyzeClientPerformance(selectedClient);
          setAiInsights(insights);
        } catch (error) {
          console.warn('Failed to generate AI insights:', error);
          setAiInsights(null);
        } finally {
          setLoadingAI(false);
        }
      } else {
        setAiInsights(null);
      }
    };

    // Debounce AI analysis to avoid too many API calls
    const timeoutId = setTimeout(generateClientInsights, 1000);
    return () => clearTimeout(timeoutId);
  }, [selectedClient]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e?.ctrlKey && e?.key === 'n') {
        e?.preventDefault();
        console.log('New client shortcut triggered');
      } else if (e?.altKey && e?.key === 'r') {
        e?.preventDefault();
        console.log('Reports shortcut triggered');
      } else if (e?.shiftKey && e?.key === 'C') {
        e?.preventDefault();
        console.log('Communication log shortcut triggered');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClientSelect = (client) => {
    setSelectedClient(client);
  };

  const handleBulkAction = (actionType, clientIds) => {
    setBulkActionModal({
      isOpen: true,
      type: actionType,
      clients: clientIds
    });
  };

  const closeBulkActionModal = () => {
    setBulkActionModal({ isOpen: false, type: null, clients: [] });
  };

  const handleRefreshData = async () => {
    try {
      setLoading(true);
      const clientData = await googleAdsService?.getAccessibleCustomers();
      setClients(clientData || []);
      
      // Update selected client if it still exists
      if (selectedClient && clientData) {
        const updatedClient = clientData?.find(c => c?.id === selectedClient?.id);
        if (updatedClient) {
          setSelectedClient(updatedClient);
        } else if (clientData?.length > 0) {
          setSelectedClient(clientData?.[0]);
        }
      }

      // Generate portfolio insights with AI
      if (clientData?.length > 0) {
        try {
          setLoadingAI(true);
          const portfolioInsights = await aiService?.analyzeClientPortfolio(clientData);
          console.log('🤖 Portfolio AI Insights:', portfolioInsights);
        } catch (error) {
          console.warn('Portfolio AI analysis failed:', error);
        } finally {
          setLoadingAI(false);
        }
      }

    } catch (error) {
      console.error('Failed to refresh client data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onClientChange={handleClientSelect}
        selectedClient={selectedClient}
      />
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'pl-16' : 'pl-64'}`}>
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Client List Panel - Left Side */}
          <div className="w-[30%] min-w-[400px] border-r border-border">
            <ClientListPanel
              clients={clients}
              selectedClient={selectedClient}
              onClientSelect={handleClientSelect}
              onBulkAction={handleBulkAction}
              loading={loading}
              onRefresh={handleRefreshData}
            />
          </div>

          {/* Client Detail Panel - Right Side */}
          <div className="flex-1">
            <ClientDetailPanel
              client={selectedClient}
              loading={loading}
              aiInsights={aiInsights}
              loadingAI={loadingAI}
              onUpdateClient={(updatedClient) => {
                // Handle client updates
                console.log('Client updated:', updatedClient);
                
                // Update the client in the list
                setClients(prevClients => 
                  prevClients?.map(c => 
                    c?.id === updatedClient?.id ? updatedClient : c
                  )
                );
                
                // Update selected client
                setSelectedClient(updatedClient);
                
                // If it's a manual client, update localStorage
                if (!updatedClient?.id?.includes('demo') && updatedClient?.enhanced) {
                  googleAdsService?.updateManualClient(updatedClient?.id, updatedClient);
                }
              }}
            />
          </div>
        </div>
      </main>
      
      {/* Bulk Actions Modal */}
      <BulkActionsModal
        isOpen={bulkActionModal?.isOpen}
        onClose={closeBulkActionModal}
        selectedClients={bulkActionModal?.clients}
        clients={clients}
        actionType={bulkActionModal?.type}
      />
    </div>
  );
};

export default ClientPortfolioManagement;