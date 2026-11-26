'use client';

import { useState } from 'react';
import { SHARED_FIELD_NAMES, type CityDetails, type PriceListProject } from '@/lib/priceListTypes';
import { api } from './adminApi';
import styles from './PriceLists.module.css';

type Props = {
  cityName: string;
  initial: CityDetails;
  /** The city's price lists, to copy details from. */
  lists: Array<{ slug: string; projectName: string }>;
  /** How many of its lists already take something from these details. */
  sharingCount: number;
  busy: boolean;
  onSave: (details: CityDetails) => Promise<boolean>;
  onClose: () => void;
};

const TEXT_FIELDS = ['officeAddress', 'siteAddress', 'contactPhones', 'email', 'footerMessage'] as const;
const stripNumber = (line: string) => line.replace(/^\(?\(?\d+\)\s*/, '');

/** The contact details a city shares with its price lists. */
export default function CityDetailsForm({ cityName, initial, lists, sharingCount, busy, onSave, onClose }: Props) {
  const [details, setDetails] = useState<CityDetails>(initial);
  const [copyFrom, setCopyFrom] = useState('');
  const [note, setNote] = useState('');

  const set = (patch: Partial<CityDetails>) => setDetails((current) => ({ ...current, ...patch }));

  async function copy() {
    if (!copyFrom) return;
    setNote('Loading…');
    try {
      const { effective } = (await api(`/api/admin/price-lists/${encodeURIComponent(copyFrom)}`)) as { effective: PriceListProject };
      setDetails({
        officeAddress: effective.officeAddress || undefined,
        siteAddress: effective.siteAddress || undefined,
        contactPhones: effective.contactPhones || undefined,
        email: effective.email || undefined,
        footerMessage: effective.footerMessage || undefined,
        notes: effective.notes?.length ? effective.notes.map(stripNumber) : undefined,
      });
      setNote(`Copied from ${lists.find((l) => l.slug === copyFrom)?.projectName}. Check the fields, then save.`);
    } catch (err) {
      setNote((err as Error).message);
    }
  }

  return (
    <div className={styles.detailsPanel}>
      <p className={styles.subheading}>Details {cityName} shares with its price lists</p>
      <p className={styles.hint}>
        In a price list, tick &quot;Same as {cityName}&quot; next to a field to use the value here. Saving updates every phase that uses it
        {sharingCount ? ` (${sharingCount} ${sharingCount === 1 ? 'list does' : 'lists do'} now)` : ''}. Leave a field blank if phases differ.
      </p>

      {lists.length ? (
        <div className={styles.toolbarGroup}>
          <select className={styles.cellInput} aria-label="Copy details from a price list" value={copyFrom} onChange={(e) => setCopyFrom(e.target.value)}>
            <option value="">Copy from a price list…</option>
            {lists.map((list) => (
              <option key={list.slug} value={list.slug}>
                {list.projectName}
              </option>
            ))}
          </select>
          <button type="button" className={styles.small} disabled={!copyFrom || busy} onClick={copy}>
            Copy
          </button>
          {note ? <span className={styles.slug}>{note}</span> : null}
        </div>
      ) : null}

      <div className={styles.grid2}>
        {TEXT_FIELDS.map((field) => (
          <label key={field} className={styles.field}>
            {SHARED_FIELD_NAMES[field]}
            <input type={field === 'email' ? 'email' : 'text'} value={details[field] || ''} onChange={(e) => set({ [field]: e.target.value })} />
          </label>
        ))}
      </div>
      <label className={styles.field}>
        {SHARED_FIELD_NAMES.notes} (one per line, numbered automatically)
        <textarea
          rows={Math.max(4, (details.notes || []).length + 1)}
          value={(details.notes || []).join('\n')}
          onChange={(e) => set({ notes: e.target.value.split('\n') })}
        />
      </label>

      <div className={styles.toolbarGroup}>
        <button
          type="button"
          className={styles.primary}
          disabled={busy}
          onClick={async () => {
            const cleaned = { ...details, notes: (details.notes || []).map((line) => line.trim()).filter(Boolean) };
            if (await onSave(cleaned)) onClose();
          }}
        >
          Save details
        </button>
        <button type="button" className={styles.secondary} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
