import { getMongoClientPromise } from '../lib/mongodb';
import { productTitleToUrlSlug } from '../lib/productSlug';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';


// CREATE
export async function createItem(data: any) {
  try {
    const db = (await getMongoClientPromise()).db(); // Get database
    const collection = db.collection('items'); // Get collection
    const result = await collection.insertOne(data); // Insert data
    return result;
  } catch (error: any) {
    throw new Error('Error inserting item: ' + error.message);
  }
}

// CREATE USER WITH HASHED PASSWORD
export async function createUser(data: any) {
  try {
    const db = (await getMongoClientPromise()).db(); // Get database
    const collection = db.collection('users'); // Get collection

    const emailNorm = normalizeUserEmail(data.email);
    const existingUser = await collection.findOne({ email: emailNorm });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const allowedUserTypes = ['customer', 'staff', 'admin'] as const;
    const requestedType = data.userType ?? 'customer';
    const userType = allowedUserTypes.includes(requestedType)
      ? requestedType
      : 'customer';

    const userData = {
      ...data,
      email: emailNorm,
      userType,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(userData);
    return result;
  } catch (error: any) {
    throw new Error('Error creating user: ' + error.message);
  }
}

/** Normalized email stored on users / pending registration OTP rows. */
function normalizeUserEmail(email: string) {
  return email.trim().toLowerCase();
}

const REG_OTP_COLLECTION = 'registration_otps';
const RESET_OTP_COLLECTION = 'password_reset_otps';
const REG_OTP_TTL_MS = 10 * 60 * 1000;
/** After OTP is verified, user must submit address within this window. */
const REG_COMPLETE_TTL_MS = 60 * 60 * 1000;
/** After reset OTP is verified, user must set a new password within this window. */
const RESET_COMPLETE_TTL_MS = 30 * 60 * 1000;

function assertRegistrationBilling(b: Record<string, unknown>) {
  const firstName = String(b.firstName ?? "").trim();
  const lastName = String(b.lastName ?? "").trim();
  const phone = String(b.phone ?? "").trim();
  const street = String(b.street ?? "").trim();
  const city = String(b.city ?? "").trim();
  const state = String(b.state ?? "").trim();
  const zip = String(b.zip ?? "").trim();
  const country = String(b.country ?? "").trim();

  if (firstName.length < 2) {
    throw new Error("First name must be at least 2 characters");
  }
  if (lastName.length < 2) {
    throw new Error("Last name must be at least 2 characters");
  }
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error("Please enter a valid phone number");
  }
  if (!street) {
    throw new Error("Street address is required");
  }
  if (!city) {
    throw new Error("City is required");
  }
  if (!state) {
    throw new Error("State is required");
  }
  if (!zip) {
    throw new Error("Zip code is required");
  }
  if (!country) {
    throw new Error("Country is required");
  }
}

function assertRegistrationPassword(password: string) {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  if (!minLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
    throw new Error(
      'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character'
    );
  }
}

