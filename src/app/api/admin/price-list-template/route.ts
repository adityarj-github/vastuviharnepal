import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { prisma } from '@/lib/prisma';
import { getPdfTemplate, TEMPLATE_ID } from '@/lib/priceLists';
import { cleanPdfTemplate, DEFAULT_PDF_TEMPLATE } from '@/lib/priceListTypes';
import { saveBlogImage } from '@/lib/privateStorage';
import { revalidatePriceLists } from '@/lib/revalidate';
import { jsonError, logError } from '@/lib/security/request';

/** The shared PDF design and the built-in defaults (for "reset"). */
export async function GET(request: Request) {
  const { admin, response } = await requirePermission(request, 'pricelists:manage');
  if (!admin) return response;
  try {
    return NextResponse.json({ success: true, template: await getPdfTemplate(), defaults: DEFAULT_PDF_TEMPLATE });
  } catch (error) {
    logError('admin.priceListTemplate.get', error);
    return jsonError('Failed to load the PDF design.', 500);
  }
}

/** Saves the shared design: { template }. */
export async function PUT(request: Request) {
  const { admin, response } = await requirePermission(request, 'pricelists:manage');
  if (!admin) return response;
  try {
    const body = await request.json().catch(() => null);
    if (!body?.template || typeof body.template !== 'object') return jsonError('The PDF design is missing.', 400);
    const data = JSON.stringify(cleanPdfTemplate(body.template));

    await prisma.priceListTemplate.upsert({
      where: { id: TEMPLATE_ID },
      update: { data, updatedBy: admin.email },
      create: { id: TEMPLATE_ID, data, updatedBy: admin.email },
    });

    revalidatePriceLists();
    await audit(admin, 'price_list.design_updated', 'price_list_template', TEMPLATE_ID);
    return NextResponse.json({ success: true });
  } catch (error) {
    logError('admin.priceListTemplate.save', error);
    return jsonError('Failed to save the PDF design.', 500);
  }
}

/** Uploads a logo (form field "file") and returns its URL. Saving the design applies it. */
export async function POST(request: Request) {
  const { admin, response } = await requirePermission(request, 'pricelists:manage');
  if (!admin) return response;
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File) || file.size === 0) return jsonError('No image file provided.', 400);

    const saved = await saveBlogImage(file, 'price-list-logo');
    if (saved.error || !saved.url) return jsonError(saved.error || 'Failed to save the logo.', 400);

    await audit(admin, 'price_list.logo_uploaded', 'price_list_template', TEMPLATE_ID, { url: saved.url });
    return NextResponse.json({ success: true, url: saved.url }, { status: 201 });
  } catch (error) {
    logError('admin.priceListTemplate.logo', error);
    return jsonError('Failed to upload the logo.', 500);
  }
}
