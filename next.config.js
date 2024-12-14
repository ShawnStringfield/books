/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'books.google.com'
      },
      {
        protocol: 'http',
        hostname: 'books.google.com'
      }
    ]
  }
}

export default nextConfig
