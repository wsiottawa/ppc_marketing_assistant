require('dotenv')?.config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app?.use(helmet());
app?.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app?.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'developer-token', 
    'login-customer-id'
  ],
  credentials: true
};

app?.use(cors(corsOptions));

// Body parsing middleware
app?.use(express?.json({ limit: '10mb' }));
app?.use(express?.urlencoded({ extended: true }));

// Environment variables validation
const requiredEnvVars = [
  'GADS_DEVELOPER_TOKEN',
  'LOGIN_CUSTOMER_ID'
];

const missingEnvVars = requiredEnvVars?.filter(envVar => !process.env[envVar]);
if (missingEnvVars?.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

// Google Ads API configuration
let googleAdsClient = null;
let authClient = null;

// Initialize Google Auth
async function initializeGoogleAuth() {
  try {
    // Check if we have service account JSON
    if (process.env.SERVICE_ACCOUNT_JSON) {
      console.log('🔐 Initializing with Service Account...');
      const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
      
      authClient = new GoogleAuth({
        credentials: serviceAccount,
        scopes: ['https://www.googleapis.com/auth/adwords']
      });
      
      console.log('✅ Service Account authentication initialized');
    } 
    // Use OAuth2 credentials
    else if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
      console.log('🔐 Initializing with OAuth2...');
      
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_OAUTH_REDIRECT_URI
      );
      
      oauth2Client?.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
      });
      
      authClient = oauth2Client;
      console.log('✅ OAuth2 authentication initialized');
    } else {
      throw new Error('No authentication method configured. Please provide either SERVICE_ACCOUNT_JSON or OAuth2 credentials.');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Google Auth:', error?.message);
    throw error;
  }
}

// Get access token
async function getAccessToken() {
  try {
    if (!authClient) {
      await initializeGoogleAuth();
    }
    
    let accessTokenResponse;
    
    if (authClient?.getAccessToken) {
      // Service Account
      accessTokenResponse = await authClient?.getAccessToken();
    } else {
      // OAuth2
      accessTokenResponse = await authClient?.getAccessToken();
    }
    
    const token = accessTokenResponse?.token || accessTokenResponse;
    
    if (!token) {
      throw new Error('No access token received');
    }
    
    return token;
  } catch (error) {
    console.error('❌ Failed to get access token:', error);
    throw new Error(`Authentication failed: ${error.message}`);
  }
}

// CORS preflight handler for all /api/ads/* routes
app?.options('/api/ads/*', (req, res) => {
  res?.set({
    'Access-Control-Allow-Origin': corsOptions?.origin,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': corsOptions?.allowedHeaders?.join(','),
    'Access-Control-Allow-Credentials': 'true'
  });
  res?.sendStatus(200);
});

// Google Ads search proxy endpoint
app?.post('/api/ads/search', async (req, res) => {
  try {
    const { gaql, customerId } = req?.body || {};
    
    if (!gaql) {
      return res?.status(400)?.json({ 
        error: 'Missing GAQL query',
        details: 'Request body must include "gaql" field with the Google Ads Query Language query'
      });
    }
    
    // Use provided customerId or default to LOGIN_CUSTOMER_ID
    const customerIdToUse = customerId || process.env.LOGIN_CUSTOMER_ID?.replace(/\D/g, '');
    
    if (!customerIdToUse) {
      return res?.status(400)?.json({
        error: 'No customer ID provided',
        details: 'Please provide customerId in request body or configure LOGIN_CUSTOMER_ID environment variable'
      });
    }
    
    console.log(`📊 Executing GAQL query for customer ${customerIdToUse}:`, gaql);
    
    // Get fresh access token
    const accessToken = await getAccessToken();
    
    // Prepare request to Google Ads API
    const googleAdsUrl = `https://googleads.googleapis.com/v21/customers/${customerIdToUse}/googleAds:search`;
    
    const requestHeaders = {
      'Authorization': `Bearer ${accessToken}`,
      'developer-token': process.env.GADS_DEVELOPER_TOKEN,
      'Content-Type': 'application/json'
    };
    
    // Add login-customer-id header if different from target customer
    if (process.env.LOGIN_CUSTOMER_ID?.replace(/\D/g, '') !== customerIdToUse) {
      requestHeaders['login-customer-id'] = process.env.LOGIN_CUSTOMER_ID?.replace(/\D/g, '');
    }
    
    const requestBody = {
      query: gaql,
      pageSize: req?.body?.pageSize || 1000
    };
    
    console.log('📤 Forwarding request to Google Ads API...');
    
    // Forward request to Google Ads API
    const fetch = (await import('node-fetch'))?.default;
    const response = await fetch(googleAdsUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestBody)
    });
    
    const responseText = await response?.text();
    const contentType = response?.headers?.get('content-type') || 'application/json';
    
    console.log(`📥 Google Ads API response: ${response?.status} ${response?.statusText}`);
    
    // Set CORS headers on response
    res?.set({
      'Access-Control-Allow-Origin': corsOptions?.origin,
      'Access-Control-Allow-Credentials': 'true',
      'Vary': 'Origin'
    });
    
    // Forward response status and body
    res?.status(response?.status)?.type(contentType)?.send(responseText);
      
  } catch (error) {
    console.error('❌ Search proxy error:', error);
    
    res?.status(500)?.set({
        'Access-Control-Allow-Origin': corsOptions?.origin,
        'Access-Control-Allow-Credentials': 'true'
      })?.json({
        error: 'Internal server error',
        message: 'Failed to execute Google Ads search request',
        details: error?.message,
        timestamp: new Date()?.toISOString()
      });
  }
});

