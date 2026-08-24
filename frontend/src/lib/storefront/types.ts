export type HeroSlide = {
  tag: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaLink: string;
  slideClass: string;
};

export type PromoBanner = {
  title: string;
  subtitle: string;
  linkLabel: string;
  href: string;
  image: string;
  layout: "tall" | "small" | "wide";
};

export type HomeTab = {
  id: string;
  label: string;
  /** Category filter key: silk | cotton | kanjivaram | party | all | or exact category name */
  filter: string;
};

export type PromoBlock = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaLink: string;
  bgClass: string;
};

export type Testimonial = {
  name: string;
  img: string;
  text: string;
  role: string;
};

export type BlogPost = {
  title: string;
  img: string;
  date: string;
  href: string;
};

export type ServiceItem = {
  title: string;
  text: string;
};

export type StorefrontSettings = {
  site: {
    name: string;
    logo: string;
    tagline: string;
    email: string;
    phone: string;
    address: string;
    currency: string;
    language: string;
    copyright: string;
  };
  topbar: {
    promoText: string;
    promoLink: string;
    promoLinkLabel: string;
  };
  heroSlides: HeroSlide[];
  promoBanners: PromoBanner[];
  homeTabs: HomeTab[];
  homeSections: {
    saleTitle: string;
    dealsTag: string;
    dealsTitle: string;
    dealsDescription: string;
    dealsEndDate: string;
    dealsProductTag: string;
    bestSellerTitle: string;
    bestSellerTag: string;
    testimonialTag: string;
    testimonialTitle: string;
    blogTitle: string;
    newsletterTitle: string;
    newsletterDescription: string;
  };
  promoBlocks: PromoBlock[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
  serviceBar: ServiceItem[];
  footer: {
    description: string;
    quickLinks: Array<{ label: string; href: string }>;
    categoryLinks: Array<{ label: string; href: string }>;
  };
};

export const STOREFRONT_SETTINGS_KEY = "main";
