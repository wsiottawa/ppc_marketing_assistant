import openai from './openaiClient';

/**
 * AI Service for Google Ads data analysis and insights
 */
class AIService {
  constructor() {
    this.model = 'gpt-5';
    this.debugMode = import.meta.env?.VITE_DEBUG_MODE === 'true';
  }

  // Log AI service activities
  log(message, data = null) {
    if (this.debugMode) {
      const timestamp = new Date()?.toISOString();
      console.log(`[${timestamp}] AIService: ${message}`);
      if (data) {
        console.log(data);
      }
    }
  }

  /**
   * Analyze client performance data and provide insights
   * @param {Object} clientData - Client performance data
   * @returns {Promise<Object>} AI-generated insights and recommendations
   */
  async analyzeClientPerformance(clientData) {
    try {
      this.log('🤖 Analyzing client performance with AI');
      
      const systemPrompt = `You are an expert Google Ads analyst with deep knowledge of PPC campaign optimization, performance metrics, and industry best practices. Analyze the provided client data and provide actionable insights.`;
      
      const userPrompt = `Analyze this Google Ads client performance data and provide insights:

Client: ${clientData?.name} (ID: ${clientData?.id})
Industry: ${clientData?.industry}
Monthly Spend: $${clientData?.monthlySpend?.toLocaleString()}
Performance Score: ${clientData?.performanceScore}%
Health Score: ${clientData?.healthScore}/100
Active Campaigns: ${clientData?.activeCampaigns}
Status: ${clientData?.status}

Recent Activity:
${clientData?.recentActivity?.slice(0, 3)?.map(activity => `- ${activity?.description}`)?.join('\n')}

Please provide:
1. Performance analysis summary
2. Key strengths and weaknesses
3. Specific optimization recommendations
4. Risk factors to monitor
5. Next steps prioritized by impact`;

      const response = await openai?.chat?.completions?.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        reasoning_effort: 'high', // Deep analysis for performance insights
        verbosity: 'high', // Detailed recommendations
      });

      const analysis = response?.choices?.[0]?.message?.content;
      
      this.log('✅ AI analysis completed');
      
