"use client";

import { useState } from 'react';
import Product from "@/data/Product.json";
import { useParams } from 'next/navigation';

const SubmitReviewSection: React.FC = () => {
  const { slug } = useParams(); // Get the slug from URL parameters
  const blogPost = Product.find(post => post.productId == slug);

  if (!blogPost) {
    return <div></div>;
  }


  type ModalType = 'one' | 'two' | 'three' | null;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const handleClose = () => setActiveModal(null);

    return <div className="submit-review-area">
        <form action="#" className="submit-review-area">
        <h5 className="title">Submit Your Review</h5>
        <div className="your-rating">
            <span>Your Rating Of This Product :</span>
            <div className="stars">
            <i className="fa-solid fa-star" />
            <i className="fa-solid fa-star" />
            <i className="fa-solid fa-star" />
            <i className="fa-solid fa-star" />
            <i className="fa-solid fa-star" />
            </div>
        </div>
        <div className="half-input-wrapper">
            <div className="half-input">
            <input type="text" placeholder="Your Name*" />
            </div>
            <div className="half-input">
            <input type="text" placeholder="Your Email *" />
            </div>
        </div>
        <textarea
            name="#"
            id="#"
            placeholder="Write Your Review"
            defaultValue={""}
        />
        <button className="rts-btn btn-primary">
            SUBMIT REVIEW
        </button>
        </form>
    </div>
};

export default SubmitReviewSection;