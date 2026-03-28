import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'covers.openlibrary.org',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'vyqrge2g9stv97pl.public.blob.vercel-storage.com',
                pathname: '/**',
            }
        ]
    }
};

export default nextConfig;
