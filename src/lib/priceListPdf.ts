// Builds the downloadable project price list as a PDF laid out like the printed
// Vastu Vihar flyer (public/ara_ph_2_ext.jpeg): coloured company header with the logo
// tab, big headline table, flats + specification on the left, payment schedules
// + notes on the right, footer band.
//
// Every text, colour, size and section is read from a PdfTemplate, which admins edit
// in the admin panel (lib/priceListTypes.ts has the defaults, matching the flyer).
//
// Runs in the browser only. It is loaded on demand (the download button and the admin
// preview) so jsPDF never ships in the page bundle.
import { jsPDF } from 'jspdf';
import {
  DEFAULT_PDF_TEMPLATE,
  type PdfTemplate,
  type PriceListProject,
  type PriceListSpec,
  type PriceListUnit,
} from '@/lib/priceListTypes';

/** Kept for older imports; the PDF takes the same shape as the public page. */
export type PriceListPdfProject = PriceListProject;

type Unit = PriceListUnit;
type RGB = [number, number, number];

type Palette = {
  primary: RGB;
  primaryDark: RGB;
  background: RGB;
  tableFill: RGB;
  gridLine: RGB;
  headerGridLine: RGB;
  text: RGB;
  mutedText: RGB;
  onPrimary: RGB;
};

const PAGE_W = 210;
const A4_H = 297;
const M = 8; // side margin, mm
const PT = 0.3528; // mm per point
const HEADER_H = 30;
const FOOTER_H = 9;
/** The lowest scale a non-growing (A4-only) page shrinks to. */
const HARD_MIN_SCALE = 0.5;

type Logo = { data: string; w: number; h: number };

