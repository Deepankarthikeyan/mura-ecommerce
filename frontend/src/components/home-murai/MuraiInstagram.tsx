const REELS = [
  { id: "DeJxV8NSGqC", label: "Ikat saree", width: 512 },
  { id: "DeBot9MpVEx", label: "Bagh cotton saree", width: 361 },
  { id: "Dd88PUyJsVt", label: "Narayanpet saree", width: 512 },
  { id: "DdlqvuyJFZg", label: "Green Ikat saree", width: 512 },
];

export default function MuraiInstagram() {
  return (
    <section className="instagram-section" aria-label="MuRa@23 on Instagram">
      <div className="section-heading">
        <h2>Follow Us on Instagram</h2>
      </div>
      <div className="instagram-grid">
        {REELS.map((reel) => (
          <a
            className="instagram-card"
            key={reel.id}
            href={`https://www.instagram.com/reel/${reel.id}/`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch ${reel.label} on Instagram (opens in a new tab)`}
          >
            <div className="instagram-card-img">
              <img
                src={`/murai/instagram/${reel.id}.webp`}
                alt={reel.label}
                width={reel.width}
                height={640}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="instagram-card-body">
              <h3>Watch on Instagram <span aria-hidden="true">↗</span></h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
