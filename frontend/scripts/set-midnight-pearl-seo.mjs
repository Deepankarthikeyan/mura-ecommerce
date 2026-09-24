/**
 * Apply SEO fields to the Midnight Pearl Maheshwari saree product.
 *
 * Usage (from frontend/):
 *   MONGODB_URI="mongodb+srv://..." node scripts/set-midnight-pearl-seo.mjs
 */
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const URI = process.env.MONGODB_URI;
if (!URI) {
  console.error("MONGODB_URI is required.");
  process.exit(1);
}

const PRODUCT_TITLE_PATTERN = /midnight pearl.*maheshwari/i;

const SEO = {
  urlSlug: "midnight-pearl-black-ivory-maheshwari-handloom-saree",
  seoTitle: "Midnight Pearl Black & Ivory Maheshwari Handloom Silk Cotton Saree | Mura23",
  seoDescription:
    "Shop Midnight Pearl, a black and ivory Maheshwari handloom silk cotton saree with antique-gold zari and an embossed striped pallu. Perfect for festive and evening occasions.",
  seoKeywords:
    "Maheshwari handloom saree, black Maheshwari saree, black and ivory saree, silk cotton saree, Maheshwari silk cotton saree, handloom saree for festive occasions, black handloom saree, ivory saree, antique gold saree, Mura23 saree",
  tags: [
    "Maheshwari handloom saree",
    "black Maheshwari saree",
    "black and ivory saree",
    "silk cotton saree",
    "Maheshwari silk cotton saree",
    "handloom saree for festive occasions",
    "black handloom saree",
    "ivory saree",
    "antique gold saree",
    "Mura23 saree",
  ],
};

const client = new MongoClient(URI);

try {
  await client.connect();
  const db = client.db();
  const collection = db.collection("products");

  const product = await collection.findOne({
    title: { $regex: PRODUCT_TITLE_PATTERN },
    $or: [{ isDeleted: { $ne: true } }, { isDeleted: { $exists: false } }],
  });

  if (!product) {
    console.error("Product not found. Search title pattern:", PRODUCT_TITLE_PATTERN);
    process.exit(1);
  }

  const slugTaken = await collection.findOne({
    urlSlug: SEO.urlSlug,
    _id: { $ne: product._id },
    $or: [{ isDeleted: { $ne: true } }, { isDeleted: { $exists: false } }],
  });

  if (slugTaken) {
    console.error(`urlSlug "${SEO.urlSlug}" is already used by:`, slugTaken.title);
    process.exit(1);
  }

  const result = await collection.updateOne(
    { _id: product._id },
    {
      $set: {
        ...SEO,
        updatedAt: new Date(),
      },
    },
  );

  console.log("Updated product:", product.title);
  console.log("Mongo _id:", product._id.toString());
  console.log("Storefront URL: /shop/" + SEO.urlSlug);
  console.log("Modified:", result.modifiedCount);
} finally {
  await client.close();
}
