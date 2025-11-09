import axios from 'axios';

/**
 * DataForSEO API Service for comprehensive keyword research and SEO data
 * Provides keyword research, SERP analysis, competitor analysis, and SEO metrics
 */
class DataForSeoService {
  constructor() {
    this.baseURL = import.meta.env?.VITE_DATAFORSEO_API_URL || 'https://api.dataforseo.com/v3';
    this.username = import.meta.env?.VITE_DATAFORSEO_USERNAME;
    this.password = import.meta.env?.VITE_DATAFORSEO_PASSWORD;
    this.debugMode = import.meta.env?.VITE_DEBUG_MODE === 'true';
    
    // Initialize axios instance with authentication
    this.apiClient = axios?.create({
      baseURL: this.baseURL,
      auth: {
        username: this.username,
        password: this.password
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });

    // Add request/response interceptors for logging and error handling
    this.setupInterceptors();
  }

  // Setup request and response interceptors
  setupInterceptors() {
    // Request interceptor
    this.apiClient?.interceptors?.request?.use(
      (config) => {
        this.log(`📤 API Request: ${config?.method?.toUpperCase()} ${config?.url}`);
        if (this.debugMode && config?.data) {
          this.log('Request Data:', config?.data);
        }
        return config;
      },
      (error) => {
        this.log('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.apiClient?.interceptors?.response?.use(
      (response) => {
        this.log(`✅ API Response: ${response?.status} ${response?.statusText}`);
        return response;
      },
      (error) => {
        this.log('❌ API Error:', error?.response?.data || error?.message);
        return Promise.reject(this.enhanceError(error));
      }
    );
  }

  // Enhanced error handling
  enhanceError(error) {
    const enhancedError = {
      message: error?.message || 'Unknown API error',
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      isDataForSeoError: true
    };

    // Handle specific DataForSEO error codes
    if (error?.response?.status === 401) {
      enhancedError.message = 'Authentication failed. Please check your DataForSEO credentials.';
    } else if (error?.response?.status === 402) {
      enhancedError.message = 'Payment required. Please check your DataForSEO account balance.';
    } else if (error?.response?.status === 403) {
      enhancedError.message = 'Access forbidden. Please verify your API permissions.';
    } else if (error?.response?.status === 429) {
      enhancedError.message = 'Rate limit exceeded. Please wait before making more requests.';
    } else if (error?.response?.status >= 500) {
      enhancedError.message = 'DataForSEO server error. Please try again later.';
    }

    return enhancedError;
  }

  // Check if DataForSEO credentials are configured
  hasValidCredentials() {
    return !!(this.username && this.password);
  }

  // Test API connection
  async testConnection() {
    try {
      this.log('🔍 Testing DataForSEO API connection...');
      
      if (!this.hasValidCredentials()) {
        return {
          success: false,
          message: 'DataForSEO credentials not configured',
          needsSetup: true
        };
      }

      const response = await this.apiClient?.get('/keywords_data/google_ads/languages');
      
      this.log('✅ DataForSEO API connection successful');
      return {
        success: true,
        message: 'DataForSEO API connection successful',
        data: response?.data
      };
    } catch (error) {
      this.log('❌ DataForSEO API connection failed:', error);
      return {
        success: false,
        message: error?.message || 'Connection test failed',
        error: error
      };
    }
  }

  // Get keyword research data
  async getKeywordResearch(params) {
    try {
      this.log(`🎯 Searching keywords for: ${params?.keyword}`);
      
      if (!this.hasValidCredentials()) {
        return this.getMockKeywordData(params?.keyword);
      }

      const requestData = [{
        keyword: params?.keyword,
        location_code: params?.locationCode || 2840, // USA by default
        language_code: params?.languageCode || 'en', // English by default
        search_partners: true,
        date_from: params?.dateFrom || '2024-01-01',
        date_to: params?.dateTo || new Date()?.toISOString()?.split('T')?.[0],
        ...this.buildFilters(params)
      }];

      const response = await this.apiClient?.post('/keywords_data/google_ads/search_volume/live', requestData);
      
      if (response?.data?.tasks?.[0]?.result) {
        return this.processKeywordResults(response?.data?.tasks?.[0]?.result);
      }
      
      throw new Error('No results returned from DataForSEO API');
    } catch (error) {
      this.log('❌ Keyword research failed, falling back to mock data:', error);
      return this.getMockKeywordData(params?.keyword);
    }
  }

  // Get keyword suggestions
  async getKeywordSuggestions(seedKeyword, params = {}) {
    try {
      this.log(`💡 Getting keyword suggestions for: ${seedKeyword}`);
      
      if (!this.hasValidCredentials()) {
        return this.getMockKeywordSuggestions(seedKeyword);
      }

      const requestData = [{
        keyword: seedKeyword,
        location_code: params?.locationCode || 2840,
        language_code: params?.languageCode || 'en',
        limit: params?.limit || 100,
        include_seed_keyword: true,
        include_serp_info: true,
        ...this.buildFilters(params)
      }];

      const response = await this.apiClient?.post('/keywords_data/google_ads/keywords_for_keywords/live', requestData);
      
      if (response?.data?.tasks?.[0]?.result) {
        return this.processKeywordSuggestions(response?.data?.tasks?.[0]?.result);
      }
      
      throw new Error('No suggestions returned from DataForSEO API');
    } catch (error) {
      this.log('❌ Keyword suggestions failed, falling back to mock data:', error);
      return this.getMockKeywordSuggestions(seedKeyword);
    }
  }

  // Get keyword difficulty and competition analysis
  async getKeywordDifficulty(keywords, params = {}) {
    try {
      this.log(`📊 Analyzing keyword difficulty for ${keywords?.length} keywords`);
      
      if (!this.hasValidCredentials()) {
        return this.getMockKeywordDifficulty(keywords);
      }

      const requestData = [{
        keywords: Array.isArray(keywords) ? keywords : [keywords],
        location_code: params?.locationCode || 2840,
        language_code: params?.languageCode || 'en'
      }];

      const response = await this.apiClient?.post('/keywords_data/keyword_difficulty/live', requestData);
      
      if (response?.data?.tasks?.[0]?.result) {
        return this.processKeywordDifficulty(response?.data?.tasks?.[0]?.result);
      }
      
      throw new Error('No difficulty data returned from DataForSEO API');
    } catch (error) {
      this.log('❌ Keyword difficulty analysis failed, falling back to mock data:', error);
      return this.getMockKeywordDifficulty(keywords);
    }
  }

  // Get SERP analysis for keywords
  async getSerpAnalysis(keyword, params = {}) {
    try {
      this.log(`🔍 Getting SERP analysis for: ${keyword}`);
      
      if (!this.hasValidCredentials()) {
        return this.getMockSerpAnalysis(keyword);
      }

      const requestData = [{
        keyword: keyword,
        location_code: params?.locationCode || 2840,
        language_code: params?.languageCode || 'en',
        device: params?.device || 'desktop',
        os: params?.os || 'windows'
      }];

      const response = await this.apiClient?.post('/serp/google/organic/live/advanced', requestData);
      
      if (response?.data?.tasks?.[0]?.result) {
        return this.processSerpResults(response?.data?.tasks?.[0]?.result);
      }
      
      throw new Error('No SERP data returned from DataForSEO API');
    } catch (error) {
      this.log('❌ SERP analysis failed, falling back to mock data:', error);
      return this.getMockSerpAnalysis(keyword);
    }
  }

  // Get competitor analysis
  async getCompetitorAnalysis(domain, params = {}) {
    try {
      this.log(`🏆 Analyzing competitors for domain: ${domain}`);
      
      if (!this.hasValidCredentials()) {
        return this.getMockCompetitorAnalysis(domain);
      }

      const requestData = [{
        target: domain,
        location_code: params?.locationCode || 2840,
        language_code: params?.languageCode || 'en',
        limit: params?.limit || 50
      }];

      const response = await this.apiClient?.post('/dataforseo_labs/google/competitors_domain/live', requestData);
      
      if (response?.data?.tasks?.[0]?.result) {
        return this.processCompetitorResults(response?.data?.tasks?.[0]?.result);
      }
      
      throw new Error('No competitor data returned from DataForSEO API');
    } catch (error) {
      this.log('❌ Competitor analysis failed, falling back to mock data:', error);
      return this.getMockCompetitorAnalysis(domain);
    }
  }

  // Build filters based on parameters
  buildFilters(params) {
    const filters = {};
    
    if (params?.searchVolume) {
      const [min, max] = params?.searchVolume?.split('-')?.map(v => parseInt(v) || 0);
      if (min > 0) filters.search_volume_min = min;
      if (max > 0 && max !== Infinity) filters.search_volume_max = max;
    }
    
    if (params?.competition) {
      switch (params?.competition) {
        case 'low':
          filters.competition_max = 0.33;
          break;
        case 'medium':
          filters.competition_min = 0.34;
          filters.competition_max = 0.66;
          break;
        case 'high':
          filters.competition_min = 0.67;
          break;
      }
    }
    
    if (params?.cpcRange) {
      const [min, max] = params?.cpcRange?.split('-')?.map(v => parseFloat(v) || 0);
      if (min > 0) filters.cpc_min = min;
      if (max > 0 && max !== Infinity) filters.cpc_max = max;
    }
    
    return filters;
  }

  // Process keyword research results
  processKeywordResults(results) {
    return results?.map(item => ({
      keyword: item?.keyword,
      volume: item?.search_volume || 0,
      competition: item?.competition || 0,
      cpc: item?.cpc || 0,
      difficulty: this.calculateDifficulty(item?.competition, item?.search_volume),
      trend: this.calculateTrend(item?.monthly_searches || []),
      monthlySearches: item?.monthly_searches || [],
      keywordAnnotations: item?.keyword_annotations || {},
      timestamp: new Date()?.toISOString()
    })) || [];
  }

  // Process keyword suggestions
  processKeywordSuggestions(results) {
    return results?.map(item => ({
      keyword: item?.keyword,
      volume: item?.search_volume || 0,
      competition: item?.competition || 0,
      cpc: item?.cpc || 0,
      difficulty: this.calculateDifficulty(item?.competition, item?.search_volume),
      relevance: item?.relevance || 0,
      categories: item?.categories || [],
      timestamp: new Date()?.toISOString()
    })) || [];
  }

  // Process keyword difficulty results
  processKeywordDifficulty(results) {
    return results?.map(item => ({
      keyword: item?.keyword,
      difficulty: item?.keyword_difficulty || 0,
      competitorCount: item?.competitor_count || 0,
      averagePagerank: item?.average_pagerank || 0,
      timestamp: new Date()?.toISOString()
    })) || [];
  }

  // Process SERP results
  processSerpResults(results) {
    const serpData = results?.[0] || {};
    
    return {
      keyword: serpData?.keyword,
      totalResults: serpData?.total_count || 0,
      organicResults: serpData?.items?.filter(item => item?.type === 'organic')?.map(item => ({
        position: item?.rank_group,
        title: item?.title,
        url: item?.url,
        displayUrl: item?.breadcrumb,
        description: item?.description,
        domain: item?.domain
      })) || [],
      paidResults: serpData?.items?.filter(item => item?.type === 'paid')?.length || 0,
      featuredSnippets: serpData?.items?.filter(item => item?.type === 'featured_snippet')?.length || 0,
      timestamp: new Date()?.toISOString()
    };
  }

  // Process competitor analysis results
  processCompetitorResults(results) {
    return results?.map(item => ({
      domain: item?.target,
      competitionLevel: item?.avg_position || 0,
      sharedKeywords: item?.intersections || 0,
      estimatedTraffic: item?.etv || 0,
      organicKeywords: item?.full_domain_metrics?.organic_keywords || 0,
      paidKeywords: item?.full_domain_metrics?.paid_keywords || 0,
      timestamp: new Date()?.toISOString()
    })) || [];
  }

  // Calculate keyword difficulty based on competition and search volume
  calculateDifficulty(competition, searchVolume) {
    if (!competition && !searchVolume) return 'Unknown';
    
    const competitionScore = competition * 100;
    const volumeScore = Math.min((searchVolume || 0) / 10000, 1) * 50;
    const totalScore = competitionScore + volumeScore;
    
    if (totalScore < 30) return 'Easy';
    if (totalScore < 60) return 'Medium';
    if (totalScore < 80) return 'Hard';
    return 'Very Hard';
  }

  // Calculate trend based on monthly searches
  calculateTrend(monthlySearches) {
    if (!monthlySearches || monthlySearches?.length < 2) return 'Stable';
    
    const recent = monthlySearches?.slice(-3)?.map(m => m?.search_volume || 0);
    const older = monthlySearches?.slice(-6, -3)?.map(m => m?.search_volume || 0);
    
    const recentAvg = recent?.reduce((a, b) => a + b, 0) / recent?.length;
    const olderAvg = older?.reduce((a, b) => a + b, 0) / older?.length;
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    if (change > 10) return 'Rising';
    if (change < -10) return 'Declining';
    return 'Stable';
  }

  // Enhanced logging with timestamps
  log(message, data = null) {
    const timestamp = new Date()?.toISOString();
    console.log(`[${timestamp}] DataForSeoService: ${message}`);
    if (data && this.debugMode) {
      console.log(data);
    }
  }

  // Mock data fallbacks for when API is not configured or fails
  getMockKeywordData(keyword) {
    return [
      {
        keyword: keyword || 'digital marketing',
        volume: Math.floor(Math.random() * 50000) + 5000,
        competition: Math.random(),
        cpc: Math.random() * 10 + 0.5,
        difficulty: ['Easy', 'Medium', 'Hard']?.[Math.floor(Math.random() * 3)],
        trend: ['Rising', 'Stable', 'Declining']?.[Math.floor(Math.random() * 3)],
        timestamp: new Date()?.toISOString()
      },
      {
        keyword: `${keyword} services`,
        volume: Math.floor(Math.random() * 30000) + 3000,
        competition: Math.random(),
        cpc: Math.random() * 8 + 0.3,
        difficulty: ['Easy', 'Medium', 'Hard']?.[Math.floor(Math.random() * 3)],
        trend: ['Rising', 'Stable', 'Declining']?.[Math.floor(Math.random() * 3)],
        timestamp: new Date()?.toISOString()
      }
    ];
  }

  getMockKeywordSuggestions(seedKeyword) {
    const suggestions = [
      'best', 'top', 'professional', 'affordable', 'local', 'online', 'free', 'premium'
    ];
    
    return suggestions?.map(prefix => ({
      keyword: `${prefix} ${seedKeyword}`,
      volume: Math.floor(Math.random() * 25000) + 1000,
      competition: Math.random(),
      cpc: Math.random() * 6 + 0.2,
      difficulty: ['Easy', 'Medium', 'Hard']?.[Math.floor(Math.random() * 3)],
      relevance: Math.random(),
      timestamp: new Date()?.toISOString()
    }));
  }

  getMockKeywordDifficulty(keywords) {
    return (Array.isArray(keywords) ? keywords : [keywords])?.map(keyword => ({
      keyword,
      difficulty: Math.floor(Math.random() * 100),
      competitorCount: Math.floor(Math.random() * 50) + 10,
      averagePagerank: Math.random() * 10,
      timestamp: new Date()?.toISOString()
    }));
  }

  getMockSerpAnalysis(keyword) {
    return {
      keyword,
      totalResults: Math.floor(Math.random() * 1000000) + 100000,
      organicResults: Array.from({ length: 10 }, (_, i) => ({
        position: i + 1,
        title: `${keyword} - Result ${i + 1}`,
        url: `https://example${i + 1}.com`,
        displayUrl: `example${i + 1}.com`,
        description: `This is a sample description for ${keyword} result ${i + 1}`,
        domain: `example${i + 1}.com`
      })),
      paidResults: Math.floor(Math.random() * 5),
      featuredSnippets: Math.floor(Math.random() * 3),
      timestamp: new Date()?.toISOString()
    };
  }

  getMockCompetitorAnalysis(domain) {
    const competitors = ['competitor1.com', 'competitor2.com', 'competitor3.com'];
    
    return competitors?.map(comp => ({
      domain: comp,
      competitionLevel: Math.random() * 100,
      sharedKeywords: Math.floor(Math.random() * 500) + 50,
      estimatedTraffic: Math.floor(Math.random() * 100000) + 10000,
      organicKeywords: Math.floor(Math.random() * 1000) + 100,
      paidKeywords: Math.floor(Math.random() * 200) + 20,
      timestamp: new Date()?.toISOString()
    }));
  }

  // Utility methods
  formatNumber(number) {
    return new Intl.NumberFormat('en-US')?.format(number);
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  }

  formatPercentage(percentage) {
    return `${(parseFloat(percentage) * 100)?.toFixed(1)}%`;
  }
}

export default new DataForSeoService();