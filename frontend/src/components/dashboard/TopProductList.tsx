function TopProductList({
    imageSrc, 
    imageAlt, 
    productName, 
    stock, 
    col2Title, 
    col2Value, 
    brandImage, 
    brandAlt,
    percentage,
    price
}: any) {
    return <div className="product-top-area-single">
        <div className="image-area">
        <a href="#" className="thumbnail">
            <img src={imageSrc} alt={imageAlt} />
        </a>
        <div className="information">
            <p>{productName}</p>
            <span>{stock} Items</span>
        </div>
        </div>
        <div className="coupon-code flex-direction-column">
        <p>{col2Title}</p>
        <span className="d-block">{col2Value}</span>
        </div>
        <div className="logo">
        <img src={brandImage} alt={brandAlt} />
        </div>
        <div className="indec">
        <div className="left">
            <p>{percentage}%</p>
            <span>₹{price}</span>
        </div>
        <img src="/assets/images-dashboard/brand/arrow-m.png" alt="ekomart" />
        </div>
    </div>
};

export default TopProductList;