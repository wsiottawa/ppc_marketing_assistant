// Google Ads API Client for Frontend
// This client communicates with our server-side proxy to avoid CORS issues

class GoogleAdsApiClient {
  constructor() {
    // Get base URL from environment or default to localhost
    this.baseURL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001/api';
    this.timeout = 30000; // 30 seconds
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
  }

  /**
   * Sleep function for retry delays
   */
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Make a request to the server-side proxy with retry logic
   */
  async makeRequest(endpoint, options = {}, retryCount = 0) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      
      const config = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        credentials: 'include',
        ...options
      };

      console.log(`📤 API Request (Attempt ${retryCount + 1}): ${config?.method} ${url}`);
      
      // Check if server is reachable first
      if (retryCount === 0) {
        await this.checkServerHealth();
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller?.abort(), this.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller?.signal
      });
      
      clearTimeout(timeoutId);
      
      const responseText = await response?.text();
      let data;
      
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.warn('📄 Non-JSON response received:', responseText?.substring(0, 200));
        data = { rawResponse: responseText };
      }
      
      console.log(`📥 API Response: ${response?.status} ${response?.statusText}`);
      
      if (!response?.ok) {
        const error = new ApiError(
          data?.error || `Request failed with status ${response.status}`,
          response.status,
          data
        );
        
        // Retry on server errors (5xx) or network issues
        if (response?.status >= 500 && retryCount < this.maxRetries) {
          console.warn(`🔄 Retrying request (${retryCount + 1}/${this.maxRetries})...`);
          await this.sleep(this.retryDelay * (retryCount + 1));
          return this.makeRequest(endpoint, options, retryCount + 1);
        }
        
        throw error;
      }
      
      return {
        data,
        status: response?.status,
        headers: Object.fromEntries(response?.headers?.entries())
      };
      
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw new ApiError('Request timeout - server may be down', 408, { 
          timeout: this.timeout,
          suggestion: 'Check if the server is running on port 3001' 
        });
      }
      
      // Handle network errors specifically
      if (error?.message?.includes('fetch') || error?.code === 'ECONNREFUSED') {
        throw new ApiError(
          'Server connection failed - server is not running',
          0,
          { 
            originalError: error?.message,
            suggestion: 'Start the server with: cd server && npm start',
            serverURL: this.baseURL
          }
        );
      }
      
      console.error('❌ API Request failed:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Retry on network errors
      if (retryCount < this.maxRetries) {
        console.warn(`🔄 Retrying request due to network error (${retryCount + 1}/${this.maxRetries})...`);
        await this.sleep(this.retryDelay * (retryCount + 1));
        return this.makeRequest(endpoint, options, retryCount + 1);
      }
      
      // Final network error
      throw new ApiError(
        'Network error - unable to reach server',
        0,
        { 
          originalError: error?.message,
          suggestion: 'Check server status and network connection',
          serverURL: this.baseURL
        }
      );
    }
  }

  /**
   * Check if server is running and healthy
   */
  async checkServerHealth() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000) // 5 second timeout for health check
      });
      
      if (!response?.ok) {
        throw new Error(`Server unhealthy: ${response?.status}`);
      }
      
      return true;
    } catch (error) {
      throw new ApiError(
        'Server health check failed',
        0,
        {
          originalError: error?.message,
          suggestion: 'Ensure the server is running: cd server && npm start',
          serverURL: this.baseURL
        }
      );
    }
  }

  /**
   * Test server connection and authentication
   */
  async testConnection() {
    try {
      console.log('🧪 Testing server connection...');
      
      // First check if server is running
      await this.checkServerHealth();
      
      const response = await this.makeRequest('/ads/test-auth');
      
      return {
        connected: true,
        authenticated: response?.data?.authenticated || false,
        message: response?.data?.message || 'Connection test successful',
        timestamp: response?.data?.timestamp,
        serverURL: this.baseURL
      };
      
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      
      return {
        connected: false,
        authenticated: false,
        error: error?.message,
        details: error?.details,
        suggestion: error?.details?.suggestion,
        timestamp: new Date()?.toISOString(),
        serverURL: this.baseURL
      };
    }
  }

  /**
   * Execute GAQL (Google Ads Query Language) query
   */
  async search(gaql, customerId = null, options = {}) {
    try {
      if (!gaql) {
        throw new ApiError('GAQL query is required', 400);
      }
      
      console.log(`🔍 Executing GAQL query${customerId ? ` for customer ${customerId}` : ''}:`);
      console.log(gaql);
      
      const requestBody = {
        gaql,
        ...( customerId && { customerId }),
        pageSize: options?.pageSize || 1000,
        ...options
      };
      
      const response = await this.makeRequest('/ads/search', {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });
      
      console.log(`✅ GAQL query executed successfully`);
      
      return response?.data;
      
    } catch (error) {
      console.error('❌ GAQL search failed:', error);
      throw error;
    }
  }

  /**
   * Get accessible customers under MCP
   */
  async getAccessibleCustomers() {
    try {
      console.log('👥 Fetching accessible customers...');
      
      const response = await this.makeRequest('/ads/customers');
      
      console.log(`✅ Found ${response?.data?.resourceNames?.length || 0} accessible customers`);
      
      return response?.data;
      
    } catch (error) {
      console.error('❌ Failed to fetch customers:', error);
      throw error;
    }
  }

  /**
   * Get client accounts under MCP using GAQL
   */
  async getClientAccounts(mcpCustomerId = null) {
    const gaql = `
      SELECT
        customer_client.client_customer,
        customer_client.descriptive_name,
        customer_client.level,
        customer_client.currency_code,
        customer_client.time_zone,
        customer_client.status,
        customer_client.hidden
      FROM customer_client
      WHERE customer_client.hidden = FALSE
      ORDER BY customer_client.descriptive_name
    `;
    
    return this.search(gaql, mcpCustomerId);
  }

  /**
   * Get campaign performance data
   */
  async getCampaignPerformance(customerId, dateRange = 'LAST_30_DAYS', options = {}) {
    const gaql = `
      SELECT 
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.advertising_channel_type,
        metrics.impressions,
        metrics.clicks,
        metrics.ctr,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value,
        metrics.average_cpc,
        segments.date
      FROM campaign 
      WHERE segments.date DURING ${dateRange}
      AND campaign.status IN ('ENABLED', 'PAUSED')
      ORDER BY metrics.cost_micros DESC
      LIMIT ${options?.limit || 100}
    `;
    
    return this.search(gaql, customerId, options);
  }

  /**
   * Get keyword performance data
   */
  async getKeywordPerformance(customerId, campaignId = null, dateRange = 'LAST_30_DAYS', options = {}) {
    const gaql = `
      SELECT 
        campaign.id,
        campaign.name,
        ad_group.id,
        ad_group.name,
        ad_group_criterion.keyword.text,
        ad_group_criterion.keyword.match_type,
        metrics.impressions,
        metrics.clicks,
        metrics.ctr,
        metrics.cost_micros,
        metrics.conversions,
        metrics.average_cpc,
        segments.date
      FROM keyword_view
      WHERE segments.date DURING ${dateRange}
      ${campaignId ? `AND campaign.id = ${campaignId}` : ''}
      AND ad_group_criterion.status = 'ENABLED'
      ORDER BY metrics.impressions DESC
      LIMIT ${options?.limit || 500}
    `;
    
    return this.search(gaql, customerId, options);
  }

  /**
   * Get audience insights
   */
  async getAudienceInsights(customerId, dateRange = 'LAST_30_DAYS', options = {}) {
    const gaql = `
      SELECT 
        campaign.id,
        campaign.name,
        segments.ad_network_type,
        segments.device,
        segments.age_range,
        segments.gender,
        metrics.impressions,
        metrics.clicks,
        metrics.ctr,
        metrics.cost_micros,
        metrics.conversions,
        segments.date
      FROM demographic_view
      WHERE segments.date DURING ${dateRange}
      ORDER BY metrics.impressions DESC
      LIMIT ${options?.limit || 300}
    `;
    
    return this.search(gaql, customerId, options);
  }

  /**
   * Health check for server
   */
  async healthCheck() {
    try {
      const response = await this.makeRequest('/health');
      return response?.data;
    } catch (error) {
      throw new ApiError('Health check failed', 503, { originalError: error });
    }
  }

  /**
   * Batch execute multiple GAQL queries
   */
  async batchSearch(queries, customerId = null, options = {}) {
    try {
      console.log(`🔄 Executing ${queries?.length} batch queries...`);
      
      const results = [];
      
      for (let i = 0; i < queries?.length; i++) {
        const query = queries?.[i];
        
        try {
          console.log(`📊 Executing query ${i + 1}/${queries?.length}...`);
          
          const result = await this.search(query?.gaql, query?.customerId || customerId, {
            ...options,
            ...query?.options
          });
          
          results?.push({
            index: i,
            query: query?.gaql,
            success: true,
            data: result,
            timestamp: new Date()?.toISOString()
          });
          
        } catch (error) {
          console.error(`❌ Batch query ${i + 1} failed:`, error);
          
          results?.push({
            index: i,
            query: query?.gaql,
            success: false,
            error: error?.message,
            details: error?.details,
            timestamp: new Date()?.toISOString()
          });
        }
        
        // Small delay between requests to avoid rate limiting
        if (i < queries?.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      console.log(`✅ Batch execution complete: ${results?.filter(r => r?.success)?.length}/${queries?.length} successful`);
      
      return {
        total: queries?.length,
        successful: results?.filter(r => r?.success)?.length,
        failed: results?.filter(r => !r?.success)?.length,
        results
      };
      
    } catch (error) {
      console.error('❌ Batch search failed:', error);
      throw error;
    }
  }

  /**
   * Format currency values from micros
   */
  formatCurrency(micros, currency = 'USD') {
    const amount = (parseInt(micros) || 0) / 1000000;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    })?.format(amount);
  }

  /**
   * Format percentage values
   */
  formatPercentage(value, decimals = 2) {
    return `${(parseFloat(value) || 0)?.toFixed(decimals)}%`;
  }

  /**
   * Format large numbers
   */
  formatNumber(number) {
    return new Intl.NumberFormat('en-US')?.format(parseInt(number) || 0);
  }
}

/**
 * Custom API Error class with enhanced error details
 */
class ApiError extends Error {
  constructor(message, status = 0, details = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    this.timestamp = new Date()?.toISOString();
  }

  toString() {
    const suggestion = this.details?.suggestion ? `\nSuggestion: ${this.details?.suggestion}` : '';
    return `${this.name}: ${this.message} (Status: ${this.status})${suggestion}`;
  }

  getHelpfulMessage() {
    const baseMessage = this.message;
    const suggestion = this.details?.suggestion;
    const serverURL = this.details?.serverURL;
    
    let helpMessage = baseMessage;
    
    if (suggestion) {
      helpMessage += `\n\n💡 Suggestion: ${suggestion}`;
    }
    
    if (serverURL) {
      helpMessage += `\n🔗 Server URL: ${serverURL}`;
    }
    
    return helpMessage;
  }
}

// Create and export singleton instance
const googleAdsApiClient = new GoogleAdsApiClient();

export default googleAdsApiClient;
export { GoogleAdsApiClient, ApiError };