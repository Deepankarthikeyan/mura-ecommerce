import React from 'react'
import Link from 'next/link'
import FollowUs from './footer/FollowUs'

const QUICK_LINKS = [
    { label: 'About Us', href: '/about', disabled: true },
    { label: 'Contact Us', href: '/contact', disabled: true },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Shipping Policy', href: '/shipping-policy' },
    { label: 'Return, Refund & Replacement Policy', href: '/return-refund-replacement-policy' },
]

function FooterOne() {
    return (
        <div><>
            <style>{`
                .footer-product-columns { columns: 4; column-gap: 28px; }
                @media (max-width: 991px) { .footer-product-columns { columns: 2; } }
                @media (max-width: 575px) { .footer-product-columns { columns: 1; } }
                .footer-product-columns a { transition: color 0.3s ease; }
                .footer-product-columns a:hover { color: #B7E38C !important; }
            `}</style>
            {/* rts footer one area start */}
            <div className="rts-footer-area" style={{ backgroundColor: '#366503' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            {/* d-block: theme .footer-main-content-wrapper is flex+space-between for multiple children; a single .row shrinks — block restores full-width grid */}
                            <div className="footer-main-content-wrapper d-block" style={{ paddingLeft: '40px', paddingRight: '40px', paddingBottom: 0 }}>
                                <div className="row g-4 w-100" style={{ marginTop: 0, marginBottom: '50px' }}>
                                    <div className="col-12">
                                        <div className="single-footer-wized">
                                            <h3 className="footer-title" style={{ marginBottom: '14px', fontSize: '20px', fontWeight: 800, color: '#fff', fontFamily: '"Montserrat", sans-serif' }}>Product List</h3>
                                            <div className="footer-product-columns">
                                                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0, marginBottom: '24px', color: '#fff' }}>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-hbzen-organic-food-supplements-with-pomegranate-ginger-palm-sugar-and-honey-150-ml" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Hbzen Organic Food Supplement
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-biozen-plus-high-efficacy-food-supplement-with-apple-cider-vinegar-organic-garlic-ginger-lemon-and-ho" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Biozen Plus High Efficacy Food Supplement
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-biozen-pluss-organic-food-supplements-with-apple-cider-vinegar-garlic-ginger-lemon-and-honey-450-ml" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Biozen Pluss Organic Food Supplements
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-biozen-syrup-ayurvedic-medicine-with-ginger-lemon-garlic-honey-and-apple-cider-400-ml" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Biozen Syrup Ayurvedic Medicine
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-ddiazen-liquid-ayurvedic-medicine-with-lemon-ginger-garlic-apple-cider-vinegar-amla-turmaric-and-hone" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Ddiazen Liquid Ayurvedic Medicine
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-herbal-tea-diabetic-tea-100gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Herbal Tea Diabetic Tea
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-obizen-syrup-ayurvedic-medicine-with-lemon-ginger-garlic-apple-cider-vinegar-cinnamon-and-honey-400-m" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Obizen Syrup Ayurvedic Medicine
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-pulmozen-pluss-organic-food-supplements-with-lemon-ginger-garlic-tulsi-and-honey-200-ml" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Pulmozen Pluss Organic Food Supplements
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-pulmozen-syrup-ayurvedic-medicine-with-lemon-ginger-garlic-tulsi-and-honey-200-ml" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Pulmozen Syrup Ayurvedic Medicine
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-unizzen-ayurvedic-medicine-with-apple-cider-vinegar-garlic-ginger-lemon-turmeric-and-honey-200-ml" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Unizzen Ayurvedic Medicine
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathihya-herbal-kuppaimeni-herbal-ayurvedic-handmade-bathing-soap-pack-of-6" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Kuppaimeni Herbal Ayurvedic Handmade Bathing Soap
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aloe-vera-bathing-soap-100g-pack-of-4-natural-oils-for-healthy-protected-skin-shop-herbal-natural-paraben-free-sulphate-" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Aloe Vera Bathing Soap
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aloe-vera-siddha-bathing-soap-100g-pack-of-3-natural-oils-for-healthy-protected-skin-shop-herbal-natural-paraben-free-su" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Aloe Vera Siddha Bathing Soap
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/ayudhdhara-vetpalai-glycerine-bathing-soap-100g-pack-of-4-natural-oils-for-healthy-protected-skin-shop-herbal-natural-pa" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Ayudhdhara Vetpalai Glycerine Bathing Soap
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/butter-handmade-bathing-bar100g-pack-of-2-natural-oils-for-healthy-protected-skin-shop-herbal-natural-paraben-free-sulph" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Butter Handmade Bathing Bar
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/charcoal-handmade-bathing-soap-100g-pack-of-2-natural-oils-for-healthy-protected-skin-shop-herbal-natural-paraben-free-s" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Charcoal Handmade Bathing Soap
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/honey-bathing-soap-100g-pack-of-3-natural-oils-for-healthy-protected-skin-shop-herbal-natural-paraben-free-sulphate-free" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Honey Bathing Soap
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/nalpamaradi-ayurvedic-bathing-soap-pack-3" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Nalpamaradi Ayurvedic Bathing Soap
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/nalpamaradi-bathing-soap-100g-pack-of-4-natural-oils-for-healthy-protected-skin-shop-herbal-natural-paraben-free-sulphat" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Nalpamaradi Bathing Soap
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/nalpamaradi-herbal-ayurvedic-bathing-soap-pack-of-6" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Nalpamaradi Herbal Ayurvedic Bathing Soap
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/nalpamaradi-herbal-ayurvedic-handmade-bathing-soap-pack-of-6-pack-6" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Nalpamaradi Herbal Ayurvedic Handmade Bathing Soap
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/sandal-bathing-soap-100g-pack-of-3-natural-oils-for-healthy-protected-skin-shop-herbal-natural-paraben-free-sulphate-fre" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Sandal Bathing Soap
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/vetpalai-herbal-ayurvedic-bathing-soap-pack-of-6" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Vetpalai Herbal Ayurvedic Bathing Soap
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/vetpalai-herbal-ayurvedic-handmade-bathing-soap-pack-of-6" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Vetpalai Herbal Ayurvedic Handmade Bathing Soap
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-garcinia-curnam-100gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Aathithya Herbal Garcinia Curnam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-thaaleesaadhi-curnam-75gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Aathithya Herbal Thaaleesaadhi Curnam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-adatodai-kudineer-curnam-50gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Adatodai Kudineer Curnam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-amukkara-curnam-75gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Amukkara Curnam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-ashoka-curnam-100gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Ashoka Curnam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-ashwagantha-curnam-75gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Ashwagantha Curnam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-athimathura-curnam-75-gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Athimathura Curnam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-attathi-curnam-75gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Attathi Curnam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-elathi-curnam-75gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Elathi Curnam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-irumal-curnam-75gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Irumal Curnam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-irumal-curnam-capsule-100-nos" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Irumal Curnam Capsule
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-keezhanelli-curnam-50gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Keezhanelli Curnam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-neruncil-kudineer-curnam-75gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Neruncil Kudineer Curnam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-nilavembu-kudineer-curnam-50gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Nilavembu Kudineer Curnam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-sallaki-curnam-100gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Sallaki Curnam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-sitopaladi-curnam-100gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Sitopaladi Curnam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-thathuviruthi-curnam-capsule-100-no" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Thathuviruthi Curnam Capsule
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-trikaduku-curnam-100gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Trikaduku Curnam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-tripalai-curnam-100gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Tripalai Curnam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-vayu-curnam-capsule-100-nos" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Vayu Curnam Capsule
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/nellikkai-curnam-50-g-1-1-buy-1-get-1-free" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Nellikkai Curnam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-maha-vilvathy-lehyam-100-gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Maha Vilvathy Lehyam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-nellikai-lehyam-100gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Nellikai Lehyam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-seerana-sanjeevi-lehyam-100gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Seerana Sanjeevi Lehyam
                                                        </a>
                                                    </li>
                                                    <li style={{ breakInside: 'avoid', marginBottom: '10px' }}>
                                                        <a href="https://aathithyaherbal.com/shop/aathithya-herbal-s-thippili-lehyam-100gm" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
                                                            Thippili Lehyam
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="footer-main-content-wrapper d-block" style={{ paddingLeft: '40px', paddingRight: '40px', paddingBottom: 0 }}>
                                <div className="row g-4 w-100" style={{ marginTop: '18px', marginBottom: '18px' }}>
                                    {/* Column 1: About Company */}
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="single-footer-wized">
                                            <h3 className="footer-title" style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '800', color: '#fff' }}>About Company</h3>
                                            <div className="call-area" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                                <div className="icon" style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <i className="fa-solid fa-phone-rotary" style={{ color: '#fff', fontSize: '20px' }} />
                                                </div>
                                                <div className="info">
                                                    <span style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>Have Question? Call Us 24/7</span>
                                                    <a href="tel:+919585515051" className="number" style={{ fontSize: '18px', fontWeight: '600', color: '#fff', textDecoration: 'none' }}>
                                                        +91 95855 15051
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 2: Store info */}
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="single-footer-wized">
                                            <div className="opening-hour" style={{ fontSize: '14px', lineHeight: '1.8', color: 'rgba(255,255,255,0.9)' }}>
                                                <p style={{ marginBottom: '15px', color: '#fff' }}>
                                                    <span style={{ color: '#fff', fontWeight: 800, fontSize: '18px', fontFamily: '"Montserrat", sans-serif', display: 'inline-block', marginBottom: '4px' }}>ONLINE STORE:</span><br />
                                                    worldwide Herbal store since 2016. We sell over 100+ Herbal products on our web-site.
                                                </p>
                                                <p style={{ color: '#fff' }}>
                                                    <span style={{ color: '#fff', fontWeight: 800, fontSize: '18px', fontFamily: '"Montserrat", sans-serif', display: 'inline-block', marginBottom: '4px' }}>ADDRESS:</span><br />
                                                    5/611, KNG Pudur Rd, K.N.Palayam,<br />
                                                    KNG Pudur Pirivu, Coimbatore,<br />
                                                    Tamil Nadu 641108.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 3: Quick links */}
                                    <div className="col-lg-4 col-md-6 col-sm-12">
                                        <div className="single-footer-wized">
                                            <h3 className="footer-title" style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '800', color: '#fff' }}>Quick links</h3>
                                            <nav className="footer-nav" aria-label="Quick links">
                                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                    {QUICK_LINKS.map((link) => (
                                                        <li key={link.href} style={{ marginBottom: '12px' }}>
                                                            {link.disabled ? (
                                                                <span
                                                                    aria-disabled="true"
                                                                    style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '15px', cursor: 'not-allowed', pointerEvents: 'none' }}
                                                                >
                                                                    {link.label}
                                                                </span>
                                                            ) : (
                                                                <Link
                                                                    href={link.href}
                                                                    style={{ color: '#fff', textDecoration: 'none', fontSize: '15px', transition: 'color 0.3s' }}
                                                                >
                                                                    {link.label}
                                                                </Link>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* rts footer one area end */}
            {/* rts copyright-area start */}
            <div className="rts-copyright-area bg_primary">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="copyright-between-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '40px', paddingRight: '40px' }}>
                                <p className="disc" style={{ textAlign: 'left', margin: 0, color: '#fff', fontWeight: 800, fontFamily: '"Montserrat", sans-serif' }}>
                                    Copyright 2026 <a href="#" style={{ color: '#fff', textDecoration: 'none', fontWeight: 800, fontFamily: '"Montserrat", sans-serif' }}>©Aathithya Herbal</a>. All rights reserved.
                                </p>
                                <FollowUs
                                    facebook="https://www.facebook.com/profile.php?id=61551352461006"
                                    twitter="https://x.com/HerbalAathithya"
                                    mail=""
                                    instagram="https://www.instagram.com/aathithya.herbal"
                                    youtube="https://www.youtube.com/@AathithyaHerbal"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* rts copyright-area end */}
        </>
        </div>
    )
}

export default FooterOne