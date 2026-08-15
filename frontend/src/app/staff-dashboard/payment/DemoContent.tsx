'use client';
import PaymentCard from '@/components/dashboard/PaymentCard';
import { useState } from 'react';

const ProductTable = () => {
  // State to track which payment methods are enabled
  const [enabledMethods, setEnabledMethods] = useState<Record<string, boolean>>({
    woo: false,
    paypal: false,
    transfer: false,
    check: false,
    cash: false,
  });

  // Toggle function for enabling/disabling payment methods
  const togglePaymentMethod = (method: string) => {
    setEnabledMethods(prev => ({
      ...prev,
      [method]: !prev[method]
    }));
  };

  return (
    <div className="body-root-inner">
      <h3 className="title">Payment Method</h3>

      {/* Woo Payment */}
      {[
        {
          imageSrc: "/assets/images-dashboard/payment/woo.png",
          imageAlt: "Woo payment logo",
          title: "Accept Payment With Woo",
          description: "Credit/Debit cards, Apple Pay, Google Pay, and more.",
          showBanksImage: true,
          toggleMethod: "woo"
        },
        {
          imageSrc: "/assets/images-dashboard/payment/paypal.webp",
          imageAlt: "PayPal logo",
          title: "Accept Payment With Paypal",
          description: "Credit/Debit cards, Apple Pay, Google Pay, and more.",
          showBanksImage: true,
          toggleMethod: "paypal"
        },
        {
          imageSrc: "/assets/images-dashboard/payment/transfer.png",
          imageAlt: "Bank transfer logo",
          title: "Direct Bank Transfer",
          description: "Take payment in person via BASC. More commonly known as direct bank/wire transfer",
          showBanksImage: false,
          toggleMethod: "transfer"
        },
        {
          imageSrc: "/assets/images-dashboard/payment/cash.png",
          imageAlt: "Cash on delivery logo",
          title: "Cash On Delivery",
          description: "Let your shoppers pay upon delivery - by cash or other methods of payment.",
          showBanksImage: false,
          toggleMethod: "cash"
        },
        {
          imageSrc: "/assets/images-dashboard/payment/check.png",
          imageAlt: "Check payment logo",
          title: "Check Payment",
          description: "Take payment in person via Checks. This offline gateway can also be useful to test purchases.",
          showBanksImage: false,
          toggleMethod: "check"
        }
      ]?.map((datum, index)=>{
        return <PaymentCard
          key={index}
          imageSrc={datum?.imageSrc}
          imageAlt={datum?.imageAlt}
          title={datum?.title}
          description={datum?.description}
          showBanksImage={datum?.showBanksImage}
          toggleMethod={datum?.toggleMethod}
          togglePaymentMethod={togglePaymentMethod}
          enabledMethods={enabledMethods}
        />
      })}

    </div>
  );
};

export default ProductTable;