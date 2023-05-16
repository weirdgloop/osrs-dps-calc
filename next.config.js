/** @type {import('next').NextConfig} */
const shouldAnalyse = process.env.ANALYSE === 'true';

let nextConfig = {
  output: 'export',
  basePath: '/osrs-dps-calc',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['runescape.wiki', 'oldschool.runescape.wiki'],
  },
}

if (shouldAnalyse) {
  const withNextBundleAnalyzer = require('@next/bundle-analyzer')();
  nextConfig = withNextBundleAnalyzer(nextConfig);
}

module.exports = nextConfig
