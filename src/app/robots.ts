import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/onboarding/'],
    },
    sitemap: 'https://cre-flow.site/sitemap.xml',
  }
}
