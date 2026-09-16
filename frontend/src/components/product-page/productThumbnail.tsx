"use client";

type Thumbnail = {
  id: string;
  src: string;
  alt: string;
};

type ProductThumbnailProps = {
  thumbnails: Thumbnail[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

const ProductThumbnail = ({
  thumbnails,
  activeIndex,
  onSelect,
}: ProductThumbnailProps) => {
  if (thumbnails.length === 0) return null;

  const columns = Math.min(Math.max(thumbnails.length, 1), 4);

  return (
    <div
      className="product-thumb-filter-group product-thumb-filter-group--below"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {thumbnails.map((thumb, index) => (
        <div
          key={thumb.id}
          className={`thumb-filter filter-btn ${activeIndex === index ? "active" : ""}`}
          onClick={() => onSelect(index)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect(index);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={thumb.alt}
          aria-pressed={activeIndex === index}
        >
          <img
            src={thumb.src}
            alt={thumb.alt}
            onError={(e) => {
              const img = e.currentTarget;
              if (img.dataset.fallbackApplied === "1") return;
              img.dataset.fallbackApplied = "1";
              img.src = "/assets/images/logo/logo-1-jpg.jpeg";
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductThumbnail;
