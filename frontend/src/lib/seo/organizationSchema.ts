const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aathithyaherbal.com";
const SITE_NAME = "Aathithya Herbal";
const SITE_DESCRIPTION =
  "Shop authentic herbal products online at Aathithya Herbal. Discover 100+ natural supplements, organic wellness products, and traditional remedies delivered worldwide since 2016.";
const LOGO_PATH = "/assets/images/logo/logo-1-jpg.jpeg";

function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).href;
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    logo: absoluteUrl(LOGO_PATH),
    description: SITE_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      streetAddress: "5/611, KNG Pudur Rd, K.N.Palayam, KNG Pudur Pirivu",
      addressLocality: "Coimbatore",
      addressRegion: "Tamil Nadu",
      postalCode: "641108",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91 95855 15051",
      email: "support@aathithyaherbal.com",
      contactType: "Customer Support",
      areaServed: "IN",
      availableLanguage: ["English", "Tamil"],
    },
    sameAs: [
      "https://www.facebook.com/profile.php?id=61551352461006",
      "https://www.instagram.com/aathithya.herbal",
      "https://www.youtube.com/@AathithyaHerbal",
      "https://x.com/HerbalAathithya",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: SITE_NAME,
    image: absoluteUrl(LOGO_PATH),
    url: absoluteUrl("/"),
    telephone: "+91 95855 15051",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "5/611, KNG Pudur Rd, K.N.Palayam, KNG Pudur Pirivu",
      addressLocality: "Coimbatore",
      addressRegion: "Tamil Nadu",
      postalCode: "641108",
      addressCountry: "IN",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "19:00",
    },
  };
}

const HERBAL_SERVICES = [
  {
    name: "Herbal Supplements",
    description:
      "Natural herbal supplements to support daily wellness, immunity, vitality, and balanced health.",
  },
  {
    name: "Organic Wellness Products",
    description:
      "Curated organic herbal products for holistic health, skincare, and personal care routines.",
  },
  {
    name: "Traditional Herbal Remedies",
    description:
      "Time-tested herbal formulations rooted in traditional practices for natural healing and wellness.",
  },
  {
    name: "Ayurvedic & Siddha Products",
    description:
      "Authentic Ayurvedic and Siddha-inspired herbal products for mind-body balance and long-term wellbeing.",
  },
] as const;

export function serviceCatalogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Herbal & Wellness Products",
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    areaServed: {
      "@type": "City",
      name: "Coimbatore",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Herbal Products",
      itemListElement: HERBAL_SERVICES.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
        },
      })),
    },
  };
}

const FAQ_ITEMS = [
  {
    question: "What is Aathithya Herbal?",
    answer:
      "Aathithya Herbal is a worldwide online herbal store operating since 2016, offering 100+ authentic herbal and wellness products for natural health and holistic wellbeing.",
  },
  {
    question: "Who can use Aathithya Herbal products?",
    answer:
      "Our herbal products are suitable for adults seeking natural wellness support. We recommend reading product descriptions and consulting a healthcare professional if you have specific health conditions.",
  },
  {
    question: "Where is Aathithya Herbal located?",
    answer:
      "Aathithya Herbal is based in Coimbatore, Tamil Nadu, India, and delivers herbal products to customers worldwide through our online store.",
  },
  {
    question: "Does Aathithya Herbal ship internationally?",
    answer:
      "Yes. We ship herbal products to customers across multiple countries. Shipping charges and delivery timelines are shown during checkout.",
  },
] as const;

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

type StoreReview = {
  author: string;
  rating: number;
  body: string;
};

/** Replace with real customer reviews that are visible on your site. */
const STORE_REVIEWS: StoreReview[] = [
  {
    author: "Verified Customer",
    rating: 5,
    body: "I've been ordering from Aathithya Herbal for months. The products are authentic, well-packaged, and delivered on time. Highly recommend for anyone looking for quality herbal supplements.",
  },
];

function averageRating(reviews: StoreReview[]): string {
  if (reviews.length === 0) return "0";
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / reviews.length).toFixed(1);
}

export function reviewSchema() {
  if (STORE_REVIEWS.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: averageRating(STORE_REVIEWS),
      reviewCount: String(STORE_REVIEWS.length),
    },
    review: STORE_REVIEWS.map((entry) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: entry.author,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(entry.rating),
      },
      reviewBody: entry.body,
    })),
  };
}
