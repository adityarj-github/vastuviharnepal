'use client';

import { useState } from 'react';
import { SHARED_FIELD_NAMES, SHARED_FIELDS, type SharedField } from '@/lib/priceListTypes';
import styles from './PriceLists.module.css';

/** What the bulk 'edit' action changes; only the keys present are applied. */
export type BulkEditFields = {
  effectiveDate?: string;
  bookingStatus?: string;
  activeFrom?: string | null;
  activeUntil?: string | null;
  useCity?: Partial<Record<SharedField, boolean>>;
};

type CityChoice = 'keep' | 'city' | 'own';

/** Changes the same fields on every selected price list. */
export default function BulkEditForm({ count, busy, onApply, onClose }: { count: number; busy: boolean; onApply: (fields: BulkEditFields) => void; onClose: () => void }) {
  const [on, setOn] = useState({ effectiveDate: false, bookingStatus: false, activeFrom: false, activeUntil: false });
  const [values, setValues] = useState({ effectiveDate: '', bookingStatus: '', activeFrom: '', activeUntil: '' });
  const [cityChoice, setCityChoice] = useState<Record<SharedField, CityChoice>>(
    Object.fromEntries(SHARED_FIELDS.map((field) => [field, 'keep'])) as Record<SharedField, CityChoice>,
  );

  const toggle = (key: keyof typeof on) => setOn((current) => ({ ...current, [key]: !current[key] }));
  const value = (key: keyof typeof values, v: string) => setValues((current) => ({ ...current, [key]: v }));

  const fields: BulkEditFields = {
    ...(on.effectiveDate ? { effectiveDate: values.effectiveDate } : {}),
    ...(on.bookingStatus ? { bookingStatus: values.bookingStatus } : {}),
    ...(on.activeFrom ? { activeFrom: values.activeFrom || null } : {}),
    ...(on.activeUntil ? { activeUntil: values.activeUntil || null } : {}),
  };
  const useCity = Object.fromEntries(
    SHARED_FIELDS.filter((field) => cityChoice[field] !== 'keep').map((field) => [field, cityChoice[field] === 'city']),
  ) as Partial<Record<SharedField, boolean>>;
  if (Object.keys(useCity).length) fields.useCity = useCity;
  const nothing = Object.keys(fields).length === 0;

  const row = (key: keyof typeof on, label: string, input: React.ReactNode, hint?: string) => (
    <div className={styles.bulkField}>
      <label className={styles.check}>
        <input type="checkbox" checked={on[key]} onChange={() => toggle(key)} />
        {label}
      </label>
      {on[key] ? input : null}
      {on[key] && hint ? <span className={styles.slug}>{hint}</span> : null}
    </div>
  );

  return (
    <div className={styles.detailsPanel}>
      <p className={styles.subheading}>Change {count} selected price {count === 1 ? 'list' : 'lists'}</p>
      <p className={styles.hint}>Tick what to change. Everything else on these lists stays as it is. If any list can&apos;t take the change, nothing is saved.</p>
      <div className={styles.grid2}>
        {row(
          'effectiveDate',
          'Effective date',
          <input className={styles.cellInput} aria-label="New effective date" placeholder="1 Apr. 2027 to 30 Sep. 2027" value={values.effectiveDate} onChange={(e) => value('effectiveDate', e.target.value)} />,
        )}
        {row(
          'bookingStatus',
          'Booking status stamp',
          <input className={styles.cellInput} aria-label="New booking status" placeholder="Booking Open" value={values.bookingStatus} onChange={(e) => value('bookingStatus', e.target.value)} />,
          'Leave blank to remove the stamp.',
        )}
        {row(
          'activeFrom',
          'Active from',
          <input type="date" className={styles.cellInput} aria-label="New active from date" value={values.activeFrom} onChange={(e) => value('activeFrom', e.target.value)} />,
          'Leave blank to clear the date.',
        )}
        {row(
          'activeUntil',
          'Active until',
          <input type="date" className={styles.cellInput} aria-label="New active until date" value={values.activeUntil} onChange={(e) => value('activeUntil', e.target.value)} />,
          'Leave blank to clear the date.',
        )}
      </div>

      <p className={styles.subheading}>Shared city details</p>
      <div className={styles.grid2}>
        {SHARED_FIELDS.map((field) => (
          <label key={field} className={styles.field}>
            {SHARED_FIELD_NAMES[field]}
            <select className={styles.cellInput} value={cityChoice[field]} onChange={(e) => setCityChoice((c) => ({ ...c, [field]: e.target.value as CityChoice }))}>
              <option value="keep">No change</option>
              <option value="city">Same as the list&apos;s city</option>
              <option value="own">Each list&apos;s own value</option>
            </select>
          </label>
        ))}
      </div>

      <div className={styles.toolbarGroup}>
        <button type="button" className={styles.primary} disabled={busy || nothing} onClick={() => onApply(fields)}>
          Apply to {count} {count === 1 ? 'list' : 'lists'}
        </button>
        <button type="button" className={styles.secondary} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
