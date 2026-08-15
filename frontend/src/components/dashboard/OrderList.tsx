function OrderList({
    imageSrc, 
    imageAlt, 
    productName,
    stock,
    price,
    date
}: any) {
    return <div className="product-top-area-single bottom">
        <div className="image-area">
        <a href="#" className="thumbnail">
            <img src={imageSrc} alt={imageAlt} />
        </a>
        <div className="information">
            <p>{productName}</p>
            <span>{stock} Items</span>
        </div>
        </div>
        <div className="coupon-code">
        <p>₹{price}</p>
        </div>
        <div className="indec mr--0">
        <p>{date}</p>
        </div>
    </div>
}

export default OrderList