/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/presenter',
  assetPrefix: '/presenter',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

export default nextConfig
