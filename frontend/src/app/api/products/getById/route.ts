import { NextResponse } from "next/server";
import { getStoreProductByLookup } from "../../../../functions/mongodbOperations";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id")?.trim() ?? "";
    if (!id) {
      return NextResponse.json({ success: false, message: "id is required" }, { status: 400 });
    }

    const product = await getStoreProductByLookup(id);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, body: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
