import {
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_LOGO,
  SITE_NAME,
  SITE_PHONE,
  SITE_URL,
} from "../brand";

const LOGO_PATH = SITE_LOGO;

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
      streetAddress: "Podanur",
      addressLocality: "Coimbatore",
      addressRegion: "Tamil Nadu",
      postalCode: "641023",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE_PHONE,
      email: SITE_EMAIL,
      contactType: "Customer Support",
      areaServed: "IN",
      availableLanguage: ["English", "Tamil"],
    },
    sameAs: [
      "https://facebook.com",
      "https://instagram.com",
      "https://x.com",
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
    telephone: SITE_PHONE,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Podanur",
      addressLocality: "Coimbatore",
      addressRegion: "Tamil Nadu",
      postalCode: "641023",
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
        "Sunday",
      ],
      opens: "10:00",
      closes: "20:00",
    },
  };
}

const SAREE_SERVICES = [
  {
    name: "Silk Sarees",
    description:
      "Handpicked silk sarees from weaving clusters across India, offered at sale prices.",
  },
  {
    name: "Cotton Sarees",
    description:
      "Everyday and festive cotton sarees sourced from trusted artisans.",
  },
  {
    name: "Banarasi Sarees",
    description:
      "Banarasi weaves with intricate zari work, available as sale sarees.",
  },
  {
    name: "Kanjivaram Sarees",
    description:
      "Kanjivaram silk sarees celebrating South Indian weaving traditions.",
  },
] as const;

export function serviceCatalogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Sale Sarees",
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
      name: "Saree Collection",
      itemListElement: SAREE_SERVICES.map((service) => ({
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
    question: "What is MuRa@23?",
    answer:
      "MuRa@23 is a sale-saree store offering silk, cotton, Banarasi, Kanjivaram and designer sarees sourced from artisans across India.",
  },
  {
    question: "Where is MuRa@23 located?",
    answer:
      "Our store is in Podanur, Coimbatore, Tamil Nadu, India. We also sell online across India.",
  },
  {
    question: "What kinds of sarees do you sell?",
    answer:
      "We specialise in sale sarees only — silk, cotton, Banarasi, Kanjivaram and designer weaves.",
  },
  {
    question: "Do you ship across India?",
    answer:
      "Yes. Shipping options and delivery timelines are shown at checkout.",
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

const STORE_REVIEWS: StoreReview[] = [
  {
    author: "Verified Customer",
    rating: 5,
    body: "Beautiful sale sarees and careful packaging. The Banarasi I ordered looked even better in person.",
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
