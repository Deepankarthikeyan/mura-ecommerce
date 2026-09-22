import { MURAI_BLOGS } from "./murai-data";

export default function MuraiBlog() {
  return (
    <section className="blog-section">
      <div className="section-heading">
        <h2>From The Blog</h2>
      </div>
      <div className="blog-grid">
        {MURAI_BLOGS.map((post) => (
          <article className="blog-card" key={post.title}>
            <div className="blog-card-img">
              <img src={post.img} alt={post.alt} loading="lazy" decoding="async" />
            </div>
            <div className="blog-card-body">
              <p className="blog-date">{post.date}</p>
              <h3>{post.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
