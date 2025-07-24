# Deploying SecureSight to Netlify

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- A Netlify account

## Project Setup

This project is configured to deploy on Netlify with Next.js 14.2.0. The configuration is defined in the `netlify.toml` file.

## Environment Variables

Make sure to set up the following environment variables in your Netlify dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://izqlbmddkywgdvxzybod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Your Supabase Anon Key]
```

Note: For security reasons, we don't store sensitive keys in the repository.

## Deployment Steps

### Option 1: Deploy via Netlify UI

1. Log in to your Netlify account
2. Click "New site from Git"
3. Connect to your Git provider and select the repository
4. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Click "Deploy site"

### Option 2: Deploy via Netlify CLI

1. Install the Netlify CLI: `npm install -g netlify-cli`
2. Log in to Netlify: `netlify login`
3. Initialize your site: `netlify init`
4. Deploy your site: `netlify deploy --prod`

## Build Command

The build command is set to `npm run build` in the netlify.toml file. This will run Next.js build process.

## Local Development

To run the project locally:

```bash
npm install
npm run dev
```

The site will be available at http://localhost:4028

## Troubleshooting

If you encounter any issues during deployment:

1. Check the Netlify build logs for errors
2. Verify that all environment variables are correctly set
3. Make sure your Next.js version (14.2.0) is compatible with the @netlify/plugin-nextjs plugin
4. Check that the API routes are properly configured with `export const dynamic = 'force-dynamic'`