/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.ko-fi.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
