import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { getCities } from '@/lib/priceListCities';
import { prisma } from '@/lib/prisma';
import { getAllPriceLists, getPdfTemplate, isBuiltInSlug, toSummary } from '@/lib/priceLists';
import {
  checkCityDetails,
  cleanPdfTemplate,
  cleanPriceList,
  readSchedule,
  SHARED_FIELDS,
  type PriceListProject,
  type SharedField,
} from '@/lib/priceListTypes';
import { cleanText } from '@/lib/validation';
import { revalidatePriceLists } from '@/lib/revalidate';
import { jsonError, logError } from '@/lib/security/request';

/**
 * Every list as a table row (with inactive and deleted ones), the shared PDF design and
 * the cities. A list's full content comes from GET /api/admin/price-lists/[slug].
 */
export async function GET(request: Request) {
  const { admin, response } = await requirePermission(request, 'pricelists:manage');
  if (!admin) return response;
  try {
    const [lists, template, cities] = await Promise.all([getAllPriceLists(), getPdfTemplate(), getCities()]);
    return NextResponse.json({ success: true, lists: lists.map(toSummary), template, cities });
  } catch (error) {
    logError('admin.priceLists.list', error);
    return jsonError('Failed to load the price lists.', 500);
  }
}

/** Adds a new list. Its slug must not be used by any list, including deleted ones. */
export async function POST(request: Request) {
  const { admin, response } = await requirePermission(request, 'pricelists:manage');
  if (!admin) return response;
  try {
    const body = await request.json().catch(() => null);
    const { project, errors } = cleanPriceList(body?.project);
    if (!project) return jsonError(errors.join(' '), 400);
    const schedule = readSchedule(body);
    if (schedule.error) return jsonError(schedule.error, 400);
    const city = project.citySlug ? (await getCities()).find((c) => c.slug === project.citySlug) : undefined;
    if (project.citySlug && !city) return jsonError('That city no longer exists. Choose another.', 400);
    const cityProblems = checkCityDetails(project, city);
    if (cityProblems.length) return jsonError(cityProblems.join(' '), 400);

    if (isBuiltInSlug(project.slug) || (await prisma.priceList.findUnique({ where: { slug: project.slug } }))) {
      return jsonError('Another price list already uses this URL slug.', 409);
    }

    const template = await getPdfTemplate();
    const last = await prisma.priceList.aggregate({ _max: { sortOrder: true } });
    const all = await getAllPriceLists();
    const sortOrder = Math.max(last._max.sortOrder ?? 0, all.length) + 1;

    const row = await prisma.priceList.create({
      data: {
        slug: project.slug,
        data: JSON.stringify(project),
        pdfDesign: body?.pdfDesign ? JSON.stringify(cleanPdfTemplate(body.pdfDesign, template)) : null,
        isPublished: body?.isPublished !== false,
        activeFrom: schedule.activeFrom,
        activeUntil: schedule.activeUntil,
        sortOrder,
        updatedBy: admin.email,
      },
    });

    revalidatePriceLists();
    await audit(admin, 'price_list.created', 'price_list', row.id, { slug: project.slug });
    return NextResponse.json({ success: true, slug: project.slug }, { status: 201 });
  } catch (error) {
    logError('admin.priceLists.create', error);
    return jsonError('Failed to create the price list.', 500);
  }
}

const BULK_ACTIONS = {
  activate: { isPublished: true },
  deactivate: { isPublished: false },
  delete: { isDeleted: true },
  restore: { isDeleted: false },
} as const;
type BulkAction = keyof typeof BULK_ACTIONS;

/** { slugs: [...], action: 'activate' | 'deactivate' | 'delete' | 'restore' } */
async function bulkUpdate(admin: { email: string }, body: { slugs?: unknown; action?: unknown }) {
  const action = body.action as BulkAction;
  if (!Object.hasOwn(BULK_ACTIONS, action)) return jsonError('Unknown action.', 400);
  const entries = await getAllPriceLists();
  const wanted = new Set((Array.isArray(body.slugs) ? body.slugs : []).filter((slug): slug is string => typeof slug === 'string'));
  const targets = entries.filter((entry) => wanted.has(entry.project.slug));
  if (!targets.length) return jsonError('Select at least one price list.', 400);

  // One by one: the D1 adapter gives no atomic batch. Each write is idempotent, so a
  // partial failure can simply be repeated.
  const change = BULK_ACTIONS[action];
  for (const entry of targets) {
    await prisma.priceList.upsert({
      where: { slug: entry.project.slug },
      update: { ...change, updatedBy: admin.email },
      create: { slug: entry.project.slug, data: null, sortOrder: entry.sortOrder, ...change, updatedBy: admin.email },
    });
  }
  return targets;
}

/**
 * { slugs, action: 'edit', fields } changes the same fields on several lists:
 *   effectiveDate (text), bookingStatus (text; '' removes the stamp),
 *   activeFrom / activeUntil (YYYY-MM-DD, or null to clear),
 *   useCity: { officeAddress: true | false, ... } (take the field from the city, or not).
 * Only the keys present change. Every list is checked first and nothing is saved
 * unless all of them pass.
 */
