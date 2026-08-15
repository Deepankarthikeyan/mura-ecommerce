import Image from 'next/image';

function PaymentCard({
    imageSrc,
    imageAlt,
    title,
    description,
    showBanksImage,
    toggleMethod,
    togglePaymentMethod,
    enabledMethods
}: any) {
    return <div className="single-payment">
        <div className='brand-logo'>
        <Image
            src={imageSrc}
            alt={imageAlt}
            className="one"
            width={100}
            height={100}
        />
        </div>
        <div className="inner-content">
        <h5>{title}</h5>
        <p>{description}</p>
        {showBanksImage && <Image
            src="/assets/images/payment/01.png"
            alt="Payment options"
            className="one"
            width={500}
            height={100}
        />}
        </div>
        <button
        onClick={() => togglePaymentMethod(toggleMethod)}
        className={`rts-btn ${enabledMethods?.[toggleMethod] ? 'btn-success' : 'btn-primary'}`}
        >
        {enabledMethods?.[toggleMethod] ? 'Disable' : 'Enable'}
        </button>
    </div>
}

export default PaymentCard