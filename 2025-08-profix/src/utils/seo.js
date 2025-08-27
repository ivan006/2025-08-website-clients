// utils/seo.js
export function buildSeoConfig({
                                 title,
                                 description,
                                 url,            // canonical URL (absolute recommended)
                                 image,          // absolute URL to 1200x630 jpg/png
                                 siteName,
                                 sameAs = [],    // social links
                                 type = 'WebPage', // schema type: WebPage | Organization | Article
                                 imageWidth = '1200',
                                 imageHeight = '630',
                               }) {
  // Schema.org block
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    name: title || '',
    url: url,
    description: description || '',
    image: image,
    logo: image,         // merged, same as image unless you override later
    sameAs: sameAs,
  };

  return {
    title,
    titleTemplate: (t) => `${t} | ${siteName}`,
    link: [{ rel: 'canonical', href: url }],
    meta: [
      // Standard SEO
      { name: 'description', content: description || '' },

      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: title || '' },
      { property: 'og:description', content: description || '' },
      { property: 'og:url', content: url || '' },
      { property: 'og:image', content: image || '' },
      { property: 'og:image:secure_url', content: image || '' },
      { property: 'og:image:width', content: String(imageWidth) },
      { property: 'og:image:height', content: String(imageHeight) },

      // Twitter (always summary_large_image)
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title || '' },
      { name: 'twitter:description', content: description || '' },
      { name: 'twitter:image', content: image || '' },
    ],
    script: {
      structuredData: {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(schema),
      },
    },
  };
}
