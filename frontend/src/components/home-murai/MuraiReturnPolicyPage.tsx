import Link from "next/link";
import "./murai.css";
import MuraiHeader from "./MuraiHeader";
import MuraiShopBenefits from "./MuraiShopBenefits";
import MuraiShopFooter from "./MuraiShopFooter";

export default function MuraiReturnPolicyPage() {
  return (
    <div className="murai-home" data-page="policy">
      <MuraiHeader />
      <main>
        <section className="breadcrumb__section">
          <div className="breadcrumb__bg category-page-banner">
            <img
              className="breadcrumb__bg-image"
              src="/murai/categories/maheswari.webp"
              alt=""
              width={1536}
              height={1024}
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
            <p>
              See also our full <Link href="/shipping-policy">Shipping &amp; Return Policy</Link> for shipping
              timelines and order cancellation details.
            </p>

            <h2>Return and Replacement / Refund Policy</h2>
            <p>
              We will accept a return and replacement, only if the product has a manufacturing defect or is
              damaged during shipping. If your package appears damaged or there is any reason to suspect a
              damaged product, kindly make a <strong>parcel opening video without any editing and pause</strong>.
            </p>
            <p>
              To qualify for a replacement or refund, the customer shall provide a clear, unedited parcel
              opening video, captured from the moment the package is opened, showing the damage to the product.
              In case of manufacturing defects, the customer shall take video/photo of the defect.{" "}
              <strong>Without such video proof, replacements will not be processed.</strong>
            </p>
            <p>
              The customer shall initiate returns/replacement through the option available in the order details
              page. While initiating replacement, the customer must upload the parcel opening video or video/photo
              of the manufacturing defect in the returns/replacement page, as applicable, in the media upload
              option provided. Once the return is approved, the customer will get a notification through email.
              We reserve the right to unilaterally reject the replacement claim if there is sufficient reason to
              suspect foul play.
            </p>
            <p>
              We do not provide reverse pickup services. On receipt of notification regarding approval of
              return, the customer shall send back the defective/damaged product(s) to us via self-courier so we
              can replace it with a new product. Once the damaged/defective product reaches us, the replacement
              product will be shipped within <strong>2–3 business days</strong>. In case the product is out of
              stock, a refund will be issued through the original payment method, typically within{" "}
              <strong>7–10 business days</strong>.
            </p>
            <p>
              After the return request is approved and the damaged/defective product is shipped back by the
              customer, charges for return courier may be claimed by the customer after uploading the courier bill
              using the option available in the returns/replacement page. The refund shall be processed as we
              deem fit, and a refund of the courier charges will be issued through mutually accepted payment
              method, typically within <strong>7–10 business days</strong>.
            </p>
            <p>
              Need help? <Link href="/contact">Contact our support team</Link>.
            </p>
          </article>
        </section>
      </main>
      <MuraiShopBenefits />
      <MuraiShopFooter />
    </div>
  );
}
