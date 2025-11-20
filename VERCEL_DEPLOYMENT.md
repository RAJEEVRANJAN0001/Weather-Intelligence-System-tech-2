# Vercel Deployment Guide

## Prerequisites
- A Vercel account (https://vercel.com)
- MongoDB Atlas account (or any cloud MongoDB)
- API keys for all services used in the project

## Environment Variables

You need to set the following environment variables in your Vercel project settings:

### Backend Environment Variables

1. **Database**
   - `MONGODB_URI` - Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/weather-db?retryWrites=true&w=majority`

2. **API Keys**
   - `OPENWEATHER_API_KEY` - OpenWeatherMap API key
   - `UNSPLASH_ACCESS_KEY` - Unsplash API access key
   - `YOUTUBE_API_KEY` - YouTube Data API key
   - `NEWS_API_KEY` - News API key (if applicable)

3. **JWT Secret**
   - `JWT_SECRET` - Secret key for JWT token generation
   - Example: Generate a random string (32+ characters)

4. **Rate Limiting**
   - `RATE_LIMIT_WINDOW_MS` - Default: `900000` (15 minutes)
   - `RATE_LIMIT_MAX_REQUESTS` - Default: `100`

5. **Frontend URL**
   - `FRONTEND_URL` - Your Vercel frontend URL
   - Example: `https://your-app.vercel.app`

6. **Node Environment**
   - `NODE_ENV` - Set to `production`

### Frontend Environment Variables

1. **GraphQL Endpoint**
   - `REACT_APP_GRAPHQL_URI` - Your Vercel backend GraphQL endpoint
   - Example: `https://your-app.vercel.app/graphql`

2. **API Base URL**
   - `REACT_APP_API_BASE_URL` - Your Vercel backend base URL
   - Example: `https://your-app.vercel.app`

## Deployment Steps

### 1. Prepare Your Repository
```bash
# Make sure all files are committed
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import Project to Vercel

1. Go to https://vercel.com/new
2. Import your Git repository
3. Select the repository: `Weather-Intelligence-System-tech-2`
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `frontend/build`

### 3. Add Environment Variables

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add all the environment variables listed above
3. Make sure to add them for all environments (Production, Preview, Development)

### 4. Deploy

1. Click **Deploy**
2. Wait for the build to complete
3. Your application will be available at `https://your-project.vercel.app`

## Post-Deployment

### Update Frontend URL
After deployment, update the `FRONTEND_URL` environment variable with your actual Vercel URL:
1. Go to **Settings** → **Environment Variables**
2. Update `FRONTEND_URL` to your Vercel URL (e.g., `https://your-app.vercel.app`)
3. Redeploy the application

### Test Your Deployment

1. **Health Check**: Visit `https://your-app.vercel.app/health`
2. **GraphQL Playground**: Visit `https://your-app.vercel.app/graphql`
3. **Frontend**: Visit `https://your-app.vercel.app`

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### API Not Working
- Check MongoDB connection string
- Verify all API keys are valid
- Check function logs in Vercel dashboard

### CORS Issues
- Update `FRONTEND_URL` environment variable
- Clear browser cache
- Check CORS configuration in `backend/server.js`

### Database Connection Issues
- Ensure MongoDB Atlas allows connections from `0.0.0.0/0` (anywhere)
- Verify MongoDB connection string is correct
- Check if IP whitelist includes Vercel IPs

## Continuous Deployment

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you create a pull request or push to other branches

## Local Development

To continue local development:
```bash
# Install dependencies
npm run install-all

# Start development servers
npm run dev
```

## Important Notes

1. **Serverless Functions**: Backend runs as serverless functions with cold starts
2. **MongoDB Connection**: Use connection pooling for better performance
3. **Environment Variables**: Never commit `.env` files to Git
4. **API Rate Limits**: Monitor your API usage to avoid hitting rate limits
5. **Free Tier Limits**: Be aware of Vercel free tier limitations

## Support

For issues or questions:
- Vercel Documentation: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com/
- GitHub Issues: [Create an issue in your repository]

## License
MIT
