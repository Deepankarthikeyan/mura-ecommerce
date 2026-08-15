import type { Metadata } from "next";
import HeaderOne from "@/components/header/Header";
import ShortService from "@/components/service/ShortService";
import FooterOne from "@/components/Footer";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata(
  "/return-refund-replacement-policy",
);

export default function ReturnRefundReplacementPolicyPage() {
  return (
    <div className="demo-one">
      <HeaderOne />

      <div className="rts-navigation-area-breadcrumb bg_light-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="navigator-breadcrumb-wrapper">
                <a href="/">Home</a>
                <i className="fa-regular fa-chevron-right" />
                <a className="current" href="/return-refund-replacement-policy">
                  Return, Refund &amp; Replacement Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-seperator bg_light-1">
        <div className="container">
          <hr className="section-seperator" />
        </div>
      </div>

      <div className="rts-pricavy-policy-area rts-section-gap">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="container-privacy-policy">
                <h1 className="title mb--20">Return, Refund &amp; Replacement Policy</h1>
                <p className="disc mb--40" style={{ color: "#616164" }}>
                  Last Updated: June 8, 2026
                </p>

                <p className="disc mb--15">
                  Thank you for choosing Aathithya Herbal. We are committed to providing high-quality herbal food
                  supplements and wellness products. Due to the nature of our products, we have established the
                  following Return, Refund, and Replacement Policy to ensure product safety, hygiene, and customer
                  satisfaction.
                </p>

                <div className="section-list mt--40">
                  <h2 className="title">Returns</h2>
                  <p className="disc">
                    As our products are classified as food supplements and consumable wellness products, we do not
                    accept returns of products once they have been delivered, except in the following cases:
                  </p>
                  <ul>
                    <li><p>The product received is damaged during transit.</p></li>
                    <li><p>The product received is defective.</p></li>
                    <li><p>An incorrect product was delivered.</p></li>
                    <li><p>The product has expired upon delivery.</p></li>
                  </ul>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">Reporting an Issue</h2>
                  <p className="disc">
                    If you receive a damaged, defective, incorrect, or expired product, please notify us within 24
                    hours of delivery by contacting our customer support team.
                  </p>
                  <p className="disc">To process your request, please provide:</p>
                  <ul>
                    <li><p>Order Number</p></li>
                    <li><p>Customer Name</p></li>
                    <li><p>Photographs of the product</p></li>
                    <li><p>Photographs of the packaging</p></li>
                    <li><p>A brief description of the issue</p></li>
                  </ul>
                  <p className="disc">
                    Requests received after 24 hours of delivery may not be eligible for replacement or refund.
                  </p>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">Replacement Policy</h2>
                  <p className="disc">
                    Upon verification of the issue, Aathithya Herbal may offer a replacement of the affected product
                    at no additional cost.
                  </p>
                  <p className="disc">
                    Replacement approval is subject to review of the information and photographs submitted by the
                    customer.
                  </p>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">Refund Policy</h2>
                  <p className="disc">Refunds may be issued only in the following situations:</p>
                  <ul>
                    <li><p>The ordered product is unavailable and cannot be fulfilled.</p></li>
                    <li>
                      <p>
                        A replacement cannot be provided for a verified damaged, defective, incorrect, or expired
                        product.
                      </p>
                    </li>
                    <li><p>An order is cancelled before dispatch.</p></li>
                  </ul>
                  <p className="disc">
                    Approved refunds will be processed through the original payment method within 7–10 business days,
                    depending on the payment provider and banking institution.
                  </p>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">Non-Returnable and Non-Refundable Items</h2>
                  <p className="disc">The following items are not eligible for return or refund:</p>
                  <ul>
                    <li><p>Opened products</p></li>
                    <li><p>Used products</p></li>
                    <li><p>Products with damaged seals due to customer handling</p></li>
                    <li><p>Products returned without prior approval</p></li>
                    <li>
                      <p>
                        Products purchased during special clearance or promotional sales, unless damaged or defective
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">Order Cancellation</h2>
                  <p className="disc">
                    Customers may request order cancellation before the order has been dispatched.
                  </p>
                  <p className="disc">
                    Once an order has been dispatched, cancellation requests cannot be accepted.
                  </p>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">Contact Us</h2>
                  <p className="disc">
                    For any return, refund, or replacement requests, please contact:
                  </p>
                  <p className="disc">
                    <strong>Aathithya Herbal</strong>
                    <br />
                    Email:{" "}
                    <a href="mailto:aathithyaherbalsoffice@gmail.com" style={{ color: "#1f72b0" }}>
                      aathithyaherbalsoffice@gmail.com
                    </a>
                    <br />
                    Phone:{" "}
                    <a href="tel:+919585515051" style={{ color: "#1f72b0" }}>
                      +91 95855 15051
                    </a>
                  </p>
                  <p className="disc">
                    We are committed to addressing genuine concerns promptly and ensuring a positive customer
                    experience.
                  </p>
                </div>

                <div
                  className="section-list mt--40"
                  style={{
                    background: "#f9fafb",
                    borderLeft: "4px solid #629D23",
                    padding: "24px",
                    borderRadius: "8px",
                  }}
                >
                  <p className="disc" style={{ marginBottom: 0 }}>
                    For safety and hygiene reasons, herbal food supplements cannot be returned once delivered.
                    However, if you receive a damaged, defective, incorrect, or expired product, please contact us
                    within 48 hours of delivery with photographs and order details. Upon verification, we will
                    arrange a replacement or refund as applicable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShortService />
      <FooterOne />
    </div>
  );
}
