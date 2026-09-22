"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import "./ThankYouContent.css";

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const total = searchParams.get("total");

  return (
    <>
      <div className="rts-navigation-area-breadcrumb bg_light-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="navigator-breadcrumb-wrapper">
                <Link href="/">Home</Link>
                <i className="fa-regular fa-chevron-right" />
                <span className="current">Order Confirmation</span>
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

      <div className="rts-register-area rts-section-gap bg_light-1 thankyou-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="registration-wrapper-1 text-center py-5">
                <div className="thankyou-hero">
                  <div className="thankyou-icon">
                    <i className="fa-solid fa-check" />
                  </div>
                </div>

                <h2 className="thankyou-title">Thank You for Your Order!</h2>
                <p className="thankyou-lead">Your order has been successfully placed.</p>

                {orderId && (
                  <div className="thankyou-card">
                    <h3 className="thankyou-card-title">Order Details</h3>
                    <div className="thankyou-row">
                      <span className="thankyou-label">Order ID</span>
                      <span className="thankyou-value is-accent">{orderId}</span>
                    </div>
                    {total && (
                      <div className="thankyou-row">
                        <span className="thankyou-label">Total Amount</span>
                        <span className="thankyou-value is-accent">
                          ₹{parseFloat(total).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="thankyou-row">
                      <span className="thankyou-label">Order Date</span>
                      <span className="thankyou-value">
                        {new Date().toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="thankyou-row">
                      <span className="thankyou-label">Status</span>
                      <span className="thankyou-status">In Progress</span>
                    </div>
                  </div>
                )}

                <p className="thankyou-note">
                  A confirmation email has been sent to your email address.
                </p>

                <div className="thankyou-actions">
                  <Link href="/" className="rts-btn btn-primary">
                    Continue Shopping
                  </Link>
                  <Link href="/shop" className="rts-btn btn-primary">
                    View Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
