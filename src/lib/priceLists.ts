// Server-side source of truth for the price lists and their PDF design.
//
// data/priceLists.js holds the lists that ship with the site. A PriceList row with the
// same slug replaces one (or hides it, with isDeleted); a row with any other slug is a
// list added in the admin panel. With an empty table the site shows the file unchanged.
import type { PriceList as PriceListRow } from '@prisma/client';
import { priceLists as builtInLists } from '@/data/priceLists';
import { getCities } from '@/lib/priceListCities';
import { databaseFallback, prisma } from '@/lib/prisma';
import {
  applyCityDetails,
  cleanPdfTemplate,
  DEFAULT_PDF_TEMPLATE,
  parseJson,
  priceListStatus,
  resolveCitySlug,
  todayInIndia,
  type PdfTemplate,
  type PriceListProject,
  type PriceListStatus,
  type PriceListSummary,
} from '@/lib/priceListTypes';

export const TEMPLATE_ID = 'default';

export type PriceListEntry = {
  project: PriceListProject;
  isPublished: boolean;
  isBuiltIn: boolean;
  /** A built-in list that has been edited (it can be reset to the file version). */
  isModified: boolean;
  isDeleted: boolean;
  /** Optional window (YYYY-MM-DD, India time) in which the list is shown. */
  activeFrom: string | null;
  activeUntil: string | null;
  /** What visitors see today: only 'active' lists are public. */
  status: PriceListStatus;
  /** The index city it belongs to (resolved from citySlug or older city text), or null. */
  citySlug: string | null;
  sortOrder: number;
  /** This list's own PDF design, or null to use the shared one. */
  pdfDesign: PdfTemplate | null;
  updatedAt: string | null;
};

const BUILT_IN = builtInLists as unknown as PriceListProject[];

export const isBuiltInSlug = (slug: string) => BUILT_IN.some((list) => list.slug === slug);

/** Every list, including unpublished and deleted ones (admin view). */
export async function getAllPriceLists(): Promise<PriceListEntry[]> {
  const model = prisma.priceList;
  const [rows, template, cities] = await Promise.all([
    model ? model.findMany().catch(databaseFallback<PriceListRow[]>('Price lists', [])) : Promise.resolve([]),
    getPdfTemplate(),
    getCities(),
  ]);
  const bySlug = new Map(rows.map((row) => [row.slug, row]));
  const today = todayInIndia();
  const withStatus = (entry: Omit<PriceListEntry, 'status' | 'citySlug'>): PriceListEntry => ({
    ...entry,
    status: priceListStatus(entry, today),
    citySlug: resolveCitySlug(entry.project, cities),
  });

  const entries: PriceListEntry[] = BUILT_IN.map((file, index) => {
    const row = bySlug.get(file.slug);
    const stored = row ? (parseJson(row.data) as PriceListProject | null) : null;
    const design = row ? parseJson(row.pdfDesign) : null;
    return withStatus({
      project: stored ? { ...stored, slug: file.slug } : file,
      isPublished: row ? row.isPublished : true,
      isBuiltIn: true,
      isModified: Boolean(stored),
      isDeleted: row?.isDeleted ?? false,
      activeFrom: row?.activeFrom ?? null,
      activeUntil: row?.activeUntil ?? null,
      sortOrder: row ? row.sortOrder : index,
      pdfDesign: design ? cleanPdfTemplate(design, template) : null,
      updatedAt: row ? row.updatedAt.toISOString() : null,
    });
  });

  rows
    .filter((row) => !isBuiltInSlug(row.slug))
    .forEach((row) => {
      const stored = parseJson(row.data) as PriceListProject | null;
      if (!stored) return;
      const design = parseJson(row.pdfDesign);
      entries.push(withStatus({
        project: { ...stored, slug: row.slug },
        isPublished: row.isPublished,
        isBuiltIn: false,
        isModified: false,
        isDeleted: row.isDeleted,
        activeFrom: row.activeFrom,
        activeUntil: row.activeUntil,
        sortOrder: row.sortOrder,
        pdfDesign: design ? cleanPdfTemplate(design, template) : null,
        updatedAt: row.updatedAt.toISOString(),
      }));
    });

  return entries.sort((a, b) => a.sortOrder - b.sortOrder || a.project.projectName.localeCompare(b.project.projectName));
}

/** The admin table row for a list: no units, schedules or design, which load on Edit. */
export function toSummary(entry: PriceListEntry): PriceListSummary {
  const { slug, projectName, phaseLabel, effectiveDate } = entry.project;
  return {
    project: { slug, projectName, phaseLabel, effectiveDate },
    citySlug: entry.citySlug,
    isPublished: entry.isPublished,
    isBuiltIn: entry.isBuiltIn,
    isModified: entry.isModified,
    isDeleted: entry.isDeleted,
    activeFrom: entry.activeFrom,
    activeUntil: entry.activeUntil,
    status: entry.status,
    sortOrder: entry.sortOrder,
    hasOwnDesign: Boolean(entry.pdfDesign),
    updatedAt: entry.updatedAt,
  };
}

/** Lists visitors can see today (status 'active'), in display order. */
export async function getPublishedPriceLists(): Promise<PriceListProject[]> {
  const entries = await getAllPriceLists();
  return entries.filter((entry) => entry.status === 'active').map((entry) => entry.project);
}

export async function getPriceListEntry(slug: string): Promise<PriceListEntry | null> {
  const entries = await getAllPriceLists();
  return entries.find((entry) => entry.project.slug === slug) ?? null;
}

/** An active list (with its city's shared details filled in) and the PDF design it downloads with. */
export async function getPublicPriceList(slug: string) {
  const [entry, template, cities] = await Promise.all([getPriceListEntry(slug), getPdfTemplate(), getCities()]);
  if (!entry || entry.status !== 'active') return null;
  const city = cities.find((c) => c.slug === entry.citySlug);
  return { project: applyCityDetails(entry.project, city), pdfTemplate: entry.pdfDesign ?? template };
}

/** The shared PDF design, filled with defaults for anything not set. */
export async function getPdfTemplate(): Promise<PdfTemplate> {
  const model = prisma.priceListTemplate;
  if (!model) return DEFAULT_PDF_TEMPLATE;
  const row = await model
    .findUnique({ where: { id: TEMPLATE_ID } })
    .catch(databaseFallback('Price list PDF design', null));
  return row ? cleanPdfTemplate(parseJson(row.data)) : DEFAULT_PDF_TEMPLATE;
}

export const builtInPriceList = (slug: string) => BUILT_IN.find((list) => list.slug === slug) ?? null;
