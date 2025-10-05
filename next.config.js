// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'export',
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: { unoptimized: true },
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },

  async rewrites() {
    return [
      // Todo lo que empiece con /backend lo proxyea al backend Nest
      { source: '/backend/:path*', destination: 'http://localhost:3002/api/:path*' },
    ];
  },
};

module.exports = nextConfig;


