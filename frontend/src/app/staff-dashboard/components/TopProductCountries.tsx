import TopProductList from '@/components/dashboard/TopProductList';

function MyComponent() {
  return (
    <div>

      <div className="row mt--10 g-5">
        <div className="col-12">
          <div className="top-product-wrapper-scroll">
            <div className="top-product-area-start">
              <div className="between-area-top">
                <div className="left-area">
                  <h4 className="title">Top Products</h4>
                  <span>Top Products List</span>
                </div>
              </div>
              {[
                {
                  imageSrc: "/assets/images-dashboard/grocery/08.jpg",
                  imageAlt: "grocery",
                  productName: "Quaker Oats Healthy Meal...",
                  stock: 500,
                  col2Title: "Coupon Code",
                  col2Value: 2415,
                  brandImage: "/assets/images-dashboard/brand/01.png", 
                  brandAlt: "ekomart",
                  percentage: 5.29,
                  price: "79.00"
                },
                {
                  imageSrc: "/assets/images-dashboard/grocery/08.jpg",
                  imageAlt: "grocery",
                  productName: "Quaker Oats Healthy Meal...",
                  stock: 500,
                  col2Title: "Coupon Code",
                  col2Value: 2415,
                  brandImage: "/assets/images-dashboard/brand/01.png", 
                  brandAlt: "ekomart",
                  percentage: 5.29,
                  price: "79.00"
                },
                {
                  imageSrc: "/assets/images-dashboard/grocery/08.jpg",
                  imageAlt: "grocery",
                  productName: "Quaker Oats Healthy Meal...",
                  stock: 500,
                  col2Title: "Coupon Code",
                  col2Value: 2415,
                  brandImage: "/assets/images-dashboard/brand/01.png", 
                  brandAlt: "ekomart",
                  percentage: 5.29,
                  price: "79.00"
                },
                {
                  imageSrc: "/assets/images-dashboard/grocery/08.jpg",
                  imageAlt: "grocery",
                  productName: "Quaker Oats Healthy Meal...",
                  stock: 500,
                  col2Title: "Coupon Code",
                  col2Value: 2415,
                  brandImage: "/assets/images-dashboard/brand/01.png", 
                  brandAlt: "ekomart",
                  percentage: 5.29,
                  price: "79.00"
                },
                {
                  imageSrc: "/assets/images-dashboard/grocery/08.jpg",
                  imageAlt: "grocery",
                  productName: "Quaker Oats Healthy Meal...",
                  stock: 500,
                  col2Title: "Coupon Code",
                  col2Value: 2415,
                  brandImage: "/assets/images-dashboard/brand/01.png", 
                  brandAlt: "ekomart",
                  percentage: 5.29,
                  price: "79.00"
                }
              ]?.map((datum, index)=>{
                return <TopProductList
                key={index}
                imageSrc={datum?.imageSrc}
                imageAlt={datum?.imageAlt}
                productName={datum?.productName}
                stock={datum?.stock}
                col2Title={datum?.col2Title}
                col2Value={datum?.col2Value}
                brandImage={datum?.brandImage}
                brandAlt={datum?.brandAlt}
                percentage={datum?.percentage}
                price={datum?.price}
                />
              })}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MyComponent;