"use client";

const ProductDescription = ({product}: any) => {

  return <div className="product-uniques">
    <span className="sku product-unipue mb--10"><strong>SKU:</strong> {product?.productId}</span>
    <span className="catagorys product-unipue mb--10"><strong>Categories:</strong> {product?.category}</span>
    <span className="tags product-unipue mb--10"><strong>Tags:</strong> {product?.tags?.join(", ")}</span>
  </div>

};

export default ProductDescription;
