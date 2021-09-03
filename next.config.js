/** @type {import('next').NextConfig} */
module.exports = {
  webpack5: true,
  reactStrictMode: true,
  distDir: 'dist/.next',
  pageExtensions: ['page.tsx', 'api.tsx', 'page.ts', 'api.ts'],
  webpack: (config) => {
    config.externals.push({ 'alt-client': 'alt-client' })
    config.externals.push({ 'alt-server': 'alt-server' })
    config.externals.push({ 'alt-shared': 'alt-shared' })
    return config;
  },
}
