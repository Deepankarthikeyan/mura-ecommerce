import Link from "next/link";
import "./murai.css";
import MuraiHeader from "./MuraiHeader";
import MuraiShopBenefits from "./MuraiShopBenefits";
import MuraiShopFooter from "./MuraiShopFooter";
import { SITE_EMAIL, SITE_NAME, SITE_PHONE } from "@/lib/brand";

export default function MuraiReturnPolicyPage() {
  return (
    <div className="murai-home" data-page="policy">
      <MuraiHeader />
      <main>
        <section className="breadcrumb__section">
          <div className="breadcrumb__bg">
            <img
              className="breadcrumb__bg-image"
              src="/murai/banners/banner-shop.jpg"
              alt=""
              width={1600}
              height={334}
              decoding="async"
            />
            <div className="container">
              <div className="breadcrumb__content">
                <h1 className="breadcrumb__content--title">Return &amp; Refund Policy</h1>
                <ul className="breadcrumb__content--menu">
                  <li className="breadcrumb__content--menu__items">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb__content--menu__items">
                    <span>Returns</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section policy-section">
          <article className="policy-card">
            <p className="policy-updated">Last updated: 30 August 2026</p>
            <p>
              Thank you for shopping at {SITE_NAME}. We sell handpicked silk, cotton, Banarasi, Kanjivaram
              and designer sarees from Podanur, Coimbatore. This policy explains how returns, replacements,
              refunds, and cancellations work for orders placed on our website.
            </p>

            <div className="policy-callout">
              Unused sarees can be returned within <strong>30 days of delivery</strong>, as long as tags
              and original packing are intact. Damaged, defective, or incorrect sarees are replaced or
              refunded after we verify your request.
            </div>

            <h2>Returns</h2>
            <p>
              You may return a saree within 30 days of delivery if it is unused, unwashed, unaltered, and
              in the same condition you received it — with all tags, blouse pieces (if included), and
              original packaging.
            </p>
            <p>We also accept returns or replacements when:</p>
            <ul>
              <li>The saree arrived damaged in transit</li>
              <li>There is a manufacturing defect in the weave, border, or pallu</li>
              <li>You received a different saree from the one you ordered</li>
              <li>The package is missing an item shown on your invoice</li>
            </ul>

            <h2>How to raise a request</h2>
            <p>
              Write to us or use your account orders page as soon as you notice an issue. For damaged or
              wrong items, please contact us within 48 hours of delivery so we can take it up with the
              courier.
            </p>
            <p>Please share:</p>
            <ul>
              <li>Order number and registered name</li>
              <li>Clear photographs of the saree, tags, and outer packaging</li>
              <li>A short note on the issue (damage, defect, wrong item, or unused return)</li>
            </ul>
            <p>
              Approved pickups are arranged in serviceable pin codes. If pickup is not available, we will
              share the return address. Please do not send a saree back without confirmation.
            </p>

            <h2>Replacement</h2>
            <p>
              After we verify the saree, {SITE_NAME} may send a replacement of the same design at no extra
              cost, subject to stock. If that saree is no longer available, we will offer another saree of
              equal value or a refund, as you prefer.
            </p>

            <h2>Refunds</h2>
            <p>Refunds are issued when:</p>
            <ul>
              <li>The saree cannot be replaced from current stock</li>
              <li>An unused return is approved within the 30-day window</li>
              <li>The order is cancelled before it is dispatched</li>
              <li>We are unable to fulfil the order</li>
            </ul>
            <p>
              Approved refunds go back to the original payment method within 7–10 business days. Cash on
              delivery is not available on {SITE_NAME}, so refunds are never paid in cash.
            </p>

            <h2>What we cannot accept</h2>
            <ul>
              <li>Sarees that have been worn, washed, stained, or altered</li>
              <li>Sarees returned without tags, blouse piece, or original packing</li>
              <li>Returns raised after 30 days of delivery</li>
              <li>Sarees sent back without prior approval</li>
              <li>Custom-draped or tailored pieces made to your measurements</li>
            </ul>

            <h2>Order cancellation</h2>
            <p>
              You may cancel an order before it is dispatched. Once the parcel has left our store, it
              cannot be cancelled in transit — please wait for delivery and then raise a return if the
              saree is unused.
            </p>

            <h2>Contact</h2>
            <p>
              For return, refund, or replacement help:
            </p>
            <p className="policy-contact">
              <strong>{SITE_NAME}</strong>
              <br />
              Podanur, Coimbatore, Tamil Nadu 641023, India
              <br />
              Email:{" "}
              <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a>
              <br />
              Phone:{" "}
              <a href="tel:02123333444">{SITE_PHONE}</a>
            </p>
            <p>
              We review genuine requests promptly so you can keep shopping sale sarees with confidence.{" "}
              <Link href="/contact">Write to us</Link> if you need help with an order.
            </p>
          </article>
        </section>
      </main>
      <MuraiShopBenefits />
      <MuraiShopFooter />
    </div>
  );
}
