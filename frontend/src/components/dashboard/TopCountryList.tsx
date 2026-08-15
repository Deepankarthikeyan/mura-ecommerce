function TopCountryList({
    imageSrc,
    imageAlt,
    countryName,
    value,
    date
}:any) {
  return <div className="product-top-area-single">
        <div className="image-area">
        <a href="#" className="thumbnail">
            <img src={imageSrc} alt={imageAlt} />
        </a>
        <div className="information">
            <p className="mb--0">{countryName}</p>
        </div>
        </div>
        <div className="coupon-code">
        <img src="/assets/images-dashboard/brand/arrow-m.png" alt="ekomart" />
        </div>
        <div className="coupon-code">
        <p>{value}</p>
        </div>
        <div className="indec mr--0">
        <p>{date}</p>
        </div>
    </div>
};

export default TopCountryList;