'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  applyCityDetails,
  cityHas,
  formatScheduleDate,
  priceListStatus,
  resolveCitySlug,
  slugify,
  statesInOrder,
  STATUS_NAMES,
  type PdfTemplate,
  type PriceListCity,
  type SharedField,
  type PriceListParking,
  type PriceListProject,
  type PriceListSpec,
  type PriceListUnit,
} from '@/lib/priceListTypes';
import PdfDesignForm from './PdfDesignForm';
import PdfPreview from './PdfPreview';
import styles from './PriceLists.module.css';

/** The editor keeps every list present (possibly empty) so inputs stay controlled. */
type Form = Required<
  Pick<
    PriceListProject,
    | 'bungalows'
    | 'flats'
    | 'shops'
    | 'parking'
    | 'paymentSchedules'
    | 'specifications'
    | 'shopSpecifications'
    | 'notes'
  >
> &
  Omit<PriceListProject, 'bungalows' | 'flats' | 'shops' | 'parking' | 'paymentSchedules' | 'specifications' | 'shopSpecifications' | 'notes'>;

export type EditorTarget = {
  project: PriceListProject;
  isNew: boolean;
  isBuiltIn: boolean;
  isPublished: boolean;
  activeFrom: string | null;
  activeUntil: string | null;
  pdfDesign: PdfTemplate | null;
};

