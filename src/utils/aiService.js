import openai from './openaiClient';

/**
 * Enhanced AI Service for comprehensive PPC Marketing Assistant
 * Provides AI-powered insights, analysis, and recommendations for Google Ads management
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
   * Generate comprehensive dashboard insights
   * @param {Object} dashboardData - Overall dashboard performance data
   * @returns {Promise<Object>} AI-generated dashboard insights
   */
  async generateDashboardInsights(dashboardData) {
    try {
      this.log('🚀 Generating comprehensive dashboard insights');
      
      const response = await openai?.chat?.completions?.create({
        model: this.model,
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert PPC strategist and data analyst. Provide actionable insights for a Google Ads management dashboard.' 
          },
          { 
            role: 'user', 
            content: `Analyze this PPC dashboard data and provide insights:

Dashboard Summary:
- Total Clients: ${dashboardData?.totalClients || 'N/A'}
- Total Monthly Spend: $${dashboardData?.totalSpend?.toLocaleString() || '0'}
- Active Campaigns: ${dashboardData?.activeCampaigns || 'N/A'}
- Average Performance Score: ${dashboardData?.avgPerformance || 'N/A'}%
- At-Risk Clients: ${dashboardData?.riskClients || 'N/A'}

Provide:
1. Overall portfolio health assessment
2. Top 3 immediate opportunities
3. Risk factors to monitor
4. Strategic recommendations for growth
5. Specific actionable next steps

Format as actionable business insights.` 
          },
        ],
        reasoning_effort: 'high',
        verbosity: 'high',
      });

      const analysis = response?.choices?.[0]?.message?.content;
      
      return this.parseInsightsResponse(analysis, 'dashboard');
      
    } catch (error) {
      this.log('❌ Dashboard insights generation failed:', error);
      return this.getFallbackInsights('dashboard');
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
      
      const response = await openai?.chat?.completions?.create({
        model: this.model,
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert Google Ads analyst specializing in client performance optimization and account growth strategies.' 
          },
          { 
            role: 'user', 
            content: `Analyze this Google Ads client performance:

Client: ${clientData?.name} (${clientData?.id})
Industry: ${clientData?.industry || 'Not specified'}
Monthly Spend: $${clientData?.monthlySpend?.toLocaleString() || '0'}
Performance Score: ${clientData?.performanceScore || 'N/A'}%
Health Score: ${clientData?.healthScore || 'N/A'}/100
Active Campaigns: ${clientData?.activeCampaigns || 'N/A'}
Status: ${clientData?.status || 'Unknown'}

Recent Activity:
${clientData?.recentActivity?.slice(0, 3)?.map(activity => `- ${activity?.description}`)?.join('\n') || 'No recent activity'}

Provide detailed analysis with:
1. Performance assessment summary
2. Key strengths and improvement areas
3. Specific optimization recommendations
4. Risk factors and alerts
5. Growth opportunities
6. Next action steps with priority levels` 
          },
        ],
        reasoning_effort: 'high',
        verbosity: 'high',
      });

      const analysis = response?.choices?.[0]?.message?.content;
      
      return this.parseInsightsResponse(analysis, 'client', clientData);

    } catch (error) {
      this.log('❌ Client performance analysis failed:', error);
      return this.getFallbackInsights('client', clientData);
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
            content: 'You are a Google Ads campaign optimization specialist with deep expertise in bid management, keyword optimization, and performance improvement.' 
          },
          { 
            role: 'user', 
            content: `Optimize this Google Ads campaign:

Campaign: ${campaignData?.name}
Type: ${campaignData?.type}
Status: ${campaignData?.status}
Impressions: ${campaignData?.impressions?.toLocaleString() || 'N/A'}
Clicks: ${campaignData?.clicks?.toLocaleString() || 'N/A'}
CTR: ${campaignData?.ctr?.toFixed(2) || 'N/A'}%
Cost: $${campaignData?.cost?.toLocaleString() || 'N/A'}
Conversions: ${campaignData?.conversions || 'N/A'}
Conversion Rate: ${campaignData?.conversionRate?.toFixed(2) || 'N/A'}%
Quality Score: ${campaignData?.qualityScore || 'N/A'}
Performance: ${campaignData?.performance || 'N/A'}

Provide specific optimization recommendations:
1. Immediate actions (high priority)
2. Bid and budget optimizations
3. Keyword and targeting improvements
4. Ad copy and creative suggestions
5. Landing page optimization
6. Performance monitoring setup
7. Expected impact and timeline` 
          },
        ],
        reasoning_effort: 'high',
        verbosity: 'high',
      });

      const analysis = response?.choices?.[0]?.message?.content;
      
      return this.parseInsightsResponse(analysis, 'campaign', campaignData);

    } catch (error) {
      this.log('❌ Campaign optimization failed:', error);
      return this.getFallbackInsights('campaign', campaignData);
    }
  }

  /**
   * Analyze competitive intelligence data
   * @param {Object} competitiveData - Competitive analysis data
   * @returns {Promise<Object>} Competitive insights and strategies
   */
  async analyzeCompetitiveIntelligence(competitiveData) {
    try {
      this.log('🕵️ Analyzing competitive intelligence');
      
      const response = await openai?.chat?.completions?.create({
        model: this.model,
        messages: [
          { 
            role: 'system', 
            content: 'You are a competitive intelligence specialist for Google Ads, expert in market analysis and strategic positioning.' 
          },
          { 
            role: 'user', 
            content: `Analyze this competitive landscape:

Market Data:
${JSON.stringify(competitiveData, null, 2)}

Provide competitive intelligence insights:
1. Market positioning analysis
2. Competitor strengths and weaknesses
3. Opportunity gaps identification
4. Strategic recommendations
5. Defensive and offensive tactics
6. Market share growth opportunities` 
          },
        ],
        reasoning_effort: 'high',
        verbosity: 'medium',
      });

      const analysis = response?.choices?.[0]?.message?.content;
      
      return this.parseInsightsResponse(analysis, 'competitive');

    } catch (error) {
      this.log('❌ Competitive analysis failed:', error);
      return this.getFallbackInsights('competitive');
    }
  }

  /**
   * Analyze keyword performance data
   * @param {Object} keywordData - Keyword performance metrics
   * @returns {Promise<Object>} Keyword optimization insights
   */
  async analyzeKeywordPerformance(keywordData) {
    try {
      this.log('🔍 Analyzing keyword performance');
      
      const response = await openai?.chat?.completions?.create({
        model: this.model,
        messages: [
          { 
            role: 'system', 
            content: 'You are a keyword research and optimization expert specializing in Google Ads performance analysis.' 
          },
          { 
            role: 'user', 
            content: `Analyze keyword performance data:

${JSON.stringify(keywordData, null, 2)}

Provide keyword optimization insights:
1. High-performing keyword analysis
2. Underperforming keyword identification
3. Expansion opportunities
4. Negative keyword suggestions
5. Bid optimization recommendations
6. Match type optimization
7. Long-tail opportunity analysis` 
          },
        ],
        reasoning_effort: 'medium',
        verbosity: 'medium',
      });

      const analysis = response?.choices?.[0]?.message?.content;
      
      return this.parseInsightsResponse(analysis, 'keyword');

    } catch (error) {
      this.log('❌ Keyword analysis failed:', error);
      return this.getFallbackInsights('keyword');
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
      
      const totalSpend = clients?.reduce((sum, client) => sum + (client?.monthlySpend || 0), 0);
      const avgPerformance = clients?.reduce((sum, client) => sum + (client?.performanceScore || 0), 0) / clients?.length;
      const riskClients = clients?.filter(client => client?.status === 'at-risk')?.length;
      
      const response = await openai?.chat?.completions?.create({
        model: this.model,
        messages: [
          { 
            role: 'system', 
            content: 'You are a senior Google Ads portfolio manager specializing in multi-client optimization and growth strategies.' 
          },
          { 
            role: 'user', 
            content: `Analyze this Google Ads client portfolio:

Portfolio Overview:
- Total Clients: ${clients?.length}
- Total Monthly Spend: $${totalSpend?.toLocaleString()}
- Average Performance Score: ${avgPerformance?.toFixed(1)}%
- At-Risk Clients: ${riskClients}

Client Performance Distribution:
${clients?.map(client => 
  `- ${client?.name}: $${client?.monthlySpend?.toLocaleString()} spend, ${client?.performanceScore}% performance, Status: ${client?.status}`
)?.join('\n')}

Provide portfolio-level insights:
1. Overall portfolio health assessment
2. Revenue optimization opportunities  
3. Risk management recommendations
4. Client segmentation strategies
5. Resource allocation optimization
6. Growth and retention strategies
7. Key performance indicators to track` 
          },
        ],
        reasoning_effort: 'high',
        verbosity: 'high',
      });

      const analysis = response?.choices?.[0]?.message?.content;
      
      return {
        analysis,
        portfolioSummary: {
          totalClients: clients?.length,
          totalSpend,
          avgPerformance: avgPerformance?.toFixed(1),
          riskClients
        },
        timestamp: new Date()?.toISOString(),
        model: this.model,
        ...this.parseInsightsResponse(analysis, 'portfolio')
      };

    } catch (error) {
      this.log('❌ Portfolio analysis failed:', error);
      return this.getFallbackInsights('portfolio');
    }
  }

  /**
   * Generate smart suggestions for various contexts
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
            content: 'You are a helpful PPC management assistant. Provide practical, actionable suggestions based on the context provided.' 
          },
          { 
            role: 'user', 
            content: `Generate helpful suggestions for this situation:

Context: ${JSON.stringify(context, null, 2)}

Provide:
1. Immediate next steps (prioritized)
2. Best practices to follow
3. Common pitfalls to avoid
4. Time-saving tips
5. Long-term strategy recommendations

Keep suggestions practical, specific, and actionable.` 
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
      return {
        suggestions: 'Unable to generate suggestions at this time. Please try again.',
        context,
        error: error?.message,
        timestamp: new Date()?.toISOString()
      };
    }
  }

  /**
   * Parse AI response into structured insights
   * @param {string} analysis - Raw AI analysis text
   * @param {string} type - Type of analysis
   * @param {Object} originalData - Original data used for analysis
   * @returns {Object} Structured insights object
   */
  parseInsightsResponse(analysis, type, originalData = null) {
    const insights = {
      analysis,
      recommendations: this.extractRecommendations(analysis),
      alerts: this.extractAlerts(analysis),
      actions: this.extractActions(analysis),
      confidence: this.calculateConfidence(analysis),
      timestamp: new Date()?.toISOString(),
      model: this.model,
      type
    };

    if (originalData) {
      insights.sourceData = originalData;
    }

    return insights;
  }

  /**
   * Extract recommendations from AI analysis
   * @param {string} text - AI analysis text
   * @returns {Array} List of recommendations
   */
  extractRecommendations(text) {
    const recommendations = [];
    
    // Look for numbered lists, bullet points, or recommendation sections
    const patterns = [
      /(?:\d+\.\s*|[-•]\s*)(.*?recommendation.*?)(?=\d+\.|[-•]|$)/gi,
      /recommend(?:ation)?s?:?\s*(.*?)(?=\n\n|\n[A-Z]|$)/gi,
      /suggest(?:ion)?s?:?\s*(.*?)(?=\n\n|\n[A-Z]|$)/gi
    ];

    patterns?.forEach(pattern => {
      const matches = text?.match(pattern);
      if (matches) {
        matches?.forEach(match => {
          const cleaned = match?.replace(/^\d+\.\s*|^[-•]\s*/g, '')?.trim();
          if (cleaned && cleaned?.length > 10) {
            recommendations?.push(cleaned);
          }
        });
      }
    });

    return recommendations?.slice(0, 5); // Limit to top 5 recommendations
  }

  /**
   * Extract alerts from AI analysis
   * @param {string} text - AI analysis text
   * @returns {Array} List of alerts
   */
  extractAlerts(text) {
    const alerts = [];
    
    // Look for alert indicators
    const alertKeywords = ['alert', 'warning', 'risk', 'concern', 'issue', 'problem', 'declining'];
    const lines = text?.split('\n');

    lines?.forEach(line => {
      const lowerLine = line?.toLowerCase();
      if (alertKeywords?.some(keyword => lowerLine?.includes(keyword))) {
        const severity = lowerLine?.includes('critical') || lowerLine?.includes('urgent') ? 'high' :
                        lowerLine?.includes('warning') || lowerLine?.includes('concern') ? 'medium' : 'low';
        
        alerts?.push({
          type: 'performance',
          severity,
          message: line?.trim()
        });
      }
    });

    return alerts?.slice(0, 3); // Limit to top 3 alerts
  }

  /**
   * Extract actionable items from AI analysis
   * @param {string} text - AI analysis text
   * @returns {Array} List of actions
   */
  extractActions(text) {
    const actions = [];
    
    // Look for action-oriented phrases
    const actionPatterns = [
      /(?:increase|decrease|optimize|adjust|improve|test|implement|review|analyze)\s+.*?(?=\.|,|\n)/gi,
      /(?:should|must|need to|consider)\s+.*?(?=\.|,|\n)/gi
    ];

    actionPatterns?.forEach(pattern => {
      const matches = text?.match(pattern);
      if (matches) {
        matches?.forEach(match => {
          const cleaned = match?.trim();
          if (cleaned && cleaned?.length > 15) {
            actions?.push({
              title: cleaned,
              description: `Recommended action based on AI analysis`,
              priority: cleaned?.toLowerCase()?.includes('critical') || cleaned?.toLowerCase()?.includes('urgent') ? 'high' : 'medium'
            });
          }
        });
      }
    });

    return actions?.slice(0, 4); // Limit to top 4 actions
  }

  /**
   * Calculate confidence score based on analysis content
   * @param {string} text - AI analysis text
   * @returns {number} Confidence score between 0 and 1
   */
  calculateConfidence(text) {
    let confidence = 0.7; // Base confidence
    
    // Increase confidence based on analysis depth
    if (text?.length > 500) confidence += 0.1;
    if (text?.includes('recommend')) confidence += 0.05;
    if (text?.includes('data shows') || text?.includes('analysis reveals')) confidence += 0.1;
    if (text?.includes('specific') || text?.includes('actionable')) confidence += 0.05;
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Get fallback insights when AI analysis fails
   * @param {string} type - Type of analysis
   * @param {Object} data - Original data
   * @returns {Object} Fallback insights
   */
  getFallbackInsights(type, data = null) {
    const fallbackInsights = {
      dashboard: {
        analysis: 'Dashboard performance is being monitored. AI analysis temporarily unavailable.',
        recommendations: [
          'Review campaign performance metrics',
          'Check for any budget pacing issues',
          'Monitor competitor activity'
        ],
        alerts: [],
        actions: [
          { title: 'Review Performance', description: 'Check key metrics', priority: 'medium' }
        ]
      },
      client: {
        analysis: `Client ${data?.name || 'performance'} requires attention. AI analysis temporarily unavailable.`,
        recommendations: [
          'Review recent performance changes',
          'Check campaign settings and budgets',
          'Analyze conversion tracking setup'
        ],
        alerts: [
          { type: 'system', severity: 'low', message: 'AI analysis unavailable' }
        ],
        actions: [
          { title: 'Manual Review', description: 'Perform manual account review', priority: 'medium' }
        ]
      },
      campaign: {
        analysis: `Campaign ${data?.name || 'optimization'} opportunities available. AI analysis temporarily unavailable.`,
        recommendations: [
          'Review keyword performance',
          'Analyze ad copy effectiveness',
          'Check bid strategies'
        ],
        alerts: [],
        actions: [
          { title: 'Keyword Review', description: 'Analyze keyword performance', priority: 'medium' }
        ]
      }
    };

    const insights = fallbackInsights?.[type] || fallbackInsights?.dashboard;
    
    return {
      ...insights,
      confidence: 0.5,
      timestamp: new Date()?.toISOString(),
      model: 'fallback',
      type,
      error: 'AI analysis temporarily unavailable'
    };
  }
}

export default new AIService();