async function bulkEdit(admin: { email: string }, body: { slugs?: unknown; fields?: unknown }) {
  const fields = (body.fields && typeof body.fields === 'object' ? body.fields : {}) as Record<string, unknown>;
  const has = (key: string) => Object.hasOwn(fields, key);
  const useCity = (fields.useCity && typeof fields.useCity === 'object' ? fields.useCity : {}) as Record<string, unknown>;
  const cityChanges = SHARED_FIELDS.filter((field) => typeof useCity[field] === 'boolean');
  const changesData = has('effectiveDate') || has('bookingStatus') || cityChanges.length > 0;
  if (!changesData && !has('activeFrom') && !has('activeUntil')) return jsonError('Choose at least one thing to change.', 400);

  const effectiveDate = has('effectiveDate') ? cleanText(fields.effectiveDate, 200) : '';
  if (has('effectiveDate') && !effectiveDate) return jsonError('Type the new effective date, or untick it.', 400);
  const bookingStatus = has('bookingStatus') ? cleanText(fields.bookingStatus, 200) : '';

  const [entries, cities] = await Promise.all([getAllPriceLists(), getCities()]);
  const wanted = new Set((Array.isArray(body.slugs) ? body.slugs : []).filter((slug): slug is string => typeof slug === 'string'));
  const targets = entries.filter((entry) => wanted.has(entry.project.slug) && !entry.isDeleted);
  if (!targets.length) return jsonError('Select at least one price list.', 400);

  const problems: string[] = [];
  const writes = targets.map((entry) => {
    const next: PriceListProject = { ...entry.project };
    if (has('effectiveDate')) next.effectiveDate = effectiveDate;
    if (has('bookingStatus')) next.bookingStatus = bookingStatus || undefined;
    if (cityChanges.length) {
      const set = new Set<SharedField>(next.useCityDetails || []);
      cityChanges.forEach((field) => (useCity[field] ? set.add(field) : set.delete(field)));
      next.useCityDetails = set.size ? SHARED_FIELDS.filter((field) => set.has(field)) : undefined;
    }
    const { project, errors } = cleanPriceList(next);
    const city = cities.find((c) => c.slug === entry.citySlug);
    const schedule = readSchedule({
      activeFrom: has('activeFrom') ? fields.activeFrom : entry.activeFrom,
      activeUntil: has('activeUntil') ? fields.activeUntil : entry.activeUntil,
    });
    const listProblems = [...errors, ...(project ? checkCityDetails(project, city) : []), ...(schedule.error ? [schedule.error] : [])];
    if (listProblems.length) problems.push(`${entry.project.projectName}: ${listProblems.join(' ')}`);
    return { entry, project, schedule };
  });
  if (problems.length) {
    return jsonError(`Nothing was changed. ${problems.slice(0, 3).join(' | ')}${problems.length > 3 ? ` (and ${problems.length - 3} more)` : ''}`, 400);
  }

  // One by one: the D1 adapter gives no atomic batch. Every list passed the checks above.
  for (const { entry, project, schedule } of writes) {
    const change = {
      ...(changesData ? { data: JSON.stringify(project) } : {}),
      ...(has('activeFrom') ? { activeFrom: schedule.activeFrom } : {}),
      ...(has('activeUntil') ? { activeUntil: schedule.activeUntil } : {}),
      updatedBy: admin.email,
    };
    await prisma.priceList.upsert({
      where: { slug: entry.project.slug },
      update: change,
      create: { slug: entry.project.slug, sortOrder: entry.sortOrder, isPublished: entry.isPublished, ...change },
    });
  }
  return targets;
}

/**
 * Saves the display order, { order: [slug, ...] }, or changes several lists at once,
 * { slugs: [...], action: 'activate' | 'deactivate' | 'delete' | 'restore' | 'edit' }.
 */
export async function PATCH(request: Request) {
  const { admin, response } = await requirePermission(request, 'pricelists:manage');
  if (!admin) return response;
  try {
    const body = await request.json().catch(() => null);
    if (body && 'action' in body) {
      const result = body.action === 'edit' ? await bulkEdit(admin, body) : await bulkUpdate(admin, body);
      if (result instanceof Response) return result;
      revalidatePriceLists();
      await audit(admin, `price_list.bulk_${body.action}`, 'price_list', undefined, {
        slugs: result.map((entry) => entry.project.slug),
        ...(body.action === 'edit' ? { fields: Object.keys(body.fields || {}) } : {}),
      });
      return NextResponse.json({ success: true, count: result.length });
    }
    const order: unknown[] = Array.isArray(body?.order) ? body.order.slice(0, 500) : [];
    const current = (await getAllPriceLists()).map((entry) => entry.project.slug);
    const given = [...new Set(order.filter((slug): slug is string => typeof slug === 'string' && current.includes(slug)))];
    if (!given.length) return jsonError('No price lists to reorder.', 400);
    // Lists left out (deleted ones, for example) follow in their current order, so no two share a position.
    const slugs = [...given, ...current.filter((slug) => !given.includes(slug))];

    // A built-in list without a row gets one that stores only its position (data null).
    // Written one by one: the D1 adapter gives no atomic batch, and a partial save
    // only leaves an order the admin can save again.
    for (const [index, slug] of slugs.entries()) {
      await prisma.priceList.upsert({
        where: { slug },
        update: { sortOrder: index, updatedBy: admin.email },
        create: { slug, data: null, sortOrder: index, updatedBy: admin.email },
      });
    }

    revalidatePriceLists();
    await audit(admin, 'price_list.reordered', 'price_list', undefined, { count: slugs.length });
    return NextResponse.json({ success: true });
  } catch (error) {
    logError('admin.priceLists.reorder', error);
    return jsonError('Failed to save the order.', 500);
  }
}
