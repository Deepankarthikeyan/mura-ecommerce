"use client";

import { useState } from 'react';
import Product from "@/data/Product.json";
import { useParams } from 'next/navigation';
import SubmitReviewSection from './SubmitReviewSection';

const ReviewSection: React.FC = () => {
  const { slug } = useParams(); // Get the slug from URL parameters
  const blogPost = Product.find(post => post.productId == slug);

  if (!blogPost) {
    return <div></div>;
  }


  type ModalType = 'one' | 'two' | 'three' | null;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const handleClose = () => setActiveModal(null);

    return <div>
        <div className="single-tab-content-shop-details">
            <div className="product-details-review-product-style">
            <div className="average-stars-area-left">
                <div className="top-stars-wrapper">
                <h4 className="review">5.0</h4>
                <div className="rating-disc">
                    <span>Average Rating</span>
                    <div className="stars">
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <span>(1 Reviews &amp; 0 Ratings)</span>
                    </div>
                </div>
                </div>
                <div className="average-stars-area">
                <h4 className="average">66.7%</h4>
                <span>Recommended (2 of 3)</span>
                </div>
                <div className="review-charts-details">
                {[
                    {
                        stars: 3,
                        review: "100%"
                    }
                ]?.map((datum, index)=>{
                    return <div key={index} className="single-review">
                        <div className="stars">
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-regular fa-star" />
                        </div>
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
                        <span className="pac">{datum?.review}</span>
                    </div>
                })}
                
                </div>
            </div>
            <SubmitReviewSection />
            </div>
        </div>
    </div>
};

export default ReviewSection;