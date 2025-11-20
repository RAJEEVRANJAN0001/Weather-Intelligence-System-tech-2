# Quick Deployment Checklist

## 📋 Before Deployment

- [ ] MongoDB Atlas database created and accessible
- [ ] All API keys obtained:
  - OpenWeatherMap API key
  - Unsplash Access Key
  - YouTube API Key
  - News API Key (if needed)
- [ ] JWT secret generated (32+ character random string)
- [ ] Code committed to GitHub repository

## 🚀 Vercel Deployment Steps

### 1. Import to Vercel
- Go to https://vercel.com/new
- Import your GitHub repository
- Framework Preset: **Other**
- Build Command: `npm run vercel-build`
- Output Directory: `frontend/build`

### 2. Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

**Backend Variables:**
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENWEATHER_API_KEY=your_openweather_key
UNSPLASH_ACCESS_KEY=your_unsplash_key
YOUTUBE_API_KEY=your_youtube_key
NEWS_API_KEY=your_news_key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

**Frontend Variables:**
```
REACT_APP_GRAPHQL_URI=https://your-app.vercel.app/graphql
REACT_APP_API_BASE_URL=https://your-app.vercel.app
```

### 3. Deploy
- Click **Deploy** button
- Wait for build to complete (3-5 minutes)
- Get your deployment URL

### 4. Post-Deployment
- Update `FRONTEND_URL` with your actual Vercel URL
- Redeploy if needed
- Test endpoints:
  - Health: `https://your-app.vercel.app/health`
  - GraphQL: `https://your-app.vercel.app/graphql`
  - Frontend: `https://your-app.vercel.app`

## ✅ Verification

Test these after deployment:
- [ ] Frontend loads correctly
- [ ] GraphQL playground accessible
- [ ] User registration/login works
- [ ] Weather search functionality works
- [ ] All API integrations working

## 🔧 Troubleshooting

**Build fails?**
- Check build logs in Vercel dashboard
- Verify all environment variables are set

**API not responding?**
- Check function logs in Vercel
- Verify MongoDB connection string
- Ensure MongoDB allows connections from 0.0.0.0/0

**CORS errors?**
- Update FRONTEND_URL to match your Vercel domain
- Clear browser cache

## 📚 Documentation

Full guide: See `VERCEL_DEPLOYMENT.md`
Environment variables template: See `.env.example`

## 🎉 Success!

Your Weather Intelligence System is now live on Vercel! 🌦️
