import { NextResponse } from 'next/server';
import {
  sendOrderActionRequestEmail,
  OrderActionType,
  OrderActionSelectedProduct,
} from '../../../../functions/mongodbOperations';

const VALID_ACTIONS: OrderActionType[] = ['cancel', 'return', 'refund'];
const MAX_FILE_BYTES = 5 * 1024 * 1024;

function parseSelectedProducts(raw: FormDataEntryValue | null): OrderActionSelectedProduct[] | null {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const products: OrderActionSelectedProduct[] = [];
    for (const entry of parsed) {
      if (
        typeof entry === 'object' &&
        entry !== null &&
        typeof (entry as OrderActionSelectedProduct).title === 'string' &&
        typeof (entry as OrderActionSelectedProduct).quantity === 'number' &&
        typeof (entry as OrderActionSelectedProduct).price === 'number'
      ) {
        products.push({
          title: (entry as OrderActionSelectedProduct).title.trim(),
          quantity: (entry as OrderActionSelectedProduct).quantity,
          price: (entry as OrderActionSelectedProduct).price,
        });
      }
    }
    return products.length > 0 ? products : null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const userEmail = typeof form.get('userEmail') === 'string' ? String(form.get('userEmail')).trim() : '';
    const userName = typeof form.get('userName') === 'string' ? String(form.get('userName')).trim() : '';
    const orderNo = typeof form.get('orderNo') === 'string' ? String(form.get('orderNo')).trim() : '';
    const actionRaw = typeof form.get('action') === 'string' ? String(form.get('action')).trim().toLowerCase() : '';
    const reason = typeof form.get('reason') === 'string' ? String(form.get('reason')).trim() : '';
    const file = form.get('attachment');
    const selectedProducts = parseSelectedProducts(form.get('selectedProducts'));

    if (!userEmail) {
      return NextResponse.json({ success: false, message: 'User email is required' }, { status: 400 });
    }
    if (!orderNo) {
      return NextResponse.json({ success: false, message: 'Order number is required' }, { status: 400 });
    }
    if (!VALID_ACTIONS.includes(actionRaw as OrderActionType)) {
      return NextResponse.json({ success: false, message: 'Invalid action type' }, { status: 400 });
    }
    if (!reason) {
      return NextResponse.json({ success: false, message: 'Reason is required' }, { status: 400 });
    }
    const requiresAttachment = actionRaw === 'return';
    let attachment: { filename: string; content: Buffer; contentType: string } | undefined;

    if (requiresAttachment) {
      if (!(file instanceof File) || file.size === 0) {
        return NextResponse.json({ success: false, message: 'Supporting document is required' }, { status: 400 });
      }
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json({ success: false, message: 'File must be 5 MB or smaller' }, { status: 400 });
      }
      attachment = {
        filename: file.name || 'attachment',
        content: Buffer.from(await file.arrayBuffer()),
        contentType: file.type || 'application/octet-stream',
      };
    }

    await sendOrderActionRequestEmail({
      userEmail,
      userName: userName || undefined,
      orderNo,
      action: actionRaw as OrderActionType,
      reason,
      selectedProducts: selectedProducts ?? undefined,
      attachment,
    });

    return NextResponse.json({
      success: true,
      message: 'Your request has been submitted. Our team will follow up shortly.',
    });
  } catch (error: any) {
    console.error('Order action request error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit request' },
      { status: 500 },
    );
  }
}
