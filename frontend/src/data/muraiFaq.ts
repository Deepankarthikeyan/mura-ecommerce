export type MuraiFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type MuraiFaqCategory = {
  id: string;
  title: string;
  items: MuraiFaqItem[];
};

export const MURAI_FAQ_CATEGORIES: MuraiFaqCategory[] = [
  {
    id: "about",
    title: "About MuRa@23",
    items: [
      {
        id: "about-indian-company",
        question: "Is MuRa@23 an Indian company?",
        answer: "Yes, MuRa@23 is an Indian company.",
      },
      {
        id: "about-where-buy",
        question: "Where can I buy MuRa@23 products in India?",
        answer:
          "You can purchase MuRa@23 products both online from our website and in-store at our physical location: 31, Arul Murugan Nagar, Podanur, Coimbatore 641023, Tamil Nadu, India.",
      },
      {
        id: "about-gift-vouchers",
        question: "Are gift vouchers available?",
        answer:
          "Yes, we offer gift vouchers for our customers. These can be purchased online or at our store.",
      },
    ],
  },
  {
    id: "products",
    title: "About Our Products",
    items: [
      {
        id: "products-manufacturing",
        question: "Where is your manufacturing unit located?",
        answer:
          "Our manufacturing unit is at: 31, Arul Murugan Nagar, Podanur, Coimbatore 641023, Tamil Nadu, India.",
      },
      {
        id: "products-handcrafted",
        question: "Are all MuRa@23 fabrics handcrafted?",
        answer:
          "We strive to maximize handcrafted processes by using hand-woven, hand block-printed fabrics, as well as vegetable dyes wherever possible.",
      },
      {
        id: "products-sizing",
        question: "Do MuRa@23 sizes conform to international norms?",
        answer:
          "There are no universal international sizing standards for clothing or home textiles as each brand develops its own measurements. We recommend measuring yourself and comparing your measurements with our sizing charts for the best fit.",
      },
      {
        id: "products-handloom",
        question: "What are the advantages of handloom fabrics?",
        answer:
          "Handloom textiles carry a unique character due to their traditional production techniques. These fabrics are breathable, cool in summer, and can retain warmth in winter. Since our products are handmade, small imperfections in prints may occur—this is the hallmark and beauty of handcrafted textiles.",
      },
      {
        id: "products-colors",
        question: "Do the colors of the product look exactly the same as in the photos?",
        answer:
          "Although we strive for accuracy, the colors of actual products may differ slightly from what appears on your screen due to varying display settings and natural dye variations.",
      },
    ],
  },
  {
    id: "shopping",
    title: "Shopping Online",
    items: [
      {
        id: "shopping-place-order",
        question: "How do I place an order on MuRa@23?",
        answer:
          "Shopping at MuRa@23 is simple and user-friendly:\n• Browse saree categories using our navigation menu.\n• Filter products by category, size, or price.\n• Add desired items (selecting size and quantity) to your cart.\n• Proceed to checkout, where you'll enter shipping and billing details.\n• Payment is securely processed via Razorpay.\n• You will receive order confirmations and tracking updates via email.",
      },
      {
        id: "shopping-order-received",
        question: "How will I know if you have received my order?",
        answer:
          "You will receive a confirmation on the website after your payment is processed and a confirmation email with your order number from MuRa@23.",
      },
      {
        id: "shopping-order-status",
        question: "How do I check my order status?",
        answer:
          "Log in to your MuRa@23 account and view the 'My Orders' section to track your order status. We aim to dispatch all domestic orders within 3 working days and international orders within 5 working days from our manufacturing unit.",
      },
      {
        id: "shopping-payment-safe",
        question: "Is it safe to use my credit card online at MuRa@23?",
        answer:
          "Yes, all payments are processed securely through Razorpay. MuRa@23 does not store your credit card information on our website.",
      },
      {
        id: "shopping-out-of-stock",
        question: "What if an item is out of stock?",
        answer:
          "We do our best to keep all products in stock. If an item is unavailable, we will attempt to produce it based on fabric availability. If not possible, we will notify you by email and initiate a refund within two business days.",
      },
      {
        id: "shopping-account",
        question: "Do I need an account to buy at MuRa@23?",
        answer:
          "Yes, an account is required to complete a purchase and to track your order. You can add items to your cart without an account, but checkout requires sign-up.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping",
    items: [
      {
        id: "shipping-delivery-time",
        question: "How long will it take to receive my order?",
        answer:
          "Orders are typically delivered within 7 working days after dispatch. Larger orders (more than five pieces per style) or custom products may take longer; you will be notified by email in such cases.",
      },
      {
        id: "shipping-countries",
        question: "Which countries do you ship to?",
        answer: "We ship worldwide.",
      },
      {
        id: "shipping-method",
        question: "How is my order shipped?",
        answer:
          "• Domestic orders: Sent through leading shipping partners from our manufacturing unit to your address.\n• International orders: Shipped via DHL.",
      },
      {
        id: "shipping-costs",
        question: "What are your shipping costs?",
        answer:
          "• Within India: Free for orders above ₹5,000.\n• International: As per DHL guidelines.",
      },
      {
        id: "shipping-tampered",
        question: "What if I receive a partial order or a tampered package?",
        answer:
          "Contact our Customer Support within 24–48 hours of delivery. Please:\n• Do not use the affected item.\n• Provide a short case description and images of the outer package and items. Also include an opening video of the package and a thorough check of the product.\n• Exchanges are issued after investigation, provided all information is shared promptly.\n\nScenarios where exchange may not apply:\n• Incomplete information or missing photos.\n• Item is used after receipt.\n• Claims for pilferage reported after 48 hours of delivery.",
      },
      {
        id: "shipping-cancel",
        question: "Can I change or cancel my order after placing it?",
        answer: "No, orders cannot be changed or cancelled after placement.",
      },
    ],
  },
  {
    id: "billing",
    title: "Billing and Payments",
    items: [
      {
        id: "billing-methods",
        question: "What payment methods do you accept?",
        answer:
          "We accept MasterCard, VISA, American Express, and Citibank Maestro Debit Cards. All transactions are processed online via a secure payment gateway.",
      },
      {
        id: "billing-cod",
        question: "Do you accept Cash on Delivery?",
        answer: "No, Cash on Delivery is not available.",
      },
      {
        id: "billing-currency",
        question: "In what currency will my order be billed?",
        answer:
          "Although all prices on MuRa@23 are shown in Indian Rupees (INR), your order will be billed in the currency of your debit/credit card.",
      },
    ],
  },
  {
    id: "support",
    title: "Customer Support",
    items: [
      {
        id: "support-contact",
        question: "How do I contact customer service?",
        answer: "For support, please email us via the Contact Us page on our website.",
      },
      {
        id: "support-privacy",
        question: "Will you share my information with others?",
        answer:
          "No, your information is confidential. Please refer to our Privacy Policy for more details.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & Exchanges",
    items: [
      {
        id: "returns-policy",
        question: "What is your return policy?",
        answer:
          "We do not accept returns, as our products are pre-washed and made with natural dyes, which may cause slight color bleeding. Detailed wash care instructions are provided. Exceptions are made for damaged products—returns for defects are accepted if you provide an opening video showing the defect. You must pay shipping charges for returns. Please contact Customer Support if you receive a damaged product.",
      },
      {
        id: "returns-exchange",
        question: "How do I request an exchange?",
        answer:
          "To exchange a damaged item, contact us using our Contact Us page and follow the product return process as specified.",
      },
    ],
  },
  {
    id: "sustainability",
    title: "Sustainability & Ethics",
    items: [
      {
        id: "sustainability-eco",
        question: "Are MuRa@23 clothes eco-friendly?",
        answer: "Yes, our clothes are made using eco-friendly processes and materials.",
      },
      {
        id: "sustainability-artisans",
        question: "Do you support local weavers and artisans?",
        answer:
          "Absolutely. We are committed to supporting local artisans and traditional weaving communities.",
      },
    ],
  },
];

export const MURAI_FAQ_ITEMS = MURAI_FAQ_CATEGORIES.flatMap((category) => category.items);