/** "(01) Booking amount" → "Booking amount". The PDF and the page number the lines. */
const stripNumber = (line: string) => line.replace(/^\(?\(?\d+\)\s*/, '');

/** Older lists name their city as text; the form always works with the city slug. */
function toForm(p: PriceListProject, cities: PriceListCity[]): Form {
  const { state: _state, city: _city, ...rest } = p;
  return {
    ...rest,
    citySlug: resolveCitySlug(p, cities) ?? undefined,
    bungalows: p.bungalows || [],
    flats: p.flats || [],
    shops: p.shops || [],
    parking: (p.parking || []).map((item) => ({ ...item, price: item.price == null ? undefined : String(item.price) })),
    paymentSchedules: (p.paymentSchedules || []).map((s) => ({ title: s.title, steps: s.steps.map(stripNumber) })),
    specifications: p.specifications || [],
    shopSpecifications: p.shopSpecifications || [],
    notes: (p.notes || []).map(stripNumber),
  };
}

/** The form as the PDF and the API see it: blank lines and rows dropped. */
function toProject(f: Form): PriceListProject {
  const lines = (items: string[]) => items.map((line) => line.trim()).filter(Boolean);
  return {
    ...f,
    bungalows: f.bungalows.filter((u) => u.name.trim()),
    flats: f.flats.filter((u) => u.name.trim()),
    shops: f.shops.filter((u) => u.name.trim()),
    parking: f.parking.filter((p) => p.name.trim()),
    paymentSchedules: f.paymentSchedules.map((s) => ({ title: s.title, steps: lines(s.steps) })).filter((s) => s.title || s.steps.length),
    specifications: f.specifications.filter((s) => s.particular.trim()),
    shopSpecifications: f.shopSpecifications.filter((s) => s.particular.trim()),
    notes: lines(f.notes),
  };
}

function move<T>(items: T[], index: number, by: number) {
  const next = [...items];
  const [item] = next.splice(index, 1);
  next.splice(index + by, 0, item);
  return next;
}

function RowButtons({ index, count, onMove, onRemove }: { index: number; count: number; onMove: (by: number) => void; onRemove: () => void }) {
  return (
    <span className={styles.rowButtons}>
      <button type="button" className={styles.iconButton} disabled={index === 0} onClick={() => onMove(-1)} aria-label="Move up">
        ↑
      </button>
      <button type="button" className={styles.iconButton} disabled={index === count - 1} onClick={() => onMove(1)} aria-label="Move down">
        ↓
      </button>
      <button type="button" className={styles.iconButton} onClick={onRemove} aria-label="Remove row">
        ✕
      </button>
    </span>
  );
}

type Column<T> = { key: keyof T & string; label: string; wide?: boolean; placeholder?: string };

/** Editable grid of rows with add, remove and reorder. */
function RowsEditor<T extends Record<string, unknown>>({
  rows,
  columns,
  blank,
  addLabel,
  onChange,
}: {
  rows: T[];
  columns: Column<T>[];
  blank: T;
  addLabel: string;
  onChange: (rows: T[]) => void;
}) {
  return (
    <div>
      {rows.length ? (
        <div className={styles.rowsScroll}>
          <table className={styles.rowsTable}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th aria-label="Row actions" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      <input
                        className={`${styles.cellInput} ${col.wide ? styles.wideCell : ''}`}
                        aria-label={`${col.label}, row ${index + 1}`}
                        placeholder={col.placeholder}
                        value={(row[col.key] as string | undefined) ?? ''}
                        onChange={(e) => {
                          const next = [...rows];
                          next[index] = { ...row, [col.key]: e.target.value || undefined };
                          if (col.key === columns[0].key) next[index] = { ...next[index], [col.key]: e.target.value };
                          onChange(next);
                        }}
                      />
                    </td>
                  ))}
                  <td>
                    <RowButtons
                      index={index}
                      count={rows.length}
                      onMove={(by) => onChange(move(rows, index, by))}
                      onRemove={() => onChange(rows.filter((_, i) => i !== index))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <button type="button" className={styles.small} onClick={() => onChange([...rows, { ...blank }])}>
        + {addLabel}
      </button>
    </div>
  );
}

const UNIT_COLUMNS: Column<PriceListUnit>[] = [
  { key: 'name', label: 'Name', wide: true, placeholder: 'Kaveri 4 BHK' },
  { key: 'model', label: 'Model' },
  { key: 'carpetArea', label: 'Carpet (sq.ft.)' },
  { key: 'builtUpArea', label: 'Built-up (sq.ft.)' },
  { key: 'landArea', label: 'Land (sq.ft.)' },
  { key: 'deluxePrice', label: 'Deluxe / price', placeholder: '56,50,000' },
  { key: 'luxuryPrice', label: 'Luxury price' },
];

const SPEC_COLUMNS: Column<PriceListSpec>[] = [
  { key: 'particular', label: 'Particular', placeholder: 'Flooring' },
  { key: 'deluxe', label: 'Deluxe (or the only grade)', wide: true },
  { key: 'luxury', label: 'Luxury', wide: true },
];

const SHOP_SPEC_COLUMNS: Column<PriceListSpec>[] = [
  { key: 'particular', label: 'Particular' },
  { key: 'deluxe', label: 'Specification', wide: true },
];

const PARKING_COLUMNS: Column<PriceListParking>[] = [
  { key: 'name', label: 'Type', wide: true, placeholder: 'Car parking' },
  { key: 'size', label: 'Size' },
  { key: 'price', label: 'Price' },
];

/** One line per item; numbering is added in the PDF and on the page. */
function LinesField({ label, value, onChange, rows = 4 }: { label: string; value: string[]; onChange: (v: string[]) => void; rows?: number }) {
  return (
    <label className={styles.field}>
      {label}
      <textarea rows={rows} value={value.join('\n')} onChange={(e) => onChange(e.target.value.split('\n'))} />
    </label>
  );
}

export default function PriceListEditor({
  target,
  sharedTemplate,
  cities,
  onSaved,
  onCancel,
}: {
  target: EditorTarget;
  sharedTemplate: PdfTemplate;
  cities: PriceListCity[];
  onSaved: (message: string) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Form>(() => toForm(target.project, cities));
  const chosenCity = cities.find((city) => city.slug === form.citySlug);
  const [isPublished, setIsPublished] = useState(target.isPublished);
  const [activeFrom, setActiveFrom] = useState(target.activeFrom || '');
  const [activeUntil, setActiveUntil] = useState(target.activeUntil || '');
  const [ownDesign, setOwnDesign] = useState<PdfTemplate | null>(target.pdfDesign);
  const [slugTouched, setSlugTouched] = useState(!target.isNew || Boolean(target.project.slug));
  const [dirty, setDirty] = useState(false);

  // Refreshing or closing the tab with unsaved changes asks first.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (patch: Partial<Form>) => {
    setForm((current) => {
      const next = { ...current, ...patch };
      if (target.isNew && !slugTouched && patch.projectName !== undefined) next.slug = slugify(patch.projectName);
      return next;
    });
    setDirty(true);
  };

  const project = useMemo(() => toProject(form), [form]);
  const previewProject = useMemo(() => applyCityDetails(project, chosenCity), [project, chosenCity]);
  const liveStatus = priceListStatus({ isPublished, isDeleted: false, activeFrom: activeFrom || null, activeUntil: activeUntil || null });
  const previewTemplate = ownDesign ?? sharedTemplate;

  async function save() {
    setSaving(true);
    setError('');
    try {
      const url = target.isNew ? '/api/admin/price-lists' : `/api/admin/price-lists/${encodeURIComponent(target.project.slug)}`;
      const response = await fetch(url, {
        method: target.isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project, isPublished, activeFrom: activeFrom || null, activeUntil: activeUntil || null, pdfDesign: ownDesign }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Could not save the price list.');
      setDirty(false);
      onSaved(target.isNew ? `Created "${project.projectName}".` : `Saved "${project.projectName}".`);
    } catch (err) {
      setError((err as Error).message);
    }
    setSaving(false);
  }

  function cancel() {
    if (dirty && !confirm('Discard your unsaved changes?')) return;
    onCancel();
  }

  const text = (key: keyof Form, label: string, props: { placeholder?: string; type?: string } = {}) => (
    <label className={styles.field}>
      {label}
      <input
        type={props.type || 'text'}
        placeholder={props.placeholder}
        value={(form[key] as string | undefined) ?? ''}
        onChange={(e) => update({ [key]: e.target.value } as Partial<Form>)}
      />
    </label>
  );

  // ---- Details shared with the city ----
  const usesCity = (field: SharedField) => (form.useCityDetails || []).includes(field);
  const cityOffers = (field: SharedField) => Boolean(chosenCity && cityHas(chosenCity.details, field));
  /** Showing the city's value: ticked, and the city has one. */
  const fromCity = (field: SharedField) => usesCity(field) && cityOffers(field);
  const setUsesCity = (field: SharedField, on: boolean) => {
    const current = new Set(form.useCityDetails || []);
    if (on) current.add(field);
    else current.delete(field);
    update({ useCityDetails: current.size ? [...current] : undefined });
  };

  const sameAsCity = (field: SharedField) =>
    chosenCity && (cityOffers(field) || usesCity(field)) ? (
      <label className={styles.sameAs}>
        <input type="checkbox" checked={usesCity(field)} onChange={(e) => setUsesCity(field, e.target.checked)} />
        Same as {chosenCity.name}
      </label>
    ) : null;

  const missingNote = (field: SharedField) =>
    usesCity(field) && !cityOffers(field) ? (
      <span className={styles.slug}>{chosenCity ? `${chosenCity.name} has no value for this yet, so this list's own is used.` : 'Choose a city to use its details.'}</span>
    ) : null;

  /** A text field that can come from the city instead. */
  const shared = (field: Exclude<SharedField, 'notes'>, label: string, props: { placeholder?: string; type?: string } = {}) => (
    <div className={styles.field}>
      <span className={styles.fieldHead}>
        <span>{label}</span>
        {sameAsCity(field)}
      </span>
      <input
        type={props.type || 'text'}
        aria-label={label}
        placeholder={props.placeholder}
        disabled={fromCity(field)}
        value={fromCity(field) ? String(chosenCity?.details[field] ?? '') : ((form[field] as string | undefined) ?? '')}
        onChange={(e) => update({ [field]: e.target.value } as Partial<Form>)}
      />
      {missingNote(field)}
    </div>
  );

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <h2 className={styles.title}>{target.isNew ? 'New price list' : `Edit: ${target.project.projectName}`}</h2>
        <div className={styles.toolbarGroup}>
          {!target.isNew ? (
            <a className={styles.secondary} href={`/price-list/${target.project.slug}/`} target="_blank" rel="noreferrer">
              View page ↗
            </a>
          ) : null}
          <button type="button" className={styles.secondary} onClick={cancel}>
            Back to list
          </button>
        </div>
      </div>

      <div className={styles.editorLayout}>
        <div className={styles.editorForm}>
          <details className={styles.section} open>
            <summary>Project details</summary>
            <div className={styles.sectionBody}>
              <div className={styles.grid2}>
                {text('projectName', 'Project name *', { placeholder: 'Ara Phase-2 Extension' })}
                <label className={styles.field}>
                  URL slug *
                  <input
                    value={form.slug}
                    disabled={!target.isNew}
                    onChange={(e) => {
                      setSlugTouched(true);
                      update({ slug: e.target.value.toLowerCase() });
                    }}
                  />
                </label>
                {text('effectiveDate', 'Effective date *', { placeholder: '16 Oct. 2026 to 31 Mar. 2027' })}
                {text('bookingStatus', 'Booking status stamp', { placeholder: 'Booking Open' })}
                {shared('contactPhones', 'Contact phones *', { placeholder: '8102921821 / 7488049821' })}
                {shared('email', 'Email', { type: 'email' })}
              </div>
              {target.isNew ? null : <p className={styles.hint}>The URL can&apos;t change once a list exists. Duplicate the list to publish it at a new URL.</p>}
              {shared('officeAddress', 'Office address *')}
              {shared('siteAddress', 'Site address *')}
              {shared('footerMessage', 'Footer message (blank uses the design default)', { placeholder: 'Thanks For Visit' })}
              {chosenCity && Object.keys(chosenCity.details).length ? (
                <p className={styles.hint}>
                  Ticked fields show {chosenCity.name}&apos;s shared details (set under Cities), so changing them there updates every phase that uses
                  them. Untick a field to give this list its own value.
                </p>
              ) : chosenCity ? (
                <p className={styles.hint}>
                  {chosenCity.name} has no shared details yet. Add them under Cities to fill phases in once.
                </p>
              ) : null}
            </div>
          </details>

          <details className={styles.section} open>
            <summary>Status &amp; schedule</summary>
            <div className={styles.sectionBody}>
              <label className={styles.switchRow}>
                <span
                  role="switch"
                  tabIndex={0}
                  aria-checked={isPublished}
                  aria-label="Active"
                  className={`${styles.switch} ${isPublished ? styles.switchOn : ''}`}
                  onClick={() => {
                    setIsPublished(!isPublished);
                    setDirty(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      setIsPublished(!isPublished);
                      setDirty(true);
                    }
                  }}
                />
                <span>{isPublished ? 'Active: shown on the website' : 'Inactive: hidden from the website'}</span>
              </label>
              <div className={styles.grid2}>
                <label className={styles.field}>
                  Active from (optional)
                  <input
                    type="date"
                    value={activeFrom}
                    max={activeUntil || undefined}
                    onChange={(e) => {
                      setActiveFrom(e.target.value);
                      setDirty(true);
                    }}
                  />
                </label>
                <label className={styles.field}>
                  Active until (optional, includes that day)
                  <input
                    type="date"
                    value={activeUntil}
                    min={activeFrom || undefined}
                    onChange={(e) => {
                      setActiveUntil(e.target.value);
                      setDirty(true);
                    }}
                  />
                </label>
              </div>
              <p className={styles.hint}>
                Now: <strong>{STATUS_NAMES[liveStatus]}</strong>
                {liveStatus === 'scheduled' && activeFrom ? ` (goes live on ${formatScheduleDate(activeFrom)})` : ''}
                {liveStatus === 'expired' && activeUntil ? ` (ended after ${formatScheduleDate(activeUntil)}; change the date to show it again)` : ''}
                {liveStatus === 'active' && activeUntil ? ` (until ${formatScheduleDate(activeUntil)})` : ''}
                . Dates follow India time. Leave both blank to keep the list active until you switch it off.
              </p>
            </div>
          </details>

          <details className={styles.section} open>
            <summary>Where it appears on /price-list</summary>
            <div className={styles.sectionBody}>
              <div className={styles.grid2}>
                <label className={styles.field}>
                  City
                  <select
                    value={form.citySlug || ''}
                    onChange={(e) => {
                      const citySlug = e.target.value || undefined;
                      const city = cities.find((c) => c.slug === citySlug);
                      if (target.isNew && city) {
                        const empty = (field: SharedField) => {
                          const own = form[field];
                          return Array.isArray(own) ? own.length === 0 : !own;
                        };
                        const fields = (['officeAddress', 'siteAddress', 'contactPhones', 'email', 'footerMessage', 'notes'] as SharedField[]).filter(
                          (field) => cityHas(city.details, field) && (empty(field) || usesCity(field)),
                        );
                        update({ citySlug, useCityDetails: fields.length ? fields : undefined });
                      } else {
                        update({ citySlug });
                      }
                    }}
                  >
                    <option value="">Not on the index (link only)</option>
                    {statesInOrder(cities).map((state) => (
                      <optgroup key={state} label={state}>
                        {cities
                          .filter((city) => city.state === state)
                          .map((city) => (
                            <option key={city.slug} value={city.slug}>
                              {city.name}
                              {city.isActive ? '' : ' (city switched off)'}
                            </option>
                          ))}
                      </optgroup>
                    ))}
                  </select>
                </label>
                {text('phaseLabel', 'Button label under the city', { placeholder: 'Phase 02 Ext' })}
              </div>
              {chosenCity && !chosenCity.isActive ? (
                <p className={styles.hint}>{chosenCity.name} is switched off, so it is hidden on the index. Switch it on under Cities.</p>
              ) : null}
              <p className={styles.hint}>
                A missing city? Add it under <strong>Cities</strong> on the price list screen. Without a city the list stays reachable by its link.
              </p>
            </div>
          </details>

          <details className={styles.section} open>
            <summary>Units &amp; prices</summary>
            <div className={styles.sectionBody}>
              <p className={styles.hint}>
                Columns left empty in every row are hidden. Prices are written as shown (for example 56,50,000). The first table with rows is the
                big headline table in the PDF.
              </p>
              <p className={styles.subheading}>Bungalows</p>
              <RowsEditor rows={form.bungalows} columns={UNIT_COLUMNS} blank={{ name: '' }} addLabel="Add bungalow" onChange={(v) => update({ bungalows: v })} />
              <p className={styles.subheading}>Flats</p>
              <RowsEditor rows={form.flats} columns={UNIT_COLUMNS} blank={{ name: '' }} addLabel="Add flat" onChange={(v) => update({ flats: v })} />
              <p className={styles.subheading}>Shops</p>
              <RowsEditor rows={form.shops} columns={UNIT_COLUMNS} blank={{ name: '' }} addLabel="Add shop" onChange={(v) => update({ shops: v })} />
              <p className={styles.subheading}>Parking</p>
              <RowsEditor rows={form.parking} columns={PARKING_COLUMNS} blank={{ name: '' }} addLabel="Add parking" onChange={(v) => update({ parking: v })} />
            </div>
          </details>

          <details className={styles.section} open>
            <summary>Payment schedules</summary>
            <div className={styles.sectionBody}>
              {form.paymentSchedules.map((schedule, index) => (
                <div key={index} className={styles.schedule}>
                  <div className={styles.toolbar}>
                    <label className={styles.field} style={{ flex: 1 }}>
                      Title
                      <input
                        value={schedule.title}
                        placeholder="Payment Schedule for Bungalow"
                        onChange={(e) => {
                          const next = [...form.paymentSchedules];
                          next[index] = { ...schedule, title: e.target.value };
                          update({ paymentSchedules: next });
                        }}
                      />
                    </label>
                    <RowButtons
                      index={index}
                      count={form.paymentSchedules.length}
                      onMove={(by) => update({ paymentSchedules: move(form.paymentSchedules, index, by) })}
                      onRemove={() => update({ paymentSchedules: form.paymentSchedules.filter((_, i) => i !== index) })}
                    />
                  </div>
                  <LinesField
                    label="Steps, one per line (numbered automatically)"
                    value={schedule.steps}
                    rows={Math.max(4, schedule.steps.length + 1)}
                    onChange={(steps) => {
                      const next = [...form.paymentSchedules];
                      next[index] = { ...schedule, steps };
                      update({ paymentSchedules: next });
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                className={styles.small}
                onClick={() => update({ paymentSchedules: [...form.paymentSchedules, { title: '', steps: [] }] })}
              >
                + Add payment schedule
              </button>
            </div>
          </details>

          <details className={styles.section}>
            <summary>Specifications</summary>
            <div className={styles.sectionBody}>
              <p className={styles.hint}>Fill only the first grade column for a single-grade list. The Luxury column is then hidden.</p>
              <RowsEditor
                rows={form.specifications}
                columns={SPEC_COLUMNS}
                blank={{ particular: '' }}
                addLabel="Add specification"
                onChange={(v) => update({ specifications: v })}
              />
              <label className={styles.field}>
                Specification note (highlighted box under the table)
                <textarea value={form.specificationNote || ''} onChange={(e) => update({ specificationNote: e.target.value })} />
              </label>
              <p className={styles.subheading}>Shop specification</p>
              <RowsEditor
                rows={form.shopSpecifications}
                columns={SHOP_SPEC_COLUMNS}
                blank={{ particular: '' }}
                addLabel="Add shop specification"
                onChange={(v) => update({ shopSpecifications: v })}
              />
            </div>
          </details>

          <details className={styles.section} open>
            <summary>Notes &amp; terms</summary>
            <div className={styles.sectionBody}>
              {sameAsCity('notes')}
              {fromCity('notes') ? (
                <label className={styles.field}>
                  {chosenCity?.name}&apos;s notes (edit them under Cities)
                  <textarea rows={Math.max(5, (chosenCity?.details.notes || []).length + 1)} value={(chosenCity?.details.notes || []).join('\n')} disabled />
                </label>
              ) : (
                <LinesField label="One note per line (numbered automatically)" value={form.notes} rows={Math.max(5, form.notes.length + 1)} onChange={(notes) => update({ notes })} />
              )}
              {missingNote('notes')}
            </div>
          </details>

          <details className={styles.section} open={Boolean(ownDesign)}>
            <summary>PDF design for this list</summary>
            <div className={styles.sectionBody}>
              <label className={styles.check}>
                <input
                  type="radio"
                  name="design-mode"
                  checked={!ownDesign}
                  onChange={() => {
                    setOwnDesign(null);
                    setDirty(true);
                  }}
                />
                Use the shared PDF design
              </label>
              <label className={styles.check}>
                <input
                  type="radio"
                  name="design-mode"
                  checked={Boolean(ownDesign)}
                  onChange={() => {
                    setOwnDesign({ ...sharedTemplate });
                    setDirty(true);
                  }}
                />
                Give this list its own design (starts as a copy of the shared one)
              </label>
              {ownDesign ? (
                <PdfDesignForm
                  value={ownDesign}
                  open={false}
                  onChange={(next) => {
                    setOwnDesign(next);
                    setDirty(true);
                  }}
                />
              ) : null}
            </div>
          </details>

          <div className={styles.stickyBar}>
            <span className={styles.hint}>{dirty ? 'Unsaved changes' : 'No unsaved changes'}</span>
            <div className={styles.toolbarGroup}>
              <button type="button" className={styles.secondary} onClick={cancel} disabled={saving}>
                Cancel
              </button>
              <button type="button" className={styles.primary} onClick={save} disabled={saving}>
                {saving ? 'Saving…' : target.isNew ? 'Create price list' : 'Save changes'}
              </button>
            </div>
          </div>
          {error ? (
            <p role="alert" className={`${styles.message} ${styles.error}`}>
              {error}
            </p>
          ) : null}
        </div>

        <div className={styles.previewColumn}>
          <PdfPreview project={previewProject} template={previewTemplate} />
        </div>
      </div>
    </div>
  );
}
