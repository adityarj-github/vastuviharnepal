// Shapes, defaults and input cleaning for the price lists and their PDF design.
// Used by the admin API, the admin editor, the public pages and lib/priceListPdf.ts,
// so it must stay free of server-only imports.
import { cleanText } from '@/lib/validation';

export type PriceListUnit = {
  name: string;
  model?: string;
  carpetArea?: string;
  builtUpArea?: string;
  landArea?: string;
  deluxePrice?: string;
  luxuryPrice?: string;
};

export type PriceListSpec = { particular: string; deluxe?: string; luxury?: string };

export type PriceListParking = { name: string; size?: string; price?: string };

export type PriceListProject = {
  slug: string;
  projectName: string;
  /** The city (PriceListCity slug) it appears under on /price-list. None = reachable only by link. */
  citySlug?: string;
  /** Older lists name their city as text instead; resolveCitySlug() matches these by name. */
  state?: string;
  city?: string;
  /** The button label under the city, for example "Phase 02". */
  phaseLabel?: string;
  /** Fields taken from the city's shared details instead of this list's own values. */
  useCityDetails?: SharedField[];
  effectiveDate: string;
  officeAddress: string;
  siteAddress: string;
  contactPhones: string;
  email?: string;
  bookingStatus?: string;
  footerMessage?: string;
  bungalows?: PriceListUnit[];
  flats?: PriceListUnit[];
  shops?: PriceListUnit[];
  parking?: PriceListParking[];
  paymentSchedules: Array<{ title: string; steps: string[] }>;
  specifications?: PriceListSpec[];
  specificationNote?: string;
  shopSpecifications?: PriceListSpec[];
  notes: string[];
};

/** Sections drawn in the PDF's left and right columns, in the order listed. */
export const LEFT_SECTIONS = ['otherUnits', 'parking', 'specifications'] as const;
export const RIGHT_SECTIONS = ['paymentSchedules', 'notes', 'shopSpecifications', 'bookingStatus'] as const;
export type LeftSection = (typeof LEFT_SECTIONS)[number];
export type RightSection = (typeof RIGHT_SECTIONS)[number];

export const SECTION_NAMES: Record<LeftSection | RightSection, string> = {
  otherUnits: 'Flat / shop tables (after the headline table)',
  parking: 'Parking table',
  specifications: 'Specification table',
  paymentSchedules: 'Payment schedules',
  notes: 'Notes',
  shopSpecifications: 'Shop specification',
  bookingStatus: 'Booking status stamp',
};

export const PDF_COLOR_KEYS = [
  'primary',
  'primaryDark',
  'background',
  'tableFill',
  'gridLine',
  'headerGridLine',
  'text',
  'mutedText',
  'onPrimary',
] as const;
export type PdfColorKey = (typeof PDF_COLOR_KEYS)[number];

export const PDF_COLOR_NAMES: Record<PdfColorKey, string> = {
  primary: 'Main colour (header, ribbons, table heads, footer)',
  primaryDark: 'Ribbon fold',
  background: 'Page background',
  tableFill: 'Table rows',
  gridLine: 'Table grid lines',
  headerGridLine: 'Lines inside table heads',
  text: 'Body text',
  mutedText: 'Project name',
  onPrimary: 'Text on the main colour',
};

export const PDF_LABEL_KEYS = [
  'officeLabel',
  'callLabel',
  'emailLabel',
  'siteLabel',
  'effectiveFrom',
  'priceListOf',
  'bungalowTitle',
  'flatTitle',
  'shopTitle',
  'parkingTitle',
  'modelColumn',
  'carpetAreaColumn',
  'builtUpAreaColumn',
  'landAreaColumn',
  'areaUnit',
  'priceColumn',
  'deluxeColumn',
  'luxuryColumn',
  'sizeColumn',
  'specificationHeading',
  'particularColumn',
  'specificationColumn',
  'notesHeading',
  'shopSpecificationHeading',
  'footerContactLabel',
  'defaultFooterMessage',
] as const;
export type PdfLabelKey = (typeof PDF_LABEL_KEYS)[number];

