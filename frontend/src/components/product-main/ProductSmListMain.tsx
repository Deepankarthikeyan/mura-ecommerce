"use client"
import Link from 'next/link';
import { useEffect } from 'react';
import {
    formatMrpStrikeDisplay,
    shouldShowMrpStrike,
} from "@/lib/shopProductDisplay";

interface BlogGridMainProps {
    Slug: string;
    ProductImage: string;
    ProductTitle?: string;
    Price?: string | number;
    mrp?: string | number;
}

const BlogGridMain: React.FC<BlogGridMainProps> = ({
    Slug,
    ProductImage,
    ProductTitle,
    Price,
    mrp,
}) => {

    // number count up and down
    useEffect(() => {
        const handleQuantityClick = (e: Event) => {
            const button = e.currentTarget as HTMLElement;
            const parent = button.closest('.quantity-edit') as HTMLElement | null;
            if (!parent) return;

            const input = parent.querySelector('.input') as HTMLInputElement | null;
            const addToCart = parent.querySelector('a.add-to-cart') as HTMLElement | null;
            if (!input) return;

            let oldValue = parseInt(input.value || '1', 10);
            let newVal = oldValue;

            if (button.classList.contains('plus')) {
                newVal = oldValue + 1;
            } else if (button.classList.contains('minus')) {
                newVal = oldValue > 1 ? oldValue - 1 : 1;
            }

            input.value = newVal.toString();
            if (addToCart) {
                addToCart.setAttribute('data-quantity', newVal.toString());
            }
        };

        const buttons = document.querySelectorAll('.quantity-edit .button');

        // 💡 Remove any existing handlers first (safe rebind)
        buttons.forEach(button => {
            button.removeEventListener('click', handleQuantityClick);
            button.addEventListener('click', handleQuantityClick);
        });

        return () => {
            buttons.forEach(button => {
                button.removeEventListener('click', handleQuantityClick);
            });
        };
    }, []);

    return (
        <>

            <Link href={`/shop/${Slug}`} className="thumbnail" style={{ backgroundColor: '#fff' }}>
                <div style={{ height: '150px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={`${ProductImage}`} alt="product" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
            </Link>
            <div className="body-content">
                <div className="top" style={{ textAlign: 'center' }}>
                    <div className="stars-area" style={{ justifyContent: 'center' }}>
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                    </div>
                    <Link href={`/shop/${Slug}`} style={{ display: 'block' }}>
                        <h4 className="title">
                            {ProductTitle?.trim() || 'Product'}
                        </h4>
                    </Link>
                    <div className="price-area" style={{ justifyContent: 'center' }}>
                        <span className="current">{`₹${Price}`}</span>
                        {shouldShowMrpStrike(Price, mrp) ? (
                            <div className="previous">{`₹${formatMrpStrikeDisplay(mrp)}`}</div>
                        ) : null}
                    </div>
                </div>
            </div>

        </>

    );
};

export default BlogGridMain;
