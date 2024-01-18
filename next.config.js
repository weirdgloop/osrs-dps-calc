/** @type {import('next').NextConfig} */
const shouldAnalyse = process.env.ANALYSE === 'true';

let nextConfig = {
  output: 'export',
  reactStrictMode: true,
  basePath: '/osrs-dps',
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
    return [
      {
        source: '/',
        destination: '/osrs-dps',
        basePath: false,
        permanent: true
      }
    ]
  }
}

if (shouldAnalyse) {
  const withNextBundleAnalyzer = require('@next/bundle-analyzer')();
  nextConfig = withNextBundleAnalyzer(nextConfig);
}

module.exports = nextConfig
