import { revalidatePath } from 'next/cache';

export function revalidatePriceLists(): void {
  try {
    revalidatePath('/price-list', 'page');
    revalidatePath('/price-list/[slug]', 'page');
  } catch (error) {
    console.warn('revalidate price-lists skipped:', error);
  }
}
