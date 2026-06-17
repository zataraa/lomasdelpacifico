import type { MetadataRoute } from "next";

import { site } from "@config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      alternates: { languages: { en: site.url, es: `${site.url}/es` } },
    },
    { url: `${site.url}/es`, lastModified: new Date() },
  ];
}
