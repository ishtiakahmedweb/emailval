import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://veriflow.dev';
  const now = new Date();

  const staticRoutes = [
    { url: baseUrl, changeFrequency: 'monthly' as const, priority: 1.0 },
    { url: `${baseUrl}/auth/login`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/auth/signup`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/dashboard`, changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${baseUrl}/dashboard/billing`, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/dashboard/bulk`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/dashboard/api-keys`, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${baseUrl}/dashboard/history`, changeFrequency: 'weekly' as const, priority: 0.4 },
    { url: `${baseUrl}/dashboard/settings`, changeFrequency: 'monthly' as const, priority: 0.3 },
  ];

  return staticRoutes.map((route) => ({
    url: route.url,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
