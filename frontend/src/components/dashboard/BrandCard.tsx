function BrandCard({
    imageSrc,
    imageAlt,
    items
}: any) {
    return <div className="col-lg-3 col-md-4 col-sm-6 col-12">
        <div className="single-brand-area-start">
        <div className="logo">
            <img src={imageSrc} alt={imageAlt} />
        </div>
        <p className="item">
            <a href="#">{items} Items</a>
        </p>
        </div>
    </div>
}

export default BrandCard