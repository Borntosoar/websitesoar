/** @type {import('next').NextConfig} */
const isExport = process.env.PAGES_EXPORT === "1";
const base = process.env.PAGES_BASE_PATH || "/websitesoar/static";

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: isExport,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // Static export for GitHub Pages preview at /websitesoar/static
  ...(isExport ? { output: "export", basePath: base, assetPrefix: base, trailingSlash: true } : {}),
};

export default nextConfig;
