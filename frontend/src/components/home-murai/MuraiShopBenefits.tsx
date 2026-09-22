const ITEMS = [
  {
    title: "Shipping",
    text: "From handpicked sellers",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 8h12v9H1z" />
        <path d="M13 11h5l3 3v3h-8z" />
        <circle cx="5.5" cy="18.5" r="1.7" />
        <circle cx="18" cy="18.5" r="1.7" />
      </svg>
    ),
  },
  {
    title: "Payment",
    text: "Secure checkout",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
        <path d="M6 15h4" />
      </svg>
    ),
  },
  {
    title: "Return",
    text: "30-day easy returns",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 12a7.5 7.5 0 0 1 12.3-5.7L19 4v5h-5l2.1-2.1A5.5 5.5 0 1 0 17.5 15" />
        <path d="M19.5 12a7.5 7.5 0 0 1-12.3 5.7L5 20v-5h5L7.9 17.1A5.5 5.5 0 1 0 6.5 9" />
      </svg>
    ),
  },
  {
    title: "Support",
    text: "Dedicated help team",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a8 8 0 0 1-8 8H8l-5 3v-4.2A8 8 0 1 1 21 12z" />
        <path d="M8 11h8M8 14h5" />
      </svg>
    ),
  },
];

export default function MuraiShopBenefits() {
  return (
    <section className="shop-benefits">
      <div className="shop-benefits-grid">
        {ITEMS.map((item) => (
          <div key={item.title} className="shop-benefit-card">
            <div className="shop-benefit-icon" aria-hidden="true">
              {item.icon}
            </div>
            <h4>{item.title}</h4>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
