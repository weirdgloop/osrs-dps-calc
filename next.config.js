/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.runescape.wiki',
        port: '',
      },
    ],
  },
}

module.exports = nextConfig
