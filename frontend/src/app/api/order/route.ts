import { NextResponse } from "next/server";
import { getUserById, createUser } from '../../../functions/mongodbOperations';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const value = url.searchParams.get('id') || '';
    const users = await getUserById('users', 'email', value);
    console.log('value => ', value);
    return NextResponse.json({ success: true, body: users });
  } catch (error: any) {
    console.error('Order API GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const reqBody = await req?.json();
    console.log('reqBody => ', reqBody?.body);
    const products = await createUser(reqBody?.body);
    return NextResponse.json({ success: true, body: products });
  } catch (error: any) {
    console.error('Order API POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}