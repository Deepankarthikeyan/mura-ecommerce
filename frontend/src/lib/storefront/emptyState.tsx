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

export function SectionPlaceholder({ message }: { message: string }) {
  return (
    <p style={{ padding: "24px 16px", textAlign: "center", color: "#888", fontSize: 15, lineHeight: 1.6 }}>
      {message}{" "}
      <a href="/staff-dashboard/storefront" style={{ color: "var(--suruchi-primary, #cf0653)" }}>
        Configure in Storefront
      </a>
    </p>
  );
}