// Customer list endpoint
app?.get('/api/ads/customers', async (req, res) => {
  try {
    console.log('👥 Fetching accessible customers...');
    
    const accessToken = await getAccessToken();
    
    const googleAdsUrl = 'https://googleads.googleapis.com/v21/customers:listAccessibleCustomers';
    
    const requestHeaders = {
      'Authorization': `Bearer ${accessToken}`,
      'developer-token': process.env.GADS_DEVELOPER_TOKEN
    };
    
    const fetch = (await import('node-fetch'))?.default;
    const response = await fetch(googleAdsUrl, {
      method: 'GET',
      headers: requestHeaders
    });
    
    const responseText = await response?.text();
    const contentType = response?.headers?.get('content-type') || 'application/json';
    
    console.log(`📥 Accessible customers response: ${response?.status}`);
    
    res?.set({
      'Access-Control-Allow-Origin': corsOptions?.origin,
      'Access-Control-Allow-Credentials': 'true',
      'Vary': 'Origin'
    });
    
    res?.status(response?.status)?.type(contentType)?.send(responseText);
      
  } catch (error) {
    console.error('❌ Customers endpoint error:', error);
    
    res?.status(500)?.set({
        'Access-Control-Allow-Origin': corsOptions?.origin,
        'Access-Control-Allow-Credentials': 'true'
      })?.json({
        error: 'Failed to fetch customers',
        details: error?.message,
        timestamp: new Date()?.toISOString()
      });
  }
});

// OAuth callback endpoint (if using OAuth2 flow)
app?.get('/api/oauth/callback', async (req, res) => {
  try {
    const { code, state, error } = req?.query;
    
    if (error) {
      return res?.status(400)?.json({
        error: 'OAuth authorization failed',
        details: error,
        description: req?.query?.error_description
      });
    }
    
    if (!code) {
      return res?.status(400)?.json({
        error: 'No authorization code received'
      });
    }
    
    console.log('🔄 Processing OAuth callback...');
    
    // Exchange code for tokens (implement based on your OAuth flow)
    // This is a placeholder - implement token exchange logic
    
    res?.json({
      success: true,
      message: 'OAuth callback processed successfully',
      // Don't return actual tokens for security
      timestamp: new Date()?.toISOString()
    });
    
  } catch (error) {
    console.error('❌ OAuth callback error:', error);
    res?.status(500)?.json({
      error: 'OAuth callback failed',
      details: error?.message
    });
  }
});

// Health check endpoint
app?.get('/api/health', (req, res) => {
  res?.json({
    status: 'healthy',
    timestamp: new Date()?.toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test authentication endpoint
app?.get('/api/ads/test-auth', async (req, res) => {
  try {
    console.log('🧪 Testing authentication...');
    
    const accessToken = await getAccessToken();
    
    res?.set({
      'Access-Control-Allow-Origin': corsOptions?.origin,
      'Access-Control-Allow-Credentials': 'true'
    });
    
    res?.json({
      authenticated: true,
      tokenReceived: !!accessToken,
      timestamp: new Date()?.toISOString(),
      message: 'Authentication successful'
    });
    
  } catch (error) {
    console.error('❌ Auth test failed:', error);
    
    res?.set({
      'Access-Control-Allow-Origin': corsOptions?.origin,
      'Access-Control-Allow-Credentials': 'true'
    });
    
    res?.status(401)?.json({
      authenticated: false,
      error: error?.message,
      timestamp: new Date()?.toISOString()
    });
  }
});

// Error handling middleware
app?.use((err, req, res, next) => {
  console.error('💥 Unhandled error:', err);
  
  res?.set({
    'Access-Control-Allow-Origin': corsOptions?.origin,
    'Access-Control-Allow-Credentials': 'true'
  });
  
  res?.status(500)?.json({
    error: 'Internal server error',
    message: err?.message || 'An unexpected error occurred',
    timestamp: new Date()?.toISOString()
  });
});

// 404 handler
app?.use('*', (req, res) => {
  res?.set({
    'Access-Control-Allow-Origin': corsOptions?.origin,
    'Access-Control-Allow-Credentials': 'true'
  });
  
  res?.status(404)?.json({
    error: 'Not found',
    message: `Route ${req?.method} ${req?.originalUrl} not found`,
    timestamp: new Date()?.toISOString()
  });
});

// Initialize server
async function startServer() {
  try {
    // Test authentication on startup
    console.log('🚀 Starting Google Ads API Server...');
    console.log('🔐 Testing authentication...');
    
    await initializeGoogleAuth();
    await getAccessToken();
    
    console.log('✅ Authentication test successful');
    
    app?.listen(PORT, () => {
      console.log(`🌟 Server running on port ${PORT}`);
      console.log(`📡 API endpoints available at http://localhost:${PORT}/api/ads/`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🧪 Auth test: http://localhost:${PORT}/api/ads/test-auth`);
    });
    
  } catch (error) {
    console.error('💥 Server startup failed:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 Received SIGINT, shutting down gracefully');
  process.exit(0);
});

startServer();