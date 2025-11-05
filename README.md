# PPC Marketing Assistant

A comprehensive Google Ads management platform built with React and Vite, featuring server-side API integration for secure Google Ads API access.

## 🚀 Quick Start

### Frontend Application
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Google Ads API Server
The application requires a server-side proxy to handle Google Ads API requests and avoid CORS issues.

```bash
# Navigate to server directory
cd server

# Install server dependencies
npm install

# Configure server environment
cp .env.example .env
# Edit server/.env with your Google Ads API credentials

# Start the API server
npm start
```

**Important**: Both the frontend (port 3000) and server (port 3001) must be running for full functionality.

## 🔧 Google Ads API Setup

### 1. Server Configuration
The server handles all Google Ads API communication securely:

- **Environment**: Configure `server/.env` with your Google Ads credentials
- **Authentication**: Supports both OAuth2 and Service Account authentication
- **CORS**: Handles cross-origin requests from the frontend
- **Security**: Rate limiting, request logging, and secure credential management

### 2. Frontend Configuration  
The frontend communicates only with the server proxy:

- **API Client**: `src/utils/googleAdsApiClient.js`
- **Base URL**: Configured via `VITE_API_BASE_URL` environment variable
- **No Direct API Calls**: All Google Ads requests go through server proxy

### 3. Connection Testing
Use the "API Integration Center" in the application to:

- Test server connection and authentication
- Execute GAQL queries
- Monitor connection status
- View detailed error messages and suggestions

## 📁 Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Application pages
│   │   ├── google-adwords-integration/  # Google Ads integration
│   │   ├── keyword-research-optimization-center/
│   │   ├── competitive-intelligence-dashboard/
│   │   └── ...
│   └── utils/
│       ├── googleAdsApiClient.js      # Frontend API client
│       └── googleAdsService.js        # Legacy service (fallback)
├── server/
│   ├── server.js           # Express server for Google Ads API proxy
│   ├── package.json        # Server dependencies
│   ├── .env               # Server environment variables
│   └── README.md          # Server documentation
└── package.json           # Frontend dependencies
```

## 🔑 Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_GOOGLE_ADS_CUSTOMER_ID=942-196-4548
# Other Google Ads credentials (for reference only)
```

### Server (server/.env)  
```env
GADS_DEVELOPER_TOKEN=your-developer-token
LOGIN_CUSTOMER_ID=942196548
GOOGLE_CLIENT_ID=your-oauth-client-id
GOOGLE_CLIENT_SECRET=your-oauth-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## 🧪 Testing the Integration

### 1. Server Health Check
```bash
curl http://localhost:3001/api/health
```

### 2. Authentication Test
```bash
curl http://localhost:3001/api/ads/test-auth
```

### 3. Frontend Integration Test
1. Open the application at `http://localhost:3000`
2. Navigate to "Google AdWords Integration"
3. Check the "Server-Side API Proxy" panel
4. Click "Test Connection" to verify setup

## 🐛 Troubleshooting

### "Server health check failed" Error
This error occurs when the server is not running or unreachable:

1. **Start the Server**: `cd server && npm start`
2. **Check Port**: Ensure server runs on port 3001
3. **Verify Environment**: Check `server/.env` configuration
4. **Check Logs**: Look for server startup errors

### CORS Errors
If you see CORS-related errors:

1. **Use Server Proxy**: Never call Google Ads API directly from frontend
2. **Check FRONTEND_URL**: Ensure `server/.env` has correct frontend URL
3. **Server Running**: Verify server is running and accessible

### Authentication Failures
For authentication issues:

1. **Check Credentials**: Verify all Google Ads API credentials in `server/.env`
2. **Developer Token**: Ensure token is approved and active
3. **Customer ID**: Use MCC ID without dashes in `LOGIN_CUSTOMER_ID`
4. **Refresh Token**: Regenerate if OAuth2 token expired

## 🔒 Security Notes

- **No Frontend Secrets**: Google Ads credentials are only in server environment
- **CORS Protection**: Server validates origins and headers
- **Rate Limiting**: API requests are throttled to prevent abuse
- **Environment Isolation**: Frontend and server environments are separate

## 📡 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Server  
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

## 🏗️ Built With

- **Frontend**: React 18, Vite, Tailwind CSS
- **Server**: Express.js, Google APIs Node.js Client
- **Authentication**: Google OAuth2 / Service Account
- **API**: Google Ads API v21