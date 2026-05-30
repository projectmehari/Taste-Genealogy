/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  output: 'export',
  outputFileTracingRoot: new URL('.', import.meta.url).pathname,
  serverExternalPackages: ['@napi-rs/canvas'],
  trailingSlash: true,
}

export default nextConfig
