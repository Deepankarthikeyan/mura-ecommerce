import { getEmptyStorefrontSettings } from "./defaultStorefrontSettings";

export function StorefrontEmptyState({
  title,
  message,
  actionHref = "/staff-dashboard/storefront",
  actionLabel = "Open Storefront settings",
}: {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div
      style={{
        margin: "24px auto",
        maxWidth: 640,
        padding: "32px 24px",
        textAlign: "center",
        border: "1px dashed #d8d8d8",
        borderRadius: 12,
        background: "#fafafa",
      }}
    >
      <h3 style={{ margin: "0 0 8px", fontSize: 20 }}>{title}</h3>
      <p style={{ margin: "0 0 16px", color: "#666", lineHeight: 1.6 }}>{message}</p>
      <a href={actionHref} className="btn btn-primary" style={{ display: "inline-block" }}>
        {actionLabel}
      </a>
    </div>
  );
}

export function hasStorefrontContent(settings: ReturnType<typeof getEmptyStorefrontSettings>) {
  return (
    settings.heroSlides.length > 0 ||
    settings.promoBanners.length > 0 ||
    settings.testimonials.length > 0 ||
    settings.blogPosts.length > 0
  );
}
