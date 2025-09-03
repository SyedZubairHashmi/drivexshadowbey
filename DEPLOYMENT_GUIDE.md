# Vercel Deployment Guide for DriveX Deal

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **MongoDB Atlas**: Set up a MongoDB Atlas cluster

## Step-by-Step Deployment

### 1. Connect Your Repository

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository
4. Select the repository containing your DriveX Deal project

### 2. Configure Project Settings

Vercel will automatically detect that this is a Next.js project. The configuration is already set in `vercel.json`:

- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Root Directory**: `/` (root of your repository)

### 3. Set Environment Variables

**IMPORTANT**: Set these environment variables before deploying:

1. In the Vercel project setup, go to **Environment Variables** section
2. Add the following variables:

```
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/drivex?retryWrites=true&w=majority
```

3. Make sure to select all environments (Production, Preview, Development)

### 4. Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Install dependencies (`npm install`)
   - Build the project (`npm run build`)
   - Deploy to production

### 5. Post-Deployment Setup

#### MongoDB Atlas Configuration

1. Go to your MongoDB Atlas dashboard
2. Navigate to **Network Access**
3. Add IP address: `0.0.0.0/0` (allows all IPs)
4. Or add Vercel's specific IP ranges if you prefer

#### Test Your Deployment

1. Visit your deployed URL (e.g., `https://your-project.vercel.app`)
2. Test the MongoDB connection: `https://your-project.vercel.app/api/test-connection`
3. Should return: `{"success": true, "message": "MongoDB connection successful"}`

## Build Commands Summary

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start production server (not needed for Vercel)
npm start
```

## Output Directory

- **Build Output**: `.next/` (Next.js build output)
- **Static Files**: `public/` (served directly)
- **API Routes**: `app/api/` (serverless functions)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ Yes | MongoDB connection string |
| `NEXT_PUBLIC_API_BASE_URL` | ❌ No | API base URL (defaults to `/api`) |

## Troubleshooting

### Common Issues

1. **Build Fails**: Check if all dependencies are in `package.json`
2. **MongoDB Connection Fails**: Verify `MONGODB_URI` environment variable
3. **API Routes Not Working**: Check if MongoDB Atlas allows connections from Vercel

### Debug Commands

```bash
# Test MongoDB connection locally
curl http://localhost:3000/api/test-connection

# Check build output
npm run build

# Test production build locally
npm run build && npm start
```

## Custom Domain Setup

1. In Vercel dashboard, go to **Settings > Domains**
2. Add your custom domain
3. Configure DNS records as instructed by Vercel

## Monitoring

- **Vercel Analytics**: Available in dashboard
- **Function Logs**: Check Vercel dashboard for API route logs
- **Performance**: Use Vercel's built-in performance monitoring

## Security Notes

- Never commit `.env` files to Git
- Use environment variables for all sensitive data
- MongoDB Atlas should have proper authentication and network access configured



