import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://borntosoar.com";

// When the gate is on (pre-launch), keep the whole site out of search. When
// it's open, allow everything except the gate page and point at the sitemap.
export default function robots(): MetadataRoute.Robots {
  const gated = Boolean(process.env.SOAR_ACCESS_PASSWORD);
  if (gated) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/access"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
