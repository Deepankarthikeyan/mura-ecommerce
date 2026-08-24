import BrandCard from '@/components/dashboard/BrandCard'
import React from 'react'

function DemoContent() {
  return (
    <div>
      <div className="body-root-inner">
  {/* vendor-grid-top-area start */}
  <div className="vendor-grid-top-search-area">
    <h5 className="title">Our Brand</h5>
    <form action="#" className="input-area-search-head-vendor">
      <input type="text" placeholder="Search vendors (by name or ID)..." />
      <a href="#" className="rts-btn btn-primary radious-sm with-icon">
        <div className="btn-text">Search</div>
        <div className="arrow-icon">
          <i className="fa-solid fa-magnifying-glass" />
        </div>
        <div className="arrow-icon">
          <i className="fa-solid fa-magnifying-glass" />
        </div>
      </a>
    </form>
  </div>
  {/* vendor-grid-top-area end */}
  <div className="vendor-list-main-wrapper">
    <div className="card-body">
      {/* rts brand area start */}
      <div className="rts-brtand-area-main">
        <div className="row g-4">
          {[
            {
              imageSrc: "/assets/images-dashboard/brand/01.png",
              imageAlt: "brand",
              items: "206"
            },
            {
              imageSrc: "/assets/images-dashboard/brand/01.png",
              imageAlt: "brand",
              items: "206"
            },
            {
              imageSrc: "/assets/images-dashboard/brand/01.png",
              imageAlt: "brand",
              items: "206"
            },
            {
              imageSrc: "/assets/images-dashboard/brand/01.png",
              imageAlt: "brand",
              items: "206"
            },
            {
              imageSrc: "/assets/images-dashboard/brand/01.png",
              imageAlt: "brand",
              items: "206"
            },
            {
              imageSrc: "/assets/images-dashboard/brand/01.png",
              imageAlt: "brand",
              items: "206"
            },
          ]?.map((datum, index)=>{
            return <BrandCard
            key={index}
            imageSrc={datum?.imageSrc}
            imageAlt={datum?.imageAlt}
            items={datum?.items}
            />
          })}
        </div>
      </div>
      {/* rts brand area end */}
    </div>
  </div>
  {/* bottom footer areas start */}
  <div className="footer-copyright">
    <div className="left">
      <p>Copyright © 2026 All Right Reserved.</p>
    </div>
    {/*
    <ul>
      <li>
        <a href="#">Terms</a>
      </li>
      <li>
        <a href="#">Privacy</a>
      </li>
      <li>
        <a href="#">Help</a>
      </li>
    </ul>
    */}
  </div>
  {/* bottom footer areas end */}
</div>

    </div>
  )
}

export default DemoContent