function hexToRgb(hex: string): RGB {
  const n = Number.parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function palette(t: PdfTemplate): Palette {
  return Object.fromEntries(Object.entries(t.colors).map(([key, value]) => [key, hexToRgb(value)])) as Palette;
}

const setFill = (doc: jsPDF, c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
const setStroke = (doc: jsPDF, c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);
const setInk = (doc: jsPDF, c: RGB) => doc.setTextColor(c[0], c[1], c[2]);

function setFont(doc: jsPDF, size: number, style = 'bold', family = 'helvetica') {
  doc.setFont(family, style);
  doc.setFontSize(size);
}

/** Largest font size (down to `min`) at which `text` fits in `maxW`. */
function fitSize(doc: jsPDF, text: string, maxW: number, size: number, min = 5) {
  let s = size;
  doc.setFontSize(s);
  while (s > min && doc.getTextWidth(text) > maxW) {
    s -= 0.25;
    doc.setFontSize(s);
  }
  return s;
}

/** Filled closed polygon from absolute points. */
function polygon(doc: jsPDF, pts: Array<[number, number]>) {
  const deltas = pts.slice(1).map((p, i) => [p[0] - pts[i][0], p[1] - pts[i][1]]);
  doc.lines(deltas, pts[0][0], pts[0][1], [1, 1], 'F', true);
}

/** Splits "(01) Booking amount..." into "01" and "Booking amount...". */
function splitNumbered(text: string, index: number) {
  const match = text.match(/^\(?\(?(\d+)\)\s*/);
  if (!match) return { num: String(index + 1).padStart(2, '0'), body: text };
  return { num: match[1], body: text.slice(match[0].length) };
}

function unitKinds(p: PriceListProject) {
  const kinds = [
    p.bungalows?.length ? 'Bungalow' : null,
    p.flats?.length ? 'Flat' : null,
    p.shops?.length ? 'Shop' : null,
  ].filter(Boolean) as string[];
  if (kinds.length <= 1) return kinds.join('');
  return `${kinds.slice(0, -1).join(', ')} & ${kinds[kinds.length - 1]}`;
}

type Col = { label: string; sub?: string; weight: number; left?: boolean };

/** Columns and cell text for a unit table, showing only columns that have data. */
function unitColumns(title: string, items: Unit[], t: PdfTemplate) {
  const L = t.labels;
  const has = (key: keyof Unit) => items.some((item) => item[key]);
  const hasLuxury = has('luxuryPrice');
  const sub = L.areaUnit || undefined;
  const cols: Array<Col & { get: (u: Unit) => string | undefined }> = [
    { label: title, weight: 1.75, left: true, get: (u) => u.name },
  ];
  if (has('model')) cols.push({ label: L.modelColumn, weight: 0.75, get: (u) => u.model });
  if (has('carpetArea')) cols.push({ label: L.carpetAreaColumn, sub, weight: 1, get: (u) => u.carpetArea });
  if (has('builtUpArea')) cols.push({ label: L.builtUpAreaColumn, sub, weight: 0.9, get: (u) => u.builtUpArea });
  if (has('landArea')) cols.push({ label: L.landAreaColumn, sub, weight: 1, get: (u) => u.landArea });
  if (has('deluxePrice')) cols.push({ label: hasLuxury ? L.deluxeColumn : L.priceColumn, weight: 1.15, get: (u) => u.deluxePrice });
  if (hasLuxury) cols.push({ label: L.luxuryColumn, weight: 1.15, get: (u) => u.luxuryPrice });

  return {
    cols,
    rows: items.map((item) => cols.map((col) => col.get(item) || '-')),
  };
}

type TableStyle = {
  headH: number;
  rowH: number;
  headSize: number;
  bodySize: number;
  italicHead?: boolean;
  redNames?: boolean;
};

/** Coloured header, filled rows, grid. Returns the bottom y. */
function drawUnitTable(doc: jsPDF, c: Palette, x: number, y: number, w: number, cols: Col[], rows: string[][], st: TableStyle) {
  const total = cols.reduce((sum, col) => sum + col.weight, 0);
  const widths = cols.map((col) => (w * col.weight) / total);
  const xs = widths.map((_, i) => x + widths.slice(0, i).reduce((a, b) => a + b, 0));
  const pad = 2.5;
  const bodyTop = y + st.headH;
  const bottom = bodyTop + rows.length * st.rowH;

  setFill(doc, c.primary);
  doc.rect(x, y, w, st.headH, 'F');
  setFill(doc, c.tableFill);
  doc.rect(x, bodyTop, w, bottom - bodyTop, 'F');

  setInk(doc, c.onPrimary);
  cols.forEach((col, i) => {
    const tx = col.left ? xs[i] + pad : xs[i] + widths[i] / 2;
    const align = col.left ? 'left' : 'center';
    setFont(doc, st.headSize, st.italicHead ? 'bolditalic' : 'bold');
    fitSize(doc, col.label, widths[i] - 2 * pad, st.headSize);
    doc.text(col.label, tx, col.sub ? y + st.headH * 0.4 : y + st.headH / 2, { align, baseline: 'middle' });
    if (col.sub) {
      setFont(doc, Math.max(st.headSize * 0.42, 5), 'italic');
      doc.text(col.sub, tx, y + st.headH * 0.78, { align, baseline: 'middle' });
    }
  });

  rows.forEach((row, r) => {
    const cy = bodyTop + r * st.rowH + st.rowH / 2;
    row.forEach((cell, i) => {
      const left = cols[i].left;
      setFont(doc, st.bodySize, 'bold');
      fitSize(doc, cell, widths[i] - 2 * pad, st.bodySize);
      setInk(doc, i === 0 && st.redNames ? c.primary : c.text);
      doc.text(cell, left ? xs[i] + pad : xs[i] + widths[i] / 2, cy, { align: left ? 'left' : 'center', baseline: 'middle' });
    });
  });

  // Grid
  doc.setLineWidth(0.3);
  setStroke(doc, c.headerGridLine);
  xs.slice(1).forEach((lx) => doc.line(lx, y, lx, bodyTop));
  setStroke(doc, c.gridLine);
  xs.slice(1).forEach((lx) => doc.line(lx, bodyTop, lx, bottom));
  for (let r = 1; r < rows.length; r += 1) doc.line(x, bodyTop + r * st.rowH, x + w, bodyTop + r * st.rowH);
  doc.setLineWidth(0.6);
  setStroke(doc, c.primary);
  doc.rect(x, y, w, bottom - y, 'S');

  return bottom;
}

/** Plain filled grid table with wrapping cells (specifications). Returns the bottom y. */
function drawSpecTable(doc: jsPDF, c: Palette, x: number, y: number, w: number, rows: string[][], weights: number[], size: number) {
  const total = weights.reduce((a, b) => a + b, 0);
  const widths = weights.map((wt) => (w * wt) / total);
  const xs = widths.map((_, i) => x + widths.slice(0, i).reduce((a, b) => a + b, 0));
  const pad = 1.5;
  const lineH = size * PT * 1.2;

  setFont(doc, size, 'bold');
  doc.setLineWidth(0.3);
  setStroke(doc, c.gridLine);
  let ry = y;
  rows.forEach((row) => {
    const lines = row.map((cell, i) => doc.splitTextToSize(cell || '-', widths[i] - 2 * pad) as string[]);
    const h = Math.max(...lines.map((l) => l.length)) * lineH + 2 * pad - 0.4;
    setFill(doc, c.tableFill);
    doc.rect(x, ry, w, h, 'F');
    setInk(doc, c.text);
    lines.forEach((cellLines, i) => {
      doc.text(cellLines, xs[i] + pad, ry + pad, { baseline: 'top', lineHeightFactor: 1.2 });
      doc.rect(xs[i], ry, widths[i], h, 'S');
    });
    ry += h;
  });
  return ry;
}

/** Heading strip with a cut right corner and a folded tab. Returns the bottom y. */
function drawRibbon(doc: jsPDF, c: Palette, x: number, y: number, text: string, size: number, k: number, maxW: number) {
  setFont(doc, size, 'bold');
  const s = fitSize(doc, text, maxW - 12 * k, size);
  const h = s * PT * 1.9;
  const w = doc.getTextWidth(text) + 12 * k;
  setFill(doc, c.primary);
  polygon(doc, [[x, y], [x + w, y], [x + w - 4 * k, y + h], [x, y + h]]);
  setFill(doc, c.primaryDark);
  polygon(doc, [[x, y + h], [x + 2.5 * k, y + h], [x + 2.5 * k, y + h + 2.2 * k]]);
  setInk(doc, c.onPrimary);
  doc.text(text, x + 3 * k, y + h / 2, { baseline: 'middle' });
  return y + h;
}

/** "(01) text" list with hanging indent. Returns the bottom y. */
function drawNumbered(doc: jsPDF, c: Palette, x: number, y: number, w: number, items: string[], size: number) {
  setFont(doc, size, 'bold');
  setInk(doc, c.text);
  const lineH = size * PT * 1.4;
  const numW = doc.getTextWidth('(00)') + 1.6;
  let cy = y;
  items.forEach((item, i) => {
    const { num, body } = splitNumbered(item, i);
    const lines = doc.splitTextToSize(body, w - numW) as string[];
    // Drawn as a one-item array so it shares the body's line metrics and sits level with it.
    doc.text([`(${num})`], x, cy, { baseline: 'top', lineHeightFactor: 1.4 });
    doc.text(lines, x + numW, cy, { baseline: 'top', lineHeightFactor: 1.4 });
    cy += lines.length * lineH + 0.5;
  });
  return cy;
}

/** Room kept free at the bottom of the page for the signature line and the footer band. */
function bottomReserve(t: PdfTemplate) {
  return (t.showFooter ? FOOTER_H : 0) + (t.showSignatures && t.signatureLabels.length ? 16 : 7);
}

/** Draws the whole sheet at scale `k` on a page `pageH` tall. Returns the bottom of the content. */
function render(doc: jsPDF, p: PriceListProject, t: PdfTemplate, k: number, pageH: number, logo: Logo | null) {
  const c = palette(t);
  const L = t.labels;
  const S = t.sizes;

  setFill(doc, c.background);
  doc.rect(0, 0, PAGE_W, pageH, 'F');

  const tabX = 9;
  const tabW = 42;
  const textLeft = tabX + tabW + 4;
  const textW = PAGE_W - 5 - textLeft;
  const textX = textLeft + textW / 2;

  // Address lines shrink a little to stay on one line; past that they wrap and the band grows.
  const phones = p.contactPhones.split(/[\/,]/).map((s) => s.trim()).filter(Boolean).join(' / ');
  const infoSize = S.headerInfo;
  const infoMin = (infoSize / 9.5) * 8;
  const infoLines: Array<{ text: string; size: number }> = [];
  [
    `${L.officeLabel} : ${p.officeAddress}`,
    `${L.callLabel} : ${phones}${p.email ? `, ${L.emailLabel} : ${p.email}` : ''}`,
    `${L.siteLabel} : ${p.siteAddress}`,
  ].forEach((line) => {
    setFont(doc, infoSize, 'bold');
    const size = fitSize(doc, line, textW, infoSize, infoMin);
    if (doc.getTextWidth(line) <= textW) {
      infoLines.push({ text: line, size });
      return;
    }
    (doc.splitTextToSize(line, textW) as string[]).forEach((part) => infoLines.push({ text: part, size: infoMin }));
  });
  const infoStep = (infoSize / 9.5) * 4.6;
  const headerH = Math.max(HEADER_H, 16 + infoLines.length * infoStep);
  const tabH = headerH + 5;

  // ---- Header band with logo tab ----
  setFill(doc, c.primary);
  doc.rect(0, 0, PAGE_W, headerH, 'F');
  setFill(doc, c.onPrimary);
  polygon(doc, [[tabX, 0], [tabX + tabW, 0], [tabX + tabW, tabH], [tabX + tabW / 2, tabH - 5], [tabX, tabH]]);
  if (logo) {
    // 35 mm wide, or narrower when a tall logo would run past the tab's point.
    const maxH = tabH - 12;
    let lw = 35;
    let lh = (lw * logo.h) / logo.w;
    if (lh > maxH) {
      lh = maxH;
      lw = (lh * logo.w) / logo.h;
    }
    doc.addImage(logo.data, 'JPEG', tabX + (tabW - lw) / 2, 5, lw, lh);
  }

  setInk(doc, c.onPrimary);
  if (t.companyName) {
    setFont(doc, S.companyName, 'bold');
    fitSize(doc, t.companyName, textW, S.companyName);
    doc.text(t.companyName, textX, 9.5, { align: 'center', baseline: 'middle' });
  }

  infoLines.forEach((line, i) => {
    setFont(doc, line.size, 'bold');
    doc.text(line.text, textX, 17 + i * infoStep, { align: 'center', baseline: 'middle' });
  });

  // ---- Title row ----
  let y = headerH + 9;
  setInk(doc, c.mutedText);
  setFont(doc, S.projectName, 'bolditalic');
  fitSize(doc, p.projectName, PAGE_W - M - (tabX + tabW + 6), S.projectName);
  doc.text(p.projectName, PAGE_W - M, y, { align: 'right' });
  y += 7.5;
  setInk(doc, c.primary);
  const effective = [L.effectiveFrom, p.effectiveDate].filter(Boolean).join(' ');
  setFont(doc, S.effectiveDate, 'bolditalic');
  fitSize(doc, effective, 120, S.effectiveDate);
  doc.text(effective, PAGE_W - M, y, { align: 'right' });
  const kinds = unitKinds(p);
  setFont(doc, S.headerInfo, 'bolditalic');
  const subtitle = [L.priceListOf, kinds].filter(Boolean).join(' ');
  if (subtitle) doc.text(subtitle, M + 2, y);
  y += 3.5;

  // ---- Headline table: bungalows, or flats/shops when a project has none ----
  const unitGroups: Array<{ title: string; items: Unit[] }> = [
    { title: L.bungalowTitle, items: p.bungalows || [] },
    { title: L.flatTitle, items: p.flats || [] },
    { title: L.shopTitle, items: p.shops || [] },
  ].filter((group) => group.items.length);
  const [headline, ...otherGroups] = unitGroups;

  if (headline) {
    const { cols, rows } = unitColumns(headline.title, headline.items, t);
    y = drawUnitTable(doc, c, M, y, PAGE_W - 2 * M, cols, rows, {
      headH: 14 * k,
      rowH: 11 * k,
      headSize: S.headlineTable * k,
      bodySize: S.headlineTable * k,
      italicHead: true,
      redNames: true,
    });
  }
  y += 7 * k;

  // ---- Two columns ----
  const leftX = M;
  const leftW = 112;
  const rightX = leftX + leftW + 6;
  const rightW = PAGE_W - M - rightX;
  let ly = y;
  let ry = y;

  const smallTable: TableStyle = {
    headH: 10 * k,
    rowH: 8 * k,
    headSize: S.smallTable * k,
    bodySize: (S.smallTable / 11) * 10.5 * k,
  };
  const ribbonSize = S.ribbon * k;
  const listSize = S.list * k;
  const specSize = S.specTable * k;

  const left: Record<PdfTemplate['leftSections'][number], () => void> = {
    otherUnits() {
      otherGroups.forEach((group) => {
        const { cols, rows } = unitColumns(group.title, group.items, t);
        ly = drawUnitTable(doc, c, leftX, ly, leftW, cols, rows, smallTable) + 6 * k;
      });
    },
    parking() {
      if (!p.parking?.length) return;
      const cols: Col[] = [
        { label: L.parkingTitle, weight: 1.6, left: true },
        { label: L.sizeColumn, weight: 1 },
        { label: L.priceColumn, weight: 1 },
      ];
      const rows = p.parking.map((item) => [
        item.name,
        item.size || '-',
        typeof item.price === 'number' ? (item.price as number).toLocaleString('en-IN') : item.price || '-',
      ]);
      ly = drawUnitTable(doc, c, leftX, ly, leftW, cols, rows, smallTable) + 6 * k;
    },
    specifications() {
      if (!p.specifications?.length) return;
      ly = drawRibbon(doc, c, leftX, ly, L.specificationHeading, (S.ribbon / 11) * 12 * k, k, leftW) + 3 * k;
      const indent = 4 * k;
      // Flat-only projects list a single specification; drop the empty Luxury column then.
      const specs: PriceListSpec[] = p.specifications;
      const twoGrades = specs.some((s) => s.luxury);
      const rows = twoGrades
        ? [[L.particularColumn, L.deluxeColumn, L.luxuryColumn], ...specs.map((s) => [s.particular, s.deluxe || '-', s.luxury || '-'])]
        : [[L.particularColumn, L.specificationColumn], ...specs.map((s) => [s.particular, s.deluxe || '-'])];
      ly = drawSpecTable(doc, c, leftX + indent, ly, leftW - indent, rows, twoGrades ? [1, 1.3, 1.6] : [1, 2], specSize);

      if (p.specificationNote) {
        const pad = 2 * k;
        const noteSize = (S.specTable / 7) * 7.8 * k;
        setFont(doc, noteSize, 'bold');
        const lines = doc.splitTextToSize(p.specificationNote, leftW - indent - 2 * pad) as string[];
        const h = lines.length * noteSize * PT * 1.35 + 2 * pad;
        setFill(doc, c.primary);
        doc.rect(leftX + indent, ly + 1.5 * k, leftW - indent, h, 'F');
        setInk(doc, c.onPrimary);
        doc.text(lines, leftX + indent + pad, ly + 1.5 * k + pad, { baseline: 'top', lineHeightFactor: 1.35 });
        ly += 1.5 * k + h;
      }
      ly += 5 * k;
    },
  };

  const right: Record<PdfTemplate['rightSections'][number], () => void> = {
    paymentSchedules() {
      p.paymentSchedules.forEach((schedule) => {
        ry = drawRibbon(doc, c, rightX, ry, schedule.title, ribbonSize, k, rightW) + 2.8 * k;
        ry = drawNumbered(doc, c, rightX + 3 * k, ry, rightW - 3 * k, schedule.steps, listSize) + 3.5 * k;
      });
    },
    notes() {
      if (!p.notes?.length) return;
      ry = drawRibbon(doc, c, rightX, ry, L.notesHeading, ribbonSize, k, rightW) + 2.8 * k;
      ry = drawNumbered(doc, c, rightX + 3 * k, ry, rightW - 3 * k, p.notes, listSize) + 3.5 * k;
    },
    shopSpecifications() {
      if (!p.shopSpecifications?.length) return;
      ry = drawRibbon(doc, c, rightX, ry, L.shopSpecificationHeading, ribbonSize, k, rightW) + 2.8 * k;
      const rows = p.shopSpecifications.map((s) => [s.particular, s.deluxe || s.luxury || '-']);
      ry = drawSpecTable(doc, c, rightX + 3 * k, ry, rightW - 3 * k, rows, [1, 1.5], specSize) + 4 * k;
    },
    bookingStatus() {
      if (!p.bookingStatus) return;
      const size = S.bookingStatus * k;
      setFont(doc, size, 'bolditalic');
      setInk(doc, c.primary);
      const tw = doc.getTextWidth(p.bookingStatus);
      ry += size * PT + 2 * k;
      doc.text(p.bookingStatus, PAGE_W - M - tw, ry, { angle: 5 });
      ry += 3 * k;
    },
  };

  t.leftSections.forEach((section) => left[section]());
  t.rightSections.forEach((section) => right[section]());

  const contentBottom = Math.max(ly, ry);

  // ---- Signatures and footer band, pinned to the page bottom ----
  const bandTop = t.showFooter ? pageH - FOOTER_H : pageH;
  if (t.showSignatures && t.signatureLabels.length) {
    setInk(doc, c.text);
    setFont(doc, 6.5, 'bold');
    const signY = bandTop - 9;
    const step = t.signatureLabels.length > 3 ? (PAGE_W - 2 * M - 8) / t.signatureLabels.length : 44;
    t.signatureLabels.forEach((label, i) => {
      doc.text(label, leftX + 4 + i * step, signY);
    });
  }

  if (t.showFooter) {
    setFill(doc, c.primary);
    doc.rect(0, bandTop, PAGE_W, FOOTER_H, 'F');
    polygon(doc, [[146, bandTop], [153, bandTop - 6], [PAGE_W, bandTop - 6], [PAGE_W, bandTop]]);
    setInk(doc, c.onPrimary);
    const contact = [[L.footerContactLabel, t.helpline].filter(Boolean).join(' '), t.website].filter(Boolean).join('    |    ');
    if (contact) {
      setFont(doc, S.footer, 'bold');
      fitSize(doc, contact, 138, S.footer);
      doc.text(contact, 70, bandTop + 4.8, { align: 'center', baseline: 'middle' });
    }
    const message = p.footerMessage || L.defaultFooterMessage;
    if (message) {
      const size = (S.footer / 12.5) * 17;
      setFont(doc, size, 'bolditalic', 'times');
      fitSize(doc, message, 60, size);
      doc.text(message, 178, bandTop + 1.2, { align: 'center', baseline: 'middle' });
    }
  }

  return contentBottom;
}

const logoCache = new Map<string, Promise<Logo>>();

/** The logo as a JPEG on white (jsPDF cannot embed WebP), cached per URL. */
function loadLogo(src: string): Promise<Logo> {
  let pending = logoCache.get(src);
  if (!pending) {
    pending = (async () => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      return { data: canvas.toDataURL('image/jpeg', 0.92), w: canvas.width, h: canvas.height };
    })();
    pending.catch(() => logoCache.delete(src));
    logoCache.set(src, pending);
  }
  return pending;
}

/**
 * Builds the PDF for one project. One A4 page; long lists shrink down to the design's
 * minimum scale, then the page grows (or, when the design keeps A4, shrinks further).
 */
export async function buildPriceListPdf(p: PriceListProject, template: PdfTemplate = DEFAULT_PDF_TEMPLATE) {
  const t = template;
  const logo = t.showLogo && t.logoUrl ? await loadLogo(t.logoUrl).catch(() => null) : null;
  const reserve = bottomReserve(t);
  const floor = t.allowTallPage ? t.minScale : HARD_MIN_SCALE;

  let k = 1;
  let bottom = 0;
  for (;;) {
    bottom = render(new jsPDF({ unit: 'mm', format: 'a4' }), p, t, k, A4_H, null);
    if (bottom <= A4_H - reserve || k <= floor) break;
    k = Math.max(floor, Math.round((k - 0.05) * 100) / 100);
  }

  const pageH = t.allowTallPage ? Math.max(A4_H, Math.ceil(bottom + reserve)) : A4_H;
  const doc = new jsPDF({ unit: 'mm', format: pageH === A4_H ? 'a4' : [PAGE_W, pageH], orientation: 'portrait' });
  render(doc, p, t, k, pageH, logo);
  doc.setProperties({ title: `${p.projectName} Price List`, author: t.author, subject: `Effective ${p.effectiveDate}` });
  return doc;
}

export function priceListFileName(p: PriceListProject, template: PdfTemplate = DEFAULT_PDF_TEMPLATE) {
  return `${(template.fileName || DEFAULT_PDF_TEMPLATE.fileName).replace('{slug}', p.slug || 'price-list')}.pdf`;
}

export async function downloadPriceListPdf(p: PriceListProject, template: PdfTemplate = DEFAULT_PDF_TEMPLATE) {
  const doc = await buildPriceListPdf(p, template);
  doc.save(priceListFileName(p, template));
}

/** An object URL for showing the PDF in an iframe. The caller revokes it. */
export async function priceListPdfUrl(p: PriceListProject, template: PdfTemplate = DEFAULT_PDF_TEMPLATE) {
  const doc = await buildPriceListPdf(p, template);
  return URL.createObjectURL(doc.output('blob'));
}
