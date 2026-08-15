"use client"
import OrderSummaryList from '@/components/dashboard/OrderSumaryList';
import Link from 'next/link';
import React, { useRef } from 'react';

const DemoContent: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;

    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // reload the page to restore original layout
  };

  return (
    <div ref={printRef}>
      <div className="body-root-inner">
        <div className="transection">
          <div className="title-right-actioin-btn-wrapper-product-list">
            <h3 className="title">Order #80294</h3>
            <div className="button-wrapper">
              <div className="single-select">
                <select className="nice-select">
                  <option>Week</option>
                  <option>Month</option>
                  <option>Year</option>
                  <option>6 Month</option>
                </select>
              </div>
            </div>
          </div>
          <div className="product-top-filter-area-l">
            <div className="left-area-button-fiulter">
              <p>Dashboard / Order / Order#85421 </p>
            </div>
          </div>
          <div className="vendor-list-main-wrapper product-wrapper">
            {/* customers details main wrapper */}
            <div className="customers-details-wrapper-one-dashboard">
              <h4 className="title">Customer Details</h4>
              <div className="main-customers-details-top">
                <div className="left">
                  <img src="/assets/images-dashboard/avatar/03.png" alt="avatar" />
                  <div className="information-area">
                    <h4 className="name">Regina Cooper</h4>
                    <span className="designation">Customer</span>
                  </div>
                </div>
                <div className="right-area">
                  {[
                    {
                      title: "Email",
                      value: "textgood@gmail.com"
                    },
                    {
                      title: "Number",
                      value: "+880123456678"
                    },
                    {
                      title: "Date",
                      value: "13/16/2024"
                    },
                    {
                      title: "Country",
                      value: "USA(America)"
                    }
                  ]?.map((datum, index)=>{
                    return <div key={index} className="short-contact-info">
                      <p className="name">{datum?.title}</p>
                      <a href="#">{datum?.value}</a>
                    </div>
                  })}
                </div>
              </div>
            </div>
            {/* customers details main wrapper end */}
            <div className='flex'>
              <div className="billing-address-area-4">
                <h4 className="title">Billing address</h4>
                <div className="main-billing-address-wrapper">
                  <div className="single-billing-address">
                    <p>
                      <span>First Name :</span> Maxlins
                    </p>
                    <p>
                      <span>Last Name :</span> Maxlins
                    </p>
                    <p>
                      <span>Address :</span> 256 E. Brewer St. Holtsville
                    </p>
                  </div>
                </div>
              </div>
              <div className="billing-address-area-4">
                <h4 className="title">Shipping Address</h4>
                <div className="main-billing-address-wrapper">
                  <div className="single-billing-address">
                    <p>
                      <span>First Name :</span> Maxlins
                    </p>
                    <p>
                      <span>Last Name :</span> Maxlins
                    </p>
                    <p>
                      <span>Address :</span> 256 E. Brewer St. Holtsville
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            
          </div>
        </div>
        <div className="order-details-table-1-table table-responsive">
          <h4 className="title">Order Summary</h4>
          <table className="table order-details-table table-responsive">
            <thead className="bg-active">
              <tr>
                <th style={{ width: 300 }}>Order Item</th>
                <th className="text-center">Price</th>
                <th className="text-center">Quantity</th>
                <th className="text-right">Color</th>
                <th className="text-right">Size</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  imageSrc: "/assets/images-dashboard/grocery/15.png",
                  imageAlt: "grocery",
                  productName: "Quaker Oats Healthy Meal...",
                  category: "Food",
                  price: "100",
                  quantity: "2",
                  color: "Red",
                  size: "M"
                }
              ]?.map((datum, index)=>{
                return <OrderSummaryList
                  key={index}
                  imageSrc={"/assets/images-dashboard/grocery/15.png"}
                  imageAlt={"grocery"}
                  productName={"Quaker Oats Healthy Meal..."}
                  category={"Food"}
                  price={"100"}
                  quantity={"2"}
                  color={"Red"}
                  size={"M"}
                />
              })}
              <tr className="b-n">
                <td colSpan={5} className="text-end f-w-600">
                  SubTotal
                </td>
                <td className="text-right">₹20.00</td>
              </tr>
              <tr className="b-n">
                <td colSpan={5} className="text-end f-w-600">
                  Tax
                </td>
                <td className="text-right">₹05.00</td>
              </tr>
              <tr className="b-n">
                <td colSpan={5} className="text-end f-w-600">
                  Grand Total
                </td>
                <td className="text-right f-w-600">₹25.00</td>
              </tr>
            </tbody>
          </table>
          <div className="buttons-area-invoice no-print mb--30">
            <button
              className="rts-btn btn-primary radious-sm with-icon"
              onClick={handlePrint}
              type="button"
            >
              <div className="btn-text">Print Now</div>
              <div className="arrow-icon">
                <i className="fa-regular fa-print" />
              </div>
              <div className="arrow-icon">
                <i className="fa-regular fa-print" />
              </div>
            </button>
            <Link
              href="/assets/images/invoice/invoice.pdf"
              download="invoice.pdf"
              className="rts-btn btn-primary radious-sm with-icon"
            >
              <div className="btn-text">Download</div>
              <div className="arrow-icon">
                <i className="fa-thin fa-download" />
              </div>
              <div className="arrow-icon">
                <i className="fa-thin fa-download" />
              </div>
            </Link>
          </div>
        </div>
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
      </div>
    </div>
  );
};

export default DemoContent;