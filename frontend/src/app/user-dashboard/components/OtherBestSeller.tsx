import BestSellersList from '@/components/dashboard/BestSellersList';
import OrderList from '@/components/dashboard/OrderList';



function MyComponent()  {
  return (
    <div>
        
        <div className="row g-5 mt--10">
  <div className="col-xl-6 col-lg-12">
    <div className="best-shop-seller-top-scroll">
      <div className="top-product-area-start">
        <div className="between-area-top">
          <div className="left-area">
            <h4 className="title">Orders</h4>
          </div>
          <div className="single-select">
            <select className="nice-select">
              <option>Week</option>
              <option>Month</option>
              <option>Year</option>
              <option>6 Month</option>
            </select>
          </div>
        </div>
        {[
          {
            imageSrc: "/assets/images-dashboard/grocery/08.jpg", 
            imageAlt: "grocery", 
            productName: "Quaker Oats Healthy Meal...",
            stock: 500,
            price: '99.00',
            date: "5 June 2025"
          },
          {
            imageSrc: "/assets/images-dashboard/grocery/08.jpg", 
            imageAlt: "grocery", 
            productName: "Quaker Oats Healthy Meal...",
            stock: 500,
            price: '99.00',
            date: "5 June 2025"
          },
          {
            imageSrc: "/assets/images-dashboard/grocery/08.jpg", 
            imageAlt: "grocery", 
            productName: "Quaker Oats Healthy Meal...",
            stock: 500,
            price: '99.00',
            date: "5 June 2025"
          }
        ]?.map((datum, index)=>{
          return <OrderList
            key={index}
            imageSrc={datum?.imageSrc}
            imageAlt={datum?.imageAlt}
            productName={datum?.productName}
            stock={datum?.stock}
            price={datum?.price}
            date={datum?.date}
          />
        })}
      </div>
    </div>
  </div>
  <div className="col-xl-6 col-lg-12">
    <div className="best-shop-seller-top-scroll">
      <div className="top-product-area-start">
        <div className="between-area-top">
          <div className="left-area">
            <h4 className="title">Best Shop Sellers</h4>
          </div>
          <div className="single-select">
            <select className="nice-select">
              <option>Week</option>
              <option>Month</option>
              <option>Year</option>
              <option>6 Month</option>
            </select>
          </div>
        </div>
        {[
          {
            imageSrc: "/assets/images-dashboard/grocery/01.png",
            imageAlt: "grocery" ,
            seller: "Robert",
            noOfSales: "75",
            category: ["Food", "Grocery"],
            totalSales: "2,000"
          }
        ]?.map((datum, index)=>{
          return <BestSellersList
          key={index}
          imageSrc={datum?.imageSrc}
          imageAlt={datum?.imageAlt}
          seller={datum?.seller}
          noOfSales={datum?.noOfSales}
          category={datum?.category}
          totalSales={datum?.totalSales}
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
