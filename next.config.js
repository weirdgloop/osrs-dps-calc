/** @type {import('next').NextConfig} */
const {execSync} = require("node:child_process");

let gitSha = undefined,
  gitShaShort = "unknown",
  gitDirty = "false";
try {
  gitSha = execSync("git rev-parse HEAD").toString().trim();
  gitShaShort = execSync("git rev-parse --short HEAD").toString().trim();
  gitDirty = execSync("git status --untracked-files=no --porcelain").toString().trim();
  if (gitDirty !== "") {
    gitDirty = "true";
  }
} catch (e) {
  console.warn(`No git data available, building without`);
}

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
  env: {
    GIT_SHA: gitSha,
    GIT_SHA_SHORT: gitShaShort,
    GIT_DIRTY: gitDirty,
  },
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
