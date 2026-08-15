import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Missing payment verification parameters" },
        { status: 400 }
      );
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = generatedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Payment is verified, now create the order in your system
    const { createOrder, sendOrderConfirmationEmail, sendWhatsAppNotification } = await import(
      "../../../../functions/mongodbOperations"
    );

    const {
      userEmail,
      userId,
      billingInfo,
      items,
      subtotal,
      discount,
      shippingCost,
      total,
      paymentMethod,
      orderNotes,
    } = orderData;

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Prepare order data
    const finalOrderData = {
      orderId,
      userEmail: userEmail || "guest@example.com",
      userId: userId || null,
      billingInfo,
      items,
      subtotal,
      discount,
      shippingCost,
      total,
      paymentMethod: "razorpay",
      paymentDetails: {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      orderNotes,
      status: "paid",
      createdAt: new Date(),
    };

    // Save order to database
    const result = await createOrder(finalOrderData);

    if (!result.acknowledged) {
      return NextResponse.json(
        { success: false, message: "Failed to save order" },
        { status: 500 }
      );
    }

    // Send confirmation emails
    try {
      await sendOrderConfirmationEmail(
        {
          orderId,
          items,
          total,
          billingInfo,
          paymentMethod: "razorpay",
          createdAt: finalOrderData.createdAt,
        },
        userEmail || billingInfo.email
      );
    } catch (emailError: any) {
      console.error("Email sending failed:", emailError);
      // Continue even if email fails - order is still saved
    }

    // Send WhatsApp notification to customer and staff (non-blocking)
    try {
      await sendWhatsAppNotification({
        orderId,
        customerName: `${billingInfo.firstName} ${billingInfo.lastName}`,
        phoneNumber: billingInfo.phone || billingInfo.contact,
        customerAddress: [
          billingInfo.street,
          billingInfo.city,
          billingInfo.state,
          billingInfo.zip,
          billingInfo.country,
        ]
          .filter(Boolean)
          .join(', '),
        total,
        items: items.map((item: any) => ({
          title: item.title,
          quantity: item.quantity,
          price: item.price
        })),
      });
    } catch (whatsappError: any) {
      console.error("WhatsApp notification failed:", whatsappError);
      // Continue even if WhatsApp fails - order is already saved
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and order placed successfully",
      orderId: orderId,
      paymentId: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to verify payment",
      },
      { status: 500 }
    );
  }
}
