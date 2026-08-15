function OrderSummaryList({
    imageSrc, 
    imageAlt,
    productName,
    category,
    price,
    quantity,
    color,
    size,
}: any) {
    return <tr>
        <td>
        <div className="item">
            <div className="thumbnail">
            <img src={imageSrc} alt={imageAlt} />
            </div>
            <div className="discription">
            <h6 className="title">{productName}</h6>
            <span>{category}</span>
            </div>
        </div>
        </td>
        <td className="text-center">₹{price}</td>
        <td className="text-center">{quantity}</td>
        <td className="text-right">{color}</td>
        <td className="text-right">{size}</td>
        <td className="text-right">₹{Number(price) * Number(quantity)}</td>
    </tr>
}

export default OrderSummaryList