export const PDF_LABEL_NAMES: Record<PdfLabelKey, string> = {
  officeLabel: 'Header: office address label',
  callLabel: 'Header: phone label',
  emailLabel: 'Header: email label',
  siteLabel: 'Header: site address label',
  effectiveFrom: 'Before the effective date',
  priceListOf: 'Before the unit kinds ("Price List of Bungalow & Flat")',
  bungalowTitle: 'Bungalow table title',
  flatTitle: 'Flat table title',
  shopTitle: 'Shop table title',
  parkingTitle: 'Parking table title',
  modelColumn: 'Column: model',
  carpetAreaColumn: 'Column: carpet area',
  builtUpAreaColumn: 'Column: built-up area',
  landAreaColumn: 'Column: land area',
  areaUnit: 'Area unit, under the area columns',
  priceColumn: 'Column: price (lists with one grade)',
  deluxeColumn: 'Column: deluxe price / grade',
  luxuryColumn: 'Column: luxury price / grade',
  sizeColumn: 'Column: parking size',
  specificationHeading: 'Specification ribbon',
  particularColumn: 'Specification column: particular',
  specificationColumn: 'Specification column (one grade)',
  notesHeading: 'Notes ribbon',
  shopSpecificationHeading: 'Shop specification ribbon',
  footerContactLabel: 'Footer: before the helpline',
  defaultFooterMessage: 'Footer message when a list has none',
};

export const PDF_SIZE_KEYS = [
  'companyName',
  'headerInfo',
  'projectName',
  'effectiveDate',
  'headlineTable',
  'smallTable',
  'ribbon',
  'list',
  'specTable',
  'bookingStatus',
  'footer',
] as const;
export type PdfSizeKey = (typeof PDF_SIZE_KEYS)[number];

export const PDF_SIZE_NAMES: Record<PdfSizeKey, string> = {
  companyName: 'Company name',
  headerInfo: 'Header addresses',
  projectName: 'Project name',
  effectiveDate: 'Effective date',
  headlineTable: 'Headline (first) table',
  smallTable: 'Other tables',
  ribbon: 'Ribbon headings',
  list: 'Payment schedule and notes',
  specTable: 'Specification table',
  bookingStatus: 'Booking status stamp',
  footer: 'Footer helpline',
};

export type PdfTemplate = {
  companyName: string;
  helpline: string;
  website: string;
  /** Image URL on this site; empty hides the logo. */
  logoUrl: string;
  showLogo: boolean;
  showSignatures: boolean;
  signatureLabels: string[];
  showFooter: boolean;
  colors: Record<PdfColorKey, string>;
  labels: Record<PdfLabelKey, string>;
  /** Font sizes in points, at full scale. */
  sizes: Record<PdfSizeKey, number>;
  leftSections: LeftSection[];
  rightSections: RightSection[];
  /** Long lists shrink to this scale (0.5–1) before the page grows past A4. */
  minScale: number;
  /** Lets a long list run onto a taller page instead of staying A4. */
  allowTallPage: boolean;
  /** "{slug}" is replaced with the list's slug. */
  fileName: string;
  author: string;
};

export const DEFAULT_PDF_TEMPLATE: PdfTemplate = {
  companyName: 'TECHNOCULTURE BUILDING CENTRE PVT. LTD.',
  helpline: '+977 9705191816 / 9802591815',
  website: 'www.vastuvihar.org',
  logoUrl: '/images/vastu-logo.webp',
  showLogo: true,
  showSignatures: true,
  signatureLabels: ['Marketing Signature', 'Project Head Signature', 'Customer Signature'],
  showFooter: true,
  colors: {
    primary: '#ed1c24',
    primaryDark: '#a01016',
    background: '#fdf7dc',
    tableFill: '#fde9a6',
    gridLine: '#f0a531',
    headerGridLine: '#f7bec0',
    text: '#1d1d1b',
    mutedText: '#3a3a3a',
    onPrimary: '#ffffff',
  },
  labels: {
    officeLabel: 'Office Address',
    callLabel: 'Call',
    emailLabel: 'Email',
    siteLabel: 'Site Address',
    effectiveFrom: 'Effective From',
    priceListOf: 'Price List of',
    bungalowTitle: 'Model Bungalow',
    flatTitle: 'Model Flat',
    shopTitle: 'Model Shop',
    parkingTitle: 'Parking',
    modelColumn: 'Model',
    carpetAreaColumn: 'Carpet Area',
    builtUpAreaColumn: 'B.U.A',
    landAreaColumn: 'Land Area',
    areaUnit: '(Sq. Ft.)',
    priceColumn: 'Price',
    deluxeColumn: 'Deluxe',
    luxuryColumn: 'Luxury',
    sizeColumn: 'Size',
    specificationHeading: 'SPECIFICATION',
    particularColumn: 'Particular',
    specificationColumn: 'Specification',
    notesHeading: 'Note:-',
    shopSpecificationHeading: 'Shop Specification',
    footerContactLabel: 'For Any Cities :',
    defaultFooterMessage: 'Thanks For Visit',
  },
  sizes: {
    companyName: 21,
    headerInfo: 9.5,
    projectName: 19,
    effectiveDate: 14,
    headlineTable: 17,
    smallTable: 11,
    ribbon: 11,
    list: 8.3,
    specTable: 7,
    bookingStatus: 24,
    footer: 12.5,
  },
  leftSections: [...LEFT_SECTIONS],
  rightSections: [...RIGHT_SECTIONS],
  minScale: 0.8,
  allowTallPage: true,
  fileName: 'vastu-vihar-{slug}-price-list',
  author: 'Vastu Vihar',
};

