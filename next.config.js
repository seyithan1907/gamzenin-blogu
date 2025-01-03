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
    TINYMCE_API_KEY: '4bxgbqh0ynkjf8mzgqz0y7rkwjvkq7fn5gqek8vg1uo1c2dk'
  }
};

module.exports = nextConfig; 