# API Directory

This directory contains the serverless function entry point for Vercel deployment.

## File Structure

- `index.js` - Main serverless function handler that serves the entire backend API
- `package.json` - Dependencies required for the serverless function

## How It Works

When deployed to Vercel, this function handles:
- GraphQL endpoint (`/graphql`)
- REST API routes (`/api/*`)
- Health check endpoint (`/health`)

The function automatically connects to MongoDB using connection pooling to optimize for serverless cold starts.

## Local Development

For local development, use the main `backend/server.js` file instead:

```bash
npm run dev
```

This API directory is specifically for Vercel's serverless environment.
