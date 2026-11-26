// Cities on the /price-list index (PriceListCity table, managed in the admin panel).
import type { PriceListCity as CityRow } from '@prisma/client';
import { priceListCities as seedCities } from '@/data/priceListCities';
import { databaseFallback, prisma } from '@/lib/prisma';
import { cleanCityDetails, parseJson, type PriceListCity } from '@/lib/priceListTypes';

/** The starting cities, used only if the database cannot be read (see databaseFallback). */
const SEED: PriceListCity[] = (seedCities as Array<{ slug: string; state: string; name: string }>).map((city, index) => ({
  ...city,
  sortOrder: index,
  isActive: true,
  details: {},
}));

const toCity = (row: CityRow): PriceListCity => ({
  slug: row.slug,
  state: row.state,
  name: row.name,
  sortOrder: row.sortOrder,
  isActive: row.isActive,
  details: cleanCityDetails(parseJson(row.details)),
});

/** Every city, active or not, in display order. */
export async function getCities(): Promise<PriceListCity[]> {
  const model = prisma.priceListCity;
  if (!model) return SEED;
  const rows = await model
    .findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] })
    .then((list) => list.map(toCity))
    .catch(databaseFallback<PriceListCity[]>('Price list cities', SEED));
  return rows;
}

/**
 * Rewrites sortOrder as 0, 1, 2… in the given order. Written one by one: the D1
 * adapter has no atomic batch, and a repeated save fixes a partial one.
 */
export async function saveCityOrder(slugs: string[], updatedBy: string) {
  for (const [index, slug] of slugs.entries()) {
    await prisma.priceListCity.update({ where: { slug }, data: { sortOrder: index, updatedBy } });
  }
}

/**
 * Display order with states kept together: cities grouped by state (states in the
 * order their first city appears), each state's cities in their current order.
 */
export function groupedOrder(cities: PriceListCity[]) {
  const sorted = [...cities].sort((a, b) => a.sortOrder - b.sortOrder);
  const states = [...new Set(sorted.map((c) => c.state))];
  return states.flatMap((state) => sorted.filter((c) => c.state === state));
}
