/** @type {import('next').NextConfig} */

// Static export + basePath are applied ONLY for GitHub Pages builds (when
// PAGES_EXPORT=1). Local `npm run dev` and Vercel get the normal config, so the
// design stays byte-identical across targets — nothing is lost.
const isExport = process.env.PAGES_EXPORT === "1";
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig = {
  images: {
    unoptimized: isExport,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
  ...(isExport
    ? {
        output: "export",
        basePath,
        assetPrefix: basePath || undefined,
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
