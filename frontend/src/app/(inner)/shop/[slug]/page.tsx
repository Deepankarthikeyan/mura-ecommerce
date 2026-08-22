"use client";

import { useEffect, useState } from "react";
import HeaderOne from "@/components/header/Header";
import FooterOne from "@/components/Footer";
import MuraiBreadcrumb from "@/components/murai/MuraiBreadcrumb";
import MuraiProductDetail from "@/components/murai/MuraiProductDetail";
import ShortService from "@/components/service/ShortService";
import axios from "axios";
import { useParams } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resolveProductGalleryImages, resolveProductListingImage } from "@/lib/shopProductDisplay";

interface Product {
  _id?: string;
  productId?: string;
  slug?: string;
  category?: string;
  title?: string;
  price?: string;
  mrp?: string;
  discountPercentage?: string;
  description?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slugRaw = params?.slug;
  const slugStr = typeof slugRaw === "string" ? slugRaw : Array.isArray(slugRaw) ? slugRaw[0] ?? "" : "";

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slugStr) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    (async () => {
      try {
        const response = await axios.get(`/api/products`, { params: { lookup: slugStr } });
        const data = response?.data?.body;
        if (!cancelled) {
          setProduct(data ?? null);
          const images = resolveProductGalleryImages(data);
          setActiveImage(images[0] || resolveProductListingImage(data));
        }
      } catch {
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slugStr]);

  const images = product ? resolveProductGalleryImages(product) : [];

  return (
    <div className="murai-home">
      <HeaderOne />
      <main>
        <MuraiBreadcrumb
          title={isLoading ? "Product" : (product?.title ?? "Product")}
          bannerImage="/assets/images/murai/banners/banner-shop.jpg"
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: isLoading ? "Loading..." : (product?.title ?? "Product") },
          ]}
        />
        <MuraiProductDetail
          loading={isLoading}
          title={product?.title ?? "Product"}
          category={product?.category}
          images={images.length ? images : activeImage ? [activeImage] : []}
          activeImage={activeImage}
          onSelectImage={setActiveImage}
          price={product?.price}
          mrp={product?.mrp}
          discountPercentage={product?.discountPercentage}
          description={product?.description}
        />
        <ShortService />
      </main>
      <FooterOne />
      <ToastContainer />
    </div>
  );
}
