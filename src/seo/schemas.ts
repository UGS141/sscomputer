import { SEO_CONFIG } from './config';
import type { Course } from '../data/courses';
import type { BlogPost } from '../data/blog';

/**
 * Generates LocalBusiness / EducationalOrganization Schema for Google & AI Engines
 */
export const generateLocalBusinessSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${SEO_CONFIG.domain}/#organization`,
    name: SEO_CONFIG.businessName,
    alternateName: SEO_CONFIG.shortName,
    description: SEO_CONFIG.primaryPositioning,
    url: SEO_CONFIG.domain,
    logo: `${SEO_CONFIG.domain}${SEO_CONFIG.defaultOgImage}`,
    image: `${SEO_CONFIG.domain}${SEO_CONFIG.defaultOgImage}`,
    telephone: SEO_CONFIG.contact.phone,
    email: SEO_CONFIG.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SEO_CONFIG.address.street,
      addressLocality: SEO_CONFIG.address.city,
      addressRegion: SEO_CONFIG.address.state,
      postalCode: SEO_CONFIG.address.postalCode,
      addressCountry: SEO_CONFIG.address.countryCode,
    },
    sameAs: [
      SEO_CONFIG.social.instagram,
      SEO_CONFIG.social.facebook,
      SEO_CONFIG.social.youtube,
      SEO_CONFIG.social.linkedin,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SEO_CONFIG.contact.phone,
      contactType: 'admissions',
      areaServed: 'IN',
      availableLanguage: ['English', 'Telugu'],
    },
  };
};

export const generateOrganizationSchema = generateLocalBusinessSchema;

/**
 * Generates WebSite Schema
 */
export const generateWebSiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SEO_CONFIG.domain}/#website`,
    name: SEO_CONFIG.businessName,
    url: SEO_CONFIG.domain,
    publisher: {
      '@id': `${SEO_CONFIG.domain}/#organization`,
    },
  };
};

/**
 * Generates BreadcrumbList Schema
 */
export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SEO_CONFIG.domain}${item.url}`,
    })),
  };
};

/**
 * Generates Course Schema for individual course pages
 */
export const generateCourseSchema = (course: Course) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${course.title} Course in Nellore`,
    description: course.shortDescription,
    provider: {
      '@type': 'EducationalOrganization',
      name: SEO_CONFIG.businessName,
      url: SEO_CONFIG.domain,
      address: {
        '@type': 'PostalAddress',
        addressLocality: SEO_CONFIG.address.city,
        addressRegion: SEO_CONFIG.address.state,
        addressCountry: SEO_CONFIG.address.countryCode,
      },
    },
    educationalLevel: course.level,
    courseMode: course.mode,
    timeRequired: course.duration,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Onsite',
      location: {
        '@type': 'Place',
        name: SEO_CONFIG.businessName,
        address: {
          '@type': 'PostalAddress',
          streetAddress: SEO_CONFIG.address.street,
          addressLocality: SEO_CONFIG.address.city,
          addressRegion: SEO_CONFIG.address.state,
          postalCode: SEO_CONFIG.address.postalCode,
          addressCountry: SEO_CONFIG.address.countryCode,
        },
      },
    },
  };
};

/**
 * Generates FAQPage Schema
 */
export const generateFAQSchema = (faqs: { question: string; answer: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

/**
 * Generates BlogPosting Schema for blog detail pages
 */
export const generateBlogArticleSchema = (post: BlogPost) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: SEO_CONFIG.businessName,
    },
    publisher: {
      '@type': 'EducationalOrganization',
      name: SEO_CONFIG.businessName,
      logo: {
        '@type': 'ImageObject',
        url: `${SEO_CONFIG.domain}${SEO_CONFIG.defaultOgImage}`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SEO_CONFIG.domain}/blog/${post.slug}`,
    },
  };
};
