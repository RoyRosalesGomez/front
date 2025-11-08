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
};

module.exports = nextConfig;
