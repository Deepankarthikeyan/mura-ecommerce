import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getProductByMongoId } from "@/functions/mongodbOperations";

/** Staff: load full product by MongoDB _id (includes soft-deleted). */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id")?.trim() ?? "";
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Valid id is required" }, { status: 400 });
    }

    const product = await getProductByMongoId(id);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, body: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