      return {
        analysis,
        client: clientData?.name,
        timestamp: new Date()?.toISOString(),
        model: this.model
      };

    } catch (error) {
      this.log('❌ AI analysis failed:', error);
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  /**
   * Generate customer ID validation and suggestions
   * @param {string} customerId - The customer ID to validate
   * @returns {Promise<Object>} Validation results and suggestions
   */
  async validateCustomerId(customerId) {
    try {
      this.log(`🔍 Validating Customer ID: ${customerId}`);
      
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5-mini', // Fast model for validation
        messages: [
          { 
            role: 'system', 
            content: 'You are a Google Ads Customer ID validation expert. Analyze customer IDs for format correctness and provide helpful feedback.' 
          },
          { 
            role: 'user', 
            content: `Validate this Google Ads Customer ID: "${customerId}"
            
            Check for:
            1. Proper format (typically 10 digits, may have dashes: XXX-XXX-XXXX)
            2. Length and character validation
            3. Common formatting issues
            4. Suggestions for correction if invalid
            
            Respond with validation status and helpful guidance.` 
          },
        ],
        reasoning_effort: 'minimal',
        verbosity: 'medium',
      });

      return {
        validation: response?.choices?.[0]?.message?.content,
        customerId,
        timestamp: new Date()?.toISOString()
      };

    } catch (error) {
      this.log('❌ Customer ID validation failed:', error);
      return {
        validation: 'Unable to validate Customer ID format. Please ensure it follows the format: XXX-XXX-XXXX (10 digits with dashes).',
        customerId,
        error: error?.message,
        timestamp: new Date()?.toISOString()
      };
    }
  }

  /**
   * Analyze multiple clients and provide portfolio insights
   * @param {Array} clients - Array of client data
   * @returns {Promise<Object>} Portfolio analysis and recommendations
   */
  async analyzeClientPortfolio(clients) {
    try {
      this.log('📊 Analyzing client portfolio with AI');
      
      // Prepare portfolio summary
      const totalSpend = clients?.reduce((sum, client) => sum + (client?.monthlySpend || 0), 0);
      const avgPerformance = clients?.reduce((sum, client) => sum + (client?.performanceScore || 0), 0) / clients?.length;
      const riskClients = clients?.filter(client => client?.status === 'at-risk')?.length;
      
      const portfolioSummary = `
Portfolio Overview:
- Total Clients: ${clients?.length}
- Total Monthly Spend: $${totalSpend?.toLocaleString()}
- Average Performance Score: ${avgPerformance?.toFixed(1)}%
- At-Risk Clients: ${riskClients}

Client Breakdown by Tier:
${clients?.reduce((acc, client) => {
  const tier = client?.tier || 'unknown';
  acc[tier] = (acc?.[tier] || 0) + 1;
  return acc;
}, {})}

Top Performing Clients:
${clients?.sort((a, b) => (b?.performanceScore || 0) - (a?.performanceScore || 0))
  ?.slice(0, 3)
  ?.map(client => `- ${client?.name}: ${client?.performanceScore}% (${client?.tier})`)
  ?.join('\n')}

Clients Needing Attention:
${clients?.filter(client => client?.status === 'at-risk' || (client?.healthScore || 0) < 60)
  ?.slice(0, 3)
  ?.map(client => `- ${client?.name}: Health ${client?.healthScore}/100`)
  ?.join('\n')}`;

      const response = await openai?.chat?.completions?.create({
        model: this.model,
        messages: [
          { 
            role: 'system', 
            content: 'You are a senior Google Ads account strategist specializing in portfolio optimization and client growth strategies.' 
          },
          { 
            role: 'user', 
            content: `Analyze this Google Ads client portfolio and provide strategic insights:

${portfolioSummary}

Please provide:
1. Overall portfolio health assessment
2. Revenue optimization opportunities
3. Risk management recommendations
4. Client growth and retention strategies
5. Resource allocation suggestions
6. Key performance indicators to track` 
          },
        ],
        reasoning_effort: 'high',
        verbosity: 'high',
      });

      return {
        portfolioAnalysis: response?.choices?.[0]?.message?.content,
        summary: {
          totalClients: clients?.length,
          totalSpend,
          avgPerformance: avgPerformance?.toFixed(1),
          riskClients
        },
        timestamp: new Date()?.toISOString(),
        model: this.model
      };

    } catch (error) {
      this.log('❌ Portfolio analysis failed:', error);
      throw new Error(`Portfolio analysis failed: ${error.message}`);
    }
  }

  /**
   * Generate campaign optimization suggestions
   * @param {Object} campaignData - Campaign performance data
   * @returns {Promise<Object>} Optimization recommendations
   */
  async optimizeCampaign(campaignData) {
    try {
      this.log('🎯 Generating campaign optimization suggestions');
      
      const response = await openai?.chat?.completions?.create({
        model: this.model,
        messages: [
          { 
            role: 'system', 
            content: 'You are a Google Ads campaign optimization specialist with expertise in bid management, keyword optimization, and ad copy performance.' 
          },
          { 
            role: 'user', 
            content: `Optimize this Google Ads campaign:

Campaign: ${campaignData?.name}
Type: ${campaignData?.type}
Status: ${campaignData?.status}
Impressions: ${campaignData?.impressions?.toLocaleString()}
Clicks: ${campaignData?.clicks?.toLocaleString()}
CTR: ${campaignData?.ctr?.toFixed(2)}%
Cost: $${campaignData?.cost?.toLocaleString()}
Conversions: ${campaignData?.conversions}
Conversion Value: $${campaignData?.conversionsValue?.toLocaleString()}

Provide specific optimization recommendations for:
1. Bid management and budget allocation
2. Keyword performance and expansion
3. Ad copy improvements
4. Audience targeting refinements
5. Landing page optimization
6. Performance monitoring metrics` 
          },
        ],
        reasoning_effort: 'high',
        verbosity: 'high',
      });

      return {
        optimization: response?.choices?.[0]?.message?.content,
        campaign: campaignData?.name,
        timestamp: new Date()?.toISOString(),
        model: this.model
      };

    } catch (error) {
      this.log('❌ Campaign optimization failed:', error);
      throw new Error(`Campaign optimization failed: ${error.message}`);
    }
  }

  /**
   * Analyze API connection issues and provide troubleshooting guidance
   * @param {Object} connectionTest - Connection test results from Google Ads API
   * @returns {Promise<Object>} Troubleshooting recommendations
   */
  async analyzeConnectionIssue(connectionTest) {
    try {
      this.log('🔧 Analyzing API connection issues');
      
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a Google Ads API integration specialist. Help users troubleshoot connection issues and provide clear, actionable solutions.' 
          },
          { 
            role: 'user', 
            content: `Analyze this Google Ads API connection issue:

Connection Status: ${connectionTest?.connectionStatus}
Credentials Valid: ${connectionTest?.detailedStatus?.credentialsValid}
OAuth Working: ${connectionTest?.detailedStatus?.oauthWorking}
CORS Blocked: ${connectionTest?.detailedStatus?.corsBlocked}
API Accessible: ${connectionTest?.detailedStatus?.apiAccessible}

Errors: ${connectionTest?.errors?.join(', ')}
Warnings: ${connectionTest?.warnings?.join(', ')}

The user entered Customer ID "853-238-2011" but data is not pulling. Provide:
1. Root cause analysis
2. Step-by-step troubleshooting guide
3. Alternative solutions (like manual client entry)
4. Best practices for API integration
5. When to contact support` 
          },
        ],
        reasoning_effort: 'medium',
        verbosity: 'high',
      });

      return {
        troubleshooting: response?.choices?.[0]?.message?.content,
        connectionStatus: connectionTest?.connectionStatus,
        timestamp: new Date()?.toISOString(),
        model: 'gpt-5-mini'
      };

    } catch (error) {
      this.log('❌ Connection issue analysis failed:', error);
      return {
        troubleshooting: `The issue appears to be related to browser security policies blocking direct API calls. Here's what you can do:

1. **Add Client Manually**: Use the "Add Client" button to manually enter Customer ID 853-238-2011
2. **Browser Limitation**: Direct Google Ads API calls are blocked by CORS in browsers - this is normal
3. **Manual Entry Process**: The system will create a client entry that you can manage and update
4. **Data Sync**: While real-time API data isn't available due to browser security, you can manually update client information
5. **Production Solution**: For live API integration, consider implementing a backend proxy server

This is a common limitation when accessing Google Ads API directly from browsers.`,
        connectionStatus: connectionTest?.connectionStatus,
        error: error?.message,
        timestamp: new Date()?.toISOString()
      };
    }
  }

  /**
   * Generate smart suggestions for client management
   * @param {Object} context - Context about the user's current situation
   * @returns {Promise<Object>} Smart suggestions and next steps
   */
  async generateSmartSuggestions(context) {
    try {
      this.log('💡 Generating smart suggestions');
      
      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful Google Ads management assistant. Provide practical, actionable suggestions based on the user\'s current situation.' 
          },
          { 
            role: 'user', 
            content: `Generate helpful suggestions for this Google Ads management situation:

Context: ${JSON.stringify(context, null, 2)}

Provide:
1. Immediate next steps
2. Best practices to follow
3. Common pitfalls to avoid
4. Efficiency tips
5. Long-term strategy recommendations

Keep suggestions practical and specific.` 
          },
        ],
        reasoning_effort: 'minimal',
        verbosity: 'medium',
      });

      return {
        suggestions: response?.choices?.[0]?.message?.content,
        context,
        timestamp: new Date()?.toISOString(),
        model: 'gpt-5-mini'
      };

    } catch (error) {
      this.log('❌ Smart suggestions generation failed:', error);
      throw new Error(`Smart suggestions generation failed: ${error.message}`);
    }
  }
}

export default new AIService();