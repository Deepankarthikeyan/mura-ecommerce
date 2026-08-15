"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ThankYouContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const total = searchParams.get('total');

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

            <div className="rts-register-area rts-section-gap bg_light-1">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="registration-wrapper-1 text-center py-5">
                                <div className="mb-4">
                                    <div
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            backgroundColor: "#d1fae5",
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            margin: "0 auto 20px"
                                        }}
                                    >
                                        <i
                                            className="fa-solid fa-check"
                                            style={{
                                                fontSize: "50px",
                                                color: "#10b981"
                                            }}
                                        />
                                    </div>
                                </div>

                                <h2 className="title mb-3" style={{ color: "#2C3C28" }}>
                                    Thank You for Your Order!
                                </h2>

                                <p className="mb-4" style={{ fontSize: "18px", color: "#666" }}>
                                    Your order has been successfully placed.
                                </p>

                                {orderId && (
                                    <div
                                        className="order-details mb-4"
                                        style={{
                                            backgroundColor: "#f9fafb",
                                            padding: "30px",
                                            borderRadius: "8px",
                                            maxWidth: "500px",
                                            margin: "0 auto"
                                        }}
                                    >
                                        <h4 style={{ color: "#2C3C28", marginBottom: "20px" }}>
                                            Order Details
                                        </h4>
                                        <div style={{ textAlign: "left" }}>
                                            <p style={{ marginBottom: "10px" }}>
                                                <strong>Order ID:</strong>{" "}
                                                <span style={{ color: "#629D23" }}>{orderId}</span>
                                            </p>
                                            {total && (
                                                <p style={{ marginBottom: "10px" }}>
                                                    <strong>Total Amount:</strong>{" "}
                                                    <span style={{ color: "#629D23", fontWeight: 600 }}>
                                                        ₹{parseFloat(total).toFixed(2)}
                                                    </span>
                                                </p>
                                            )}
                                            <p style={{ marginBottom: "10px" }}>
                                                <strong>Order Date:</strong>{" "}
                                                {new Date().toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <p style={{ marginBottom: "0" }}>
                                                <strong>Status:</strong>{" "}
                                                <span
                                                    style={{
                                                        backgroundColor: "#d1fae5",
                                                        color: "#065f46",
                                                        padding: "4px 12px",
                                                        borderRadius: "4px",
                                                        fontSize: "14px",
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    In Progress
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <p className="mb-4" style={{ fontSize: "16px", color: "#666" }}>
                                    A confirmation email has been sent to your email address.
                                </p>

                                <div className="button-area mt-4" style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "nowrap" }}>
                                    <Link
                                        href="/"
                                        className="rts-btn btn-primary"
                                    >
                                        Continue Shopping
                                    </Link>
                                    <Link
                                        href="/shop"
                                        className="rts-btn btn-primary"
                                    >
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
