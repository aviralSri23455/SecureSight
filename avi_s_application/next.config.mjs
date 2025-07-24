/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  distDir: process.env.DIST_DIR || '.next',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
  webpack(config) {
    return config;
  },
  // Disable static optimization for API routes
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  // API configuration removed as it's not valid in Next.js 14
};

export default nextConfig;