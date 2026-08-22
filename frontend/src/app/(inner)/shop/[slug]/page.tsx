"use client";

import { useEffect, useState } from 'react';
import HeaderOne from "@/components/header/Header";
import MuraiBreadcrumb from "@/components/murai/MuraiBreadcrumb";
import ShortService from "@/components/service/ShortService";
import RelatedProduct from "@/components/product/RelatedProduct";
import FooterOne from "@/components/Footer";
import axios from 'axios'
import { useParams } from 'next/navigation';

import { useCart } from "@/components/header/CartContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductImage from '@/components/product-page/ProductImage';
import ProductThumbnail from '@/components/product-page/productThumbnail';
import CategoryBadge from '@/components/product-page/CategoryBadge';
import ProductDescription from '@/components/product-page/ProductDescription';
import ReviewSection from '@/components/review-section/ReviewSection';
import { sanitizeProductDescriptionHtml } from '@/lib/sanitizeProductHtml';
import {
  parseMoneyAmount,
  resolveProductAdMediaUrl,
  resolveProductGalleryImages,
  resolveProductListingImage,
} from '@/lib/shopProductDisplay';

// Product interface to fix TypeScript errors
interface Product {
  _id?: string;
  id?: number;
  productId?: string;
  slug?: string;
  image?: string;
  bannerImg?: string | string[];
  productAdMediaUrl?: string;
  category?: string;
  title?: string;
  author?: string;
  publishedDate?: string;
  quantity?: string;
  price?: string;
  mrp?: string;
  discountPercentage?: string;
  description?: string;
  reviews?: number;
  ratings?: number;
  tags?: string[];
  stock?: number;
}

/** Strikethrough MRP only when it is greater than sale (hides when equal or invalid). */
function showMrpVersusSale(price: string | undefined, mrp: string | undefined): boolean {
  const saleNum = parseFloat(String(price ?? "").replace(/,/g, "").trim());
  const mrpNum = parseFloat(String(mrp ?? "").replace(/,/g, "").trim());
  return Number.isFinite(saleNum) && Number.isFinite(mrpNum) && mrpNum > saleNum;
}

