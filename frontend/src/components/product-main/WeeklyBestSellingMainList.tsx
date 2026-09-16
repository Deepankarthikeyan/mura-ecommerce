"use client"
import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from "@/components/header/CartContext";
import { useWishlist } from "@/components/header/WishlistContext";
import { parseMoneyAmount } from '@/lib/shopProductDisplay';

interface BlogGridMainProps {
    Slug: string;
    ProductImage: string;
    ProductTitle?: string;
    Price?: string;
}

// Helper function to truncate text to 3 words
const truncateToThreeWords = (text: string | undefined): string => {
    if (!text) return 'How to growing your business';
    const words = text.trim().split(/\s+/);
    if (words.length <= 3) return text;
    return words.slice(0, 3).join(' ') + '...';
};

const BlogGridMain: React.FC<BlogGridMainProps> = ({
    Slug,
    ProductImage,
    ProductTitle,
    Price,
}) => {


    type ModalType = 'one' | 'two' | 'three' | null;
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    // cart item
    const { addToCart } = useCart(); // Now works

    const handleAdd = () => {
        addToCart({
            id: Date.now(), // unique ID
            image: `${ProductImage}`,
            title: ProductTitle ?? 'Default Product Title',
            price: parseMoneyAmount(Price) ?? 0,
            quantity: 1,
            active: true,
        });
    };

    const { addToWishlist } = useWishlist();
    const handleWishlist = () => {
        addToWishlist({
            id: Date.now(),
            image: `${ProductImage}`,
            title: ProductTitle ?? 'Default Product Title',
            price: parseMoneyAmount(Price) ?? 0,
            quantity: 1,
        });
    };




    return (
        <>
            {/* iamge and sction area start */}
            <div className="image-and-action-area-wrapper">
                <Link href={`/shop/${Slug}`} className="thumbnail-preview">
                    <div className="badge">
                        <span>
                            25% <br />
                            Off
                        </span>
                        <i className="fa-solid fa-bookmark" />
                    </div>
                    <img src={`${ProductImage}`} alt="grocery" />
                </Link>
                <div className="action-share-option">
                    <span
                        className="single-action openuptip message-show-action"
                        data-flow="up"
                        title="Add To Wishlist"
                        onClick={handleWishlist}
                    >
                        <i className="fa-light fa-heart" />
                    </span>
                    <span
                        className="single-action openuptip"
                        data-flow="up"
                        title="Compare"
                        onClick={() => setActiveModal('one')}
                    >
                        <i className="fa-solid fa-arrows-retweet" />
                    </span>
                    <span
                        className="single-action openuptip cta-quickview product-details-popup-btn"
                        data-flow="up"
                        title="Quick View" onClick={() => setActiveModal('two')}
                    >
                        <i className="fa-regular fa-eye" />
                    </span>
                </div>
            </div>
            {/* iamge and sction area start */}
            <div className="body-content">
                <Link href={`/shop/${Slug}`}>
                    <h4 className="title">
                        {truncateToThreeWords(ProductTitle)}
                    </h4>
                </Link>
                <span className="availability">500g Pack</span>
                <div className="price-area">
                    <span className="current">{`₹${Price}`}</span>
                    <div className="previous">₹36.00</div>
                </div>
                <div className="cart-counter-action">
                    <div className="quantity-edit">
                        <input type="text" className="input" defaultValue={1} />
                        <div className="button-wrapper-action">
                            <button className="button minus">
                                <i className="fa-regular fa-chevron-down" />
                            </button>
                            <button className="button plus">
                                +<i className="fa-regular fa-chevron-up" />
                            </button>
                        </div>
                    </div>
                    <Link href="#" className="rts-btn btn-primary radious-sm with-icon"
                        onClick={e => {
                            e.preventDefault();
                            handleAdd();
                        }}
                    >
                        <div className="btn-text add-cart">Add</div>
                        <div className="arrow-icon">
                            <i className="fa-regular fa-cart-shopping" />
                        </div>
                        <div className="arrow-icon">
                            <i className="fa-regular fa-cart-shopping" />
                        </div>
                    </Link>
                </div>
            </div>

        </>
    );
};

export default BlogGridMain;