import Link from "next/link";

export default function MuraiBlogSection() {
  const posts = [
    { image: "/assets/images/murai/sarees/banarasi.webp", title: "How to Choose the Perfect Silk Saree" },
    { image: "/assets/images/murai/sarees/kanjivaram.webp", title: "Banarasi vs Kanjivaram: A Complete Guide" },
    { image: "/assets/images/murai/sarees/georgette-party.webp", title: "5 Ways to Style Your Saree for Modern Occasions" },
  ];

  return (
    <section className="blog-section">
      <div className="section-heading"><h2>From The Blog</h2></div>
      <div className="blog-grid">
        {posts.map((post) => (
          <article key={post.title} className="blog-card">
            <div className="blog-card-img">
              <img src={post.image} alt="" loading="lazy" decoding="async" />
            </div>
            <div className="blog-card-body">
              <p className="blog-date">February 03, 2026</p>
              <h3><Link href="/blog">{post.title}</Link></h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
