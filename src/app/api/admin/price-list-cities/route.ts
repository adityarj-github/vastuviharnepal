import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { prisma } from '@/lib/prisma';
import { getCities, groupedOrder, saveCityOrder } from '@/lib/priceListCities';
import { getAllPriceLists } from '@/lib/priceLists';
import { cleanCityInput, slugify } from '@/lib/priceListTypes';
import { cleanText } from '@/lib/validation';
import { revalidatePriceLists } from '@/lib/revalidate';
import { jsonError, logError } from '@/lib/security/request';

/** Every city with how many price lists point at it. */
export async function GET(request: Request) {
  const { admin, response } = await requirePermission(request, 'pricelists:manage');
  if (!admin) return response;
  try {
    const [cities, lists] = await Promise.all([getCities(), getAllPriceLists()]);
    const counts = cities.map((city) => {
      const mine = lists.filter((entry) => entry.citySlug === city.slug);
      return {
        ...city,
        listCount: mine.filter((entry) => !entry.isDeleted).length,
        activeCount: mine.filter((entry) => entry.status === 'active').length,
        deletedCount: mine.filter((entry) => entry.isDeleted).length,
        sharingCount: mine.filter((entry) => !entry.isDeleted && entry.project.useCityDetails?.length).length,
        lists: mine.filter((entry) => !entry.isDeleted).map((entry) => ({ slug: entry.project.slug, projectName: entry.project.projectName })),
      };
    });
    return NextResponse.json({ success: true, cities: counts });
  } catch (error) {
    logError('admin.priceListCities.list', error);
    return jsonError('Failed to load the cities.', 500);
  }
}

/** Adds a city at the end of its state ({ state, name }). */
export async function POST(request: Request) {
  const { admin, response } = await requirePermission(request, 'pricelists:manage');
  if (!admin) return response;
  try {
    const { state, name, error } = cleanCityInput(await request.json().catch(() => null));
    if (error) return jsonError(error, 400);

    const cities = await getCities();
    const existing = cities.find((c) => c.state.toLowerCase() === state.toLowerCase() && c.name.toLowerCase() === name.toLowerCase());
    if (existing) return jsonError(`${existing.name} is already listed under ${existing.state}.`, 409);
    // Reuse the spelling of an existing state, so "bihar" joins "Bihar".
    const stateName = cities.find((c) => c.state.toLowerCase() === state.toLowerCase())?.state ?? state;

    const base = slugify(name);
    let slug = base;
    for (let n = 2; cities.some((c) => c.slug === slug); n += 1) slug = `${base}-${n}`;

    await prisma.priceListCity.create({ data: { slug, state: stateName, name, sortOrder: 1_000_000, isActive: true, updatedBy: admin.email } });
    const order = groupedOrder([...cities, { slug, state: stateName, name, sortOrder: 1_000_000, isActive: true, details: {} }]);
    await saveCityOrder(order.map((c) => c.slug), admin.email);

    revalidatePriceLists();
    await audit(admin, 'price_list_city.created', 'price_list_city', slug, { state: stateName, name });
    return NextResponse.json({ success: true, slug }, { status: 201 });
  } catch (error) {
    logError('admin.priceListCities.create', error);
    return jsonError('Failed to add the city.', 500);
  }
}

/**
 * { order: [slug, ...] } saves the display order (cities stay grouped by state), or
 * { renameState: { from, to } } renames a state for all its cities.
 */
export async function PATCH(request: Request) {
  const { admin, response } = await requirePermission(request, 'pricelists:manage');
  if (!admin) return response;
  try {
    const body = await request.json().catch(() => null);
    const cities = await getCities();

    if (body?.renameState) {
      const from = cleanText(body.renameState.from, 80);
      const to = cleanText(body.renameState.to, 80);
      if (!to) return jsonError('Type the new state name.', 400);
      if (!cities.some((c) => c.state === from)) return jsonError('State not found.', 404);
      const clash = cities.find((c) => c.state !== from && c.state.toLowerCase() === to.toLowerCase());
      // Renaming onto an existing state merges the two; its cities join that state's block.
      const target = clash?.state ?? to;
      await prisma.priceListCity.updateMany({ where: { state: from }, data: { state: target, updatedBy: admin.email } });
      if (clash) {
        const moved = cities.map((c) => (c.state === from ? { ...c, state: target } : c));
        await saveCityOrder(groupedOrder(moved).map((c) => c.slug), admin.email);
      }
      revalidatePriceLists();
      await audit(admin, 'price_list_city.state_renamed', 'price_list_city', undefined, { from, to: target });
      return NextResponse.json({ success: true });
    }

    const given: unknown[] = Array.isArray(body?.order) ? body.order : [];
    const known = new Set(cities.map((c) => c.slug));
    const slugs = [...new Set(given.filter((s): s is string => typeof s === 'string' && known.has(s)))];
    if (!slugs.length) return jsonError('No cities to reorder.', 400);
    const rest = cities.filter((c) => !slugs.includes(c.slug)).map((c) => c.slug);
    const position = new Map([...slugs, ...rest].map((slug, index) => [slug, index]));
    const order = groupedOrder(cities.map((c) => ({ ...c, sortOrder: position.get(c.slug) ?? 0 })));
    await saveCityOrder(order.map((c) => c.slug), admin.email);

    revalidatePriceLists();
    await audit(admin, 'price_list_city.reordered', 'price_list_city', undefined, { count: order.length });
    return NextResponse.json({ success: true });
  } catch (error) {
    logError('admin.priceListCities.update', error);
    return jsonError('Failed to save the cities.', 500);
  }
}
