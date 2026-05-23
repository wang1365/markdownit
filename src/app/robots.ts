import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/private/"]
      }
    ],
    sitemap: "https://markdownit.online/sitemap.xml",
    host: "https://markdownit.online"
  };
}
