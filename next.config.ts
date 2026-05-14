import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactCompiler: false,
    poweredByHeader: false,
    images: {
        // ✅ Enable Next.js Image Optimization (auto WebP, resize, optimize)
        unoptimized: false,
        // Use WebP with high quality
        formats: ['image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        // Cache optimized images for 31 days
        minimumCacheTTL: 2678400,
    },
    compress: true,
    experimental: {
        serverComponentsHmrCache: false,
        // Optimize CSS
        optimizePackageImports: ['@fortawesome/react-fontawesome'],
    },
};

export default nextConfig;