// ---------------------------------------------------------------------------
// Input cleaning. Everything an admin sends goes through these before it is stored.
// ---------------------------------------------------------------------------

const SHORT = 200;
const LONG = 2000;
const MAX_ROWS = 100;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const list = (value: unknown) => (Array.isArray(value) ? value.slice(0, MAX_ROWS) : []);

/** Text, or undefined when empty, so optional fields stay out of the stored JSON. */
function optional(value: unknown, max = SHORT) {
  const text = typeof value === 'number' ? String(value) : cleanText(value, max);
  return text || undefined;
}

function units(value: unknown): PriceListUnit[] {
  return list(value)
    .filter(isObject)
    .map((u) => ({
      name: cleanText(u.name, SHORT),
      model: optional(u.model),
      carpetArea: optional(u.carpetArea),
      builtUpArea: optional(u.builtUpArea),
      landArea: optional(u.landArea),
      deluxePrice: optional(u.deluxePrice),
      luxuryPrice: optional(u.luxuryPrice),
    }))
    .filter((u) => u.name);
}

function specs(value: unknown): PriceListSpec[] {
  return list(value)
    .filter(isObject)
    .map((s) => ({ particular: cleanText(s.particular, SHORT), deluxe: optional(s.deluxe, LONG), luxury: optional(s.luxury, LONG) }))
    .filter((s) => s.particular);
}

function lines(value: unknown, max = LONG) {
  return list(value).map((line) => cleanText(line, max)).filter(Boolean);
}

/** Drops undefined values and empty arrays so the stored JSON matches the hand-written file. */
function compact<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0)),
  ) as T;
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Cleans a submitted price list. Returns the problems found, if any. */
export function cleanPriceList(input: unknown): { project?: PriceListProject; errors: string[] } {
  if (!isObject(input)) return { errors: ['The price list is missing.'] };
  const errors: string[] = [];

  const project = compact({
    slug: cleanText(input.slug, 80).toLowerCase(),
    projectName: cleanText(input.projectName, SHORT),
    citySlug: optional(input.citySlug, 80)?.toLowerCase(),
    phaseLabel: optional(input.phaseLabel),
    useCityDetails: cleanSharedFields(input.useCityDetails),
    effectiveDate: cleanText(input.effectiveDate, SHORT),
    officeAddress: cleanText(input.officeAddress, 400),
    siteAddress: cleanText(input.siteAddress, 400),
    contactPhones: cleanText(input.contactPhones, SHORT),
    email: optional(input.email),
    bookingStatus: optional(input.bookingStatus),
    footerMessage: optional(input.footerMessage),
    bungalows: units(input.bungalows),
    flats: units(input.flats),
    shops: units(input.shops),
    parking: list(input.parking)
      .filter(isObject)
      .map((p) => compact({ name: cleanText(p.name, SHORT), size: optional(p.size), price: optional(p.price) }))
      .filter((p) => p.name),
    paymentSchedules: list(input.paymentSchedules)
      .filter(isObject)
      .map((s) => ({ title: cleanText(s.title, SHORT), steps: lines(s.steps) }))
      .filter((s) => s.title || s.steps.length),
    specifications: specs(input.specifications),
    specificationNote: optional(input.specificationNote, LONG),
    shopSpecifications: specs(input.shopSpecifications),
    notes: lines(input.notes),
  }) as PriceListProject;

  project.bungalows = project.bungalows?.map((u) => compact(u));
  project.flats = project.flats?.map((u) => compact(u));
  project.shops = project.shops?.map((u) => compact(u));
  project.specifications = project.specifications?.map((s) => compact(s));
  project.shopSpecifications = project.shopSpecifications?.map((s) => compact(s));
  project.paymentSchedules ??= [];
  project.notes ??= [];

  if (!SLUG_PATTERN.test(project.slug)) errors.push('The URL slug may use only lowercase letters, numbers and dashes.');
  if (!project.projectName) errors.push('Project name is required.');
  if (!project.effectiveDate) errors.push('Effective date is required.');
  // A field taken from the city is checked against the city by checkCityDetails().
  const fromCity = new Set(project.useCityDetails || []);
  if (!project.officeAddress && !fromCity.has('officeAddress')) errors.push('Office address is required.');
  if (!project.siteAddress && !fromCity.has('siteAddress')) errors.push('Site address is required.');
  if (!project.contactPhones && !fromCity.has('contactPhones')) errors.push('Contact phone is required.');
  if (fromCity.size && !project.citySlug) errors.push('Choose a city before using its shared details.');
  if (project.citySlug && !SLUG_PATTERN.test(project.citySlug)) errors.push('Choose a city from the list.');
  if (![project.bungalows, project.flats, project.shops].some((group) => group?.length)) {
    errors.push('Add at least one bungalow, flat or shop.');
  }

  return errors.length ? { errors } : { project, errors };
}

