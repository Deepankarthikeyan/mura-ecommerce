"use client"
import React from 'react';
import Link from "next/link";
function NavItem() {
    return (
        <div>
            <nav>
                
                <ul className="parent-nav">
                    <li className="parent with-megamenu">
                        <Link href="/shop">
                            Shop
                            {/* <span className="badge">New</span> */}
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default NavItem;




// <ul className="parent-nav">
//                     <li className="parent with-megamenu">
//                         <Link href="#">
//                             Shop
//                             {/* <span className="badge">New</span> */}
//                         </Link>
//                         <div className="rts-megamenu">
//                             <div className="wrapper">
//                                 <div className="row align-items-center">
//                                     <div className="col-lg-8">
//                                         <div className="megamenu-item-wrapper">
//                                             {/* single item areas start */}
//                                             <div className="single-megamenu-wrapper">
//                                                 <p className="title">Product Feature</p>
//                                                 <ul>
//                                                     {/* <li>
//                                                         <Link
//                                                             className="sub-b"
//                                                             href="/shop-details-variable"
//                                                         >
//                                                             Variable product
//                                                         </Link>
//                                                     </li>
//                                                     <li>
//                                                         <Link
//                                                             className="sub-b"
//                                                             href="/shop-details-affiliats"
//                                                         >
//                                                             Affiliate product
//                                                         </Link>
//                                                     </li> */}
//                                                     {/* <li>
//                                                         <Link
//                                                             className="sub-b"
//                                                             href="/shop-compare"
//                                                         >
//                                                             Shop Compare
//                                                         </Link>
//                                                     </li>
//                                                     <li>
//                                                         <Link
//                                                             className="sub-b"
//                                                             href="/trackorder"
//                                                         >
//                                                             Track Order
//                                                         </Link>
//                                                     </li> */}
//                                                 </ul>
//                                             </div>
//                                             {/* single item areas end */}
//                                         </div>
//                                     </div>
//                                     <div className="col-lg-4">
//                                         <Link
//                                             href="/shop"
//                                             className="feature-add-megamenu-area"
//                                         >
//                                             <img
//                                                 src="assets/images/feature/05.jpg"
//                                                 alt="feature_product"
//                                             />
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </li>
                    
                    
                    
//                     {/* <li className="parents">
//                         <Link target='_blank' href="/dashboard">
//                             Dashboard
//                             <span className="badge">New</span>
//                         </Link>
//                     </li> */}

//                 </ul>