"use client"
import { Link } from '@mui/material'
import React from 'react'

function LessDiscountTwo() {
    return (
        <div>
            <>
                {/* weekly best deals area start */}
                <div className="weekly-best-deals-top-primary rts-section-gapTop">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="weekly-best-deals-top-primary-wrapper">
                                    <div className="title-area-between with-progress">
                                        <h2 className="title-left color-white mb--0">
                                            Hand Picked Products for 10% Offer
                                        </h2>
                                        <div className="countdown">
                                            <div className="countDown">10/05/2026 10:20:00</div>
                                        </div>
                                    </div>
                                    <div className="body-best-deals-padding">
                                        <div className="row g-4">
                                            {[
                                                {
                                                    imageHref: "/shop",
                                                    imageUrl: "assets/images/grocery/27.jpg",
                                                    imageAlt: "grocery",
                                                    reviews: 125,
                                                    productTitle: "Biozen Syrup Apple Cider Vinegar 400ml",
                                                    quantity: "500g Pack",
                                                    price: "₹36.00",
                                                    mrp: "₹36.00"
                                                },
                                                {
                                                    imageHref: "/shop",
                                                    imageUrl: "assets/images/grocery/28.jpg",
                                                    imageAlt: "grocery",
                                                    reviews: 125,
                                                    productTitle: "Biozen Syrup Apple Cider Vinegar 400ml",
                                                    quantity: "500g Pack",
                                                    price: "₹36.00",
                                                    mrp: "₹36.00"
                                                },
                                                {
                                                    imageHref: "/shop",
                                                    imageUrl: "assets/images/grocery/26.jpg",
                                                    imageAlt: "grocery",
                                                    reviews: 125,
                                                    productTitle: "Biozen Syrup Apple Cider Vinegar 400ml",
                                                    quantity: "500g Pack",
                                                    price: "₹36.00",
                                                    mrp: "₹36.00"
                                                }
                                            ]?.map((datum)=>{
                                                return <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                                                    <div className="single-shopping-card-one tranding-product with-progress">
                                                        <Link href={datum?.imageHref} className="thumbnail-preview">
                                                            <img src={datum?.imageUrl} alt={datum?.imageAlt} />
                                                        </Link>
                                                        <div className="body-content">
                                                            <div className="top">
                                                                <div className="stars-area">
                                                                    <i className="fa-solid fa-star" />
                                                                    <i className="fa-solid fa-star" />
                                                                    <i className="fa-solid fa-star" />
                                                                    <i className="fa-solid fa-star" />
                                                                    <i className="fa-solid fa-star" />
                                                                    <span>({datum?.reviews}) Reviews</span>
                                                                </div>
                                                                <Link href="/shop">
                                                                    <h4 className="title">
                                                                        {datum?.productTitle}
                                                                    </h4>
                                                                </Link>
                                                                <span className="availability">{datum?.quantity}</span>
                                                                <div className="price-area">
                                                                    <span className="current">{datum?.price}</span>
                                                                    <div className="previous">{datum?.mrp}</div>
                                                                </div>
                                                            </div>
                                                            <div className="bottom-content-deals mt--10">
                                                                <span>In Stock</span>
                                                                <div className="single-progress-area-incard">
                                                                    <div className="progress">
                                                                        <div
                                                                            className="progress-bar wow fadeInLeft"
                                                                            role="progressbar"
                                                                            style={{ width: "80%" }}
                                                                            aria-valuenow={25}
                                                                            aria-valuemin={0}
                                                                            aria-valuemax={100}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* weekly best deals area end */}
            </>

        </div>
    )
}

export default LessDiscountTwo