'use client';

import { useState, useEffect } from 'react';
import ProductDetails from "@/components/modal/ProductDetails";
import CompareModal from "@/components/modal/CompareModal";
import { useCart } from "@/components/header/CartContext";
import { useWishlist } from "@/components/header/WishlistContext";
import { useCompare } from '@/components/header/CompareContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { parseMoneyAmount } from '@/lib/shopProductDisplay';

function showMrpVersusSale(price: string | undefined, mrp: string | undefined): boolean {
  const saleNum = parseFloat(String(price ?? "").replace(/,/g, "").trim());
  const mrpNum = parseFloat(String(mrp ?? "").replace(/,/g, "").trim());
  return Number.isFinite(saleNum) && Number.isFinite(mrpNum) && mrpNum > saleNum;
}

function discountPercentPositive(value: unknown): boolean {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
}

const BlogGridMain: React.FC<any> = ({
  Slug,
  ProductImage,
  ProductTitle,
  Price,
  productQuantity,
  mrp,
  discountPercentage,
  ProductCategory,
}) => {

  // ✅ Swiper Anti-Hydration Fix (safe version)
  const [domReady, setDomReady] = useState(false);

  useEffect(() => {
    setDomReady(true);
  }, []);

  // Other hooks (must stay in order)
  type ModalType = 'one' | 'two' | 'three' | null;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const handleClose = () => setActiveModal(null);

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { addToCompare } = useCompare();

  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  // quantity
  const [quantity, setQuantity] = useState(1);
  const increase = () => setQuantity(prev => prev + 1);
  const decrease = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleAdd = () => {
    addToCart({
      id: Date.now(),
      image: `${ProductImage}`,
      title: ProductTitle ?? 'Default Product Title',
      price: parseMoneyAmount(Price) ?? 0,
      quantity,
      active: true,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 5000);
  };

  const handleWishlist = () => {
    addToWishlist({
      id: Date.now(),
      image: `${ProductImage}`,
      title: ProductTitle ?? 'Default Product Title',
      price: parseMoneyAmount(Price) ?? 0,
      quantity: 1,
    });
    setWishlisted(true);
    setTimeout(() => setWishlisted(false), 3000);
  };

  const handleCompare = () => {
    addToCompare({
      image: `${ProductImage}`,
      name: ProductTitle ?? 'Default Product Title',
      price: Price ?? '0',
      description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      rating: 5,
      ratingCount: 25,
      weight: '500g',
      inStock: true,
    });
  };

  const compare = () => toast('Successfully Add To Compare !');
  const addcart = () => toast('Successfully Add To Cart !');
  const wishList = () => toast('Successfully Add To Wishlist !');
  const onSale = showMrpVersusSale(Price, mrp) || discountPercentPositive(discountPercentage);
  const categoryLabel =
    typeof ProductCategory === "string" && ProductCategory.trim() ? ProductCategory.trim() : "";

  return (
    <>
      {/* ⛔ Don't render UI until DOM ready, but WITHOUT breaking hooks */}
      {!domReady ? null : (
        <>
          <div className="image-and-action-area-wrapper" style={{ backgroundColor: '#fff' }}>
            <Link href={`/shop/${Slug}`} className="thumbnail-preview">
              {onSale ? <span className="fashion-sale-badge">SALE</span> : null}
              <div className="thumbnail-preview-inner" style={{ height: '200px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={`${ProductImage}`} alt="grocery" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
              </div>
            </Link>
          </div>

          <div className="body-content">
            {categoryLabel ? <span className="fashion-category">{categoryLabel}</span> : null}
            <Link href={`/shop/${Slug}`} style={{ display: 'block', textAlign: 'center' }}>
              <h4 className="title">{ProductTitle ?? 'How to growing your business'}</h4>
            </Link>
            <div className="ayurvedha-availability" style={{ textAlign: 'center' }}>
              <span className="availability" style={{ fontWeight: 700 }}>{productQuantity}</span>
            </div>
            <div className="price-area" style={{ justifyContent: 'center' }}>
              <span className="current">{`₹${Price}`}</span>
              {showMrpVersusSale(Price, mrp) && (
                <div className="previous">{`₹${mrp}`}</div>
              )}
            </div>
            <div className="fashion-rating" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <i key={i} className="fa-solid fa-star" />
              ))}
            </div>
            <div className="fashion-card-divider" />

            <div className="cart-counter-action">
              <div className="quantity-edit">
                <input
                  type="text"
                  className="input"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                />
                <div className="button-wrapper-action">
                  <button className="button minus" onClick={decrease}>
                    <i className="fa-regular fa-chevron-down" />
                  </button>
                  <button className="button plus" onClick={increase}>
                    +<i className="fa-regular fa-chevron-up" />
                  </button>
                </div>
              </div>

              <Link
                href="#"
                className="rts-btn btn-primary add-to-card radious-sm with-icon"
                onClick={e => {
                  e.preventDefault();
                  handleAdd();
                  addcart();
                }}
              >
                <div className="btn-text ayurvedha-add-label">{added ? 'Added' : 'Add'}</div>
                <div className="btn-text fashion-add-label">{added ? 'Added' : '+ Add to cart'}</div>
                <div className="arrow-icon">
                  <i className={added ? "fa-solid fa-check" : "fa-regular fa-cart-shopping"} />
                </div>
                <div className="arrow-icon">
                  <i className={added ? "fa-solid fa-check" : "fa-regular fa-cart-shopping"} />
                </div>
              </Link>
              <button
                type="button"
                className="fashion-wishlist-btn"
                aria-label="Add to wishlist"
                title="Add to wishlist"
                onClick={() => {
                  handleWishlist();
                  wishList();
                }}
              >
                <i className={wishlisted ? "fa-solid fa-heart" : "fa-light fa-heart"} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modals always mounted (does not affect swiper width) */}
      <CompareModal show={activeModal === 'one'} handleClose={handleClose} />
      <ProductDetails
        show={activeModal === 'two'}
        handleClose={handleClose}
        productImage={`${ProductImage}`}
        productTitle={ProductTitle ?? 'Default Product Title'}
        productPrice={Price ?? '0'}
      />
    </>
  );
};

export default BlogGridMain;
