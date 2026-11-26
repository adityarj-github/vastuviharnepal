'use client';

import { useRef, useState } from 'react';
import { compressImageToWebP } from '@/lib/clientImageCompress';
import {
  DEFAULT_PDF_TEMPLATE,
  LEFT_SECTIONS,
  PDF_COLOR_KEYS,
  PDF_COLOR_NAMES,
  PDF_LABEL_KEYS,
  PDF_LABEL_NAMES,
  PDF_SIZE_KEYS,
  PDF_SIZE_NAMES,
  RIGHT_SECTIONS,
  SECTION_NAMES,
  type PdfTemplate,
} from '@/lib/priceListTypes';
import styles from './PriceLists.module.css';

type Props = {
  value: PdfTemplate;
  onChange: (next: PdfTemplate) => void;
  /** Sections start open on the design page, closed inside a list's editor. */
  open?: boolean;
};

const HEX = /^#[0-9a-f]{6}$/i;

/** Ordered list of sections with show/hide and up/down. Hidden ones keep their place below. */
function SectionOrder<T extends string>({
  title,
  all,
  shown,
  onChange,
}: {
  title: string;
  all: readonly T[];
  shown: T[];
  onChange: (next: T[]) => void;
}) {
  const hidden = all.filter((item) => !shown.includes(item));
  const move = (index: number, by: number) => {
    const next = [...shown];
    const [item] = next.splice(index, 1);
    next.splice(index + by, 0, item);
    onChange(next);
  };
  return (
    <div>
      <p className={styles.subheading}>{title}</p>
      <ul className={styles.sectionList}>
        {shown.map((item, index) => (
          <li key={item} className={styles.sectionItem}>
            <label className={styles.check}>
              <input type="checkbox" checked onChange={() => onChange(shown.filter((s) => s !== item))} />
              {SECTION_NAMES[item as keyof typeof SECTION_NAMES]}
            </label>
            <span className={styles.rowButtons}>
              <button type="button" className={styles.iconButton} disabled={index === 0} onClick={() => move(index, -1)} aria-label="Move up">
                ↑
              </button>
              <button
                type="button"
                className={styles.iconButton}
                disabled={index === shown.length - 1}
                onClick={() => move(index, 1)}
                aria-label="Move down"
              >
                ↓
              </button>
            </span>
          </li>
        ))}
        {hidden.map((item) => (
          <li key={item} className={styles.sectionItem}>
            <label className={`${styles.check} ${styles.sectionHidden}`}>
              <input type="checkbox" checked={false} onChange={() => onChange([...shown, item])} />
              {SECTION_NAMES[item as keyof typeof SECTION_NAMES]}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PdfDesignForm({ value, onChange, open = true }: Props) {
  const t = value;
  const logoInput = useRef<HTMLInputElement>(null);
  const [logoMessage, setLogoMessage] = useState('');
  const set = <K extends keyof PdfTemplate>(key: K, v: PdfTemplate[K]) => onChange({ ...t, [key]: v });

  async function uploadLogo(file: File) {
    setLogoMessage('Uploading…');
    try {
      const body = new FormData();
      body.set('file', await compressImageToWebP(file));
      const response = await fetch('/api/admin/price-list-template', { method: 'POST', body });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Upload failed.');
      onChange({ ...t, logoUrl: data.url, showLogo: true });
      setLogoMessage('Logo uploaded. Save to apply it.');
    } catch (err) {
      setLogoMessage((err as Error).message);
    }
  }

  return (
    <>
      <details className={styles.section} open={open}>
        <summary>Company &amp; contact</summary>
        <div className={styles.sectionBody}>
          <div className={styles.grid2}>
            <label className={styles.field}>
              Company name (header)
              <input value={t.companyName} onChange={(e) => set('companyName', e.target.value)} />
            </label>
            <label className={styles.field}>
              Helpline (footer)
              <input value={t.helpline} onChange={(e) => set('helpline', e.target.value)} />
            </label>
            <label className={styles.field}>
              Website (footer)
              <input value={t.website} onChange={(e) => set('website', e.target.value)} />
            </label>
            <label className={styles.field}>
              PDF author
              <input value={t.author} onChange={(e) => set('author', e.target.value)} />
            </label>
            <label className={styles.field}>
              File name ({'{slug}'} = list URL)
              <input value={t.fileName} onChange={(e) => set('fileName', e.target.value)} />
            </label>
          </div>
        </div>
      </details>

      <details className={styles.section} open={open}>
        <summary>Logo</summary>
        <div className={styles.sectionBody}>
          <label className={styles.check}>
            <input type="checkbox" checked={t.showLogo} onChange={(e) => set('showLogo', e.target.checked)} />
            Show the logo in the header tab
          </label>
          <div className={styles.logoRow}>
            {t.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.logoUrl} alt="Current logo" className={styles.logoImage} />
            ) : (
              <span className={styles.hint}>No logo set.</span>
            )}
            <button type="button" className={styles.secondary} onClick={() => logoInput.current?.click()}>
              Upload new logo
            </button>
            {t.logoUrl !== DEFAULT_PDF_TEMPLATE.logoUrl ? (
              <button type="button" className={styles.small} onClick={() => set('logoUrl', DEFAULT_PDF_TEMPLATE.logoUrl)}>
                Use the standard logo
              </button>
            ) : null}
          </div>
          <input
            ref={logoInput}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (file) uploadLogo(file);
            }}
          />
          <p className={styles.hint}>
            JPG, PNG or WebP. It sits on a white tab, so a logo with a white or transparent background works best.
          </p>
          {logoMessage ? <p className={styles.hint}>{logoMessage}</p> : null}
        </div>
      </details>

      <details className={styles.section} open={open}>
        <summary>Colours</summary>
        <div className={styles.sectionBody}>
          <div className={styles.grid2}>
            {PDF_COLOR_KEYS.map((key) => (
              <div key={key} className={styles.field}>
                {PDF_COLOR_NAMES[key]}
                <span className={styles.colorRow}>
                  <input
                    type="color"
                    aria-label={PDF_COLOR_NAMES[key]}
                    value={t.colors[key]}
                    onChange={(e) => set('colors', { ...t.colors, [key]: e.target.value })}
                  />
                  <input
                    type="text"
                    className={styles.cellInput}
                    aria-label={`${PDF_COLOR_NAMES[key]} hex code`}
                    defaultValue={t.colors[key]}
                    key={t.colors[key]}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (HEX.test(v)) set('colors', { ...t.colors, [key]: v.toLowerCase() });
                      else e.target.value = t.colors[key];
                    }}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </details>

      <details className={styles.section} open={open}>
        <summary>Headings &amp; labels</summary>
        <div className={styles.sectionBody}>
          <div className={styles.grid2}>
            {PDF_LABEL_KEYS.map((key) => (
              <label key={key} className={styles.field}>
                {PDF_LABEL_NAMES[key]}
                <input value={t.labels[key]} onChange={(e) => set('labels', { ...t.labels, [key]: e.target.value })} />
              </label>
            ))}
          </div>
        </div>
      </details>

      <details className={styles.section} open={open}>
        <summary>Font sizes (points)</summary>
        <div className={styles.sectionBody}>
          <div className={styles.grid2}>
            {PDF_SIZE_KEYS.map((key) => (
              <label key={key} className={styles.field}>
                {PDF_SIZE_NAMES[key]}
                <input
                  type="number"
                  min={4}
                  max={48}
                  step={0.5}
                  value={t.sizes[key]}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (Number.isFinite(n) && n > 0) set('sizes', { ...t.sizes, [key]: n });
                  }}
                />
              </label>
            ))}
          </div>
        </div>
      </details>

      <details className={styles.section} open={open}>
        <summary>Layout &amp; sections</summary>
        <div className={styles.sectionBody}>
          <p className={styles.hint}>The first unit table (bungalows, or flats when there are none) always runs across the full width.</p>
          <div className={styles.grid2}>
            <SectionOrder title="Left column" all={LEFT_SECTIONS} shown={t.leftSections} onChange={(v) => set('leftSections', v)} />
            <SectionOrder title="Right column" all={RIGHT_SECTIONS} shown={t.rightSections} onChange={(v) => set('rightSections', v)} />
          </div>
          <div className={styles.grid2}>
            <label className={styles.field}>
              Smallest text scale for long lists ({Math.round(t.minScale * 100)}%)
              <input
                type="range"
                min={0.5}
                max={1}
                step={0.05}
                value={t.minScale}
                onChange={(e) => set('minScale', Number(e.target.value))}
              />
            </label>
            <label className={styles.check}>
              <input type="checkbox" checked={t.allowTallPage} onChange={(e) => set('allowTallPage', e.target.checked)} />
              Let very long lists use a taller page (otherwise always A4, shrinking text further)
            </label>
          </div>
        </div>
      </details>

      <details className={styles.section} open={open}>
        <summary>Signatures &amp; footer</summary>
        <div className={styles.sectionBody}>
          <label className={styles.check}>
            <input type="checkbox" checked={t.showSignatures} onChange={(e) => set('showSignatures', e.target.checked)} />
            Show signature labels
          </label>
          <div className={styles.grid2}>
            {[0, 1, 2, 3].map((i) => (
              <label key={i} className={styles.field}>
                Signature {i + 1}
                <input
                  value={t.signatureLabels[i] || ''}
                  placeholder={i === 3 ? 'Optional' : ''}
                  onChange={(e) => {
                    const next = [...t.signatureLabels];
                    next[i] = e.target.value;
                    set('signatureLabels', next.slice(0, 4).map((v) => v ?? ''));
                  }}
                  onBlur={() => set('signatureLabels', t.signatureLabels.filter((v) => v && v.trim()))}
                />
              </label>
            ))}
          </div>
          <label className={styles.check}>
            <input type="checkbox" checked={t.showFooter} onChange={(e) => set('showFooter', e.target.checked)} />
            Show the footer band (helpline, website, footer message)
          </label>
        </div>
      </details>
    </>
  );
}
