"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import type {
  BlogPost,
  HeroSlide,
  HomeTab,
  PromoBanner,
  PromoBlock,
  StorefrontSettings,
  Testimonial,
} from "@/lib/storefront/types";
import { getDefaultStorefrontSettings } from "@/lib/storefront/defaultStorefrontSettings";

type Tab = "site" | "hero" | "banners" | "home" | "content" | "footer";

const inputStyle: React.CSSProperties = {
  border: "1px solid #d0d0d0",
  borderRadius: "6px",
  padding: "8px 12px",
  width: "100%",
  boxSizing: "border-box",
  fontSize: "14px",
};

const labelStyle: React.CSSProperties = { fontSize: "13px", fontWeight: 600, color: "#333" };
const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "4px" };
const cardStyle: React.CSSProperties = {
  borderRadius: "8px",
  border: "1px solid #e8e8e8",
  background: "#fff",
  padding: "20px",
  marginBottom: "16px",
};

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: "10px 16px",
  border: "none",
  borderBottom: active ? "2px solid #0d6efd" : "2px solid transparent",
  background: "transparent",
  color: active ? "#0d6efd" : "#666",
  fontWeight: active ? 600 : 400,
  cursor: "pointer",
  fontSize: "14px",
});

function Field({
  label,
  value,
  onChange,
  multiline,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
}) {
  return (
    <label style={fieldStyle}>
      <span style={labelStyle}>{label}</span>
      {multiline ? (
        <textarea
          style={{ ...inputStyle, minHeight: 72, resize: "vertical" }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input style={inputStyle} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

export default function DemoContent() {
  const [tab, setTab] = useState<Tab>("site");
  const [settings, setSettings] = useState<StorefrontSettings>(getDefaultStorefrontSettings());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/storefront");
      if (data?.success && data.settings) setSettings(data.settings);
    } catch {
      toast.error("Failed to load storefront settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put("/api/storefront", { settings });
      if (data?.success) {
        toast.success("Storefront settings saved");
        if (data.settings) setSettings(data.settings);
      } else {
        toast.error(data?.message || "Save failed");
      }
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : "Save failed";
      toast.error(String(msg ?? "Save failed"));
    } finally {
      setSaving(false);
    }
  };

  const updateSite = (patch: Partial<StorefrontSettings["site"]>) =>
    setSettings((s) => ({ ...s, site: { ...s.site, ...patch } }));

  const updateTopbar = (patch: Partial<StorefrontSettings["topbar"]>) =>
    setSettings((s) => ({ ...s, topbar: { ...s.topbar, ...patch } }));

  const updateHomeSections = (patch: Partial<StorefrontSettings["homeSections"]>) =>
    setSettings((s) => ({ ...s, homeSections: { ...s.homeSections, ...patch } }));

  const updateFooter = (patch: Partial<StorefrontSettings["footer"]>) =>
    setSettings((s) => ({ ...s, footer: { ...s.footer, ...patch } }));

  const updateHero = (index: number, patch: Partial<HeroSlide>) =>
    setSettings((s) => ({
      ...s,
      heroSlides: s.heroSlides.map((slide, i) => (i === index ? { ...slide, ...patch } : slide)),
    }));

  const updateBanner = (index: number, patch: Partial<PromoBanner>) =>
    setSettings((s) => ({
      ...s,
      promoBanners: s.promoBanners.map((b, i) => (i === index ? { ...b, ...patch } : b)),
    }));

  const updateHomeTab = (index: number, patch: Partial<HomeTab>) =>
    setSettings((s) => ({
      ...s,
      homeTabs: s.homeTabs.map((t, i) => (i === index ? { ...t, ...patch } : t)),
    }));

  const updateTestimonial = (index: number, patch: Partial<Testimonial>) =>
    setSettings((s) => ({
      ...s,
      testimonials: s.testimonials.map((t, i) => (i === index ? { ...t, ...patch } : t)),
    }));

  const updateBlog = (index: number, patch: Partial<BlogPost>) =>
    setSettings((s) => ({
      ...s,
      blogPosts: s.blogPosts.map((b, i) => (i === index ? { ...b, ...patch } : b)),
    }));

  const updatePromoBlock = (index: number, patch: Partial<PromoBlock>) =>
    setSettings((s) => ({
      ...s,
      promoBlocks: s.promoBlocks.map((b, i) => (i === index ? { ...b, ...patch } : b)),
    }));

  if (loading) {
    return (
      <div className="body-root-inner">
        <p style={{ padding: 24 }}>Loading storefront settings...</p>
      </div>
    );
  }

  return (
    <div className="body-root-inner">
      <div className="transection">
        <div className="title-right-actioin-btn-wrapper-product-list" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 className="title">Storefront</h3>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: "#666" }}>
              Control the MuRa@23 homepage, header, footer, and promotional content. Products are managed in Inventory.
            </p>
          </div>
          <button type="button" className="rts-btn btn-primary" disabled={saving} onClick={save}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>

        <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #e8e8e8", marginTop: 16, flexWrap: "wrap" }}>
          {(
            [
              ["site", "Site & contact"],
              ["hero", "Hero slider"],
              ["banners", "Promo banners"],
              ["home", "Home sections"],
              ["content", "Testimonials & blog"],
              ["footer", "Footer"],
            ] as const
          ).map(([id, label]) => (
            <button key={id} type="button" style={tabStyle(tab === id)} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>

        {tab === "site" && (
          <div style={{ marginTop: 20, maxWidth: 720 }}>
            <div style={cardStyle}>
              <h4 style={{ marginTop: 0 }}>Brand & contact</h4>
              <div style={{ display: "grid", gap: 12 }}>
                <Field label="Store name" value={settings.site.name} onChange={(v) => updateSite({ name: v })} />
                <Field label="Logo URL" value={settings.site.logo} onChange={(v) => updateSite({ logo: v })} />
                <Field label="Tagline" value={settings.site.tagline} onChange={(v) => updateSite({ tagline: v })} multiline />
                <Field label="Email" value={settings.site.email} onChange={(v) => updateSite({ email: v })} />
                <Field label="Phone" value={settings.site.phone} onChange={(v) => updateSite({ phone: v })} />
                <Field label="Address" value={settings.site.address} onChange={(v) => updateSite({ address: v })} />
                <Field label="Currency label" value={settings.site.currency} onChange={(v) => updateSite({ currency: v })} />
                <Field label="Language label" value={settings.site.language} onChange={(v) => updateSite({ language: v })} />
                <Field label="Copyright" value={settings.site.copyright} onChange={(v) => updateSite({ copyright: v })} />
              </div>
            </div>
            <div style={cardStyle}>
              <h4 style={{ marginTop: 0 }}>Top bar</h4>
              <div style={{ display: "grid", gap: 12 }}>
                <Field label="Promo text" value={settings.topbar.promoText} onChange={(v) => updateTopbar({ promoText: v })} />
                <Field label="Promo link URL" value={settings.topbar.promoLink} onChange={(v) => updateTopbar({ promoLink: v })} />
                <Field label="Promo link label" value={settings.topbar.promoLinkLabel} onChange={(v) => updateTopbar({ promoLinkLabel: v })} />
              </div>
            </div>
          </div>
        )}

        {tab === "hero" && (
          <div style={{ marginTop: 20 }}>
            {settings.heroSlides.map((slide, i) => (
              <div key={i} style={cardStyle}>
                <h4 style={{ marginTop: 0 }}>Slide {i + 1}</h4>
                <div style={{ display: "grid", gap: 12, maxWidth: 720 }}>
                  <Field label="Tag" value={slide.tag} onChange={(v) => updateHero(i, { tag: v })} />
                  <Field label="Title (use \\n for line break)" value={slide.title} onChange={(v) => updateHero(i, { title: v })} multiline />
                  <Field label="Subtitle" value={slide.subtitle} onChange={(v) => updateHero(i, { subtitle: v })} multiline />
                  <Field label="Button label" value={slide.ctaLabel} onChange={(v) => updateHero(i, { ctaLabel: v })} />
                  <Field label="Button link" value={slide.ctaLink} onChange={(v) => updateHero(i, { ctaLink: v })} />
                  <Field label="CSS slide class (slide-1, slide-2, slide-3)" value={slide.slideClass} onChange={(v) => updateHero(i, { slideClass: v })} />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "banners" && (
          <div style={{ marginTop: 20 }}>
            {settings.promoBanners.map((banner, i) => (
              <div key={i} style={cardStyle}>
                <h4 style={{ marginTop: 0 }}>Banner {i + 1}</h4>
                <div style={{ display: "grid", gap: 12, maxWidth: 720 }}>
                  <Field label="Title" value={banner.title} onChange={(v) => updateBanner(i, { title: v })} multiline />
                  <Field label="Subtitle" value={banner.subtitle} onChange={(v) => updateBanner(i, { subtitle: v })} />
                  <Field label="Link label" value={banner.linkLabel} onChange={(v) => updateBanner(i, { linkLabel: v })} />
                  <Field label="Link URL" value={banner.href} onChange={(v) => updateBanner(i, { href: v })} />
                  <Field label="Image URL" value={banner.image} onChange={(v) => updateBanner(i, { image: v })} />
                  <Field label="Layout (tall | small | wide)" value={banner.layout} onChange={(v) => updateBanner(i, { layout: v as PromoBanner["layout"] })} />
                </div>
              </div>
            ))}
            <div style={cardStyle}>
              <h4 style={{ marginTop: 0 }}>Mid-page promo blocks</h4>
              {settings.promoBlocks.map((block, i) => (
                <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #eee" }}>
                  <strong>Block {i + 1}</strong>
                  <div style={{ display: "grid", gap: 12, marginTop: 8, maxWidth: 720 }}>
                    <Field label="Title" value={block.title} onChange={(v) => updatePromoBlock(i, { title: v })} multiline />
                    <Field label="Subtitle" value={block.subtitle} onChange={(v) => updatePromoBlock(i, { subtitle: v })} />
                    <Field label="Button label" value={block.ctaLabel} onChange={(v) => updatePromoBlock(i, { ctaLabel: v })} />
                    <Field label="Button link" value={block.ctaLink} onChange={(v) => updatePromoBlock(i, { ctaLink: v })} />
                    <Field label="Background class (bg-1 | bg-2)" value={block.bgClass} onChange={(v) => updatePromoBlock(i, { bgClass: v })} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "home" && (
          <div style={{ marginTop: 20, maxWidth: 720 }}>
            <div style={cardStyle}>
              <h4 style={{ marginTop: 0 }}>Section titles</h4>
              <div style={{ display: "grid", gap: 12 }}>
                <Field label="Sale products title" value={settings.homeSections.saleTitle} onChange={(v) => updateHomeSections({ saleTitle: v })} />
                <Field label="Deals tag" value={settings.homeSections.dealsTag} onChange={(v) => updateHomeSections({ dealsTag: v })} />
                <Field label="Deals title" value={settings.homeSections.dealsTitle} onChange={(v) => updateHomeSections({ dealsTitle: v })} />
                <Field label="Deals description" value={settings.homeSections.dealsDescription} onChange={(v) => updateHomeSections({ dealsDescription: v })} multiline />
                <Field label="Deals end date (ISO, optional)" value={settings.homeSections.dealsEndDate} onChange={(v) => updateHomeSections({ dealsEndDate: v })} />
                <Field label="Deal product tag (Inventory)" value={settings.homeSections.dealsProductTag} onChange={(v) => updateHomeSections({ dealsProductTag: v })} />
                <Field label="Best seller title" value={settings.homeSections.bestSellerTitle} onChange={(v) => updateHomeSections({ bestSellerTitle: v })} />
                <Field label="Best seller tag (Inventory)" value={settings.homeSections.bestSellerTag} onChange={(v) => updateHomeSections({ bestSellerTag: v })} />
              </div>
              <p style={{ fontSize: 13, color: "#666", marginTop: 12 }}>
                Tag products in Inventory with <code>deal-of-day</code> or <code>bestseller</code> (comma-separated tags) to feature them on the homepage.
              </p>
            </div>
            {settings.homeTabs.map((homeTab, i) => (
              <div key={homeTab.id} style={cardStyle}>
                <h4 style={{ marginTop: 0 }}>Home tab {i + 1}</h4>
                <div style={{ display: "grid", gap: 12 }}>
                  <Field label="Tab ID" value={homeTab.id} onChange={(v) => updateHomeTab(i, { id: v })} />
                  <Field label="Tab label" value={homeTab.label} onChange={(v) => updateHomeTab(i, { label: v })} />
                  <Field label="Category filter (silk, cotton, designer, or exact category name)" value={homeTab.filter} onChange={(v) => updateHomeTab(i, { filter: v })} />
                </div>
              </div>
            ))}
            <div style={cardStyle}>
              <h4 style={{ marginTop: 0 }}>Service bar</h4>
              {settings.serviceBar.map((item, i) => (
                <div key={i} style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                  <Field
                    label={`Service ${i + 1} title`}
                    value={item.title}
                    onChange={(v) =>
                      setSettings((s) => ({
                        ...s,
                        serviceBar: s.serviceBar.map((row, j) => (j === i ? { ...row, title: v } : row)),
                      }))
                    }
                  />
                  <Field
                    label="Description"
                    value={item.text}
                    onChange={(v) =>
                      setSettings((s) => ({
                        ...s,
                        serviceBar: s.serviceBar.map((row, j) => (j === i ? { ...row, text: v } : row)),
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "content" && (
          <div style={{ marginTop: 20 }}>
            <div style={cardStyle}>
              <h4 style={{ marginTop: 0 }}>Testimonials</h4>
              <Field label="Section tag" value={settings.homeSections.testimonialTag} onChange={(v) => updateHomeSections({ testimonialTag: v })} />
              <Field label="Section title" value={settings.homeSections.testimonialTitle} onChange={(v) => updateHomeSections({ testimonialTitle: v })} />
            </div>
            {settings.testimonials.map((t, i) => (
              <div key={i} style={cardStyle}>
                <h4 style={{ marginTop: 0 }}>Testimonial {i + 1}</h4>
                <div style={{ display: "grid", gap: 12, maxWidth: 720 }}>
                  <Field label="Name" value={t.name} onChange={(v) => updateTestimonial(i, { name: v })} />
                  <Field label="Role" value={t.role} onChange={(v) => updateTestimonial(i, { role: v })} />
                  <Field label="Avatar image URL" value={t.img} onChange={(v) => updateTestimonial(i, { img: v })} />
                  <Field label="Quote" value={t.text} onChange={(v) => updateTestimonial(i, { text: v })} multiline />
                </div>
              </div>
            ))}
            <div style={cardStyle}>
              <h4 style={{ marginTop: 0 }}>Blog teasers</h4>
              <Field label="Section title" value={settings.homeSections.blogTitle} onChange={(v) => updateHomeSections({ blogTitle: v })} />
            </div>
            {settings.blogPosts.map((b, i) => (
              <div key={i} style={cardStyle}>
                <h4 style={{ marginTop: 0 }}>Blog post {i + 1}</h4>
                <div style={{ display: "grid", gap: 12, maxWidth: 720 }}>
                  <Field label="Title" value={b.title} onChange={(v) => updateBlog(i, { title: v })} />
                  <Field label="Date" value={b.date} onChange={(v) => updateBlog(i, { date: v })} />
                  <Field label="Image URL" value={b.img} onChange={(v) => updateBlog(i, { img: v })} />
                  <Field label="Link URL" value={b.href} onChange={(v) => updateBlog(i, { href: v })} />
                </div>
              </div>
            ))}
            <div style={cardStyle}>
              <h4 style={{ marginTop: 0 }}>Newsletter</h4>
              <Field label="Title" value={settings.homeSections.newsletterTitle} onChange={(v) => updateHomeSections({ newsletterTitle: v })} />
              <Field label="Description" value={settings.homeSections.newsletterDescription} onChange={(v) => updateHomeSections({ newsletterDescription: v })} multiline />
            </div>
          </div>
        )}

        {tab === "footer" && (
          <div style={{ marginTop: 20, maxWidth: 720 }}>
            <div style={cardStyle}>
              <h4 style={{ marginTop: 0 }}>Footer</h4>
              <Field label="Description" value={settings.footer.description} onChange={(v) => updateFooter({ description: v })} multiline />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
