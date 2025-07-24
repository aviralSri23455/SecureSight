# Deploying SecureSight to Netlify

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- A Netlify account

## Project Setup

This project is configured to deploy on Netlify with Next.js 14.2.0. The configuration is defined in the `netlify.toml` file located in the root directory of the repository.

The project structure has the main application code in the `avi_s_application` subdirectory, which is specified as the base directory in the Netlify configuration.

## Environment Variables

The project requires the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://izqlbmddkywgdvxzybod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Your Supabase Anon Key]
```

These are set up in three places:

1. `.env` file in the avi_s_application directory (for local development)
2. `.env.development` file (for development environment)
3. Netlify dashboard (for production deployment)

Note: For security reasons, we don't commit the actual Supabase Anon Key to the repository in public repositories.

## Deployment Steps

### Option 1: Deploy via Netlify UI

1. Log in to your Netlify account
2. Click "New site from Git"
3. Connect to your Git provider and select the repository
4. Configure the build settings:
   - Base directory: `avi_s_application`
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

### Important Notes

1. The `package.json` file has been updated to use proper scripts:
   - `npm run dev` - Runs the development server on port 4028
   - `npm run build` - Builds the production version
   - `npm start` - Starts the production server
   - `npm run serve` - Starts the production server on port 4028

2. If you encounter build errors, check the following:
   - Ensure the base directory is correctly set to `avi_s_application`
   - Verify that environment variables are properly set in the Netlify dashboard
   - Check that the publish directory is set to `.next` (relative to the base directory)

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
5. If you see a "package.json not found" error:
   - Verify that the base directory is correctly set to `avi_s_application` in both the Netlify UI and netlify.toml
   - Check that the netlify.toml file is in the root directory of your repository
6. If you see build errors related to Next.js:
   - Check that the Next.js version is compatible with your Node.js version
   - Try clearing the Netlify cache and rebuilding
7. If environment variables aren't being recognized:
   - Double-check that they're correctly set in the Netlify dashboard
   - Ensure they're named exactly as required by the application