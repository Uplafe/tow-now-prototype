/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.mapbox\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'mapbox-cache',
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
      },
    },
    {
      urlPattern: /^https:\/\/events\.mapbox\.com\/.*/i,
      handler: 'NetworkOnly',
    },
  ],
})

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['randomuser.me', 'api.mapbox.com'],
  },
}

module.exports = withPWA(nextConfig)
