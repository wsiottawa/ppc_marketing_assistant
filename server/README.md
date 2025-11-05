# Google Ads API Server

This server provides a secure proxy for Google Ads API requests, handling CORS issues and managing authentication server-side.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment
Copy your Google Ads API credentials to `server/.env`:

```bash
# Copy the template
cp .env.example .env

# Edit with your actual credentials
nano .env
```

**Required Environment Variables:**
```env
GADS_DEVELOPER_TOKEN=your-actual-developer-token
LOGIN_CUSTOMER_ID=your-mcc-customer-id-without-dashes
GOOGLE_CLIENT_ID=your-oauth-client-id
GOOGLE_CLIENT_SECRET=your-oauth-client-secret  
GOOGLE_REFRESH_TOKEN=your-refresh-token
```

### 3. Start Server
```bash
npm start
```

The server will start on `http://localhost:3001`

## 🔧 Environment Setup

### Option A: Copy from Main .env
If you already have Google Ads credentials in your main `.env` file:

1. Open your main `.env` file
2. Copy the values (without `VITE_` prefix) to `server/.env`
3. Example:
   ```
   Main .env: VITE_GOOGLE_ADS_DEVELOPER_TOKEN=abc123
   Server .env: GADS_DEVELOPER_TOKEN=abc123
   ```

### Option B: Manual Configuration  
1. Get your credentials from [Google Ads API Console](https://developers.google.com/google-ads/api)
2. Add them to `server/.env`

## 📡 API Endpoints

- `GET /api/health` - Server health check
- `GET /api/ads/test-auth` - Test authentication
- `POST /api/ads/search` - Execute GAQL queries
- `GET /api/ads/customers` - List accessible customers

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Authentication Test
```bash
curl http://localhost:3001/api/ads/test-auth
```

### GAQL Query Test
```bash
curl -X POST http://localhost:3001/api/ads/search \
  -H "Content-Type: application/json" \
  -d '{
    "gaql": "SELECT customer_client.client_customer, customer_client.descriptive_name FROM customer_client WHERE customer_client.hidden = FALSE LIMIT 10"
  }'
```

## 🔒 Security Features

- **CORS Protection**: Configured for your frontend domain
- **Rate Limiting**: Prevents API abuse
- **Helmet**: Security headers
- **Environment Isolation**: Secrets never exposed to frontend
- **Request Logging**: Morgan for request monitoring

## 🐛 Troubleshooting

### Server Won't Start
1. **Missing Dependencies**: Run `npm install`
2. **Missing .env**: Create `.env` file with credentials
3. **Port 3001 Busy**: Change `PORT` in `.env` or stop other services

### Authentication Errors
1. **Invalid Developer Token**: Check `GADS_DEVELOPER_TOKEN`
2. **Wrong Customer ID**: Verify `LOGIN_CUSTOMER_ID` (no dashes)
3. **Expired Refresh Token**: Regenerate OAuth2 refresh token

### CORS Errors
1. **Wrong Frontend URL**: Update `FRONTEND_URL` in `.env`
2. **Server Not Running**: Ensure server is started on port 3001

### API Request Failures
1. **Check Server Logs**: Look for detailed error messages
2. **Verify Credentials**: Use `/api/ads/test-auth` endpoint
3. **Test with cURL**: Isolate frontend vs server issues

## 📁 File Structure
```
server/
├── server.js          # Main server application
├── package.json       # Dependencies and scripts
├── .env               # Environment variables (create this)
├── start.js           # Startup script with validation
└── README.md          # This documentation
```

## 🔄 Development Mode
```bash
npm install -g nodemon
npm run dev
```

This starts the server with auto-reload on file changes.