export async function initiateRegistrationWithOtp(payload: {
  username: string;
  email: string;
  password: string;
}) {
  if (!payload.username?.trim() || payload.username.trim().length < 3) {
    throw new Error('Username must be at least 3 characters long');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.email?.trim() || '')) {
    throw new Error('Please enter a valid email address');
  }

  const normalizedEmail = normalizeUserEmail(payload.email);
  const db = (await getMongoClientPromise()).db();
  const users = db.collection('users');
  if (await users.findOne({ email: normalizedEmail })) {
    throw new Error('User with this email already exists');
  }

  assertRegistrationPassword(payload.password);

  const otpPlain = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otpPlain, 10);

  const col = db.collection(REG_OTP_COLLECTION);
  await col.updateOne(
    { email: normalizedEmail },
    {
      $set: {
        email: normalizedEmail,
        username: payload.username.trim(),
        otpHash,
        expiresAt: new Date(Date.now() + REG_OTP_TTL_MS),
      },
      $unset: {
        passwordHash: "",
        otpVerifiedAt: "",
        completeToken: "",
        completeExpiresAt: "",
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );

  await sendRegistrationOtpEmail(normalizedEmail, otpPlain);

  return { success: true as const, message: 'Verification code sent to your email' };
}

/** Confirms email via OTP; does not create a user until address is submitted. */
export async function verifyRegistrationOtp(email: string, otpPlain: string) {
  const normalizedEmail = normalizeUserEmail(email);
  const otp = otpPlain.replace(/\s/g, "");
  if (!/^\d{6}$/.test(otp)) {
    throw new Error("Enter the 6-digit code from your email");
  }

  const db = (await getMongoClientPromise()).db();
  const col = db.collection(REG_OTP_COLLECTION);
  const doc = await col.findOne({ email: normalizedEmail });
  if (!doc) {
    throw new Error("No pending registration found. Please submit the form again.");
  }

  if (doc.otpVerifiedAt && doc.completeToken) {
    if (doc.completeExpiresAt && doc.completeExpiresAt > new Date()) {
      return {
        success: true as const,
        registrationToken: doc.completeToken as string,
        message: "Email verified. Add your address to finish signup.",
      };
    }
    await col.deleteOne({ _id: doc._id });
    throw new Error("Registration session expired. Please register again.");
  }

  if (doc.expiresAt < new Date()) {
    await col.deleteOne({ _id: doc._id });
    throw new Error("Verification code expired. Request a new one.");
  }

  const match = await bcrypt.compare(otp, doc.otpHash);
  if (!match) {
    throw new Error("Invalid verification code.");
  }

  const completeToken = crypto.randomBytes(32).toString("hex");
  const completeExpiresAt = new Date(Date.now() + REG_COMPLETE_TTL_MS);

  await col.updateOne(
    { _id: doc._id },
    {
      $set: {
        otpVerifiedAt: new Date(),
        completeToken,
        completeExpiresAt,
      },
      $unset: { otpHash: "" },
    }
  );

  return {
    success: true as const,
    registrationToken: completeToken,
    message: "Email verified. Add your address to finish signup.",
  };
}

/** Creates the user with password and saved address; consumes pending registration. */
export async function finalizeRegistrationWithAddress(
  registrationToken: string,
  password: string,
  billingInfo: Record<string, unknown>
) {
  if (!registrationToken?.trim()) {
    throw new Error("Registration token is required");
  }
  assertRegistrationPassword(password);
  assertRegistrationBilling(billingInfo);

  const db = (await getMongoClientPromise()).db();
  const col = db.collection(REG_OTP_COLLECTION);
  const doc = await col.findOne({
    completeToken: registrationToken.trim(),
    otpVerifiedAt: { $exists: true },
    completeExpiresAt: { $gt: new Date() },
  });

  if (!doc) {
    throw new Error("Registration session invalid or expired. Please register again.");
  }

  const normalizedEmail = doc.email as string;

  await createUser({
    username: doc.username as string,
    email: normalizedEmail,
    password,
    billingInfo: {
      ...billingInfo,
      email: normalizedEmail,
    },
  });

  await col.deleteOne({ _id: doc._id });
  return {
    success: true as const,
    message: "Account created successfully",
  };
}

// VALIDATE USER LOGIN
export async function validateUserLogin(email: string, password: string) {
  try {
    const db = (await getMongoClientPromise()).db(); // Get database
    const collection = db.collection('users'); // Get collection

    const raw = email.trim();
    const user = await collection.findOne({
      $or: [{ email: raw.toLowerCase() }, { email: raw }],
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: 'Invalid password' };
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (error: any) {
    throw new Error('Error validating user: ' + error.message);
  }
}

// ----------------------------------------------------------------------------------------------------------------

// READ
export async function getAllItems(collectionName: string) {
  try {
    const db = (await getMongoClientPromise()).db("biozen"); // Get database
    console.log('getAllItems => ', collectionName)
    const collection = db.collection(collectionName); // Get collection
    const items = await collection.find({}).toArray(); // Fetch all items
    return items;
  } catch (error: any) {
    throw new Error('Error fetching items: ' + error.message);
  }
}

/** Products for listings: omit soft-deleted unless includeDisabled is true. */
function productsListingBaseFilter(includeDisabled: boolean) {
  if (includeDisabled) {
    return {};
  }
  return {
    $or: [{ isDeleted: { $ne: true } }, { isDeleted: { $exists: false } }],
  };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getProductsListing(
  includeDisabled: boolean,
  options?: { search?: string; category?: string }
) {
  try {
    const db = (await getMongoClientPromise()).db("biozen");
    const collection = db.collection("products");
    const filter: Record<string, unknown> = {
      ...productsListingBaseFilter(includeDisabled),
    };

    const category = options?.category?.trim();
    if (category) {
      filter.category = category;
    }

    const search = options?.search?.trim();
    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      filter.$and = [
        {
          $or: [{ title: { $regex: regex } }, { category: { $regex: regex } }],
        },
      ];
    }

    return collection.find(filter).toArray();
  } catch (error: any) {
    throw new Error("Error fetching products: " + error.message);
  }
}

/** Distinct product categories for listing filters. */
export async function getProductCategories(includeDisabled: boolean) {
  try {
    const db = (await getMongoClientPromise()).db("biozen");
    const collection = db.collection("products");
    const categories = await collection.distinct("category", productsListingBaseFilter(includeDisabled));
    return categories
      .map((value) => String(value ?? "").trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  } catch (error: any) {
    throw new Error("Error fetching product categories: " + error.message);
  }
}

/** Update fields on a document in `products` (database biozen). */
export async function updateProductFields(productId: string, fields: Record<string, unknown>) {
  try {
    const db = (await getMongoClientPromise()).db("biozen");
    const collection = db.collection("products");
    const result = await collection.updateOne(
      { _id: new ObjectId(productId) },
      { $set: { ...fields, updatedAt: new Date() } }
    );
    return result;
  } catch (error: any) {
    throw new Error("Error updating product: " + error.message);
  }
}

/** Insert a new product into `products` (database biozen). */
export async function createProduct(fields: Record<string, unknown>) {
  try {
    const db = (await getMongoClientPromise()).db("biozen");
    const collection = db.collection("products");

    const productId = typeof fields.productId === "string" ? fields.productId.trim() : "";
    if (productId) {
      const existing = await collection.findOne({ productId });
      if (existing) {
        throw new Error(`Product ID "${productId}" already exists`);
      }
    }

    const maxDoc = await collection
      .find({ id: { $type: "number" } })
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    const nextId = ((maxDoc[0]?.id as number | undefined) ?? 0) + 1;

    const slug =
      (typeof fields.slug === "string" ? fields.slug.trim() : "") ||
      productId;

    const doc: Record<string, unknown> = {
      ...fields,
      id: nextId,
      slug,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(doc);
    const mongoId = result.insertedId.toString();

    if (typeof doc.title === "string" && doc.title.trim()) {
      await assignUrlSlugForProduct(mongoId, doc.title);
    }

    return { insertedId: result.insertedId, mongoId };
  } catch (error: any) {
    throw new Error("Error creating product: " + error.message);
  }
}

/** Full product document by Mongo _id (staff; includes disabled). */
export async function getProductByMongoId(mongoId: string) {
  try {
    if (!ObjectId.isValid(mongoId)) return null;
    const db = (await getMongoClientPromise()).db("biozen");
    const collection = db.collection("products");
    return collection.findOne({ _id: new ObjectId(mongoId) });
  } catch (error: any) {
    throw new Error("Error fetching product: " + error.message);
  }
}

/** Ensures `urlSlug` matches title and is unique among non-deleted products (for /shop/[slug] lookups). */
export async function assignUrlSlugForProduct(mongoId: string, title: string) {
  const base = productTitleToUrlSlug(String(title ?? "").trim());
  if (!base) {
    return;
  }
  try {
    const db = (await getMongoClientPromise()).db("biozen");
    const collection = db.collection("products");
    const oid = new ObjectId(mongoId);

    for (let n = 0; n < 200; n++) {
      const candidate = n === 0 ? base : `${base}-${n + 1}`;
      const exists = await collection.findOne({
        urlSlug: candidate,
        _id: { $ne: oid },
        $or: [{ isDeleted: { $ne: true } }, { isDeleted: { $exists: false } }],
      });
      if (!exists) {
        await collection.updateOne({ _id: oid }, { $set: { urlSlug: candidate, updatedAt: new Date() } });
        return;
      }
    }
  } catch (error: any) {
    console.error("assignUrlSlugForProduct:", error);
  }
}

/** Single product for storefront (biozen DB); hides soft-deleted. Match productId, slug, urlSlug, or title-derived slug. */
export async function getStoreProductByLookup(productKey: string) {
  try {
    const key = productKey.trim();
    if (!key) {
      return null;
    }

    const db = (await getMongoClientPromise()).db("biozen");
    const collection = db.collection("products");

    const notDeleted = {
      $or: [{ isDeleted: { $ne: true } }, { isDeleted: { $exists: false } }],
    };

    const normLower = key.toLowerCase();

    let doc = await collection.findOne({
      $and: [
        notDeleted,
        {
          $or: [
            { productId: key },
            { slug: key },
            { slug: normLower },
            { urlSlug: key },
            { urlSlug: normLower },
          ],
        },
      ],
    });

    if (doc) {
      return doc;
    }

    const products = await collection.find(notDeleted).toArray();
    for (const p of products) {
      const stored =
        typeof (p as { urlSlug?: string }).urlSlug === "string"
          ? String((p as { urlSlug?: string }).urlSlug).trim().toLowerCase()
          : "";
      if (stored && stored === normLower) {
        return p;
      }
      const derived = productTitleToUrlSlug(String((p as { title?: string }).title ?? "")).toLowerCase();
      if (derived && derived === normLower) {
        await collection
          .updateOne({ _id: p._id }, { $set: { urlSlug: derived, updatedAt: new Date() } })
          .catch(() => {});
        return p;
      }
    }

    return null;
  } catch (error: any) {
    throw new Error("Error fetching product: " + error.message);
  }
}

// --------------------------------------------------------------------------------------------------------------------

// READ BY ONE
export async function getItemById(collectionName: any, property: any, value: any) {
  try {
    const db = (await getMongoClientPromise()).db(); // Get database
    console.log("item => ", collectionName)
    const collection = db.collection(collectionName); // Get collection
    const item = await collection.findOne({productId: value }); // Find item by ID
    return item;
  } catch (error: any) {
    throw new Error('Error fetching item by ID: ' + error.message);
  }
}

// READ BY ONE
export async function getUserById(collectionName: any, property: any, value: any) {
  try {
    const db = (await getMongoClientPromise()).db(); // Get database
    console.log("item => ", collectionName)
    const collection = db.collection(collectionName); // Get collection
    const item = await collection.findOne({email: value }); // Find item by ID
    return item;
  } catch (error: any) {
    throw new Error('Error fetching item by ID: ' + error.message);
  }
}

// UPDATE USER BY EMAIL
export async function updateUserByEmail(email: string, updatedData: any) {
  try {
    const db = (await getMongoClientPromise()).db(); // Get database
    const collection = db.collection('users'); // Get collection
    const result = await collection.updateOne(
      { email: email }, // Match by email
      { $set: updatedData } // Update fields
    );
    return result;
  } catch (error: any) {
    throw new Error('Error updating user: ' + error.message);
  }
}

// -----------------------------------------------------------------------------------------------------------------------------

// UPDATE
export async function updateItemById(id: any, updatedData: any) {
  try {
    const db = (await getMongoClientPromise()).db(); // Get database
    const collection = db.collection('items'); // Get collection
    const result = await collection.updateOne(
      { _id: new ObjectId(id) }, // Match by ID
      { $set: updatedData } // Update fields
    );
    return result;
  } catch (error: any) {
    throw new Error('Error updating item: ' + error.message);
  }
}

// ------------------------------------------------------------------------------------------------------------------------------

// DELETE
export async function deleteItemById(id: any) {
  try {
    const db = (await getMongoClientPromise()).db(); // Get database
    const collection = db.collection('items'); // Get collection
    const result = await collection.deleteOne({ _id: new ObjectId(id) }); // Delete item by ID
    return result;
  } catch (error: any) {
    throw new Error('Error deleting item: ' + error.message);
  }
}

// ------------------------------------------------------------------------------------------------------------------------------

// CREATE ORDER
export async function createOrder(orderData: any) {
  try {
    const db = (await getMongoClientPromise()).db(); // Get database
    const collection = db.collection('orderDetails'); // Get collection
    const result = await collection.insertOne({
      ...orderData,
      createdAt: new Date(),
      status: 'pending'
    });
    return result;
  } catch (error: any) {
    throw new Error('Error creating order: ' + error.message);
  }
}

// ------------------------------------------------------------------------------------------------------------------------------

// EMAIL SERVICE
import nodemailer from 'nodemailer';

// Support comma-separated emails in env var
const STAFF_EMAILS = (process.env.STAFF_EMAILS || '')
  .split(',')
  .map(email => email.trim())
  .filter(email => email.length > 0);

const STAFF_PHONE_NUMBERS = (process.env.STAFF_PHONE_NUMBERS || '')
  .split(',')
  .map((phone) => phone.trim())
  .filter((phone) => phone.length > 0);

// Lazy-load transporter to avoid build-time issues
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    console.log('Email config check:', {
      hasEmailUser: !!emailUser,
      hasEmailPass: !!emailPass,
      emailUser: emailUser ? emailUser.substring(0, 5) + '...' : 'NOT SET',
      passLength: emailPass ? emailPass.length : 0,
      isPlaceholder: emailPass === 'your-gmail-app-password'
    });

    if (!emailUser || !emailPass || emailPass === 'your-gmail-app-password') {
      throw new Error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS in .env.local');
    }

    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      },
      requireTLS: true
    });
  }
  return transporter;
}

const ORDER_EMAIL_TIMEZONE = 'Asia/Kolkata';

