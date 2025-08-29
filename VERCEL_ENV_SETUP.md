# Vercel Environment Variables Setup

## Required Environment Variables

Add these environment variables in your Vercel project dashboard under **Settings > Environment Variables**:

### 1. MongoDB Connection
```
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database?retryWrites=true&w=majority
```

### 2. API Base URL (Optional - for production)
```
NEXT_PUBLIC_API_BASE_URL=https://your-domain.vercel.app/api
```

## How to Set Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** tab
4. Click on **Environment Variables**
5. Add each variable:
   - **Name**: `MONGODB_URI`
   - **Value**: Your MongoDB connection string
   - **Environment**: Select all environments (Production, Preview, Development)
6. Click **Save**

## Important Notes:

- **MONGODB_URI**: This is the most critical environment variable. Make sure your MongoDB Atlas cluster allows connections from Vercel's IP addresses.
- **NEXT_PUBLIC_API_BASE_URL**: Only needed if you want to override the default API base URL. If not set, it will default to `/api`.
- All environment variables marked with `NEXT_PUBLIC_` prefix will be available in the browser.
- Variables without `NEXT_PUBLIC_` prefix are only available on the server side.

## MongoDB Atlas Setup for Vercel:

1. In MongoDB Atlas, go to **Network Access**
2. Add IP address: `0.0.0.0/0` (allows all IPs) or add Vercel's IP ranges
3. Make sure your database user has the necessary permissions
4. Use the connection string from MongoDB Atlas dashboard

## Testing Environment Variables:

After deployment, you can test your MongoDB connection by visiting:
```
https://your-domain.vercel.app/api/test-connection
```

This should return a success response if your environment variables are configured correctly.

