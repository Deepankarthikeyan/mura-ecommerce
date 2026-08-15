"use client";

export default function ReportPlaceholder({ title }: { title: string }) {
  return (
    <div>
      <div className="body-root-inner">
        <div className="transection">
          <div className="title-right-actioin-btn-wrapper-product-list">
            <h3 className="title">{title}</h3>
          </div>
        </div>
        <div className="row g-5">
          <div className="col-12">
            <p style={{ color: "#6b7280", marginTop: 8 }}>
              Report content for {title} will appear here.
            </p>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="left">
            <p>Copyright © 2026 All Right Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
