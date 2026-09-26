import React, { useEffect } from 'react';
import { SEO_CONFIG } from './config';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogImage?: string;
  schemas?: object[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = [],
  canonicalPath = '',
  ogType = 'website',
  ogImage,
  schemas = [],
}) => {
  const fullTitle = title
    ? `${title} | ${SEO_CONFIG.businessName}`
    : `${SEO_CONFIG.businessName} | Computer Courses in Nellore`;

  const metaDescription =
    description ||
    `${SEO_CONFIG.businessName} offers practical computer, programming, software and career-focused training in Nellore. Explore courses, batches and hands-on learning.`;

  const canonicalUrl = `${SEO_CONFIG.domain}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;
  const image = ogImage ? (ogImage.startsWith('http') ? ogImage : `${SEO_CONFIG.domain}${ogImage}`) : `${SEO_CONFIG.domain}${SEO_CONFIG.defaultOgImage}`;

  const allKeywords = Array.from(
    new Set([
      ...keywords,
      'Sri Shanmukha Computer Institute',
      'SSCI Nellore',
      'computer courses in Nellore',
      'computer training institute in Nellore',
      'programming classes in Nellore',
    ])
  ).join(', ');

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle;

    // Helper to set meta attributes safely
    const setMeta = (nameOrProperty: string, value: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${nameOrProperty}"]` : `meta[name="${nameOrProperty}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) {
          el.setAttribute('property', nameOrProperty);
        } else {
          el.setAttribute('name', nameOrProperty);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    // 2. Set Standard Meta Tags
    setMeta('description', metaDescription);
    setMeta('keywords', allKeywords);
    setMeta('robots', 'index, follow');
    setMeta('author', SEO_CONFIG.businessName);

    // 3. Set Open Graph Tags
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', metaDescription, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:type', ogType, true);
    setMeta('og:site_name', SEO_CONFIG.businessName, true);
    setMeta('og:image', image, true);
    setMeta('og:locale', 'en_IN', true);

    // 4. Set Twitter Card Tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', metaDescription);
    setMeta('twitter:image', image);

    // 5. Set Canonical Link
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);

    // 6. Inject JSON-LD Schema Scripts
    const scriptId = 'seo-schema-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    if (schemas && schemas.length > 0) {
      const payload = schemas.length === 1 ? schemas[0] : { '@context': 'https://schema.org', '@graph': schemas };
      scriptEl.textContent = JSON.stringify(payload, null, 2);
    } else {
      scriptEl.textContent = '';
    }
  }, [fullTitle, metaDescription, allKeywords, canonicalUrl, ogType, image, schemas]);

  return null;
};
