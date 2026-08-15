import type { Metadata } from "next";
import HeaderOne from "@/components/header/Header";
import ShortService from "@/components/service/ShortService";
import FooterOne from "@/components/Footer";
import { staticPageMetadata } from "@/lib/seo/buildPageMetadata";

export const generateMetadata: () => Promise<Metadata> = staticPageMetadata("/shipping-policy");

export default function ShippingPolicyPage() {
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
                <a className="current" href="/shipping-policy">
                  Shipping Policy
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
                <h1 className="title mb--20">Shipping Policy</h1>
                <p className="disc mb--40" style={{ color: "#616164" }}>
                  Last Updated: June 8, 2026
                </p>

                <p className="disc mb--15">
                  Thank you for shopping with Aathithya Herbal. We are committed to delivering your herbal food
                  supplements and wellness products safely and promptly.
                </p>

                <div className="section-list mt--40">
                  <h2 className="title">Order Processing</h2>
                  <ul>
                    <li>
                      <p>Orders are typically processed within 1–4 business days after payment confirmation.</p>
                    </li>
                    <li>
                      <p>Orders placed on weekends or public holidays will be processed on the next working day.</p>
                    </li>
                    <li>
                      <p>
                        During peak seasons, special promotions, or unforeseen circumstances, processing times may
                        be slightly extended.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">Shipping &amp; Delivery</h2>
                  <ul>
                    <li>
                      <p>We currently ship across Tamil Nadu.</p>
                    </li>
                    <li>
                      <p>
                        Delivery timelines generally range between 2–4 business days, depending on the destination
                        and courier service availability.
                      </p>
                    </li>
                    <li>
                      <p>Delivery times may vary for remote or rural locations.</p>
                    </li>
                  </ul>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">Shipping Charges</h2>
                  <ul>
                    <li>
                      <p>Shipping charges, if applicable, will be displayed at checkout before payment.</p>
                    </li>
                    <li>
                      <p>
                        Free shipping may be offered on selected orders, promotions, or minimum purchase values as
                        announced from time to time.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">Order Tracking</h2>
                  <ul>
                    <li>
                      <p>
                        Once your order has been shipped, you will receive a confirmation message/email containing
                        shipment and tracking details.
                      </p>
                    </li>
                    <li>
                      <p>
                        Customers can track their orders using the tracking link provided by the courier partner.
                      </p>
                    </li>
                  </ul>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">Delivery Delays</h2>
                  <p className="disc">While we strive to ensure timely delivery, delays may occur due to:</p>
                  <ul>
                    <li><p>Weather conditions</p></li>
                    <li><p>Natural disasters</p></li>
                    <li><p>Public holidays</p></li>
                    <li><p>Transport disruptions</p></li>
                    <li><p>Courier service issues</p></li>
                    <li><p>Other circumstances beyond our control</p></li>
                  </ul>
                  <p className="disc">
                    Aathithya Herbal shall not be held liable for delays caused by such factors.
                  </p>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">Incorrect Shipping Information</h2>
                  <p className="disc">
                    Customers are responsible for providing accurate shipping details at the time of placing an order.
                  </p>
                  <p className="disc">
                    If an incorrect address, phone number, or other delivery information is provided, resulting in
                    delivery failure or additional charges, Aathithya Herbal shall not be responsible for the delay
                    or loss.
                  </p>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">Damaged or Missing Packages</h2>
                  <p className="disc">
                    If you receive a damaged package or if any product is missing, please contact us within 24 hours
                    of delivery with:
                  </p>
                  <ul>
                    <li><p>Order Number</p></li>
                    <li><p>Photographs of the package and product (if damaged)</p></li>
                    <li><p>Details of the issue</p></li>
                  </ul>
                  <p className="disc">
                    We will review the matter and provide an appropriate resolution.
                  </p>
                </div>

                <div className="section-list mt--40">
                  <h2 className="title">Contact Us</h2>
                  <p className="disc">For any shipping-related questions, please contact:</p>
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
                    We appreciate your trust and thank you for choosing Aathithya Herbal for your wellness journey.
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
