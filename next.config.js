/** @type {import('next').NextConfig} */
module.exports = {
  webpack5: true,
  reactStrictMode: true,
  distDir: 'dist/next',
  webpack: (config) => {
    config.resolve.fallback = { 
      "alt-client": false,
      "alt-server": false,
      "alt-shared": false,
    };
    return config;
  },
}
