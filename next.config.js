/** @type {import('next').NextConfig} */

const nextConfig = {
  // Resim optimizasyonu
  images: {
    domains: ['*'],
    formats: ['image/webp'],
  },
  // Strict mode'u devre dışı bırak
  reactStrictMode: false,
};

module.exports = nextConfig; 