import BestSellersList from '@/components/dashboard/BestSellersList';



function MyComponent()  {
  return (
    <div>
        
        <div className="row g-5 mt--10">
  <div className="col-12">
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
