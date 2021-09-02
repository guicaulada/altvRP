/** @type {import('next').NextConfig} */
module.exports = {
  webpack5: true,
  reactStrictMode: true,
  distDir: 'dist/next',
  pageExtensions: ['page.tsx', 'api.tsx', 'page.ts', 'api.ts'],
  webpack: (config) => {
    config.resolve.fallback = { 
      "alt-client": false,
      "alt-server": false,
      "alt-shared": false,
    };
    return config;
  },
}
