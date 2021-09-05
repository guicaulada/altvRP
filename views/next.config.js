/** @type {import('next').NextConfig} */
const pkg = require('./package.json')
const path = require('path')
module.exports = {
  webpack5: true,
  reactStrictMode: true,
  distDir: '.next',
  pageExtensions: ['page.tsx', 'api.tsx', 'page.ts', 'api.ts'],
  webpack: (config) => {
    for (const [key, value] of Object.entries(pkg._moduleAliases)) {
      config.resolve.alias[key] = path.resolve(value)
    }
    return config;
  },
}
