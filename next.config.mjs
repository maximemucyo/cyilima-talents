/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas'];
    }
    return config;
  },
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: './lib/utils/mock-canvas.js',
      },
    },
  },
}

export default nextConfig
