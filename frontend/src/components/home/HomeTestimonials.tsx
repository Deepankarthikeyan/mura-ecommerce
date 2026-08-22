export default function HomeTestimonials() {
  const testimonials = [
    {
      quote:
        "The Banarasi silk saree I ordered was even more beautiful in person. Fast delivery and excellent packaging!",
      name: "Priya Sharma",
      location: "Mumbai",
    },
    {
      quote:
        "Amazing collection at sale prices. The Kanjivaram saree quality is outstanding. Will definitely shop again.",
      name: "Lakshmi Devi",
      location: "Chennai",
    },
    {
      quote: "Best place for authentic handwoven sarees. Customer support was very helpful with sizing guidance.",
      name: "Ananya Reddy",
      location: "Hyderabad",
    },
  ];

  return (
    <section className="testimonial-section">
      <div className="testimonial-deco" aria-hidden="true">
        <span className="testimonial-deco-item testimonial-deco-item--1">✦</span>
        <span className="testimonial-deco-item testimonial-deco-item--2">★</span>
        <span className="testimonial-deco-item testimonial-deco-item--3">✦</span>
        <span className="testimonial-deco-item testimonial-deco-item--4">★</span>
      </div>
      <div className="section-heading">
        <h2>What Our Customers Say</h2>
      </div>
      <div className="testimonial-grid">
        {testimonials.map((item) => (
          <article key={item.name} className="testimonial-card">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-quote">&ldquo;{item.quote}&rdquo;</p>
            <div className="testimonial-author">
              <strong>{item.name}</strong>
              <span>{item.location}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
