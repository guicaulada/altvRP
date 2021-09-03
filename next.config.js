/** @type {import('next').NextConfig} */
const npm_package = require('./package.json')
const path = require('path')
module.exports = {
  webpack5: true,
  reactStrictMode: true,
  distDir: 'dist/.next',
  pageExtensions: ['page.tsx', 'api.tsx', 'page.ts', 'api.ts'],
  webpack: (config) => {
    config.externals.push({ 'alt-client': 'alt-client' })
    config.externals.push({ 'alt-server': 'alt-server' })
    config.externals.push({ 'alt-shared': 'alt-shared' })
    config.externals.push({ '@server': '@server' })
    config.externals.push({ '@client': '@client' })
    config.externals.push({ '@plugins': '@plugins' })
    for (const [key, value] of Object.entries(npm_package._moduleAliases)) {
      config.resolve.alias[key] = path.resolve(value)
    }
    return config;
  },
}
