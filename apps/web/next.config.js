/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ['@if/ui', '@if/mdx-relations'],
  typescript: {
    ignoreBuildErrors: true,
  },
};
