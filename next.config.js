/** @type {import('next').NextConfig} */
const shouldAnalyse = process.env.ANALYSE === 'true';

let nextConfig = {
  output: 'export',
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  images: {
    unoptimized: true,
    domains: ['runescape.wiki', 'oldschool.runescape.wiki'],
  },
  transpilePackages: [
    'd3',
    'd3-array',
    'internmap'
  ],
  async redirects() {
    if (process.env.NEXT_PUBLIC_BASE_PATH) {
      return [
        {
          source: '/',
          destination: process.env.NEXT_PUBLIC_BASE_PATH,
          basePath: false,
          permanent: true
        }
      ]
    } else {
      return [];
    }
  }
}

if (shouldAnalyse) {
  const withNextBundleAnalyzer = require('@next/bundle-analyzer')();
  nextConfig = withNextBundleAnalyzer(nextConfig);
}

module.exports = nextConfig
