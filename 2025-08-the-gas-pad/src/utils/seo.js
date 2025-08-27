// utils/seo.js

export function buildSeoConfig({
                                 title,
                                 description,
                                 url,            // canonical URL (absolute recommended)
                                 image,          // absolute URL to 1200x630 jpg/png
                                 siteName,
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
  };

  return {
    title,
    titleTemplate: (t) => `${t} | ${siteName}`,
    link: [{ rel: 'canonical', href: url }],
    meta: [
      { name: 'description', content: description || '' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: title || '' },
      { property: 'og:description', content: description || '' },
      { property: 'og:url', content: url || '' },
      { property: 'og:image', content: image || '' },
      { property: 'og:image:secure_url', content: image || '' },
      { property: 'og:image:width', content: String(imageWidth) },
      { property: 'og:image:height', content: String(imageHeight) },
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

// --------------------------------------------------------------------
// SECOND FUNCTION: for product or catalog style pages
// --------------------------------------------------------------------

// utils/seo.js

export function buildCatalogItems(items = []) {
  return items.map((item) => {
    const type = item['SEO Type'] || 'Product';

    // Base entity
    const entity = {
      '@type': type,
      name: item['Title'] || '',
      description: item['Tagline'] || '',
    };

    if (item['Category']) {
      entity.category = item['Category'];
    }

    // Only include Offer if price is present
    if (item['Price'] !== undefined && item['Price'] !== null && item['Price'] !== '') {
      entity.offers = {
        '@type': 'Offer',
        price: String(item['Price']),
        priceCurrency: 'ZAR',
        availability: 'https://schema.org/InStock',
      };
    }

    return entity;
  });
}

