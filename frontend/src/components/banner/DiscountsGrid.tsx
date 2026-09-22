import Link from "next/link";
import type { DiscountCard } from "@/lib/homepageSections";
import { DISCOUNT_CARD_SLOTS } from "@/lib/homepageSections";
import "./DiscountsGrid.css";

type DiscountsGridProps = {
  cards: DiscountCard[];
  preview?: boolean;
};

function DiscountCardView({
  card,
  slot,
  preview,
}: {
  card: DiscountCard;
  slot: (typeof DISCOUNT_CARD_SLOTS)[number]["key"];
  preview: boolean;
}) {
  const imageUrl = card.imageUrl?.trim();
  const showCta = card.ctaEnabled !== false;
  const href = card.ctaLink?.trim() || "/shop";
  const ctaName = card.ctaName?.trim() || "SHOP NOW";
  const className = `discounts-bento__card discounts-bento__card--${slot}`;

  const inner = (
    <>
      {imageUrl ? (
        <img className="discounts-bento__media" src={imageUrl} alt={card.altText || ""} />
      ) : (
        <div className="discounts-bento__placeholder" aria-hidden="true" />
      )}
      <div className="discounts-bento__overlay" aria-hidden="true" />
      <div className="discounts-bento__content">
        {card.tag.trim() ? <p className="discounts-bento__tag">{card.tag}</p> : null}
        {card.headline.trim() ? <h3 className="discounts-bento__headline">{card.headline}</h3> : null}
        {showCta ? <span className="discounts-bento__cta">{ctaName} →</span> : null}
      </div>
    </>
  );

  if (preview || !showCta) {
    return (
      <div className={className} aria-label={card.headline || card.tag || "Discount card"}>
        {inner}
      </div>
    );
  }

  return (
    <Link href={href} className={className} aria-label={card.headline || ctaName}>
      {inner}
    </Link>
  );
}

export default function DiscountsGrid({ cards, preview = false }: DiscountsGridProps) {
  if (!cards.length) return null;

  return (
    <section className={`discounts-bento-section${preview ? " is-preview" : ""}`}>
      <div className={preview ? undefined : "container"}>
        <div className="discounts-bento">
          {DISCOUNT_CARD_SLOTS.map((slot, index) => {
            const card = cards[index];
            if (!card) return null;
            return <DiscountCardView key={card.id} card={card} slot={slot.key} preview={preview} />;
          })}
        </div>
      </div>
    </section>
  );
}
