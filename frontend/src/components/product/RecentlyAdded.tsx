"use client"
import React, { useEffect, useState } from 'react'
import ProductSmListMain from "@/components/product-main/ProductSmListMain";
// import Product from '@/data/Product.json';
import axios from 'axios';
import { shopProductPathSegment } from "@/lib/productSlug";
import { resolveProductListingImage } from "@/lib/shopProductDisplay";

// Skeleton loader component for product list items
const ProductSkeleton = () => (
  <div className="single-product-list" style={{ display: "flex", alignItems: "center", gap: "15px", padding: "15px 0" }}>
    <div style={{ width: "80px", height: "80px", backgroundColor: "#e0e0e0", borderRadius: "8px", animation: "pulse 1.5s ease-in-out infinite" }} />
    <div style={{ flex: 1 }}>
      <div style={{ width: "80%", height: "16px", backgroundColor: "#e0e0e0", borderRadius: "4px", marginBottom: "8px", animation: "pulse 1.5s ease-in-out infinite" }} />
      <div style={{ width: "50%", height: "14px", backgroundColor: "#e0e0e0", borderRadius: "4px", animation: "pulse 1.5s ease-in-out infinite" }} />
    </div>
  </div>
);

// Section skeleton with title and 4 product placeholders
const SectionSkeleton = ({ title }: { title: string }) => (
  <div className="feature-product-list-wrapper">
    <div className="title-area">
      <h2 className="title">{title}</h2>
    </div>
    {[1, 2, 3, 4].map((i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);

function RecentlyAdded() {

  const [postsSection1, setPostsSection1] = useState([])
  const [postsSection2, setPostsSection2] = useState([])
  const [postsSection3, setPostsSection3] = useState([])
  const [postsSection4, setPostsSection4] = useState([])

  const [Product, setProduct] = useState([])
  const [isLoading, setIsLoading] = useState(true)


  const handleFetchProducts = async () => {
    setIsLoading(true);

    try {

      const response = await axios.get("/api/products")
      const responses = response?.data?.body
      console.log('responses => ', responses)
      setProduct(responses)

      productCategoriser(responses)

    } catch (error) {

      console.log('error fetching the product in Recently added component : ', error)

    } finally {
      setIsLoading(false);
    }

  }

  const productCategoriser = (responses: any) => {

    // product content

    const postIndicesSection1 = [1, 2, 3, 4];
    const postIndicesSection2 = [5, 6, 7, 8];
    const postIndicesSection3 = [9, 10, 11, 12];
    const postIndicesSection4 = [13, 14, 15, 16];

    // Helper function to get posts from indices
    const getPostsByIndices = (indices: number[]): any[] => indices.map(index => responses[index]).filter(Boolean);

    // Prepare post groups
    const postsSectionOne: any = getPostsByIndices(postIndicesSection1);
    const postsSectionTwo: any = getPostsByIndices(postIndicesSection2);
    const postsSectionThree: any = getPostsByIndices(postIndicesSection3);
    const postsSectionFour: any = getPostsByIndices(postIndicesSection4);

    setPostsSection1(postsSectionOne)
    setPostsSection2(postsSectionTwo)
    setPostsSection3(postsSectionThree)
    setPostsSection4(postsSectionFour)

  }

  useEffect(()=>{
    handleFetchProducts()
  }, [])

  return (
    <div>
      {/* Inject keyframes for skeleton animation */}
      <style>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
      <>
        {/* four feature area start */}
        <div className="four-feature-in-one rts-section-gapTop">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-3">
                {/* single four feature */}
                {isLoading ? (
                  <SectionSkeleton title="Recently Added" />
                ) : (
                  <div className="feature-product-list-wrapper">
                    <div className="title-area">
                      <h2 className="title">Recently Added</h2>
                    </div>
                        {postsSection1.map((post: any, index: number) => (
                            <div
                                key={index}
                                className="single-product-list"
                            >
                                <ProductSmListMain
                                    Slug={shopProductPathSegment(post)}
                                    ProductImage={resolveProductListingImage(post)}
                                    ProductTitle={post.title}
                                    Price={post.price != null ? String(post.price) : ""}
                                    mrp={post.mrp}
                                />
                            </div>
                        ))}
                  </div>
                )}
                {/* single four feature end */}
              </div>
              <div className="col-lg-3">
                {/* single four feature */}
                {isLoading ? (
                  <SectionSkeleton title="Top Rated" />
                ) : (
                  <div className="feature-product-list-wrapper">
                    <div className="title-area">
                      <h2 className="title">Top Rated</h2>
                    </div>
                      {postsSection2.map((post: any, index: number) => (
                          <div
                              key={index}
                              className="single-product-list"
                          >
                              <ProductSmListMain
                                  Slug={shopProductPathSegment(post)}
                                  ProductImage={resolveProductListingImage(post)}
                                  ProductTitle={post.title}
                                  Price={post.price != null ? String(post.price) : ""}
                                  mrp={post.mrp}
                              />
                          </div>
                      ))}
                  </div>
                )}
                {/* single four feature end */}
              </div>
              <div className="col-lg-3">
                {/* single four feature */}
                {isLoading ? (
                  <SectionSkeleton title="Top Selling" />
                ) : (
                  <div className="feature-product-list-wrapper">
                    <div className="title-area">
                      <h2 className="title">Top Selling</h2>
                    </div>
                    {postsSection3.map((post: any, index: number) => (
                        <div
                            key={index}
                            className="single-product-list"
                        >
                            <ProductSmListMain
                                Slug={shopProductPathSegment(post)}
                                ProductImage={resolveProductListingImage(post)}
                                ProductTitle={post.title}
                                Price={post.price != null ? String(post.price) : ""}
                                mrp={post.mrp}
                            />
                        </div>
                    ))}
                  </div>
                )}
                {/* single four feature end */}
              </div>
              <div className="col-lg-3">
                <div className="add-area-start-feature">
                  <div className="thumbnail">
                    <img src="assets/images/add/01.jpg" alt="add_area" />
                  </div>
                  <div className="inner-add-content">
                    <div className="tag">Weekend Discount</div>
                    <h2 className="title">
                      Discover Real organic
                      <span>Flavors Vegetable</span>
                    </h2>
                    <a href="/shop" className="shop-now-goshop-btn">
                      <span className="text">Read Details</span>
                      <div className="plus-icon">
                        <i className="fa-sharp fa-regular fa-plus" />
                      </div>
                      <div className="plus-icon">
                        <i className="fa-sharp fa-regular fa-plus" />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* four feature area end */}
      </>

    </div>
  )
}

export default RecentlyAdded
