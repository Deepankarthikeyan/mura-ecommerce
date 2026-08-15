function BestSellersList({
    imageSrc, 
    imageAlt, 
    seller,
    noOfSales,
    category,
    totalSales
}: any) {
    return <div className="product-top-area-single bottom">
        <div className="image-area">
            <a href="#" className="thumbnail">
            <img src={imageSrc} alt={imageAlt} />
            </a>
            <div className="information">
            <p className="mb--5">{seller}</p>
            <span>{noOfSales} Purchases</span>
            </div>
        </div>
        <div className="coupon-code justify-content-center">
            <p>{category?.join(", ")}</p>
        </div>
        <div className="coupon-code justify-content-center">
            <p>₹{totalSales}</p>
        </div>
        <div className="indec mr--0">
            <img src="/assets/images-dashboard/grocery/02.png" alt="ekomart" />
        </div>
    </div>
}

export default BestSellersList