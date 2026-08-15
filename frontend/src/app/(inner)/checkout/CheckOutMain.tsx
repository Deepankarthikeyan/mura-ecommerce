// src/components/service/CheckOutMain.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useCart } from '@/components/header/CartContext';
import { useUser } from '@/components/header/UserContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import BillingEditDialog from '@/components/dialog/BillingEditDialog';
import LoginDialog from '@/components/auth/LoginDialog';
import RegisterDialog, {
  type RegistrationReadyPayload,
} from "@/components/auth/RegisterDialog";
import AddressDialog from '@/components/auth/AddressDialog';

const DEFAULT_SHIPPING_COST = 50;

function isDeliveryPincodeValid(zip: string): boolean {
    const normalized = zip.trim();
    return /^\d{6}$/.test(normalized) && normalized.startsWith('6');
}

interface ValidationErrors {
    email?: string;
    firstName?: string;
    lastName?: string;
    country?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
    paymentMethod?: string;
    terms?: string;
}

export default function CheckOutMain() {

    const router = useRouter()
    const { user, isAuthenticated, isUserLoaded, updateUser } = useUser();

    const { cartItems, clearCart } = useCart();
    const [coupon, setCoupon] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{
        code: string;
        discountType: 'percentage' | 'price';
        discountPercentage: number;
        discountPrice: number;
        label: string;
    } | null>(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [billingInfo, setBillingInfo] = useState({
        email: '',
        firstName: '',
        lastName: '',
        company: '',
        country: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        orderNotes: '',
    });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSavingBilling, setIsSavingBilling] = useState(false);
    const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
    const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    const [signupContinue, setSignupContinue] =
        useState<RegistrationReadyPayload | null>(null);

    const [couponMessage, setCouponMessage] = useState('');

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = (() => {
        if (!appliedCoupon) return 0;
        if (appliedCoupon.discountType === 'percentage') {
            return Math.min(subtotal, (subtotal * appliedCoupon.discountPercentage) / 100);
        }
        return Math.min(subtotal, appliedCoupon.discountPrice);
    })();
    const shippingCost = DEFAULT_SHIPPING_COST;
    const total = Math.max(0, subtotal - discountAmount + shippingCost);
    const isDeliveryAvailable = isDeliveryPincodeValid(billingInfo.zip);

    const handleCouponApply = async () => {
        const code = coupon.trim();
        if (!code) {
            setAppliedCoupon(null);
            setCouponMessage('Please enter a coupon code');
            return;
        }
        if (subtotal <= 0) {
            setAppliedCoupon(null);
            setCouponMessage('Add items to your cart before applying a coupon');
            return;
        }

        setIsApplyingCoupon(true);
        setCouponMessage('');
        try {
            const response = await axios.post('/api/coupons/validate', {
                code,
                subtotal,
            });
            if (response.data?.success && response.data?.body) {
                const body = response.data.body;
                setAppliedCoupon({
                    code: body.code,
                    discountType: body.discountType,
                    discountPercentage: Number(body.discountPercentage) || 0,
                    discountPrice: Number(body.discountPrice) || 0,
                    label: body.label,
                });
                setCoupon(body.code);
                setCouponMessage(`Coupon applied — ${body.label} off`);
            } else {
                setAppliedCoupon(null);
                setCouponMessage(response.data?.message || 'Coupon code is incorrect');
            }
        } catch (error: any) {
            setAppliedCoupon(null);
            setCouponMessage(
                error?.response?.data?.message || 'Coupon code is incorrect'
            );
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    // Pre-fill billing info from user data if available
    useEffect(() => {
        if (isAuthenticated && user) {
            const userBillingInfo = user?.billingInfo;
            if (userBillingInfo) {
                // User has existing billing info - pre-fill it
                setBillingInfo({
                    email: user.email || '',
                    firstName: userBillingInfo.firstName || '',
                    lastName: userBillingInfo.lastName || '',
                    company: userBillingInfo.company || '',
                    country: userBillingInfo.country || '',
                    street: userBillingInfo.street || '',
                    city: userBillingInfo.city || '',
                    state: userBillingInfo.state || '',
                    zip: userBillingInfo.zip || '',
                    phone: userBillingInfo.phone || '',
                    orderNotes: userBillingInfo.orderNotes || '',
                });
            } else {
                // No billing info yet - just fill email from user
                setBillingInfo(prev => ({
                    ...prev,
                    email: user.email || ''
                }));
            }
        }
    }, [isAuthenticated, user]);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        return phoneRegex.test(phone);
    };

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!billingInfo.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(billingInfo.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!billingInfo.firstName.trim()) {
            newErrors.firstName = "First name is required";
        } else if (billingInfo.firstName.trim().length < 2) {
            newErrors.firstName = "First name must be at least 2 characters";
        }

        if (!billingInfo.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        } else if (billingInfo.lastName.trim().length < 2) {
            newErrors.lastName = "Last name must be at least 2 characters";
        }

        if (!billingInfo.country.trim()) {
            newErrors.country = "Country is required";
        }

        if (!billingInfo.street.trim()) {
            newErrors.street = "Street address is required";
        }

        if (!billingInfo.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!billingInfo.state.trim()) {
            newErrors.state = "State is required";
        }

        if (!billingInfo.zip.trim()) {
            newErrors.zip = "Zip code is required";
        }

        if (!billingInfo.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!validatePhone(billingInfo.phone)) {
            newErrors.phone = "Please enter a valid phone number";
        }

        if (isDeliveryPincodeValid(billingInfo.zip)) {
            if (!paymentMethod) {
                newErrors.paymentMethod = "Please select a payment method";
            }

            if (!termsAccepted) {
                newErrors.terms = "You must agree to the terms and conditions";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setBillingInfo({ ...billingInfo, [id]: value });
        // Clear error when user types
        if (errors[id as keyof ValidationErrors]) {
            setErrors((prev) => ({ ...prev, [id]: undefined }));
        }
    };

    // Handle billing info update from dialog
    const handleBillingUpdate = (updatedBilling: typeof billingInfo) => {
        setBillingInfo(updatedBilling);
        if (isAuthenticated && user) {
            updateUser({
                billingInfo: {
                    firstName: updatedBilling.firstName,
                    lastName: updatedBilling.lastName,
                    company: updatedBilling.company,
                    country: updatedBilling.country,
                    street: updatedBilling.street,
                    city: updatedBilling.city,
                    state: updatedBilling.state,
                    zip: updatedBilling.zip,
                    phone: updatedBilling.phone,
                    orderNotes: updatedBilling.orderNotes,
                },
            });
        }
        toast.success('Billing information updated successfully!');
    };

    // Save billing info to user's profile
    const saveBillingInfo = async () => {
        if (!isAuthenticated || !user) {
            return; // Don't save for guest users
        }

        setIsSavingBilling(true);

        try {
            const response = await axios.put(`/api/users`, {
                email: user.email,
                billingInfo: {
                    firstName: billingInfo.firstName,
                    lastName: billingInfo.lastName,
                    company: billingInfo.company,
                    country: billingInfo.country,
                    street: billingInfo.street,
                    city: billingInfo.city,
                    state: billingInfo.state,
                    zip: billingInfo.zip,
                    phone: billingInfo.phone,
                    orderNotes: billingInfo.orderNotes,
                }
            });

            if (response.data?.success) {
                toast.success('Billing information saved to your profile.');
                console.log('Billing info saved successfully');
            } else {
                toast.error(response.data?.message || 'Failed to save billing info');
                console.log('Failed to save billing info:', response.data?.message);
            }
        } catch (error: any) {
            console.log('Error saving billing info:', error);
            toast.error('Could not save billing information.');
        } finally {
            setIsSavingBilling(false);
        }
    };

    const [showCoupon, setShowCoupon] = useState(false);
    const toggleCouponInput = () => {
        setShowCoupon((prev) => !prev);
    };

    // Billing Edit Dialog state
    const [isBillingDialogOpen, setIsBillingDialogOpen] = useState(false);

    // Note: No longer redirecting to login page on logout
    // Users can stay on the checkout page and will see a login prompt

    // Load Razorpay script dynamically
    const loadRazorpayScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // Handle Razorpay payment
    const initiateRazorpayPayment = async (razorpayOrderId: string, keyId: string) => {
        const options = {
            key: keyId,
            amount: Math.round(total * 100), // Amount in paise
            currency: 'INR',
            name: 'Aathithya Herbal',
            description: `Order for ${cartItems.length} items`,
            order_id: razorpayOrderId,
            prefill: {
                name: `${billingInfo.firstName} ${billingInfo.lastName}`,
                email: billingInfo.email,
                contact: billingInfo.phone,
            },
            notes: {
                address: `${billingInfo.street}, ${billingInfo.city}, ${billingInfo.state}, ${billingInfo.country} - ${billingInfo.zip}`,
            },
            theme: {
                color: '#629D23',
            },
            handler: async function (response: any) {
                // Payment successful - verify and create order
                setIsVerifyingPayment(true);
                try {
                    toast.info('Verifying payment...');

                    const orderData = {
                        userEmail: user?.email || billingInfo.email,
                        userId: user?._id || null,
                        billingInfo: {
                            firstName: billingInfo.firstName,
                            lastName: billingInfo.lastName,
                            company: billingInfo.company,
                            country: billingInfo.country,
                            street: billingInfo.street,
                            city: billingInfo.city,
                            state: billingInfo.state,
                            zip: billingInfo.zip,
                            phone: billingInfo.phone,
                            email: billingInfo.email
                        },
                        items: cartItems.map(item => ({
                            id: item.id,
                            title: item.title,
                            price: item.price,
                            quantity: item.quantity,
                            image: item.image
                        })),
                        subtotal,
                        discount: discountAmount,
                        couponCode: appliedCoupon?.code || '',
                        shippingCost,
                        total,
                        paymentMethod: 'razorpay',
                        orderNotes: billingInfo.orderNotes
                    };

                    // Verify payment and create order
                    const verifyResponse = await axios.post(`/api/razorpay/verify`, {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        orderData: orderData,
                    });

                    if (verifyResponse.data?.success) {
                        const orderId = verifyResponse.data?.orderId;
                        toast.success('Order placed successfully! Redirecting...');

                        // Clear cart after successful order
                        clearCart();

                        // Redirect to thank you page with order details
                        router.push(`/thankyou?orderId=${orderId}&total=${total}`);
                    } else {
                        toast.error('Payment verification failed. Please contact support.');
                    }
                } catch (error: any) {
                    console.log('Payment verification error: ', error);
                    toast.error(error.response?.data?.message || 'Payment verification failed. Please contact support.');
                } finally {
                    setIsVerifyingPayment(false);
                }
            },
            modal: {
                ondismiss: function() {
                    setIsSubmitting(false);
                    toast.info('Payment cancelled. You can try again.');
                }
            }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    };

    const handleCheckout = async (e: React.MouseEvent) => {
        e.preventDefault();

        // Check if user is authenticated before proceeding
        if (!isAuthenticated) {
            toast.info('Please log in to complete your order.');
            setIsLoginDialogOpen(true);
            return;
        }

        if (!isDeliveryAvailable) {
            toast.error('Delivery not available for this address location.');
            return;
        }

        if (!validateForm()) {
            return;
        }

        // Ensure Razorpay is selected as payment method
        if (paymentMethod !== 'razorpay') {
            setErrors(prev => ({ ...prev, paymentMethod: 'Please select Razorpay as the payment method' }));
            return;
        }

        setIsSubmitting(true);

        try {
            // Save billing info to user profile before creating order
            if (isAuthenticated && user) {
                await saveBillingInfo();
            }

            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toast.error('Failed to load payment gateway. Please try again.');
                setIsSubmitting(false);
                return;
            }

            // Create Razorpay order
            toast.info('Initiating payment...');
            const razorpayResponse = await axios.post(`/api/razorpay/create-order`, {
                amount: total,
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
                notes: {
                    customerEmail: billingInfo.email,
                    customerName: `${billingInfo.firstName} ${billingInfo.lastName}`,
                }
            });

            if (razorpayResponse.data?.success) {
                const { orderId, keyId } = razorpayResponse.data;
                // Open Razorpay checkout
                await initiateRazorpayPayment(orderId, keyId);
            } else {
                toast.error('Failed to create payment order. Please try again.');
            }

        } catch (error: any) {
            console.log('Error during checkout: ', error);
            toast.error(error.response?.data?.message || 'Error during checkout. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    // Note: Allow users to stay on checkout page even when logged out
    // The checkout form will show but order placement requires authentication

    return (
        <div className="checkout-area rts-section-gap">
            <div className="container">
                <div className="row">
                    {/* Left: Billing Details */}
                    <div className="col-lg-8 pr--40 order-1">
                        {/*
                        <div className="coupon-input-area-1">
                            <div className="coupon-area">
                                <div className="coupon-ask cupon-wrapper-1" onClick={toggleCouponInput}>
                                    <button className="coupon-click" onClick={handleCouponApply}>
                                        Have a coupon? Click here to enter your code
                                    </button>
                                </div>
                                <div className={`coupon-input-area cupon1 ${showCoupon ? 'show' : ''}`}>
                                    <div className="inner">
                                        <p>If you have a coupon code, please apply it below.</p>
                                        <div className="form-area">
                                            <input
                                                type="text"
                                                placeholder="Enter Coupon Code..."
                                                value={coupon}
                                                onChange={e => {
                                                    setCoupon(e.target.value);
                                                    setCouponMessage('');
                                                }}
                                            />
                                            <button type="button" className="btn-primary rts-btn" onClick={handleCouponApply}>
                                                Apply Coupon
                                            </button>
                                        </div>
                                        {couponMessage && (
                                            <p
                                                style={{
                                                    color: coupon === '12345' ? 'green' : 'red',
                                                    marginTop: '8px',
                                                }}
                                            >
                                                {couponMessage}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        */}

                        {/* Billing Form */}
                        <div className="rts-billing-details-area">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="title m-0">Billing Details</h3>
                                {isAuthenticated && user?.billingInfo && (
                                    <span className="text-sm text-gray-500">
                                        (Pre-filled from your profile)
                                    </span>
                                )}
                            </div>
                            {/* Billing Info Card */}
                            <div className="billing-info-card" style={{
                                background: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                padding: "16px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                            }}>
                                <div className="card-header" style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "12px",
                                    paddingBottom: "10px",
                                    borderBottom: "1px solid #f3f4f6"
                                }}>
                                    <div>
                                        <h4 style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            color: "#2C3C28",
                                            margin: "0 0 2px 0"
                                        }}>
                                            {billingInfo.firstName} {billingInfo.lastName}
                                        </h4>
                                        <span style={{
                                            fontSize: "12px",
                                            color: "#6b7280"
                                        }}>
                                            {billingInfo.email}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setIsBillingDialogOpen(true)}
                                        style={{
                                            background: "#f3f4f6",
                                            border: "none",
                                            borderRadius: "6px",
                                            padding: "6px",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "background 0.2s ease",
                                            width: "32px",
                                            height: "32px",
                                            flexShrink: 0
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "#e5e7eb")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                                        title="Edit Billing Details"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#629D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="#629D23" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </div>

                                <div className="billing-details" style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "8px 16px",
                                    marginBottom: "12px",
                                    fontSize: "13px"
                                }}>
                                    <div style={{ gridColumn: "1 / -1" }}>
                                        <span style={{ color: "#9ca3af", fontSize: "11px", textTransform: "uppercase" }}>Address</span>
                                        <p style={{ margin: "0", color: "#374151", lineHeight: "1.6" }}>
                                            {billingInfo.street}<br />
                                            {billingInfo.city}, {billingInfo.state} {billingInfo.zip}
                                        </p>
                                    </div>
                                    <div>
                                        <span style={{ color: "#9ca3af", fontSize: "11px", textTransform: "uppercase" }}>Country</span>
                                        <p style={{ margin: "0", color: "#374151" }}>{billingInfo.country}</p>
                                    </div>
                                    <div>
                                        <span style={{ color: "#9ca3af", fontSize: "11px", textTransform: "uppercase" }}>Phone</span>
                                        <p style={{ margin: "0", color: "#374151" }}>{billingInfo.phone}</p>
                                    </div>
                                    {billingInfo.company && (
                                        <div style={{ gridColumn: "1 / -1" }}>
                                            <span style={{ color: "#9ca3af", fontSize: "11px", textTransform: "uppercase" }}>Company</span>
                                            <p style={{ margin: "0", color: "#374151" }}>{billingInfo.company}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="order-notes-section" style={{ borderTop: "1px solid #f3f4f6", paddingTop: "10px" }}>
                                    <label style={{
                                        display: "block",
                                        marginBottom: "4px",
                                        fontSize: "12px",
                                        fontWeight: "500",
                                        color: "#374151"
                                    }}>
                                        Order Notes <span style={{ color: "#9ca3af" }}>(Optional)</span>
                                    </label>
                                    <textarea
                                        id="orderNotes"
                                        value={billingInfo.orderNotes}
                                        onChange={handleInputChange}
                                        placeholder="Any special instructions..."
                                        style={{
                                            width: "100%",
                                            padding: "8px",
                                            border: "1px solid #d1d5db",
                                            borderRadius: "6px",
                                            fontSize: "13px",
                                            resize: "vertical",
                                            minHeight: "60px"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="col-lg-4 order-2">
                        <h3 className="title-checkout">Your Order</h3>
                        <div className="right-card-sidebar-checkout">
                            <div className="top-wrapper">
                                <div className="product">Products</div>
                                <div className="price">Price</div>
                            </div>

                            {cartItems.length === 0 ? (
                                <p>Your cart is empty.</p>
                            ) : (
                                cartItems.map((item) => (
                                    <div className="single-shop-list" key={item.id}>
                                        <div className="left-area">
                                            <img src={item.image} alt={item.title} />
                                            <span className="title">{item.title} × {item.quantity}</span>
                                        </div>
                                        <span className="price">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))
                            )}

                            <div className="single-shop-list">
                                <div className="left-area">
                                    <span>Subtotal</span>
                                </div>
                                <span className="price">₹{subtotal.toFixed(2)}</span>
                            </div>

                            <div className="single-shop-list">
                                <div className="left-area">
                                    <span>Shipping</span>
                                </div>
                                <span
                                    className="price"
                                    style={!isDeliveryAvailable ? { color: '#991b1b', fontSize: '13px' } : undefined}
                                >
                                    {isDeliveryAvailable ? `₹${shippingCost.toFixed(2)}` : 'Not available'}
                                </span>
                            </div>

                            <div
                                style={{
                                    padding: '20px 0',
                                    margin: '0 36px',
                                    borderBottom: '1px solid #E2E2E2',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        width: '100%',
                                    }}
                                >
                                    <span style={{ flex: '0 0 auto', whiteSpace: 'nowrap' }}>
                                        Coupon
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Enter Coupon Code"
                                        value={coupon}
                                        onChange={(e) => {
                                            setCoupon(e.target.value);
                                            setCouponMessage('');
                                            if (appliedCoupon) setAppliedCoupon(null);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                void handleCouponApply();
                                            }
                                        }}
                                        style={{
                                            flex: '1 1 0%',
                                            width: '100%',
                                            minWidth: 0,
                                            maxWidth: '100%',
                                            height: '40px',
                                            padding: '0 12px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '6px',
                                            fontSize: '13px',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => void handleCouponApply()}
                                        disabled={isApplyingCoupon}
                                        style={{
                                            flex: '0 0 auto',
                                            width: 'auto',
                                            maxWidth: 'max-content',
                                            height: '40px',
                                            padding: '0 16px',
                                            background: '#629D23',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            cursor: isApplyingCoupon ? 'wait' : 'pointer',
                                            whiteSpace: 'nowrap',
                                            opacity: isApplyingCoupon ? 0.7 : 1,
                                        }}
                                    >
                                        {isApplyingCoupon ? 'Applying…' : 'Apply'}
                                    </button>
                                </div>
                                {couponMessage && (
                                    <p
                                        style={{
                                            margin: '8px 0 0',
                                            fontSize: '12px',
                                            color: appliedCoupon ? '#629D23' : '#ef4444',
                                        }}
                                    >
                                        {couponMessage}
                                    </p>
                                )}
                            </div>

                            <div className="single-shop-list">
                                <div className="left-area">
                                    <span>
                                        Discount
                                        {appliedCoupon ? ` (${appliedCoupon.label})` : ''}
                                    </span>
                                </div>
                                <span
                                    className="price"
                                    style={discountAmount > 0 ? { color: '#629D23' } : undefined}
                                >
                                    {discountAmount > 0 ? `-₹${discountAmount.toFixed(2)}` : '₹0.00'}
                                </span>
                            </div>

                            <div className="single-shop-list">
                                <div className="left-area">
                                    <span style={{ fontWeight: 600, color: '#2C3C28' }}>Total Price:</span>
                                </div>
                                <span className="price" style={{ color: '#629D23' }}>₹{total.toFixed(2)}</span>
                            </div>

                            {/* Payment methods */}
                            <div className="cottom-cart-right-area">
                                {isDeliveryAvailable ? (
                                    <>
                                <div style={{ marginBottom: "20px" }}>
                                    <label
                                        htmlFor="razorpay"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "12px",
                                            padding: "12px 16px",
                                            border: paymentMethod === 'razorpay' ? "2px solid #1f72b0" : "2px solid #e5e7eb",
                                            borderRadius: "8px",
                                            backgroundColor: paymentMethod === 'razorpay' ? "#eff6ff" : "#ffffff",
                                            cursor: "pointer",
                                            transition: "all 0.3s ease"
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            id="razorpay"
                                            name="payment"
                                            checked={paymentMethod === 'razorpay'}
                                            onChange={() => {
                                                setPaymentMethod('razorpay');
                                                if (errors.paymentMethod) {
                                                    setErrors((prev) => ({ ...prev, paymentMethod: undefined }));
                                                }
                                            }}
                                            style={{
                                                width: "18px",
                                                height: "18px",
                                                cursor: "pointer",
                                                accentColor: "#1f72b0",
                                                flexShrink: 0
                                            }}
                                        />
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, fontWeight: 500, fontSize: "14px" }}>
                                            <img
                                                src="/assets/images/payment/razorpay-logo.svg"
                                                alt="Razorpay"
                                                height={20}
                                                style={{ flexShrink: 0, display: "block", width: "auto", maxWidth: "110px" }}
                                            />
                                            Pay with Razorpay (Cards, UPI, Net Banking) <span style={{ color: "#ef4444" }}>*</span>
                                        </span>
                                    </label>
                                </div>
                                {errors.paymentMethod && (
                                    <span className="error-message" style={{ color: "red", fontSize: "14px", marginBottom: "15px", display: "block" }}>
                                        {errors.paymentMethod}
                                    </span>
                                )}
                                <div
                                    className="single-category mb--30"
                                    style={{
                                        border: errors.terms ? "2px solid #ef4444" : "2px solid #e5e7eb",
                                        padding: "12px 16px",
                                        borderRadius: "8px",
                                        transition: "all 0.3s ease",
                                        backgroundColor: termsAccepted ? "#f0fdf4" : "#f9fafb",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        cursor: "pointer",
                                        userSelect: "none"
                                    }}
                                    onClick={() => {
                                        setTermsAccepted(!termsAccepted);
                                        if (errors.terms) {
                                            setErrors((prev) => ({ ...prev, terms: undefined }));
                                        }
                                    }}
                                >
                                    <div
                                        style={{
                                            position: "relative",
                                            width: "20px",
                                            height: "20px",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <span
                                            aria-hidden
                                            style={{
                                                position: "absolute",
                                                inset: 0,
                                                borderRadius: "4px",
                                                border: `2px solid ${termsAccepted ? "#000000" : "#d1d5db"}`,
                                                backgroundColor: termsAccepted ? "#000000" : "#ffffff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                pointerEvents: "none",
                                            }}
                                        >
                                            {termsAccepted && (
                                                <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                                    <path
                                                        d="M1 5.5L5 9.5L13 1.5"
                                                        stroke="#FFFFFF"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            )}
                                        </span>
                                        <input
                                            id="terms"
                                            type="checkbox"
                                            checked={termsAccepted}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => {
                                                setTermsAccepted(e.target.checked);
                                                if (errors.terms) {
                                                    setErrors((prev) => ({ ...prev, terms: undefined }));
                                                }
                                            }}
                                            style={{
                                                position: "absolute",
                                                inset: 0,
                                                width: "100%",
                                                height: "100%",
                                                margin: 0,
                                                opacity: 0,
                                                cursor: "pointer",
                                                zIndex: 1,
                                            }}
                                        />
                                    </div>
                                    <label htmlFor="terms" style={{ cursor: "pointer", fontWeight: "bold", fontSize: "14px", pointerEvents: "none" }} onClick={(e) => e.preventDefault()}>
                                        <strong>I have read and agree to the <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} style={{ color: "#1f72b0", textDecoration: "underline", pointerEvents: "auto" }}>terms and conditions</a></strong> <span style={{ color: "#ef4444" }}>*</span>
                                    </label>
                                </div>
                                {errors.terms && (
                                    <span className="error-message" style={{ color: "red", fontSize: "14px", marginBottom: "15px", display: "block" }}>
                                        {errors.terms}
                                    </span>
                                )}
                                <button
                                    className="rts-btn btn-primary"
                                    onClick={handleCheckout}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Processing..." : "Place Order"}
                                </button>
                                    </>
                                ) : (
                                    <div
                                        style={{
                                            padding: "16px",
                                            borderRadius: "8px",
                                            border: "1px solid #fecaca",
                                            backgroundColor: "#fef2f2",
                                            color: "#991b1b",
                                            fontSize: "14px",
                                            lineHeight: 1.6,
                                            fontWeight: 500,
                                            textAlign: "center",
                                        }}
                                    >
                                        Delivery not available for your address location.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Billing Edit Dialog */}
            <BillingEditDialog
                isOpen={isBillingDialogOpen}
                onClose={() => setIsBillingDialogOpen(false)}
                billingInfo={billingInfo}
                onSave={handleBillingUpdate}
                userEmail={user?.email}
            />

            {/* Login/Register/Address Dialogs */}
            <LoginDialog
                isOpen={isLoginDialogOpen}
                onClose={() => setIsLoginDialogOpen(false)}
                onSwitchToRegister={() => {
                    setIsLoginDialogOpen(false);
                    setIsRegisterDialogOpen(true);
                }}
            />
            <RegisterDialog
                isOpen={isRegisterDialogOpen}
                onClose={() => setIsRegisterDialogOpen(false)}
                onSwitchToLogin={() => {
                    setIsRegisterDialogOpen(false);
                    setIsLoginDialogOpen(true);
                }}
                onRegisterSuccess={(p) => {
                    setSignupContinue(p);
                    setIsRegisterDialogOpen(false);
                    setIsAddressDialogOpen(true);
                }}
            />
            <AddressDialog
                isOpen={isAddressDialogOpen}
                onClose={() => {
                    setIsAddressDialogOpen(false);
                    setSignupContinue(null);
                }}
                userEmail={signupContinue?.email ?? ""}
                registrationToken={signupContinue?.registrationToken}
                signupPassword={signupContinue?.password}
                onSwitchToLogin={() => {
                    setSignupContinue(null);
                    setIsAddressDialogOpen(false);
                    setIsLoginDialogOpen(true);
                }}
            />

            {/* Payment Verification Loader Overlay */}
            {isVerifyingPayment && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        backdropFilter: "blur(4px)",
                    }}
                >
                    <svg
                        width="60"
                        height="60"
                        viewBox="0 0 60 60"
                        style={{
                            animation: "rotate 1s linear infinite",
                        }}
                    >
                        <circle
                            cx="30"
                            cy="30"
                            r="26"
                            fill="none"
                            stroke="#f3f4f6"
                            strokeWidth="4"
                        />
                        <circle
                            cx="30"
                            cy="30"
                            r="26"
                            fill="none"
                            stroke="#629D23"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray="120"
                            strokeDashoffset="80"
                            style={{
                                transformOrigin: "center",
                                animation: "dash 1.5s ease-in-out infinite",
                            }}
                        />
                    </svg>
                    <p
                        style={{
                            marginTop: "20px",
                            color: "#fff",
                            fontSize: "16px",
                            fontWeight: 500,
                        }}
                    >
                        Verifying your payment...
                    </p>
                    <style>{`
                        @keyframes rotate {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                        @keyframes dash {
                            0% { stroke-dashoffset: 120; }
                            50% { stroke-dashoffset: 30; }
                            100% { stroke-dashoffset: 120; }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
}