// Skeleton component for product detail
const ProductDetailSkeleton = () => (
  <div className="product-details-popup">
    <div className="details-product-area">
      <div className="product-thumb-area">
        {/* Main image skeleton */}
        <div style={{ width: "100%", height: "400px", backgroundColor: "#e0e0e0", borderRadius: "8px", animation: "pulse 1.5s ease-in-out infinite" }} />
        {/* Thumbnails skeleton */}
        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ width: "72px", height: "72px", backgroundColor: "#e0e0e0", borderRadius: "4px", animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {/* Category and rating skeleton */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <div style={{ width: "80px", height: "24px", backgroundColor: "#e0e0e0", borderRadius: "4px", animation: "pulse 1.5s ease-in-out infinite" }} />
          <div style={{ width: "120px", height: "20px", backgroundColor: "#e0e0e0", borderRadius: "4px", animation: "pulse 1.5s ease-in-out infinite" }} />
        </div>
        {/* Title skeleton */}
        <div style={{ width: "80%", height: "32px", backgroundColor: "#e0e0e0", borderRadius: "4px", marginBottom: "20px", animation: "pulse 1.5s ease-in-out infinite" }} />
        {/* Description skeleton */}
        <div style={{ width: "100%", height: "60px", backgroundColor: "#e0e0e0", borderRadius: "4px", marginBottom: "20px", animation: "pulse 1.5s ease-in-out infinite" }} />
        {/* Price skeleton */}
        <div style={{ width: "150px", height: "28px", backgroundColor: "#e0e0e0", borderRadius: "4px", marginBottom: "20px", animation: "pulse 1.5s ease-in-out infinite" }} />
        {/* Button skeleton */}
        <div style={{ width: "180px", height: "48px", backgroundColor: "#e0e0e0", borderRadius: "25px", animation: "pulse 1.5s ease-in-out infinite" }} />
      </div>
    </div>
  </div>
);

const CompareElements: React.FC = () => {
  const params = useParams();
  const slugRaw = params?.slug;
  const slugStr =
    typeof slugRaw === "string" ? slugRaw : Array.isArray(slugRaw) ? slugRaw[0] ?? "" : "";

  const [blogPost, setBlogPost] = useState<Product | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slugStr) {
      setIsLoading(false);
      setBlogPost(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    (async () => {
      try {
        const response = await axios.get(`/api/products`, {
          params: { lookup: slugStr },
        });
        const responses = response?.data?.body;
        if (!cancelled) {
          setBlogPost(responses ?? null);
          setActiveImageIndex(0);
        }
      } catch (error) {
        console.log("error fetching the product in Recently added component : ", error);
        if (!cancelled) {
          setBlogPost(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slugStr]);

  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({
      id: Date.now(),
      image: resolveProductListingImage(blogPost),
      title: blogPost?.title ?? 'Default Product Title',
      price: parseMoneyAmount(blogPost?.price) ?? 0,
      quantity: 1,
      active: true,
    });
    setAdded(true);
    toast('Successfully Added To Cart!');
    setTimeout(() => setAdded(false), 5000);
  };

  const [activeTab, setActiveTab] = useState<string>('tab1');
  type ModalType = 'one' | 'two' | 'three' | null;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const handleClose = () => setActiveModal(null);

  const galleryImages = resolveProductGalleryImages(blogPost);
  const thumbnails = galleryImages.map((src, index) => ({
    id: `gallery-${index}`,
    src,
    alt: blogPost?.title ? `${blogPost.title} image ${index + 1}` : `Product image ${index + 1}`,
  }));
  const mainImage =
    galleryImages[activeImageIndex] ||
    galleryImages[0] ||
    resolveProductListingImage(blogPost);
  const adMediaUrl = resolveProductAdMediaUrl(blogPost);

  return (
    <div className="murai-home">
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
      <HeaderOne />
      <main>
      <MuraiBreadcrumb
        title={isLoading ? "Product" : (blogPost?.title ?? "Product")}
        bannerImage="/assets/images/murai/banners/banner-shop.jpg"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: isLoading ? "Loading..." : (blogPost?.title ?? "Product") },
        ]}
      />

      <div className="rts-chop-details-area rts-section-gap bg_light-1">
        <style>{`
          @media (min-width: 992px) {
            /* overflow:hidden on body/html breaks position:sticky.
               overflow:clip hides overflow without creating a scroll container. */
            html, body {
              overflow-x: clip !important;
              overflow-y: visible !important;
            }
            .shopdetails-style-1-wrapper .details-product-area {
              align-items: flex-start;
            }
            .shopdetails-style-1-wrapper .product-thumb-area {
              position: sticky;
              top: 100px;
              align-self: flex-start;
            }
            .shopdetails-style-1-wrapper .theiaStickySidebar {
              position: sticky;
              top: 100px;
            }
          }
        `}</style>
        <div className="container">
          <div className="shopdetails-style-1-wrapper">
            <div className="row g-5">
              <div className="col-xl-8 col-lg-8 col-md-12">
                <div className="product-details-popup-wrapper in-shopdetails">
                  <div className="rts-product-details-section rts-product-details-section2 product-details-popup-section">
                    {isLoading ? (
                      <ProductDetailSkeleton />
                    ) : (
                      <div className="product-details-popup">
                        <div className="details-product-area">
                          <div className="product-thumb-area">
                            <div className="cursor"></div>
                            <ProductImage image={mainImage} alt={blogPost?.title} />
                            <ProductThumbnail
                              thumbnails={thumbnails}
                              activeIndex={activeImageIndex}
                              onSelect={setActiveImageIndex}
                            />
                          </div>

                          <div className="">
                            <div className="product-status">
                              <CategoryBadge categoryName={blogPost?.category} />
                              <div className="rating-stars-group">
                                {(blogPost?.ratings ?? 0) > 0 && <div className="rating-star"><i className="fas fa-star" /></div>}
                                {(blogPost?.ratings ?? 0) > 1 && <div className="rating-star"><i className="fas fa-star" /></div>}
                                {(blogPost?.ratings ?? 0) > 2 && <div className="rating-star"><i className="fas fa-star" /></div>}
                                {(blogPost?.ratings ?? 0) > 3 && <div className="rating-star"><i className="fas fa-star" /></div>}
                                {(blogPost?.ratings ?? 0) > 4 && <div className="rating-star"><i className="fas fa-star-half-alt" /></div>}
                                <span>{blogPost?.reviews ?? 0} Reviews</span>
                              </div>
                            </div>
                            <h1 className="product-title">{blogPost?.title}</h1>
                            <span className="product-price mb--15 d-block" style={{ color: "#DC2626", fontWeight: 600 }}>
                              ₹{blogPost?.price}
                              {showMrpVersusSale(blogPost?.price, blogPost?.mrp) && (
                                <span className="old-price ml--15">₹{blogPost?.mrp}</span>
                              )}
                            </span>

                            <div className="product-bottom-action">
                              <a
                                href="#"
                                className="rts-btn btn-primary radious-sm with-icon"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleAdd();
                                }}
                              >
                                <div className="btn-text">Add to Cart</div>
                                <div className="arrow-icon"><i className="fa-regular fa-cart-shopping" /></div>
                                <div className="arrow-icon"><i className="fa-regular fa-cart-shopping" /></div>
                              </a>
                            </div>

                            <ProductDescription product={blogPost} />

                            <div
                              className="mt--20 mb--20 rich-product-html"
                              dangerouslySetInnerHTML={{
                                __html: sanitizeProductDescriptionHtml(blogPost?.description),
                              }}
                            />

                            {/* <div className="share-option-shop-details">
                              <div className="single-share-option"><div className="icon"><i className="fa-regular fa-heart" /></div><span>Add To Wishlist</span></div>
                              <div className="single-share-option"><div className="icon"><i className="fa-solid fa-share" /></div><span>Share On social</span></div>
                              <div className="single-share-option"><div className="icon"><i className="fa-light fa-code-compare" /></div><span>Compare</span></div>
                            </div> */}

                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* <div className="product-discription-tab-shop mt--50">
                  <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        onClick={() => setActiveTab('tab1')}
                        className={`nav-link ${activeTab === 'tab1' ? 'active' : ''}`}>
                        Product Details
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        onClick={() => setActiveTab('tab2')}
                        className={`nav-link ${activeTab === 'tab2' ? 'active' : ''}`}>
                        Additional Information
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        onClick={() => setActiveTab('tab3')}
                        className={`nav-link ${activeTab === 'tab3' ? 'active' : ''}`}>
                        Customer Reviews (01)
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content" id="myTabContent">
                    {activeTab === 'tab1' &&
                      <div>
                        <div className="single-tab-content-shop-details">
                          <p className="disc">
                            Uninhibited carnally hired played in whimpered dear gorilla
                            koala depending and much yikes off far quetzal goodness and
                            from for grimaced goodness unaccountably and meadowlark near
                            unblushingly crucial scallop tightly neurotic hungrily some
                            and dear furiously this apart.
                          </p>
                          <div className="details-row-2">
                            <div className="left-area">
                              <img src="/assets/images/shop/06.jpg" alt="shop" />
                            </div>
                            <div className="right">
                              <h4 className="title">
                                All Natural Italian-Style Chicken Meatballs
                              </h4>
                              <p className="mb--25">
                                Pellentesque habitant morbi tristique senectus et netus
                                et malesuada fames ac turpis egestas Vestibulum tortor
                                quam, feugiat vitae, ultricies eget, tempor sit amet,
                                ante. ibero sit amet quam egestas semperAenean ultricies
                                mi vitae est Mauris placerat eleifend.
                              </p>
                              <ul className="bottom-ul">
                                <li>
                                  Elementum sociis rhoncus aptent auctor urna justo
                                </li>
                                <li>
                                  Habitasse venenatis gravida nisl, sollicitudin posuere
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>




                      </div>}
                    {activeTab === 'tab2' &&
                      <div>
                        <div className="single-tab-content-shop-details">
                          <p className="disc">
                            Uninhibited carnally hired played in whimpered dear gorilla
                            koala depending and much yikes off far quetzal goodness and
                            from for grimaced goodness unaccountably and meadowlark near
                            unblushingly crucial scallop tightly neurotic hungrily some
                            and dear furiously this apart.
                          </p>
                          <div className="table-responsive table-shop-details-pd">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th>Kitchen Fade Defy</th>
                                  <th>5KG</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>PRAN Full Cream Milk Powder</td>
                                  <td>3KG</td>
                                </tr>
                                <tr>
                                  <td>Net weight</td>
                                  <td>8KG</td>
                                </tr>
                                <tr>
                                  <td>Brand</td>
                                  <td>Reactheme</td>
                                </tr>
                                <tr>
                                  <td>Item code</td>
                                  <td>4000000005</td>
                                </tr>
                                <tr>
                                  <td>Product type</td>
                                  <td>Powder milk</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <p className="cansellation mt--20">
                            <span> Return/cancellation:</span> No change will be
                            applicable which are already delivered to customer. If
                            product quality or quantity problem found then customer can
                            return/cancel their order on delivery time with presence of
                            delivery person.
                          </p>
                          <p className="note">
                            <span>Note:</span> Product delivery duration may vary due to
                            product availability in stock.
                          </p>
                        </div>
                      </div>}

                    {activeTab === 'tab3' &&
                      <ReviewSection /> }

                  </div>
                </div> */}

              </div>

              <div className="col-xl-3 col-lg-4 col-md-12 offset-xl-1  rts-sticky-column-item">
                <div className="theiaStickySidebar">
                  {adMediaUrl ? (
                    <div
                      className="shop-sight-sticky-sidevbar mb--20"
                      style={{
                        paddingTop: "5px",
                        paddingLeft: "5px",
                        paddingRight: "5px",
                        paddingBottom: "5px",
                        boxSizing: "border-box",
                      }}
                    >
                      <img
                        src={adMediaUrl}
                        alt="Product promotion"
                        style={{ width: "100%", height: "auto", display: "block", marginBottom: 0 }}
                      />
                    </div>
                  ) : null}
                  <div className="our-payment-method">
                    <h5 className="title">Guaranteed Safe Checkout</h5>
                    <ul
                      className="payment-gateway-icons"
                      aria-label="Accepted payment methods"
                      style={{
                        listStyle: "none",
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: "10px",
                        margin: "12px 0 0",
                        padding: 0,
                      }}
                    >
                      {(
                        [
                          { type: "icon" as const, icon: "fa-brands fa-cc-visa", label: "Visa" },
                          { type: "icon" as const, icon: "fa-brands fa-cc-mastercard", label: "Mastercard" },
                          { type: "icon" as const, icon: "fa-brands fa-cc-amex", label: "American Express" },
                          { type: "icon" as const, icon: "fa-brands fa-google-pay", label: "Google Pay / UPI" },
                          { type: "img" as const, src: "/assets/images/payment/razorpay.svg", label: "Razorpay" },
                        ]
                      ).map((item) => (
                        <li
                          key={item.label}
                          title={item.label}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "44px",
                            height: "32px",
                            borderRadius: "6px",
                            background: "#fff",
                            border: "1px solid #e2e2e2",
                            color: "#2C3C28",
                            fontSize: "22px",
                          }}
                        >
                          {item.type === "img" ? (
                            <img src={item.src} alt="" width={20} height={20} style={{ display: "block" }} />
                          ) : (
                            <i className={item.icon} aria-hidden="true" />
                          )}
                          <span className="visually-hidden">{item.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <RelatedProduct /> */}
      <ShortService />
      </main>
      <FooterOne />
      <ToastContainer />
    </div>
  );
};

export default CompareElements;
