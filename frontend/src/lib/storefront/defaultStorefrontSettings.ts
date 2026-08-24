import type { StorefrontSettings } from "./types";

/** Minimal shell shown on a fresh deploy before staff saves storefront settings. */
export function getEmptyStorefrontSettings(): StorefrontSettings {
  return {
    site: {
      name: "My Store",
      logo: "/murai/images/mura-newlogo.png",
      tagline: "",
      email: "",
      phone: "",
      address: "",
      currency: "₹ INR",
      language: "English",
      copyright: "© My Store. All rights reserved.",
    },
    topbar: {
      promoText: "",
      promoLink: "/shop",
      promoLinkLabel: "Shop Now",
    },
    heroSlides: [],
    promoBanners: [],
    homeTabs: [{ id: "all", label: "All Products", filter: "all" }],
    homeSections: {
      saleTitle: "Sale Sarees",
      dealsTag: "Hurry up and Get 25% Discount",
      dealsTitle: "Deals Of The Day",
      dealsDescription: "Don't miss out on our exclusive daily deals.",
      dealsEndDate: "",
      dealsProductTag: "deal-of-day",
      bestSellerTitle: "Best Selling Sarees",
      bestSellerTag: "bestseller",
      testimonialTag: "✦ Client Love ✦",
      testimonialTitle: "Our Clients Say",
      blogTitle: "From The Blog",
      newsletterTitle: "Join Our Newsletter",
      newsletterDescription: "Enter your email address to subscribe our notification of our new post & features by email.",
    },
    promoBlocks: [],
    testimonials: [],
    blogPosts: [],
    serviceBar: [
      { title: "Shipping", text: "From handpicked sellers" },
      { title: "Payment", text: "Secure checkout" },
      { title: "Return", text: "30-day easy returns" },
      { title: "Support", text: "Dedicated help team" },
    ],
    footer: {
      description: "",
      quickLinks: [
        { label: "Home", href: "/" },
        { label: "Shop", href: "/shop" },
        { label: "Contact", href: "/contact" },
      ],
      categoryLinks: [],
    },
  };
}

