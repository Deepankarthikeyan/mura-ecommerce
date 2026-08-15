import { NextResponse } from "next/server";
import { getUserById, validateUserLogin, updateUserByEmail } from '../../../functions/mongodbOperations'; // Import functions

// GET - Get user by email (for checking if user exists)
export async function GET(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const value = `${req.url?.split("=")?.[1]}`
      const property = 'users'
      const users = await getUserById('users', property, value);
      console.log('value => ', value)
      return NextResponse.json({ success: true, body: users});
    } catch (error: any) {
      return NextResponse.json({ success: false, message: error.message });
    }
  } else {
    return NextResponse.json({ success: false, message: 'Method Not Allowed' });
  }
}

// POST - Create new user (Registration) or Login
export async function POST(req: any, res: any) {
  if (req.method === 'POST') {
    try {
      const reqBody = await req?.json();
      const action = reqBody?.action; // 'register' or 'login'

      // Registration without email OTP is disabled — passwords are only stored after OTP verify.
      if (action === 'register') {
        return NextResponse.json({
          success: false,
          message:
            'Direct registration is not available. Complete sign-up via email verification (/api/users/register/send-otp then /verify).',
        }, { status: 403 });
      }

      // Handle User Login
      else if (action === 'login') {
        const { email, password } = reqBody?.body;

        // Validate required fields
        if (!email || !password) {
          return NextResponse.json({
            success: false,
            message: 'Email and password are required'
          }, { status: 400 });
        }

        const result = await validateUserLogin(email, password);

        if (result.success) {
          return NextResponse.json({
            success: true,
            message: 'Login successful',
            body: result.user
          });
        } else {
          return NextResponse.json({
            success: false,
            message: result.message
          }, { status: 401 });
        }
      }

      // Invalid action
      else {
        return NextResponse.json({
          success: false,
          message: 'Invalid action. Use "login"'
        }, { status: 400 });
      }

    } catch (error: any) {
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: 500 });
    }
  } else {
    return NextResponse.json({
      success: false,
      message: 'Method Not Allowed'
    }, { status: 405 });
  }
}

// PUT - Update user billing info
export async function PUT(req: any) {
  try {
    const reqBody = await req?.json();
    const { email, billingInfo } = reqBody;

    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }

    if (!billingInfo) {
      return NextResponse.json({
        success: false,
        message: 'Billing information is required'
      }, { status: 400 });
    }

    // Update user with billing info
    const result = await updateUserByEmail(email, {
      billingInfo,
      updatedAt: new Date()
    });

    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'User billing information updated successfully',
      body: result
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}
