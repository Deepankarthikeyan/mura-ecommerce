import { NextResponse } from "next/server";
import { createOrder, sendOrderConfirmationEmail, getOrdersByUserEmail } from '../../../functions/mongodbOperations';

// POST - Create new order
export async function POST(req: any) {
  try {
    const reqBody = await req?.json();
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
      orderNotes
    } = reqBody;

    // Validate required fields
    if (!billingInfo || !items || !total) {
      return NextResponse.json({
        success: false,
        message: 'Missing required order information'
      }, { status: 400 });
    }

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Prepare order data
    const orderData = {
      orderId,
      userEmail: userEmail || 'guest@example.com',
      userId: userId || null,
      billingInfo,
      items,
      subtotal,
      discount,
      shippingCost,
      total,
      paymentMethod,
      orderNotes,
      status: 'pending',
      createdAt: new Date()
    };

    // Save order to database
    const result = await createOrder(orderData);

    if (!result.acknowledged) {
      return NextResponse.json({
        success: false,
        message: 'Failed to save order'
      }, { status: 500 });
    }

    // Send confirmation emails
    try {
      await sendOrderConfirmationEmail(
        {
          orderId,
          items,
          total,
          billingInfo,
          paymentMethod,
          createdAt: orderData.createdAt,
        },
        userEmail || billingInfo.email
      );
    } catch (emailError: any) {
      console.error('Email sending failed:', emailError);
      // Continue even if email fails - order is still saved
    }

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      body: {
        ...orderData,
        _id: result.insertedId
      }
    });

  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to create order'
    }, { status: 500 });
  }
}

// GET - Get orders by user email
export async function GET(req: any) {
  try {
    // Get userEmail from query params
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json({
        success: false,
        message: 'userEmail query parameter is required'
      }, { status: 400 });
    }

    // Fetch orders from database
    const orders = await getOrdersByUserEmail(userEmail);

    return NextResponse.json({
      success: true,
      orders: orders,
      count: orders.length
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch orders'
    }, { status: 500 });
  }
}
