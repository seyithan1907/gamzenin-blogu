/** @type {import('next').NextConfig} */

const nextConfig = {
  // Resim optimizasyonu
  images: {
    domains: ['*'],
    formats: ['image/webp'],
  },
  // Strict mode'u devre dışı bırak
  reactStrictMode: false,
  env: {
    TINYMCE_API_KEY: '7nypjsdnr897d1t2j0psecllg4pct25cqbzw2xqcthksbok5'
  }
};

module.exports = nextConfig; 