/** Order confirmation emails — always show India Standard Time (IST). */
function formatOrderEmailDateTime(value?: string | number | Date | null): string {
  const date =
    value == null ? new Date() : value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return formatOrderEmailDateTime(new Date());
  }

  const formatted = date.toLocaleString('en-IN', {
    timeZone: ORDER_EMAIL_TIMEZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return `${formatted} IST`;
}

export async function sendRegistrationOtpEmail(toEmail: string, otpCode: string) {
  const transport = getTransporter();
  const from = process.env.EMAIL_USER || "your-email@gmail.com";
  await transport.sendMail({
    from: `"Aathithya Herbal" <${from}>`,
    to: toEmail,
    subject: "Your registration verification code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #2C3C28; margin: 0 0 12px 0;">Verify your email</h2>
        <p style="color: #444; font-size: 15px; line-height: 1.5;">Use this code to complete your registration:</p>
        <div style="font-size: 28px; letter-spacing: 8px; font-weight: 700; color: #629D23; margin: 20px 0;">${otpCode}</div>
        <p style="color: #666; font-size: 13px;">This code expires in 10 minutes. If you did not request this, you can ignore this email.</p>
      </div>
    `,
    text: `Your registration verification code is: ${otpCode}. It expires in 10 minutes.`,
  });
}

export async function sendPasswordResetOtpEmail(toEmail: string, otpCode: string) {
  const transport = getTransporter();
  const from = process.env.EMAIL_USER || "your-email@gmail.com";
  await transport.sendMail({
    from: `"Aathithya Herbal" <${from}>`,
    to: toEmail,
    subject: "Your password reset verification code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #2C3C28; margin: 0 0 12px 0;">Reset your password</h2>
        <p style="color: #444; font-size: 15px; line-height: 1.5;">Use this code to reset your password:</p>
        <div style="font-size: 28px; letter-spacing: 8px; font-weight: 700; color: #629D23; margin: 20px 0;">${otpCode}</div>
        <p style="color: #666; font-size: 13px;">This code expires in 10 minutes. If you did not request this, you can ignore this email.</p>
      </div>
    `,
    text: `Your password reset verification code is: ${otpCode}. It expires in 10 minutes.`,
  });
}

/** Sends a password-reset OTP to an existing account email. */
export async function initiatePasswordResetOtp(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email?.trim() || "")) {
    throw new Error("Please enter a valid email address");
  }

  const normalizedEmail = normalizeUserEmail(email);
  const db = (await getMongoClientPromise()).db();
  const users = db.collection("users");
  const user = await users.findOne({
    $or: [{ email: normalizedEmail }, { email: email.trim() }],
  });

  if (!user) {
    throw new Error("No account found with this email address");
  }

  const otpPlain = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otpPlain, 10);
  const col = db.collection(RESET_OTP_COLLECTION);

  await col.updateOne(
    { email: normalizedEmail },
    {
      $set: {
        email: normalizedEmail,
        otpHash,
        expiresAt: new Date(Date.now() + REG_OTP_TTL_MS),
      },
      $unset: {
        otpVerifiedAt: "",
        resetToken: "",
        resetExpiresAt: "",
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );

  await sendPasswordResetOtpEmail(normalizedEmail, otpPlain);

  return { success: true as const, message: "Verification code sent to your email" };
}

/** Confirms password-reset OTP and returns a short-lived reset token. */
export async function verifyPasswordResetOtp(email: string, otpPlain: string) {
  const normalizedEmail = normalizeUserEmail(email);
  const otp = otpPlain.replace(/\s/g, "");
  if (!/^\d{6}$/.test(otp)) {
    throw new Error("Enter the 6-digit code from your email");
  }

  const db = (await getMongoClientPromise()).db();
  const col = db.collection(RESET_OTP_COLLECTION);
  const doc = await col.findOne({ email: normalizedEmail });
  if (!doc) {
    throw new Error("No password reset request found. Please request a new code.");
  }

  if (doc.otpVerifiedAt && doc.resetToken) {
    if (doc.resetExpiresAt && doc.resetExpiresAt > new Date()) {
      return {
        success: true as const,
        resetToken: doc.resetToken as string,
        message: "Email verified. You can set a new password.",
      };
    }
    await col.deleteOne({ _id: doc._id });
    throw new Error("Password reset session expired. Please request a new code.");
  }

  if (doc.expiresAt < new Date()) {
    await col.deleteOne({ _id: doc._id });
    throw new Error("Verification code expired. Request a new one.");
  }

  const match = await bcrypt.compare(otp, doc.otpHash);
  if (!match) {
    throw new Error("Invalid verification code.");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetExpiresAt = new Date(Date.now() + RESET_COMPLETE_TTL_MS);

  await col.updateOne(
    { _id: doc._id },
    {
      $set: {
        otpVerifiedAt: new Date(),
        resetToken,
        resetExpiresAt,
      },
      $unset: { otpHash: "" },
    }
  );

  return {
    success: true as const,
    resetToken,
    message: "Email verified. You can set a new password.",
  };
}

/** Sets a new password using a verified reset token. */
export async function resetPasswordWithToken(resetToken: string, password: string) {
  if (!resetToken?.trim()) {
    throw new Error("Reset token is required");
  }
  assertRegistrationPassword(password);

  const db = (await getMongoClientPromise()).db();
  const col = db.collection(RESET_OTP_COLLECTION);
  const doc = await col.findOne({
    resetToken: resetToken.trim(),
    otpVerifiedAt: { $exists: true },
    resetExpiresAt: { $gt: new Date() },
  });

  if (!doc) {
    throw new Error("Password reset session invalid or expired. Please try again.");
  }

  const normalizedEmail = doc.email as string;
  const hashedPassword = await bcrypt.hash(password, 10);
  const users = db.collection("users");
  const result = await users.updateOne(
    {
      $or: [{ email: normalizedEmail }, { email: String(doc.email) }],
    },
    { $set: { password: hashedPassword, updatedAt: new Date() } }
  );

  if (result.matchedCount === 0) {
    throw new Error("Account not found. Please try again.");
  }

  await col.deleteOne({ _id: doc._id });

  return {
    success: true as const,
    message: "Password updated successfully. You can now log in.",
  };
}

export async function sendOrderConfirmationEmail(orderData: any, userEmail: string) {
  try {
    const { orderId, items, total, billingInfo, paymentMethod, createdAt } = orderData;
    const orderDateDisplay = formatOrderEmailDateTime(createdAt);

    // Format items for email
    const itemsList = items.map((item: any) =>
      `<tr>
        <td style="padding: 10px; border: 1px solid #ddd;">${item.title}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    ).join('');

    const companyAddress = {
      name: "Aathithya Herbal",
      street: "5/611, KNG Pudur Rd",
      area: "K.N.Palayam, KNG Pudur Pirivu",
      city: "Coimbatore, Tamil Nadu 641108",
      country: "India",
      phone: "+91 95855 15051",
      email: "support@aathithyaherbal.com"
    };

    const buildOrderEmailHtml = (orderHeading: string, greetingLine: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; border: 1px solid #e0e0e0;">
        <!-- Header with Logo -->
        <div style="background: linear-gradient(135deg, #629D23 0%, #4a7a1a 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700;">AATHITHYA HERBAL</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Worldwide Herbal Store Since 2016</p>
        </div>

        <div style="padding: 30px 30px 0 30px;">
          <h2 style="color: #629D23; margin: 0 0 10px 0; font-size: 24px;">${orderHeading}</h2>
          <p style="color: #666; margin: 0;">${greetingLine}</p>
        </div>

        <!-- Order Details -->
        <div style="padding: 20px 30px;">
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;">Order ID:</td>
                <td style="padding: 8px 0; color: #2C3C28; font-weight: 600; font-size: 14px;">${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;">Order Date:</td>
                <td style="padding: 8px 0; color: #2C3C28; font-size: 14px;">${orderDateDisplay}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-size: 14px;">Payment Method:</td>
                <td style="padding: 8px 0; color: #2C3C28; font-size: 14px;">${paymentMethod}</td>
              </tr>
            </table>
          </div>

          <!-- Items Ordered -->
          <h3 style="color: #2C3C28; margin: 0 0 15px 0; font-size: 18px;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #629D23; color: white;">
                <th style="padding: 12px; border: 1px solid #629D23; text-align: left; font-size: 14px;">Product</th>
                <th style="padding: 12px; border: 1px solid #629D23; text-align: center; font-size: 14px;">Qty</th>
                <th style="padding: 12px; border: 1px solid #629D23; text-align: right; font-size: 14px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>

          <!-- Order Total -->
          <div style="text-align: right; padding: 15px; background: #f0f7e6; border-radius: 8px; margin-bottom: 30px;">
            <span style="color: #666; font-size: 16px;">Order Total: </span>
            <span style="color: #629D23; font-size: 24px; font-weight: 700;">₹${total.toFixed(2)}</span>
          </div>

          <!-- Addresses Section -->
          <h3 style="color: #2C3C28; margin: 0 0 15px 0; font-size: 18px;">Address Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <tr>
              <!-- Company Dispatch Address (Left) -->
              <td style="width: 50%; vertical-align: top; padding-right: 15px;">
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #629D23;">
                  <h4 style="color: #629D23; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">From (Dispatch)</h4>
                  <p style="margin: 0; color: #2C3C28; font-weight: 600; font-size: 15px;">${companyAddress.name}</p>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 13px; line-height: 1.6;">
                    ${companyAddress.street}<br>
                    ${companyAddress.area}<br>
                    ${companyAddress.city}<br>
                    ${companyAddress.country}<br>
                    <strong>Phone:</strong> ${companyAddress.phone}
                  </p>
                </div>
              </td>
              <!-- Shipping Address (Right) -->
              <td style="width: 50%; vertical-align: top; padding-left: 15px;">
                <div style="background: #f0f7e6; padding: 20px; border-radius: 8px; border-left: 4px solid #2C3C28;">
                  <h4 style="color: #2C3C28; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">To (Ship To)</h4>
                  <p style="margin: 0; color: #2C3C28; font-weight: 600; font-size: 15px;">${billingInfo.firstName} ${billingInfo.lastName}</p>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 13px; line-height: 1.6;">
                    ${billingInfo.street}<br>
                    ${billingInfo.city}, ${billingInfo.state} ${billingInfo.zip}<br>
                    ${billingInfo.country}<br>
                    <strong>Phone:</strong> ${billingInfo.phone}
                  </p>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Footer -->
        <div style="background: #2C3C28; padding: 30px; color: white; text-align: center;">
          <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #fff;">Aathithya Herbal</h3>
          <p style="margin: 0 0 10px 0; font-size: 13px; color: #ccc; line-height: 1.6;">
            5/611, KNG Pudur Rd, K.N.Palayam, KNG Pudur Pirivu,<br>
            Coimbatore, Tamil Nadu 641108, India
          </p>
          <p style="margin: 0 0 15px 0; font-size: 13px; color: #ccc;">
            <strong>Contact:</strong> +91 95855 15051 | <strong>Email:</strong> support@aathithyaherbal.com
          </p>
          <div style="border-top: 1px solid #4a5a46; padding-top: 15px; margin-top: 15px;">
            <p style="margin: 0; font-size: 12px; color: #888;">
              Thank you for shopping with us! If you have any questions about your order,<br>
              please contact our customer support team.
            </p>
          </div>
        </div>
      </div>
    `;

    const customerGreeting = `Dear ${billingInfo.firstName} ${billingInfo.lastName}, thank you for your order!`;
    const staffGreeting = `Admin - New order from ${billingInfo.firstName} ${billingInfo.lastName}, thank you for your order!`;
    const customerEmailHtml = buildOrderEmailHtml('Order Placed', customerGreeting);
    const staffEmailHtml = buildOrderEmailHtml('Order Received', staffGreeting);

    // Send email to user
    const userMailOptions = {
      from: `"Aathithya Herbal" <${process.env.EMAIL_USER || 'your-email@gmail.com'}>`,
      to: userEmail,
      subject: `Order Placed - Order #${orderId}`,
      html: customerEmailHtml,
    };

    // Send both emails
    const transport = getTransporter();

    // Verify transporter before sending
    await transport.verify();
    console.log('Email transporter verified successfully');

    // Send email to user
    const userResult = await transport.sendMail(userMailOptions);
    console.log('User email sent:', userResult.messageId);

    // Send emails to all staff members in parallel
    if (STAFF_EMAILS.length > 0) {
      const staffEmailPromises = STAFF_EMAILS.map(async (staffEmail) => {
        const staffMailOptions = {
          from: `"Aathithya Herbal" <${process.env.EMAIL_USER || 'your-email@gmail.com'}>`,
          to: staffEmail,
          subject: `Order Received - Order #${orderId}`,
          html: staffEmailHtml,
        };
        const result = await transport.sendMail(staffMailOptions);
        console.log(`Staff email sent to ${staffEmail}:`, result.messageId);
        return result;
      });

      await Promise.all(staffEmailPromises);
      console.log(`All staff emails sent successfully to ${STAFF_EMAILS.length} recipient(s)`);
    }

    return { success: true, message: 'Emails sent successfully' };
  } catch (error: any) {
    console.error('Error sending email:', error);
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Check your EMAIL_USER and EMAIL_PASS in .env.local. Make sure you are using a Gmail App Password, not your regular Gmail password.');
    }
    if (error.code === 'ESOCKET' && error.message.includes('certificate')) {
      throw new Error('SSL Certificate error. If this persists, try setting NODE_TLS_REJECT_UNAUTHORIZED=0 in your .env.local file as a workaround (development only).');
    }
    throw new Error('Error sending email: ' + error.message);
  }
}

export type OrderActionType = 'cancel' | 'return' | 'refund';

export interface OrderActionSelectedProduct {
  title: string;
  quantity: number;
  price: number;
}

interface OrderActionEmailParams {
  userEmail: string;
  userName?: string;
  orderNo: string;
  action: OrderActionType;
  reason: string;
  selectedProducts?: OrderActionSelectedProduct[];
  attachment?: {
    filename: string;
    content: Buffer;
    contentType: string;
  };
}

const ORDER_ACTION_LABELS: Record<OrderActionType, string> = {
  cancel: 'Cancellation',
  return: 'Return',
  refund: 'Refund',
};

export async function sendOrderActionRequestEmail(params: OrderActionEmailParams) {
  const { userEmail, userName, orderNo, action, reason, selectedProducts, attachment } = params;
  const actionLabel = ORDER_ACTION_LABELS[action];
  const displayName = userName?.trim() || userEmail;
  const fromAddress = process.env.EMAIL_USER || 'your-email@gmail.com';

  const escapeHtml = (value: string) => value.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const selectedProductsHtml =
    selectedProducts && selectedProducts.length > 0
      ? `
        <h3 style="color: #2C3C28; margin: 0 0 8px 0; font-size: 16px;">Selected products</h3>
        <ul style="margin: 0 0 16px 0; padding-left: 20px; color: #444; font-size: 14px; line-height: 1.6;">
          ${selectedProducts
            .map(
              (product) =>
                `<li>${escapeHtml(product.title)} × ${product.quantity} — ₹${(product.price * product.quantity).toFixed(2)}</li>`,
            )
            .join('')}
        </ul>
      `
      : '';

  const selectedProductsText =
    selectedProducts && selectedProducts.length > 0
      ? `\n\nSelected products:\n${selectedProducts
          .map(
            (product) =>
              `- ${product.title} × ${product.quantity} — ₹${(product.price * product.quantity).toFixed(2)}`,
          )
          .join('\n')}`
      : '';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e0e0e0;">
      <div style="background: linear-gradient(135deg, #629D23 0%, #4a7a1a 100%); padding: 24px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 22px;">Order ${actionLabel} Request</h1>
      </div>
      <div style="padding: 24px;">
        <p style="margin: 0 0 16px 0; color: #444; font-size: 15px; line-height: 1.5;">
          A customer has submitted a <strong>${actionLabel.toLowerCase()}</strong> request for their order.
        </p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px; width: 140px;">Order:</td>
            <td style="padding: 8px 0; color: #2C3C28; font-weight: 600; font-size: 14px;">${orderNo}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px;">Customer:</td>
            <td style="padding: 8px 0; color: #2C3C28; font-size: 14px;">${displayName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px;">Email:</td>
            <td style="padding: 8px 0; color: #2C3C28; font-size: 14px;">
              <a href="mailto:${userEmail}">${userEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-size: 14px;">Request type:</td>
            <td style="padding: 8px 0; color: #2C3C28; font-size: 14px;">${actionLabel}</td>
          </tr>
        </table>
        ${selectedProductsHtml}
        <h3 style="color: #2C3C28; margin: 0 0 8px 0; font-size: 16px;">Reason</h3>
        <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; border-left: 4px solid #629D23; margin-bottom: 16px;">
          <p style="margin: 0; color: #444; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(reason)}</p>
        </div>
        ${attachment ? '<p style="margin: 0; color: #666; font-size: 13px;">Supporting document is attached to this email.</p>' : ''}
      </div>
    </div>
  `;

  try {
    if (STAFF_EMAILS.length === 0) {
      throw new Error('STAFF_EMAILS is not configured. Please set STAFF_EMAILS in .env.local');
    }

    const transport = getTransporter();
    await transport.verify();

    const staffEmailPromises = STAFF_EMAILS.map(async (staffEmail) => {
      const result = await transport.sendMail({
        from: `"${displayName}" <${fromAddress}>`,
        replyTo: userEmail,
        to: staffEmail,
        subject: `Order ${actionLabel} Request - ${orderNo}`,
        html,
        text: `Order ${actionLabel} Request\n\nOrder: ${orderNo}\nCustomer: ${displayName}\nEmail: ${userEmail}${selectedProductsText}\n\nReason:\n${reason}`,
        attachments: attachment
          ? [
              {
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType,
              },
            ]
          : [],
      });
      return result;
    });

    await Promise.all(staffEmailPromises);
    return { success: true, message: 'Request submitted successfully' };
  } catch (error: any) {
    console.error('Error sending order action email:', error);
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Check EMAIL_USER and EMAIL_PASS in .env.local.');
    }
    throw new Error('Error sending request: ' + error.message);
  }
}

// ------------------------------------------------------------------------------------------------------------------------------

// WHATSAPP SERVICE - Meta Business API Direct Integration
const WHATSAPP_CUSTOMER_CHECKOUT_STATUS = 'Order placed';
const WHATSAPP_STAFF_CHECKOUT_STATUS = 'Order received';

interface WhatsAppMessageData {
  orderId: string;
  customerName: string;
  phoneNumber?: string;
  customerAddress?: string;
  total: number;
  items: Array<{ title: string; quantity: number; price: number }>;
}

function formatWhatsAppPhone(phone: string): string {
  return phone.startsWith('+') ? phone : `+91${phone}`;
}

function sanitizeWhatsAppTemplateParam(text: string): string {
  return text.replace(/[\n\r\t]+/g, ' ').replace(/ {5,}/g, '    ').trim();
}

function buildStaffCustomerPhone(messageData: WhatsAppMessageData): string {
  const phone = messageData.phoneNumber?.trim();
  return phone ? formatWhatsAppPhone(phone) : '—';
}

function buildStaffCustomerAddress(messageData: WhatsAppMessageData): string {
  return messageData.customerAddress?.trim() || '—';
}

/** Staff utility template body vars — Meta template static text:
 *  📦 New Order Received - Aathithya Herbal
 *  Customer: {{1}}
 *  Phone: {{6}} / Address: {{7}}
 *  Order ID: {{2}} / Order Value: {{3}}
 *  Ordered Items: {{4}} / Order Status: {{5}}
 *  ✅ Please proceed with order processing, packing, and dispatch
 *
 *  Meta rejects newlines in parameter values — all vars must be single-line.
 */
function buildStaffOrderWhatsAppBodyParams(messageData: WhatsAppMessageData): string[] {
  const { customerName, orderId, total, items } = messageData;
  const itemsBlock =
    items.length > 0
      ? items.map((item) => `${item.title} × ${item.quantity}`).join(' | ')
      : '—';

  return [
    customerName,
    orderId,
    `₹${total.toFixed(2)}`,
    itemsBlock,
    WHATSAPP_STAFF_CHECKOUT_STATUS,
    buildStaffCustomerPhone(messageData),
    buildStaffCustomerAddress(messageData),
  ].map(sanitizeWhatsAppTemplateParam);
}

async function sendStaffWhatsAppNotificationToRecipient(
  messageData: WhatsAppMessageData,
  phoneNumber: string,
) {
  const apiVersion = 'v18.0';
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  const templateName =
    process.env.META_STAFF_ORDER_TEMPLATE_NAME || 'staff_new_order';

  if (!phoneNumberId || !accessToken) {
    console.warn('WhatsApp not configured: META_PHONE_NUMBER_ID or META_ACCESS_TOKEN missing');
    return { success: false, error: 'WhatsApp credentials not configured' };
  }

  const formattedPhone = formatWhatsAppPhone(phoneNumber);
  const bodyParams = buildStaffOrderWhatsAppBodyParams(messageData);
  const apiUrl = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

  const messageBody = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formattedPhone,
    type: 'template',
    template: {
      name: templateName,
      language: { code: 'en' },
      components: [
        {
          type: 'body',
          parameters: bodyParams.map((text) => ({ type: 'text', text })),
        },
      ],
    },
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageBody),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(`WhatsApp staff API error for ${formattedPhone}:`, data);
    throw new Error(data.error?.message || 'WhatsApp API request failed');
  }

  console.log(`WhatsApp staff order message sent to ${formattedPhone}:`, data.messages?.[0]?.id);
  return { success: true, messageId: data.messages?.[0]?.id as string | undefined };
}

function formatOrderStatusForCustomerNotification(status: string): string {
  const s = String(status ?? '').trim().toLowerCase();
  if (s === 'paid') return 'Order received';
  if (s === 'disptached' || s === 'dispatched') return 'Dispatched';
  if (s === 'canceled' || s === 'cancelled') return 'Cancel approved';
  return s
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Customer-facing headline for each order status — sent as template body {{6}}. */
const CUSTOMER_WHATSAPP_STATUS_HEADLINES: Record<string, string> = {
  'order placed': '🎉 Your order has been confirmed!',
  paid: '🎉 Your order has been confirmed!',
  'order received': '🎉 Your order has been confirmed!',
  pending: '⏳ Your order is pending confirmation.',
  'order accepted': '✅ Your order has been accepted!',
  dispatched: '🚚 Your order is on the way!',
  disptached: '🚚 Your order is on the way!',
  delivered: '📦 Your order has been delivered!',
  'cancel in review': '🔍 Your cancellation request is under review.',
  'cancel approved': '✅ Your order cancellation has been approved.',
  'cancel rejected': '❌ Your cancellation request was not approved.',
  canceled: '❌ Your order has been cancelled.',
  cancelled: '❌ Your order has been cancelled.',
  'return in review': '🔍 Your return request is under review.',
  'return approved': '✅ Your return has been approved.',
  'return rejected': 'ℹ️ Your return request was not approved.',
  'refund processing': '💳 Your refund is being processed.',
  refunded: '✅ Your refund has been completed.',
};

function resolveCustomerWhatsAppStatusHeadline(status: string): string {
  const key = String(status ?? '').trim().toLowerCase();
  return CUSTOMER_WHATSAPP_STATUS_HEADLINES[key] ?? '📋 Your order status has been updated.';
}

/** Customer utility template body vars — Meta template static text:
 *  Customer: {{1}}
 *  Order ID: {{2}} / Order Value: {{3}}
 *  Items: {{4}} / Status: {{5}}
 *  {{6}} — Status headline (e.g. "🎉 Your order has been confirmed!")
 *
 *  Meta rejects newlines in parameter values — all vars must be single-line.
 */
function buildCustomerOrderWhatsAppBodyParams(
  messageData: WhatsAppMessageData,
  orderStatusLabel: string,
  statusForHeadline: string,
): string[] {
  const { orderId, customerName, total, items } = messageData;
  const itemsSummary = items.slice(0, 3).map((i) => `${i.title} (x${i.quantity})`).join(', ');
  const itemsDisplay = items.length > 3 ? `${itemsSummary}...` : itemsSummary;

  return [
    customerName,
    orderId,
    `₹${total.toFixed(2)}`,
    itemsDisplay,
    orderStatusLabel,
    resolveCustomerWhatsAppStatusHeadline(statusForHeadline),
  ].map(sanitizeWhatsAppTemplateParam);
}

async function sendWhatsAppNotificationToRecipient(
  messageData: WhatsAppMessageData,
  phoneNumber: string,
  orderStatus: string = WHATSAPP_CUSTOMER_CHECKOUT_STATUS,
  rawStatusForHeadline: string = WHATSAPP_CUSTOMER_CHECKOUT_STATUS,
) {
  const apiVersion = 'v18.0';
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  const templateName = process.env.META_ORDER_TEMPLATE_NAME || 'order_confirmation';

  if (!phoneNumberId || !accessToken) {
    console.warn('WhatsApp not configured: META_PHONE_NUMBER_ID or META_ACCESS_TOKEN missing');
    return { success: false, error: 'WhatsApp credentials not configured' };
  }

  const formattedPhone = formatWhatsAppPhone(phoneNumber);
  const bodyParams = buildCustomerOrderWhatsAppBodyParams(
    messageData,
    orderStatus,
    rawStatusForHeadline,
  );
  const apiUrl = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

  const messageBody = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: formattedPhone,
    type: 'template',
    template: {
      name: templateName,
      language: { code: 'en' },
      components: [
        {
          type: 'body',
          parameters: bodyParams.map((text) => ({ type: 'text', text })),
        },
      ],
    },
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageBody),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(`WhatsApp API error for ${formattedPhone}:`, data);
    throw new Error(data.error?.message || 'WhatsApp API request failed');
  }

  console.log(`WhatsApp message sent to ${formattedPhone}:`, data.messages?.[0]?.id);
  return { success: true, messageId: data.messages?.[0]?.id as string | undefined };
}

function buildCustomerWhatsAppMessageData(order: Record<string, unknown>): WhatsAppMessageData | null {
  const orderId = String(order.orderId ?? '').trim();
  if (!orderId) return null;

  const billingInfo = (order.billingInfo ?? {}) as Record<string, unknown>;
  const firstName = String(billingInfo.firstName ?? '').trim();
  const lastName = String(billingInfo.lastName ?? '').trim();
  const customerName = `${firstName} ${lastName}`.trim() || 'Customer';
  const phoneNumber = String(billingInfo.phone ?? billingInfo.contact ?? '').trim() || undefined;
  const customerAddress = [
    billingInfo.street,
    billingInfo.city,
    billingInfo.state,
    billingInfo.zip,
    billingInfo.country,
  ]
    .map((part) => String(part ?? '').trim())
    .filter(Boolean)
    .join(', ');

  const rawItems = Array.isArray(order.items) ? order.items : [];
  const items = rawItems
    .map((item) => {
      const row = item as Record<string, unknown>;
      const title = String(row.title ?? 'Item').trim() || 'Item';
      const quantity = Number(row.quantity ?? 1);
      const price = Number(row.price ?? 0);
      return {
        title,
        quantity: Number.isFinite(quantity) ? quantity : 1,
        price: Number.isFinite(price) ? price : 0,
      };
    })
    .filter((item) => item.title);

  const totalRaw = order.total;
  const total =
    typeof totalRaw === 'number'
      ? totalRaw
      : parseFloat(String(totalRaw ?? '0').replace(/[^0-9.-]/g, '')) || 0;

  return {
    orderId,
    customerName,
    phoneNumber,
    customerAddress: customerAddress || undefined,
    total,
    items,
  };
}

function resolveCustomerOrderEmail(order: Record<string, unknown>): string {
  const billingInfo = (order.billingInfo ?? {}) as Record<string, unknown>;
  return String(order.userEmail ?? billingInfo.email ?? '').trim();
}

export async function sendOrderStatusUpdateEmail(
  order: Record<string, unknown>,
  newStatus: string,
) {
  const userEmail = resolveCustomerOrderEmail(order);
  if (!userEmail) {
    throw new Error('Customer email not available for this order');
  }

  const orderId = String(order.orderId ?? '').trim();
  const billingInfo = (order.billingInfo ?? {}) as Record<string, unknown>;
  const firstName = String(billingInfo.firstName ?? '').trim();
  const lastName = String(billingInfo.lastName ?? '').trim();
  const customerName = `${firstName} ${lastName}`.trim() || 'Customer';
  const statusDisplay = formatOrderStatusForCustomerNotification(newStatus);
  const orderDateDisplay = formatOrderEmailDateTime(
    (order.createdAt as string | number | Date | null | undefined) ?? null,
  );
  const totalRaw = order.total;
  const total =
    typeof totalRaw === 'number'
      ? totalRaw
      : parseFloat(String(totalRaw ?? '0').replace(/[^0-9.-]/g, '')) || 0;
  const paymentMethod = String(order.paymentMethod ?? '—');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; border: 1px solid #e0e0e0;">
      <div style="background: linear-gradient(135deg, #629D23 0%, #4a7a1a 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 700;">AATHITHYA HERBAL</h1>
        <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Worldwide Herbal Store Since 2016</p>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #629D23; margin: 0 0 10px 0; font-size: 24px;">Order Status Updated</h2>
        <p style="color: #666; margin: 0 0 20px 0;">Dear ${customerName}, your order status has been updated.</p>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Order ID:</td>
              <td style="padding: 8px 0; color: #2C3C28; font-weight: 600; font-size: 14px;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Order Date:</td>
              <td style="padding: 8px 0; color: #2C3C28; font-size: 14px;">${orderDateDisplay}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Payment Method:</td>
              <td style="padding: 8px 0; color: #2C3C28; font-size: 14px;">${paymentMethod}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">New Status:</td>
              <td style="padding: 8px 0; color: #629D23; font-weight: 700; font-size: 16px;">${statusDisplay}</td>
            </tr>
          </table>
        </div>
        <div style="text-align: right; padding: 15px; background: #f0f7e6; border-radius: 8px; margin-bottom: 20px;">
          <span style="color: #666; font-size: 16px;">Order Total: </span>
          <span style="color: #629D23; font-size: 24px; font-weight: 700;">₹${total.toFixed(2)}</span>
        </div>
        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0;">
          If you have any questions about your order, please contact our customer support team at
          <strong>support@aathithyaherbal.com</strong> or call <strong>+91 95855 15051</strong>.
        </p>
      </div>
      <div style="background: #2C3C28; padding: 24px; color: white; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #888;">Thank you for shopping with Aathithya Herbal.</p>
      </div>
    </div>
  `;

  const transport = getTransporter();
  await transport.verify();
  const result = await transport.sendMail({
    from: `"Aathithya Herbal" <${process.env.EMAIL_USER || 'your-email@gmail.com'}>`,
    to: userEmail,
    subject: `Order Status Updated - ${statusDisplay} - Order #${orderId}`,
    html,
    text: `Dear ${customerName},\n\nYour order ${orderId} status has been updated to: ${statusDisplay}.\n\nOrder total: ₹${total.toFixed(2)}\n\nThank you for shopping with Aathithya Herbal.`,
  });
  console.log('Order status update email sent to customer:', result.messageId);
  return { success: true, messageId: result.messageId };
}

export async function sendCustomerOrderStatusWhatsApp(
  order: Record<string, unknown>,
  newStatus: string,
) {
  const messageData = buildCustomerWhatsAppMessageData(order);
  if (!messageData) {
    return { success: false, error: 'Order data is incomplete for WhatsApp notification' };
  }
  const customerPhone = messageData.phoneNumber?.trim();
  if (!customerPhone) {
    return { success: false, error: 'Customer phone number not available' };
  }

  const statusDisplay = formatOrderStatusForCustomerNotification(newStatus);
  return sendWhatsAppNotificationToRecipient(
    messageData,
    customerPhone,
    statusDisplay,
    newStatus,
  );
}

/** Notify the order customer by email and WhatsApp when staff updates order status. */
export async function sendOrderStatusUpdateToCustomer(
  order: Record<string, unknown>,
  newStatus: string,
) {
  const results: { email?: { success: boolean }; whatsapp?: { success: boolean; error?: string } } =
    {};

  try {
    await sendOrderStatusUpdateEmail(order, newStatus);
    results.email = { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Email failed';
    console.error('Order status update email failed:', msg);
    results.email = { success: false };
  }

  try {
    const whatsappResult = await sendCustomerOrderStatusWhatsApp(order, newStatus);
    results.whatsapp = {
      success: !!whatsappResult.success,
      error: whatsappResult.error,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'WhatsApp failed';
    console.error('Order status update WhatsApp failed:', msg);
    results.whatsapp = { success: false, error: msg };
  }

  const notified = results.email?.success || results.whatsapp?.success;
  return { success: notified, results };
}

export async function sendWhatsAppNotification(messageData: WhatsAppMessageData) {
  try {
    const sendTasks: Promise<{ success: boolean; error?: string; messageId?: string }>[] = [];

    const customerPhone = messageData.phoneNumber?.trim();
    if (customerPhone) {
      sendTasks.push(
        sendWhatsAppNotificationToRecipient(messageData, customerPhone).catch((error: any) => {
          console.error(`Error sending WhatsApp message to customer ${customerPhone}:`, error);
          return { success: false, error: error.message };
        }),
      );
    }

    STAFF_PHONE_NUMBERS.forEach((staffPhone) => {
      sendTasks.push(
        sendStaffWhatsAppNotificationToRecipient(messageData, staffPhone).catch((error: any) => {
          console.error(`Error sending WhatsApp staff message to ${staffPhone}:`, error);
          return { success: false, error: error.message };
        }),
      );
    });

    if (sendTasks.length === 0) {
      return { success: false, error: 'No WhatsApp recipients configured' };
    }

    const results = await Promise.all(sendTasks);

    const successCount = results.filter((result) => result.success).length;
    console.log(
      `WhatsApp order notifications sent to ${successCount}/${sendTasks.length} recipient(s)`,
    );

    return {
      success: successCount > 0,
      sentCount: successCount,
      totalRecipients: sendTasks.length,
      results,
    };
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error);
    return { success: false, error: error.message };
  }
}

export type WhatsAppTemplateHeaderImage = { id: string } | { link: string };

/** Upload image bytes to WhatsApp Cloud API; returns a media id for template header parameters. */
export async function uploadWhatsAppMediaImage(params: {
  buffer: ArrayBuffer;
  filename: string;
  mimeType: string;
}): Promise<{ id: string } | { error: string }> {
  const apiVersion = 'v18.0';
  const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    return { error: 'WhatsApp credentials not configured' };
  }

  const uploadUrl = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/media`;
  const formData = new FormData();
  formData.append('messaging_product', 'whatsapp');
  formData.append('type', 'image');
  formData.append('file', new Blob([params.buffer], { type: params.mimeType }), params.filename);

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    const msg = data.error?.message || data.error?.error_user_msg || 'WhatsApp media upload failed';
    return { error: msg };
  }
  const id = data.id as string | undefined;
  if (!id) {
    return { error: 'WhatsApp media upload returned no id' };
  }
  return { id };
}

export type WhatsAppTemplateUrlButtonParam = {
  /** 0-based index of the URL button in the template (first URL button = 0). */
  index: number;
  /** Value that replaces the URL variable (suffix or path segment Meta appended to the button URL). */
  text: string;
  /** Required for named-parameter templates (matches Meta template URL variable name). */
  parameterName?: string;
};

/** Send an approved template by name. Optional header image, body text vars, and dynamic URL button. */
export async function sendWhatsAppNamedTemplateMessage(options: {
  toDigits: string;
  templateName: string;
  languageCode?: string;
  headerImage?: WhatsAppTemplateHeaderImage;
  /** Positional body placeholders {{1}}, {{2}}, … in order. */
  bodyTextParams?: string[];
  /** When the template URL button ends with a variable, pass its value here. */
  urlButton?: WhatsAppTemplateUrlButtonParam;
}) {
  try {
    const { toDigits, templateName, languageCode = 'en', headerImage, bodyTextParams, urlButton } = options;
    const apiVersion = 'v18.0';
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
      console.warn('WhatsApp not configured: META_PHONE_NUMBER_ID or META_ACCESS_TOKEN missing');
      return { success: false, error: 'WhatsApp credentials not configured' };
    }

    const apiUrl = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

    const components: Record<string, unknown>[] = [];

    if (headerImage) {
      const imagePayload = 'id' in headerImage ? { id: headerImage.id } : { link: headerImage.link };
      components.push({
        type: 'header',
        parameters: [{ type: 'image', image: imagePayload }],
      });
    }

    if (bodyTextParams && bodyTextParams.length > 0) {
      components.push({
        type: 'body',
        parameters: bodyTextParams.map((text) => ({ type: 'text', text })),
      });
    }

    if (urlButton && urlButton.text !== '') {
      const param: Record<string, string> = { type: 'text', text: urlButton.text };
      if (urlButton.parameterName) {
        param.parameter_name = urlButton.parameterName;
      }
      components.push({
        type: 'button',
        sub_type: 'url',
        index: String(urlButton.index),
        parameters: [param],
      });
    }

    const template: Record<string, unknown> = {
      name: templateName.trim().toLowerCase(),
      language: { code: languageCode },
    };

    if (components.length > 0) {
      template.components = components;
    }

    const messageBody = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: toDigits.replace(/\D/g, ''),
      type: 'template',
      template,
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('WhatsApp named template API error:', data);
      const msg = data.error?.message || data.error?.error_user_msg || 'WhatsApp API request failed';
      return { success: false, error: msg };
    }

    return { success: true, messageId: data.messages?.[0]?.id as string | undefined };
  } catch (error: any) {
    console.error('Error sending WhatsApp named template message:', error);
    return { success: false, error: error.message };
  }
}

// ------------------------------------------------------------------------------------------------------------------------------

// GET ORDERS BY USER EMAIL
export async function getOrdersByUserEmail(userEmail: string) {
  try {
    const db = (await getMongoClientPromise()).db(); // Get database
    const collection = db.collection('orderDetails'); // Get collection

    // Find orders by user email, sorted by createdAt in descending order (newest first)
    const orders = await collection
      .find({ userEmail: userEmail })
      .sort({ createdAt: -1 })
      .toArray();

    return orders;
  } catch (error: any) {
    console.error('Error fetching orders by user email:', error);
    throw new Error('Error fetching orders: ' + error.message);
  }
}

/** All orders for staff dashboard (newest first). */
export async function getAllOrders(limit = 3000) {
  return getOrdersListing({ limit });
}

export async function getOrdersListing(options?: {
  search?: string;
  status?: string;
  date?: string;
  limit?: number;
}) {
  try {
    const db = (await getMongoClientPromise()).db();
    const collection = db.collection("orderDetails");
    const andClauses: Record<string, unknown>[] = [];

    const status = options?.status?.trim();
    if (status) {
      andClauses.push({ status: status.toLowerCase() });
    }

    const date = options?.date?.trim();
    if (date) {
      const start = new Date(`${date}T00:00:00+05:30`);
      const end = new Date(`${date}T23:59:59.999+05:30`);
      andClauses.push({ createdAt: { $gte: start, $lte: end } });
    }

    const search = options?.search?.trim();
    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      andClauses.push({
        $or: [
          { orderId: { $regex: regex } },
          { userEmail: { $regex: regex } },
          { "billingInfo.email": { $regex: regex } },
          { "billingInfo.firstName": { $regex: regex } },
          { "billingInfo.lastName": { $regex: regex } },
          { status: { $regex: regex } },
          { paymentMethod: { $regex: regex } },
          { "items.title": { $regex: regex } },
        ],
      });
    }

    const filter: Record<string, unknown> = {};
    if (andClauses.length === 1) {
      Object.assign(filter, andClauses[0]);
    } else if (andClauses.length > 1) {
      filter.$and = andClauses;
    }

    const limit = Math.min(Math.max(options?.limit ?? 3000, 1), 5000);
    return collection.find(filter).sort({ createdAt: -1 }).limit(limit).toArray();
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    throw new Error("Error fetching orders: " + error.message);
  }
}

/** Distinct order statuses for staff filters. */
export async function getOrderDistinctStatuses() {
  try {
    const db = (await getMongoClientPromise()).db();
    const collection = db.collection("orderDetails");
    const statuses = await collection.distinct("status");
    return statuses
      .map((value) => String(value ?? "").trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  } catch (error: any) {
    console.error("Error fetching order statuses:", error);
    throw new Error("Error fetching order statuses: " + error.message);
  }
}

/** Distinct order dates (IST, YYYY-MM-DD) for staff filters. */
export async function getOrderDistinctDates() {
  try {
    const db = (await getMongoClientPromise()).db();
    const collection = db.collection("orderDetails");
    const results = await collection
      .aggregate([
        { $match: { createdAt: { $exists: true, $ne: null } } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: "Asia/Kolkata",
              },
            },
          },
        },
        { $sort: { _id: -1 } },
      ])
      .toArray();
    return results.map((row) => String(row._id ?? "")).filter(Boolean);
  } catch (error: any) {
    console.error("Error fetching order dates:", error);
    throw new Error("Error fetching order dates: " + error.message);
  }
}

/** Statuses excluded from sales metrics (cancelled / cancel in progress). */
const SALES_REPORT_EXCLUDED_STATUSES = ["cancel", "cancel in review", "cancel approved"];

const SALES_TOTAL_NUM_PROJECT = {
  totalNum: {
    $cond: [
      { $eq: [{ $type: "$total" }, "number"] },
      "$total",
      {
        $convert: {
          input: {
            $replaceAll: {
              input: { $toString: { $ifNull: ["$total", "0"] } },
              find: ",",
              replacement: "",
            },
          },
          to: "double",
          onError: 0,
          onNull: 0,
        },
      },
    ],
  },
};

function buildLastTwelveMonthKeys(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now);
  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const keys: string[] = [];
  for (let i = 11; i >= 0; i -= 1) {
    const d = new Date(Date.UTC(year, month - 1 - i, 1));
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    keys.push(`${y}-${m}`);
  }
  return keys;
}

function formatMonthLabel(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  if (!y || !m) return ym;
  return new Date(y, m - 1, 1).toLocaleString("en-IN", {
    month: "short",
    year: "2-digit",
  });
}

/** Aggregated sales metrics for admin Sales Report (excludes cancelled orders). */
export async function getSalesReportMetrics() {
  try {
    const db = (await getMongoClientPromise()).db();
    const collection = db.collection("orderDetails");
    const monthKeys = buildLastTwelveMonthKeys();
    const rangeStart = `${monthKeys[0]}-01`;

    const nonCancelledMatch = {
      $expr: {
        $not: {
          $in: [
            { $toLower: { $ifNull: ["$status", ""] } },
            SALES_REPORT_EXCLUDED_STATUSES,
          ],
        },
      },
    };

    const [summaryRows, monthlyRows] = await Promise.all([
      collection
        .aggregate([
          { $match: nonCancelledMatch },
          { $project: SALES_TOTAL_NUM_PROJECT },
          {
            $group: {
              _id: null,
              totalSales: { $sum: "$totalNum" },
              orderCount: { $sum: 1 },
            },
          },
        ])
        .toArray(),
      collection
        .aggregate([
          {
            $match: {
              createdAt: { $gte: new Date(`${rangeStart}T00:00:00+05:30`) },
              ...nonCancelledMatch,
            },
          },
          {
            $project: {
              ...SALES_TOTAL_NUM_PROJECT,
              monthKey: {
                $dateToString: {
                  format: "%Y-%m",
                  date: "$createdAt",
                  timezone: "Asia/Kolkata",
                },
              },
            },
          },
          {
            $group: {
              _id: "$monthKey",
              orderCount: { $sum: 1 },
              orderValue: { $sum: "$totalNum" },
            },
          },
        ])
        .toArray(),
    ]);

    const summary = summaryRows[0] as { totalSales?: number; orderCount?: number } | undefined;
    const totalSales = typeof summary?.totalSales === "number" ? summary.totalSales : 0;
    const orderCount = typeof summary?.orderCount === "number" ? summary.orderCount : 0;
    const averageOrderValue = orderCount > 0 ? totalSales / orderCount : 0;

    const byMonth = new Map<string, { orderCount: number; orderValue: number }>();
    for (const row of monthlyRows) {
      const key = String((row as { _id?: unknown })._id ?? "");
      if (!key) continue;
      byMonth.set(key, {
        orderCount: Number((row as { orderCount?: number }).orderCount) || 0,
        orderValue: Number((row as { orderValue?: number }).orderValue) || 0,
      });
    }

    return {
      totalSales,
      orderCount,
      averageOrderValue,
      chart: {
        labels: monthKeys.map(formatMonthLabel),
        orderCounts: monthKeys.map((key) => byMonth.get(key)?.orderCount ?? 0),
        orderValues: monthKeys.map((key) => byMonth.get(key)?.orderValue ?? 0),
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching sales report metrics:", message);
    throw new Error("Error fetching sales report metrics: " + message);
  }
}

const PRODUCT_REPORT_TOP_N = 8;

function mongoNumericFromField(fieldPath: string) {
  return {
    $cond: [
      { $eq: [{ $type: fieldPath }, "number"] },
      fieldPath,
      {
        $convert: {
          input: {
            $replaceAll: {
              input: { $toString: { $ifNull: [fieldPath, "0"] } },
              find: ",",
              replacement: "",
            },
          },
          to: "double",
          onError: 0,
          onNull: 0,
        },
      },
    ],
  };
}

/** Product report metrics from order line items (excludes cancelled orders). */
export async function getProductReportMetrics() {
  try {
    const db = (await getMongoClientPromise()).db();
    const collection = db.collection("orderDetails");

    const nonCancelledMatch = {
      $expr: {
        $not: {
          $in: [
            { $toLower: { $ifNull: ["$status", ""] } },
            SALES_REPORT_EXCLUDED_STATUSES,
          ],
        },
      },
    };

    const productRows = await collection
      .aggregate([
        { $match: nonCancelledMatch },
        { $unwind: "$items" },
        {
          $project: {
            title: {
              $let: {
                vars: {
                  raw: { $trim: { input: { $toString: { $ifNull: ["$items.title", ""] } } } },
                },
                in: {
                  $cond: [{ $eq: ["$$raw", ""] }, "Item", "$$raw"],
                },
              },
            },
            qty: {
              $let: {
                vars: { n: mongoNumericFromField("$items.quantity") },
                in: {
                  $cond: [{ $gt: ["$$n", 0] }, "$$n", 1],
                },
              },
            },
            price: mongoNumericFromField("$items.price"),
          },
        },
        {
          $project: {
            title: 1,
            qty: 1,
            lineRevenue: { $multiply: ["$qty", "$price"] },
          },
        },
        {
          $group: {
            _id: "$title",
            unitsSold: { $sum: "$qty" },
            revenue: { $sum: "$lineRevenue" },
          },
        },
        { $sort: { unitsSold: -1, revenue: -1 } },
      ])
      .toArray();

    type ProductAgg = { _id?: unknown; unitsSold?: number; revenue?: number };
    const products = (productRows as ProductAgg[]).map((row) => ({
      title: String(row._id ?? "Item").trim() || "Item",
      unitsSold: Number(row.unitsSold) || 0,
      revenue: Number(row.revenue) || 0,
    }));

    const unitsSold = products.reduce((sum, p) => sum + p.unitsSold, 0);
    const productRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
    const top = products[0];
    const topByUnits = products.slice(0, PRODUCT_REPORT_TOP_N);
    const topByRevenue = [...products]
      .sort((a, b) => b.revenue - a.revenue || b.unitsSold - a.unitsSold)
      .slice(0, PRODUCT_REPORT_TOP_N);

    return {
      bestSellingProduct: top?.title ?? "—",
      bestSellingUnits: top?.unitsSold ?? 0,
      unitsSold,
      productRevenue,
      chart: {
        labels: topByUnits.map((p) => p.title),
        unitsSold: topByUnits.map((p) => p.unitsSold),
        revenueLabels: topByRevenue.map((p) => p.title),
        revenues: topByRevenue.map((p) => p.revenue),
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching product report metrics:", message);
    throw new Error("Error fetching product report metrics: " + message);
  }
}

const ORDER_REPORT_COMPLETED_STATUSES = ["delivered"];
const ORDER_REPORT_CANCELLED_STATUSES = [
  "cancel",
  "cancel in review",
  "cancel approved",
  "cancelled",
  "canceled",
];
const ORDER_REPORT_RETURN_REFUND_STATUSES = [
  "return in review",
  "return approved",
  "refund processing",
  "refunded",
  "returned",
];

function classifyOrderReportBucket(statusRaw: string): "completed" | "cancelled" | "returnedRefunded" | null {
  const s = statusRaw.trim().toLowerCase();
  if (ORDER_REPORT_COMPLETED_STATUSES.includes(s)) return "completed";
  if (ORDER_REPORT_CANCELLED_STATUSES.includes(s)) return "cancelled";
  if (ORDER_REPORT_RETURN_REFUND_STATUSES.includes(s)) return "returnedRefunded";
  return null;
}

/** Order report metrics by status outcome (completed / cancelled / returned-refunded). */
export async function getOrderReportMetrics() {
  try {
    const db = (await getMongoClientPromise()).db();
    const collection = db.collection("orderDetails");
    const monthKeys = buildLastTwelveMonthKeys();
    const rangeStart = `${monthKeys[0]}-01`;

    const trackedStatuses = [
      ...ORDER_REPORT_COMPLETED_STATUSES,
      ...ORDER_REPORT_CANCELLED_STATUSES,
      ...ORDER_REPORT_RETURN_REFUND_STATUSES,
    ];

    const [summaryRows, monthlyRows] = await Promise.all([
      collection
        .aggregate([
          {
            $project: {
              statusKey: { $toLower: { $ifNull: ["$status", ""] } },
            },
          },
          {
            $match: {
              statusKey: { $in: trackedStatuses },
            },
          },
          {
            $group: {
              _id: "$statusKey",
              count: { $sum: 1 },
            },
          },
        ])
        .toArray(),
      collection
        .aggregate([
          {
            $match: {
              createdAt: { $gte: new Date(`${rangeStart}T00:00:00+05:30`) },
            },
          },
          {
            $project: {
              statusKey: { $toLower: { $ifNull: ["$status", ""] } },
              monthKey: {
                $dateToString: {
                  format: "%Y-%m",
                  date: "$createdAt",
                  timezone: "Asia/Kolkata",
                },
              },
            },
          },
          {
            $match: {
              statusKey: { $in: trackedStatuses },
            },
          },
          {
            $group: {
              _id: { monthKey: "$monthKey", statusKey: "$statusKey" },
              count: { $sum: 1 },
            },
          },
        ])
        .toArray(),
    ]);

    let completedOrders = 0;
    let cancelledOrders = 0;
    let returnedRefundedOrders = 0;

    for (const row of summaryRows) {
      const statusKey = String((row as { _id?: unknown })._id ?? "");
      const count = Number((row as { count?: number }).count) || 0;
      const bucket = classifyOrderReportBucket(statusKey);
      if (bucket === "completed") completedOrders += count;
      else if (bucket === "cancelled") cancelledOrders += count;
      else if (bucket === "returnedRefunded") returnedRefundedOrders += count;
    }

    const monthlyBuckets = new Map<
      string,
      { completed: number; cancelled: number; returnedRefunded: number }
    >();
    for (const key of monthKeys) {
      monthlyBuckets.set(key, { completed: 0, cancelled: 0, returnedRefunded: 0 });
    }

    for (const row of monthlyRows) {
      const id = (row as { _id?: { monthKey?: string; statusKey?: string } })._id;
      const monthKey = String(id?.monthKey ?? "");
      const statusKey = String(id?.statusKey ?? "");
      const count = Number((row as { count?: number }).count) || 0;
      const bucket = classifyOrderReportBucket(statusKey);
      const current = monthlyBuckets.get(monthKey);
      if (!current || !bucket) continue;
      current[bucket] += count;
    }

    return {
      completedOrders,
      cancelledOrders,
      returnedRefundedOrders,
      chart: {
        labels: monthKeys.map(formatMonthLabel),
        completed: monthKeys.map((key) => monthlyBuckets.get(key)?.completed ?? 0),
        cancelled: monthKeys.map((key) => monthlyBuckets.get(key)?.cancelled ?? 0),
        returnedRefunded: monthKeys.map(
          (key) => monthlyBuckets.get(key)?.returnedRefunded ?? 0
        ),
        summaryLabels: ["Completed", "Cancelled", "Returned/refunded"],
        summaryCounts: [completedOrders, cancelledOrders, returnedRefundedOrders],
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching order report metrics:", message);
    throw new Error("Error fetching order report metrics: " + message);
  }
}

/** Staff UI order lifecycle — must match staff orders DemoContent options. */
export const STAFF_ORDER_STATUS_WHITELIST = new Set([
  "pending",
  "order accepted",
  "dispatched",
  "delivered",
  "cancel in review",
  "cancel approved",
  "cancel rejected",
  "return in review",
  "return approved",
  "return rejected",
  "refund processing",
  "refunded",
]);

export async function getOrderByMongoId(mongoId: string) {
  const id = String(mongoId ?? "").trim();
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid order id");
  }
  try {
    const db = (await getMongoClientPromise()).db();
    const collection = db.collection("orderDetails");
    return collection.findOne({ _id: new ObjectId(id) });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Fetch failed";
    throw new Error("Error fetching order: " + msg);
  }
}

export async function updateOrderStatusByMongoId(mongoId: string, status: string) {
  const id = String(mongoId ?? "").trim();
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid order id");
  }
  const s = String(status ?? "").trim().toLowerCase();
  if (!STAFF_ORDER_STATUS_WHITELIST.has(s)) {
    throw new Error("Invalid order status");
  }
  try {
    const db = (await getMongoClientPromise()).db();
    const collection = db.collection("orderDetails");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: s, updatedAt: new Date() } },
    );
    if (result.matchedCount === 0) {
      throw new Error("Order not found");
    }
    return result;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Update failed";
    if (msg === "Order not found" || msg === "Invalid order id" || msg === "Invalid order status") {
      throw error;
    }
    throw new Error("Error updating order: " + msg);
  }
}

const SEO_SETTINGS_COLLECTION = "seo_settings";

export async function getSeoSettings(): Promise<Record<string, string>> {
  try {
    const db = (await getMongoClientPromise()).db();
    const docs = await db.collection(SEO_SETTINGS_COLLECTION).find({}).toArray();
    const out: Record<string, string> = {};
    for (const doc of docs) {
      const key = typeof doc.key === "string" ? doc.key : "";
      const content = typeof doc.content === "string" ? doc.content : "";
      if (key) out[key] = content;
    }
    return out;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Fetch failed";
    throw new Error("Error fetching SEO settings: " + msg);
  }
}

export async function upsertSeoSetting(key: string, content: string) {
  const k = String(key ?? "").trim();
  if (!k) {
    throw new Error("SEO section key is required");
  }
  try {
    const db = (await getMongoClientPromise()).db();
    return db.collection(SEO_SETTINGS_COLLECTION).updateOne(
      { key: k },
      { $set: { key: k, content, updatedAt: new Date() } },
      { upsert: true },
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Save failed";
    throw new Error("Error saving SEO setting: " + msg);
  }
}

const SEO_PAGES_COLLECTION = "seo_pages";

export async function getSeoPagesMap(): Promise<Record<string, string>> {
  try {
    const db = (await getMongoClientPromise()).db();
    const docs = await db.collection(SEO_PAGES_COLLECTION).find({}).toArray();
    const out: Record<string, string> = {};
    for (const doc of docs) {
      const path = typeof doc.path === "string" ? doc.path.trim() : "";
      const content = typeof doc.content === "string" ? doc.content : "";
      if (path && content.trim()) {
        out[path] = content;
      }
    }
    return out;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Fetch failed";
    throw new Error("Error fetching SEO pages: " + msg);
  }
}

export async function getAllSeoPageRecords(): Promise<
  Array<{ path: string; content: string; updatedAt?: Date }>
> {
  try {
    const db = (await getMongoClientPromise()).db();
    const docs = await db.collection(SEO_PAGES_COLLECTION).find({}).toArray();
    return docs
      .map((doc) => ({
        path: typeof doc.path === "string" ? doc.path.trim() : "",
        content: typeof doc.content === "string" ? doc.content : "",
        updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt : undefined,
      }))
      .filter((row) => row.path.length > 0);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Fetch failed";
    throw new Error("Error fetching SEO page records: " + msg);
  }
}

export async function upsertSeoPage(path: string, content: string) {
  const p = String(path ?? "").trim();
  if (!p) {
    throw new Error("SEO page path is required");
  }
  try {
    const db = (await getMongoClientPromise()).db();
    return db.collection(SEO_PAGES_COLLECTION).updateOne(
      { path: p },
      { $set: { path: p, content, updatedAt: new Date() } },
      { upsert: true },
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Save failed";
    throw new Error("Error saving SEO page: " + msg);
  }
}

export async function deleteSeoPage(path: string) {
  const p = String(path ?? "").trim();
  if (!p) {
    throw new Error("SEO page path is required");
  }
  try {
    const db = (await getMongoClientPromise()).db();
    return db.collection(SEO_PAGES_COLLECTION).deleteOne({ path: p });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Delete failed";
    throw new Error("Error deleting SEO page: " + msg);
  }
}

const COUPONS_COLLECTION = "coupons";

export type CouponStatus = "active" | "inactive";

export interface CouponRecord {
  couponName: string;
  couponCode: string;
  discountPrice: number;
  discountPercentage: number;
  fromDate: Date;
  toDate: Date;
  numberOfDays: number;
  status: CouponStatus;
  createdAt: Date;
  updatedAt: Date;
}

function serializeCouponDoc(doc: Record<string, unknown>) {
  return {
    id: String(doc._id ?? ""),
    couponName: String(doc.couponName ?? doc.title ?? ""),
    couponCode: String(doc.couponCode ?? ""),
    discountPrice: Number(doc.discountPrice ?? 0),
    discountPercentage: Number(doc.discountPercentage ?? 0),
    fromDate: doc.fromDate ?? doc.startTime ?? null,
    toDate: doc.toDate ?? doc.endTime ?? null,
    numberOfDays: Number(doc.numberOfDays ?? 0),
    status: doc.status === "inactive" ? "inactive" : "active",
    createdAt: doc.createdAt ?? null,
    updatedAt: doc.updatedAt ?? null,
  };
}

export async function getAllCoupons() {
  try {
    const db = (await getMongoClientPromise()).db();
    const docs = await db
      .collection(COUPONS_COLLECTION)
      .find({})
      .sort({ createdAt: -1, _id: -1 })
      .toArray();
    return docs.map((doc) => serializeCouponDoc(doc as Record<string, unknown>));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Fetch failed";
    throw new Error("Error fetching coupons: " + msg);
  }
}

export async function getCouponByCode(code: string) {
  const normalized = String(code ?? "").trim().replace(/\s+/g, "").toUpperCase();
  if (!normalized) return null;
  try {
    const db = (await getMongoClientPromise()).db();
    const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const doc = await db.collection(COUPONS_COLLECTION).findOne({
      couponCode: { $regex: `^${escaped}$`, $options: "i" },
    });
    if (!doc) return null;
    return serializeCouponDoc(doc as Record<string, unknown>);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Fetch failed";
    throw new Error("Error fetching coupon by code: " + msg);
  }
}

export async function createCoupon(fields: {
  couponName: string;
  discountPrice: number;
  discountPercentage: number;
  fromDate: Date;
  toDate: Date;
  numberOfDays: number;
  status?: CouponStatus;
}) {
  const couponName = String(fields.couponName ?? "").trim();
  if (!couponName) {
    throw new Error("Coupon name is required");
  }
  try {
    const db = (await getMongoClientPromise()).db();
    const now = new Date();
    const couponCode = couponName.replace(/\s+/g, "").toUpperCase();
    const doc = {
      couponName,
      title: couponName,
      couponCode,
      discountPrice: fields.discountPrice,
      discountPercentage: fields.discountPercentage,
      fromDate: fields.fromDate,
      toDate: fields.toDate,
      startTime: fields.fromDate,
      endTime: fields.toDate,
      numberOfDays: fields.numberOfDays,
      status: fields.status === "inactive" ? "inactive" : "active",
      minimumAmount: 0,
      productType: "all",
      logo: "",
      createdAt: now,
      updatedAt: now,
    };
    const result = await db.collection(COUPONS_COLLECTION).insertOne(doc);
    return {
      insertedId: result.insertedId,
      id: result.insertedId.toString(),
      coupon: serializeCouponDoc({ ...doc, _id: result.insertedId }),
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Create failed";
    throw new Error("Error creating coupon: " + msg);
  }
}

export async function updateCouponFields(
  couponId: string,
  fields: Record<string, unknown>
) {
  if (!ObjectId.isValid(couponId)) {
    throw new Error("Invalid coupon id");
  }
  try {
    const db = (await getMongoClientPromise()).db();
    const result = await db.collection(COUPONS_COLLECTION).updateOne(
      { _id: new ObjectId(couponId) },
      { $set: { ...fields, updatedAt: new Date() } }
    );
    return result;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Update failed";
    throw new Error("Error updating coupon: " + msg);
  }
}

export async function deleteCouponById(couponId: string) {
  if (!ObjectId.isValid(couponId)) {
    throw new Error("Invalid coupon id");
  }
  try {
    const db = (await getMongoClientPromise()).db();
    return db.collection(COUPONS_COLLECTION).deleteOne({ _id: new ObjectId(couponId) });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Delete failed";
    throw new Error("Error deleting coupon: " + msg);
  }
}