const HEX = /^#[0-9a-f]{6}$/i;

function number(value: unknown, fallback: number, min: number, max: number) {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n * 100) / 100)) : fallback;
}

/** Known sections in the given order. A section left out of the list is hidden. */
function sectionOrder<T extends string>(value: unknown, known: readonly T[], fallback: T[]): T[] {
  if (!Array.isArray(value)) return fallback;
  const seen = new Set<T>();
  value.forEach((item) => {
    if (known.includes(item as T)) seen.add(item as T);
  });
  return [...seen];
}

/** Only same-site paths or https URLs, so the PDF never loads a script-capable scheme. */
function cleanImageUrl(value: unknown, fallback: string) {
  if (value === '') return '';
  const url = cleanText(value, 500);
  if (!url) return fallback;
  if (url.startsWith('/') && !url.startsWith('//')) return url;
  return fallback;
}

/** Fills a stored or submitted design with defaults for anything missing or invalid. */
export function cleanPdfTemplate(input: unknown, base: PdfTemplate = DEFAULT_PDF_TEMPLATE): PdfTemplate {
  const t = isObject(input) ? input : {};
  const colors = isObject(t.colors) ? t.colors : {};
  const labels = isObject(t.labels) ? t.labels : {};
  const sizes = isObject(t.sizes) ? t.sizes : {};
  const text = (value: unknown, fallback: string, max = SHORT) => (typeof value === 'string' ? cleanText(value, max) : fallback);
  const flag = (value: unknown, fallback: boolean) => (typeof value === 'boolean' ? value : fallback);

  return {
    companyName: text(t.companyName, base.companyName),
    helpline: text(t.helpline, base.helpline),
    website: text(t.website, base.website),
    logoUrl: cleanImageUrl(t.logoUrl, base.logoUrl),
    showLogo: flag(t.showLogo, base.showLogo),
    showSignatures: flag(t.showSignatures, base.showSignatures),
    signatureLabels: Array.isArray(t.signatureLabels)
      ? t.signatureLabels.slice(0, 4).map((label) => cleanText(label, 60)).filter(Boolean)
      : base.signatureLabels,
    showFooter: flag(t.showFooter, base.showFooter),
    colors: Object.fromEntries(
      PDF_COLOR_KEYS.map((key) => {
        const value = typeof colors[key] === 'string' ? (colors[key] as string).trim() : '';
        return [key, HEX.test(value) ? value.toLowerCase() : base.colors[key]];
      }),
    ) as PdfTemplate['colors'],
    labels: Object.fromEntries(PDF_LABEL_KEYS.map((key) => [key, text(labels[key], base.labels[key])])) as PdfTemplate['labels'],
    sizes: Object.fromEntries(
      PDF_SIZE_KEYS.map((key) => [key, number(sizes[key], base.sizes[key], 4, 48)]),
    ) as PdfTemplate['sizes'],
    leftSections: sectionOrder(t.leftSections, LEFT_SECTIONS, base.leftSections),
    rightSections: sectionOrder(t.rightSections, RIGHT_SECTIONS, base.rightSections),
    minScale: number(t.minScale, base.minScale, 0.5, 1),
    allowTallPage: flag(t.allowTallPage, base.allowTallPage),
    fileName: slugify(text(t.fileName, base.fileName).replace('{slug}', 'SLUGTOKEN')).replace('slugtoken', '{slug}') || base.fileName,
    author: text(t.author, base.author),
  };
}

