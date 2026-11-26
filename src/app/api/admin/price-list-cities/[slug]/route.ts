import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/adminAuth';
import { audit } from '@/lib/audit';
import { prisma } from '@/lib/prisma';
import { getCities, groupedOrder, saveCityOrder } from '@/lib/priceListCities';
import { getAllPriceLists } from '@/lib/priceLists';
import { cityHas, cleanCityDetails, cleanCityInput, REQUIRED_SHARED, SHARED_FIELD_NAMES } from '@/lib/priceListTypes';
import { revalidatePriceLists } from '@/lib/revalidate';
import { jsonError, logError } from '@/lib/security/request';

type Context = { params: Promise<{ slug: string }> };

/**
 * Renames a city, moves it to another state, switches it on/off, or saves the details it
 * shares with its price lists: { state?, name?, isActive?, details? }. The slug never
 * changes, so price lists stay attached.
 */
export async function PUT(request: Request, { params }: Context) {
  const { admin, response } = await requirePermission(request, 'pricelists:manage');
  if (!admin) return response;
  try {
    const { slug } = await params;
    const cities = await getCities();
    const city = cities.find((c) => c.slug === slug);
    if (!city) return jsonError('City not found.', 404);

    const body = await request.json().catch(() => null);
    const wantsText = body && ('state' in body || 'name' in body);
    const text = wantsText ? cleanCityInput({ state: body.state ?? city.state, name: body.name ?? city.name }) : null;
    if (text?.error) return jsonError(text.error, 400);

    const state = text ? (cities.find((c) => c.state.toLowerCase() === text.state.toLowerCase())?.state ?? text.state) : city.state;
    const name = text ? text.name : city.name;
    const clash = cities.find((c) => c.slug !== slug && c.state.toLowerCase() === state.toLowerCase() && c.name.toLowerCase() === name.toLowerCase());
    if (clash) return jsonError(`${clash.name} is already listed under ${clash.state}.`, 409);
    const isActive = typeof body?.isActive === 'boolean' ? body.isActive : city.isActive;

    let details = city.details;
    if (body && 'details' in body) {
      details = cleanCityDetails(body.details);
      // A required detail cannot be emptied while a list takes it from this city and
      // has no value of its own to fall back on.
      const lists = (await getAllPriceLists()).filter((entry) => entry.citySlug === slug && !entry.isDeleted);
      for (const field of REQUIRED_SHARED) {
        if (cityHas(details, field)) continue;
        const relying = lists.filter((entry) => entry.project.useCityDetails?.includes(field) && !entry.project[field]);
        if (relying.length) {
          return jsonError(
            `${relying.length} price ${relying.length === 1 ? 'list uses' : 'lists use'} this city's ${SHARED_FIELD_NAMES[field].toLowerCase()} (${relying
              .slice(0, 3)
              .map((entry) => entry.project.projectName)
              .join(', ')}). Keep a value, or untick "Same as city" in those lists first.`,
            409,
          );
        }
      }
    }

    await prisma.priceListCity.update({
      where: { slug },
      data: { state, name, isActive, details: Object.keys(details).length ? JSON.stringify(details) : null, updatedBy: admin.email },
    });
    if (state !== city.state) {
      // Moved to another state: it goes to the end of that state's cities.
      const moved = cities.map((c) => (c.slug === slug ? { ...c, state, sortOrder: 1_000_000 } : c));
      await saveCityOrder(groupedOrder(moved).map((c) => c.slug), admin.email);
    }

    revalidatePriceLists();
    await audit(admin, 'price_list_city.updated', 'price_list_city', slug, { state, name, isActive, details: Object.keys(details) });
    return NextResponse.json({ success: true });
  } catch (error) {
    logError('admin.priceListCities.save', error);
    return jsonError('Failed to save the city.', 500);
  }
}

/** Removes a city that no price list (including deleted ones) points at. */
export async function DELETE(request: Request, { params }: Context) {
  const { admin, response } = await requirePermission(request, 'pricelists:manage');
  if (!admin) return response;
  try {
    const { slug } = await params;
    const city = (await getCities()).find((c) => c.slug === slug);
    if (!city) return jsonError('City not found.', 404);

    const using = (await getAllPriceLists()).filter((entry) => entry.citySlug === slug);
    if (using.length) {
      const names = using.slice(0, 3).map((entry) => entry.project.projectName).join(', ');
      return jsonError(
        `${city.name} still has ${using.length} price ${using.length === 1 ? 'list' : 'lists'} (${names}${using.length > 3 ? ', …' : ''}). Move them to another city first, or switch the city off instead.`,
        409,
      );
    }

    await prisma.priceListCity.delete({ where: { slug } });
    revalidatePriceLists();
    await audit(admin, 'price_list_city.deleted', 'price_list_city', slug, { state: city.state, name: city.name });
    return NextResponse.json({ success: true });
  } catch (error) {
    logError('admin.priceListCities.delete', error);
    return jsonError('Failed to delete the city.', 500);
  }
}
