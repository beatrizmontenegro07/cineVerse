import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Preserve Django's trailing slashes when forwarding API requests.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [{ source: '/api/:path*', destination: 'http://backend:8000/api/:path*/' }];
  },
};

export default nextConfig;