// ---------------------------------------------------------------------------
// Active / inactive status. A list is shown only when it is switched on, not
// deleted, and today (India time) falls inside its optional active window.
// ---------------------------------------------------------------------------

export type PriceListStatus = 'active' | 'inactive' | 'scheduled' | 'expired' | 'deleted';

export const STATUS_NAMES: Record<PriceListStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  scheduled: 'Scheduled',
  expired: 'Expired',
  deleted: 'Deleted',
};

const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** A real calendar date as YYYY-MM-DD, or null. */
export function cleanScheduleDate(value: unknown): string | null {
  if (typeof value !== 'string' || !DATE.test(value.trim())) return null;
  const date = value.trim();
  const parsed = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date ? date : null;
}

/** Today's date in India as YYYY-MM-DD. The schedule is in India time wherever the server runs. */
export function todayInIndia(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

export function priceListStatus(
  entry: { isPublished: boolean; isDeleted: boolean; activeFrom: string | null; activeUntil: string | null },
  today = todayInIndia(),
): PriceListStatus {
  if (entry.isDeleted) return 'deleted';
  if (!entry.isPublished) return 'inactive';
  if (entry.activeFrom && today < entry.activeFrom) return 'scheduled';
  if (entry.activeUntil && today > entry.activeUntil) return 'expired';
  return 'active';
}

/** Reads { activeFrom, activeUntil } from a request body. Blank means no limit. */
export function readSchedule(body: unknown): { activeFrom: string | null; activeUntil: string | null; error?: string } {
  const b = isObject(body) ? body : {};
  const blank = (value: unknown) => value === undefined || value === null || value === '';
  const activeFrom = cleanScheduleDate(b.activeFrom);
  const activeUntil = cleanScheduleDate(b.activeUntil);
  if (!blank(b.activeFrom) && !activeFrom) return { activeFrom, activeUntil, error: 'The "Active from" date is not valid.' };
  if (!blank(b.activeUntil) && !activeUntil) return { activeFrom, activeUntil, error: 'The "Active until" date is not valid.' };
  if (activeFrom && activeUntil && activeUntil < activeFrom) {
    return { activeFrom, activeUntil, error: '"Active until" must be on or after "Active from".' };
  }
  return { activeFrom, activeUntil };
}

/** "12 Jan 2027" from YYYY-MM-DD. */
export function formatScheduleDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

/** Parses stored JSON without throwing. */
export function parseJson(value: string | null | undefined): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Cities on the /price-list index.
// ---------------------------------------------------------------------------

export type PriceListCity = {
  slug: string;
  state: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  /** Contact details its price lists can share (see SHARED_FIELDS). */
  details: CityDetails;
};

const sameText = (a?: string, b?: string) => Boolean(a && b) && a!.trim().toLowerCase() === b!.trim().toLowerCase();

/** The city a list belongs to: its citySlug, or for older lists the city named in its text fields. */
export function resolveCitySlug(project: Pick<PriceListProject, 'citySlug' | 'state' | 'city'>, cities: PriceListCity[]) {
  if (project.citySlug) return cities.some((c) => c.slug === project.citySlug) ? project.citySlug : null;
  if (!project.city) return null;
  const match =
    cities.find((c) => sameText(c.name, project.city) && (!project.state || sameText(c.state, project.state))) ??
    cities.find((c) => sameText(c.name, project.city));
  return match?.slug ?? null;
}

/** States in the order their first city appears. */
export function statesInOrder(cities: PriceListCity[]) {
  const sorted = [...cities].sort((a, b) => a.sortOrder - b.sortOrder);
  return [...new Set(sorted.map((c) => c.state))];
}

/** Cleans { state, name } for a new or renamed city. */
export function cleanCityInput(input: unknown): { state: string; name: string; error?: string } {
  const b = isObject(input) ? input : {};
  const state = cleanText(b.state, 80);
  const name = cleanText(b.name, 80);
  if (!state) return { state, name, error: 'Choose or type a state.' };
  if (!name) return { state, name, error: 'Type the city name.' };
  if (!slugify(name)) return { state, name, error: 'The city name needs at least one letter or number.' };
  return { state, name };
}

// ---------------------------------------------------------------------------
// Admin table rows: just what the grouped list shows. The full list is
// fetched when it is opened, so the table stays fast with many lists.
// ---------------------------------------------------------------------------

export type PriceListSummary = {
  project: Pick<PriceListProject, 'slug' | 'projectName' | 'phaseLabel' | 'effectiveDate'>;
  citySlug: string | null;
  isPublished: boolean;
  isBuiltIn: boolean;
  isModified: boolean;
  isDeleted: boolean;
  activeFrom: string | null;
  activeUntil: string | null;
  status: PriceListStatus;
  sortOrder: number;
  hasOwnDesign: boolean;
  updatedAt: string | null;
};

/** How many days "expiring soon" looks ahead. */
export const EXPIRING_DAYS = 30;

/** Whole days from today (India) to a YYYY-MM-DD date; negative once it has passed. */
export function daysUntil(date: string, today = todayInIndia()) {
  return Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
}

/** An active list whose "Active until" date is within the next EXPIRING_DAYS days (today included). */
export function isExpiringSoon(entry: { status: PriceListStatus; activeUntil: string | null }, today = todayInIndia()) {
  return entry.status === 'active' && Boolean(entry.activeUntil) && daysUntil(entry.activeUntil as string, today) <= EXPIRING_DAYS;
}

// ---------------------------------------------------------------------------
// Details a city shares with its price lists. A list picks, field by field,
// whether to use the city's value (useCityDetails) or its own.
// ---------------------------------------------------------------------------

export const SHARED_FIELDS = ['officeAddress', 'siteAddress', 'contactPhones', 'email', 'footerMessage', 'notes'] as const;
export type SharedField = (typeof SHARED_FIELDS)[number];

export const SHARED_FIELD_NAMES: Record<SharedField, string> = {
  officeAddress: 'Office address',
  siteAddress: 'Site address',
  contactPhones: 'Contact phones',
  email: 'Email',
  footerMessage: 'Footer message',
  notes: 'Notes & terms',
};

/** Fields a list cannot do without; a city cannot clear one while lists rely on it. */
export const REQUIRED_SHARED: SharedField[] = ['officeAddress', 'siteAddress', 'contactPhones'];

export type CityDetails = {
  officeAddress?: string;
  siteAddress?: string;
  contactPhones?: string;
  email?: string;
  footerMessage?: string;
  notes?: string[];
};

export function cleanSharedFields(value: unknown): SharedField[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const fields = SHARED_FIELDS.filter((field) => value.includes(field));
  return fields.length ? fields : undefined;
}

/** Cleans stored or submitted city details; empty fields are left out. */
export function cleanCityDetails(input: unknown): CityDetails {
  const b = isObject(input) ? input : {};
  const notes = list(b.notes)
    .map((line) => cleanText(line, LONG).replace(/^\(?\(?\d+\)\s*/, ''))
    .filter(Boolean);
  return compact({
    officeAddress: optional(b.officeAddress, 400),
    siteAddress: optional(b.siteAddress, 400),
    contactPhones: optional(b.contactPhones),
    email: optional(b.email),
    footerMessage: optional(b.footerMessage),
    notes: notes.length ? notes : undefined,
  }) as CityDetails;
}

/** True when the city has a usable value for this field. */
export function cityHas(details: CityDetails | undefined, field: SharedField) {
  const value = details?.[field];
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}

/**
 * The list as visitors see it: every field in useCityDetails replaced by the city's
 * value. A field the city has no value for keeps the list's own value.
 */
export function applyCityDetails<T extends Partial<PriceListProject>>(project: T, city: Pick<PriceListCity, 'details'> | null | undefined): T {
  const fields = project.useCityDetails || [];
  if (!fields.length || !city) return project;
  const next: Record<string, unknown> = { ...project };
  fields.forEach((field) => {
    if (cityHas(city.details, field)) next[field] = city.details[field];
  });
  return next as T;
}

/** Problems with a list's shared details against its city (null city = not found). */
export function checkCityDetails(project: PriceListProject, city: PriceListCity | null | undefined): string[] {
  const fields = project.useCityDetails || [];
  if (!fields.length) return [];
  if (!city) return ['Choose a city before using its shared details.'];
  return fields
    .filter((field) => REQUIRED_SHARED.includes(field) && !cityHas(city.details, field) && !project[field])
    .map((field) => `${city.name} has no ${SHARED_FIELD_NAMES[field].toLowerCase()} yet. Add it under Cities, or untick "Same as city".`);
}
