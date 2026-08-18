import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://savrion.in').replace(/\/$/, '');
const DEFAULT_DESCRIPTION = 'Savrion delivers custom software engineering, web applications, scalable cloud infrastructure, and enterprise digital solutions.';

const pageMetadata = {
  '/': { title: 'Enterprise Software Solutions', description: DEFAULT_DESCRIPTION },
  '/about': { title: 'About Savrion', description: 'Learn about Savrion’s approach to enterprise software engineering, cloud systems, and digital transformation.' },
  '/services': { title: 'Software Development Services', description: 'Explore Savrion’s custom software, web, mobile, cloud, DevOps, and digital strategy services.' },
  '/products': { title: 'Products & Case Studies', description: 'Explore software products and client success stories delivered by Savrion.' },
  '/contact': { title: 'Contact Savrion', description: 'Contact Savrion to discuss your software engineering, web application, cloud, or digital transformation needs.' },
  '/technologies': { title: 'Technology Expertise', description: 'Discover the modern technologies and engineering practices used by Savrion.' }
};

/** Updates browser metadata and structured data for the current public route. */
const SEO = () => {
  const { pathname } = useLocation();
  const basePage = pathname.startsWith('/services/')
    ? { title: 'Software Development Service', description: DEFAULT_DESCRIPTION }
    : pathname.startsWith('/products/') || pathname.startsWith('/projects/')
      ? { title: 'Product Case Study', description: 'Explore a Savrion software product and the business outcomes it delivers.' }
      : pageMetadata[pathname] || { title: 'Page Not Found', description: DEFAULT_DESCRIPTION };
  const canonicalPath = pathname.startsWith('/projects/') ? pathname.replace('/projects/', '/products/') : pathname;
  const canonicalUrl = `${SITE_URL}${canonicalPath === '/' ? '/' : canonicalPath}`;
  const title = `${basePage.title} | Savrion`;

  useEffect(() => {
    /** Creates or updates a document head meta element. */
    const setMeta = (selector, attributes) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        document.head.appendChild(element);
      }
      Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    };

    document.title = title;
    setMeta('meta[name="description"]', { name: 'description', content: basePage.description });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: basePage.description });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    let schema = document.getElementById('savrion-structured-data');
    if (!schema) {
      schema = document.createElement('script');
      schema.id = 'savrion-structured-data';
      schema.type = 'application/ld+json';
      document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          name: 'Savrion',
          url: SITE_URL,
          logo: `${SITE_URL}/savrion-s.svg`,
          description: DEFAULT_DESCRIPTION
        },
        {
          '@type': 'WebPage',
          name: title,
          url: canonicalUrl,
          description: basePage.description,
          isPartOf: { '@type': 'WebSite', name: 'Savrion', url: SITE_URL }
        }
      ]
    });
  }, [basePage.description, canonicalUrl, title]);

  return null;
};

export default SEO;
