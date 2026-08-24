const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://murai-website-wine.vercel.app";
const SITE_NAME = "MuRa@23";
const SITE_DESCRIPTION =
  "Shop premium sale sarees online at MuRa@23. Silk, cotton, Banarasi, Kanjivaram and designer sarees at up to 70% off. Handcrafted with love in India.";
const LOGO_PATH = "/murai/images/mura-newlogo.png";

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
      telephone: "02 123 333 444",
      email: "murapodanur@gmail.com",
      contactType: "Customer Support",
      areaServed: "IN",
      availableLanguage: ["English", "Tamil"],
    },
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
    telephone: "02 123 333 444",
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
      ],
      opens: "09:00",
      closes: "20:00",
    },
  };
}

const SAREE_SERVICES = [
  {
    name: "Silk Sarees",
    description: "Premium handwoven silk sarees on sale — Banarasi, Kanjivaram, and designer silk collections.",
  },
  {
    name: "Cotton Sarees",
    description: "Comfortable cotton sarees for daily wear and festive occasions at unbeatable sale prices.",
  },
  {
    name: "Banarasi Sarees",
    description: "Authentic Banarasi silk sarees with intricate zari work, sourced directly from artisans.",
  },
  {
    name: "Kanjivaram Sarees",
    description: "Traditional Kanjivaram silk sarees from Kanchipuram weavers at exclusive sale prices.",
  },
] as const;

export function serviceCatalogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Sale Sarees Online",
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
      name: "Sale Sarees",
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
      "MuRa@23 is an online saree store in Podanur, Coimbatore, offering premium silk, cotton, Banarasi, and Kanjivaram sarees at sale prices.",
  },
  {
    question: "What types of sarees do you sell?",
    answer:
      "We specialize in sale sarees including silk, cotton, Banarasi, Kanjivaram, designer, and party wear sarees.",
  },
  {
    question: "Where is MuRa@23 located?",
    answer:
      "MuRa@23 is based in Podanur, Coimbatore, Tamil Nadu, India. You can visit our store or shop online.",
  },
  {
    question: "Do you offer discounts on sarees?",
    answer:
      "Yes. MuRa@23 is dedicated to sale sarees with discounts up to 70% off on selected collections.",
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
    body: "Beautiful sarees at great prices. The silk quality is excellent and delivery was fast. Highly recommend MuRa@23!",
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