/** Rich MuRa template staff can load from the dashboard when setting up. */
export function getStorefrontTemplateSettings(): StorefrontSettings {
  return {
    site: {
      name: "MuRa@23",
      logo: "/murai/images/mura-newlogo.png",
      tagline: "India's finest sale sarees — silk, cotton, Banarasi, Kanjivaram and designer sarees at unbeatable prices.",
      email: "murapodanur@gmail.com",
      phone: "02 123 333 444",
      address: "Podanur, Tamil Nadu, India",
      currency: "₹ INR",
      language: "English",
      copyright: "© 2026 MuRa@23. All rights reserved. Handcrafted with love in India.",
    },
    topbar: {
      promoText: "Big Saree Sale — Up to 70% Off",
      promoLink: "/shop",
      promoLinkLabel: "Shop Sale Sarees",
    },
    heroSlides: [
      {
        tag: "Saree Sale",
        title: "Handcrafted Silk\nSarees On Sale",
        subtitle: "Up To 70% Off On Premium Sarees.\nSilk, Cotton & Designer Collection!",
        ctaLabel: "Shop Sale Sarees →",
        ctaLink: "/shop",
        slideClass: "slide-1",
      },
      {
        tag: "Saree Sale",
        title: "Handcrafted Silk\nSarees On Sale",
        subtitle: "Up To 70% Off On Premium Sarees.\nSilk, Cotton & Designer Collection!",
        ctaLabel: "Shop Sale Sarees →",
        ctaLink: "/shop",
        slideClass: "slide-2",
      },
      {
        tag: "Saree Sale",
        title: "Handcrafted Silk\nSarees On Sale",
        subtitle: "Up To 70% Off On Premium Sarees.\nSilk, Cotton & Designer Collection!",
        ctaLabel: "Shop Sale Sarees →",
        ctaLink: "/shop",
        slideClass: "slide-3",
      },
    ],
    promoBanners: [
      {
        title: "Silk Saree\nSale",
        subtitle: "40% Off",
        linkLabel: "View Discounts →",
        href: "/shop?category=silk",
        image: "/murai/images/sarees/banarasi.webp",
        layout: "tall",
      },
      {
        title: "Up to 50% Off\nBanarasi Sarees",
        subtitle: "Banarasi",
        linkLabel: "View Discounts →",
        href: "/shop?category=kanjivaram",
        image: "/murai/images/sarees/paithani.webp",
        layout: "small",
      },
      {
        title: "Free Shipping Over\nOrder ₹999",
        subtitle: "Cotton Sarees",
        linkLabel: "View Discounts →",
        href: "/shop?category=cotton",
        image: "/murai/images/sarees/cotton-block.webp",
        layout: "small",
      },
      {
        title: "Kanjivaram Silk\nSaree Sale",
        subtitle: "35% Off",
        linkLabel: "View Discounts →",
        href: "/shop?category=kanjivaram",
        image: "/murai/images/sarees/kanjivaram.webp",
        layout: "wide",
      },
    ],
    homeTabs: [
      { id: "featured", label: "Silk Sarees", filter: "silk" },
      { id: "trending", label: "Cotton Sarees", filter: "cotton" },
      { id: "newarrival", label: "Designer Sarees", filter: "designer" },
    ],
    homeSections: {
      saleTitle: "Sale Sarees",
      dealsTag: "Hurry up and Get 25% Discount",
      dealsTitle: "Deals Of The Day",
      dealsDescription:
        "Don't miss out on our exclusive daily saree deals. Limited stock on handwoven silk and cotton sarees.",
      dealsEndDate: "",
      dealsProductTag: "deal-of-day",
      bestSellerTitle: "Best Selling Sarees",
      bestSellerTag: "bestseller",
      testimonialTag: "✦ Client Love ✦",
      testimonialTitle: "Our Clients Say",
      blogTitle: "From The Blog",
      newsletterTitle: "Join Our Newsletter",
      newsletterDescription:
        "Enter your email address to subscribe our notification of our new post & features by email.",
    },
    promoBlocks: [
      {
        title: "Up to 50% Off\nSarees",
        subtitle: "Shop Silk & Cotton",
        ctaLabel: "Shop Now",
        ctaLink: "/shop",
        bgClass: "bg-1",
      },
      {
        title: "Up to 70% Off\nSarees",
        subtitle: "Limited time sale",
        ctaLabel: "Discover Now",
        ctaLink: "/shop",
        bgClass: "bg-2",
      },
    ],
    testimonials: [
      {
        name: "Priya Sharma",
        img: "/murai/images/avatars/priya-sharma.svg",
        text: "The Banarasi silk saree I bought on sale is absolutely stunning! Rich zari work and the fabric quality is exceptional. Best saree purchase ever!",
        role: "Saree Lover",
      },
      {
        name: "Laura Johnson",
        img: "/murai/images/avatars/laura-johnson.svg",
        text: "MuRa@23 has the best saree sale online! Got a beautiful Kanjivaram at 40% off. Fast delivery and elegant packaging. Highly recommended!",
        role: "Saree Lover",
      },
      {
        name: "Richard Smith",
        img: "/murai/images/avatars/richard-smith.svg",
        text: "The silk saree I purchased exceeded my expectations. Gorgeous colors and the packaging was elegant. Perfect for gifting too.",
        role: "Saree Lover",
      },
    ],
    blogPosts: [
      {
        title: "How to Choose the Perfect Silk Saree",
        img: "/murai/images/sarees/banarasi.webp",
        date: "February 03, 2026",
        href: "/blog",
      },
      {
        title: "Banarasi vs Kanjivaram: A Complete Guide",
        img: "/murai/images/sarees/kanjivaram.webp",
        date: "February 03, 2026",
        href: "/blog",
      },
      {
        title: "5 Ways to Style Your Saree for Modern Occasions",
        img: "/murai/images/sarees/georgette-party.webp",
        date: "February 03, 2026",
        href: "/blog",
      },
    ],
    serviceBar: [
      { title: "Shipping", text: "From handpicked sellers" },
      { title: "Payment", text: "Secure checkout" },
      { title: "Return", text: "30-day easy returns" },
      { title: "Support", text: "Dedicated help team" },
    ],
    footer: {
      description:
        "India's finest sale sarees — silk, cotton, Banarasi, Kanjivaram and designer sarees at unbeatable prices.",
      quickLinks: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Shop", href: "/shop" },
        { label: "Contact", href: "/contact" },
      ],
      categoryLinks: [
        { label: "Silk Sarees", href: "/shop?category=silk" },
        { label: "Cotton Sarees", href: "/shop?category=cotton" },
        { label: "Banarasi", href: "/shop?category=kanjivaram" },
        { label: "Kanjivaram", href: "/shop?category=kanjivaram" },
      ],
    },
  };
}

/** @deprecated Use getEmptyStorefrontSettings or getStorefrontTemplateSettings */
export function getDefaultStorefrontSettings(): StorefrontSettings {
  return getEmptyStorefrontSettings();
}

export function mergeStorefrontSettings(
  saved: Partial<StorefrontSettings> | null | undefined
): StorefrontSettings {
  const empty = getEmptyStorefrontSettings();
  if (!saved || typeof saved !== "object") return empty;

  return {
    site: { ...empty.site, ...saved.site },
    topbar: { ...empty.topbar, ...saved.topbar },
    heroSlides: saved.heroSlides ?? empty.heroSlides,
    promoBanners: saved.promoBanners ?? empty.promoBanners,
    homeTabs: saved.homeTabs?.length ? saved.homeTabs : empty.homeTabs,
    homeSections: { ...empty.homeSections, ...saved.homeSections },
    promoBlocks: saved.promoBlocks ?? empty.promoBlocks,
    testimonials: saved.testimonials ?? empty.testimonials,
    blogPosts: saved.blogPosts ?? empty.blogPosts,
    serviceBar: saved.serviceBar ?? empty.serviceBar,
    footer: {
      ...empty.footer,
      ...saved.footer,
      quickLinks: saved.footer?.quickLinks?.length ? saved.footer.quickLinks : empty.footer.quickLinks,
      categoryLinks: saved.footer?.categoryLinks ?? empty.footer.categoryLinks,
    },
  };
}
