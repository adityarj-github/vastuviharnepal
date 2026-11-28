'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  daysUntil,
  DEFAULT_PDF_TEMPLATE,
  EXPIRING_DAYS,
  formatScheduleDate,
  isExpiringSoon,
  statesInOrder,
  STATUS_NAMES,
  todayInIndia,
  type PdfTemplate,
  type PriceListCity,
  type PriceListProject,
  type PriceListStatus,
  type PriceListSummary,
} from '@/lib/priceListTypes';
import { api, useLoad, when } from './adminApi';
import BulkEditForm, { type BulkEditFields } from './BulkEditForm';
import PdfDesignForm from './PdfDesignForm';
import PdfPreview from './PdfPreview';
import PriceListCities from './PriceListCities';
import PriceListEditor, { type EditorTarget } from './PriceListEditor';
import styles from './PriceLists.module.css';

/** A table row: the summary the list endpoint returns (full content loads on Edit). */
type Entry = PriceListSummary;

/** The full list, as GET /api/admin/price-lists/[slug] returns it. */
type FullEntry = {
  project: PriceListProject;
  isPublished: boolean;
  isBuiltIn: boolean;
  activeFrom: string | null;
  activeUntil: string | null;
  pdfDesign: PdfTemplate | null;
};

type Filter = 'all' | 'expiring' | PriceListStatus;
type ViewName = 'list' | 'cities' | 'design' | 'edit' | 'new';

/**
 * Everything that decides what this screen shows. It lives in the page address
 * (?tab=price-lists&status=…&state=…&city=…&q=…&view=…&list=…&from=…), so refresh,
 * bookmarks and the browser's Back button keep the admin where they were.
 */
type UrlState = { filter: Filter; state: string; city: string; q: string; view: ViewName; list: string; from: string };

const DEFAULT_URL: UrlState = { filter: 'all', state: '', city: '', q: '', view: 'list', list: '', from: '' };
const FILTER_KEYS: Filter[] = ['all', 'active', 'expiring', 'inactive', 'scheduled', 'expired', 'deleted'];
const VIEW_NAMES: ViewName[] = ['list', 'cities', 'design', 'edit', 'new'];

function readUrl(): UrlState {
  if (typeof window === 'undefined') return DEFAULT_URL;
  const p = new URLSearchParams(window.location.search);
  const filter = p.get('status') as Filter;
  const view = p.get('view') as ViewName;
  return {
    filter: FILTER_KEYS.includes(filter) ? filter : 'all',
    state: p.get('state') || '',
    city: p.get('city') || '',
    q: p.get('q') || '',
    view: VIEW_NAMES.includes(view) ? view : 'list',
    list: p.get('list') || '',
    from: p.get('from') || '',
  };
}

function urlFor(u: UrlState) {
  const p = new URLSearchParams({ tab: 'price-lists' });
  if (u.view !== 'list') p.set('view', u.view);
  if (u.view === 'edit' && u.list) p.set('list', u.list);
  if (u.view === 'new' && u.from) p.set('from', u.from);
  if (u.filter !== 'all') p.set('status', u.filter);
  if (u.state) p.set('state', u.state);
  if (u.city) p.set('city', u.city);
  if (u.q) p.set('q', u.q);
  return `${window.location.pathname}?${p.toString()}`;
}

const FILTERS: Array<{ key: Filter; label: string; title?: string }> = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'expiring', label: 'Expiring soon', title: `Active lists whose "Active until" date is within ${EXPIRING_DAYS} days` },
  { key: 'inactive', label: 'Inactive' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'expired', label: 'Expired' },
  { key: 'deleted', label: 'Deleted' },
];

const STATUS_BADGE: Record<PriceListStatus, string> = {
  active: styles.badgeGreen,
  inactive: styles.badgeAmber,
  scheduled: styles.badgeBlue,
  expired: styles.badgeGrey,
  deleted: styles.badgeRed,
};

const BLANK_PROJECT: PriceListProject = {
  slug: '',
  projectName: '',
  effectiveDate: '',
  officeAddress: '',
  siteAddress: '',
  contactPhones: '',
  bookingStatus: 'Booking Open',
  bungalows: [{ name: '' }],
  paymentSchedules: [{ title: 'Payment Schedule', steps: [] }],
  notes: [],
};

const listPath = (slug: string) => `/api/admin/price-lists/${encodeURIComponent(slug)}`;

/** One line under the status badge explaining the schedule, if any. */
function scheduleNote(entry: Entry) {
  const { activeFrom: from, activeUntil: until } = entry;
  if (entry.status === 'scheduled' && from) return `Goes live ${formatScheduleDate(from)}`;
  if (entry.status === 'expired' && until) return `Ended ${formatScheduleDate(until)}`;
  if (from && until) return `${formatScheduleDate(from)} – ${formatScheduleDate(until)}`;
  if (until) return `Until ${formatScheduleDate(until)}`;
  if (from) return `From ${formatScheduleDate(from)}`;
  return '';
}

function endsIn(days: number) {
  if (days <= 0) return 'Ends today';
  if (days === 1) return 'Ends tomorrow';
  return `Ends in ${days} days`;
}

/** Shared PDF design, previewed with any list (loaded in full when picked). */
function DesignView({ lists, initial, onDone }: { lists: Entry[]; initial: PdfTemplate; onDone: (message?: string) => void }) {
  const [template, setTemplate] = useState<PdfTemplate>(initial);
  const [sample, setSample] = useState(lists[0]?.project.slug || '');
  const [sampleProject, setSampleProject] = useState<PriceListProject | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const withOwnDesign = lists.filter((entry) => entry.hasOwnDesign).map((entry) => entry.project.projectName);

  useEffect(() => {
    if (!sample) return;
    let cancelled = false;
    api(listPath(sample))
      .then((data: { entry: FullEntry }) => {
        if (!cancelled) setSampleProject(data.entry.project);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [sample]);

  const change = (next: PdfTemplate) => {
    setTemplate(next);
    setDirty(true);
  };

  async function save() {
    setSaving(true);
    setError('');
    try {
      await api('/api/admin/price-list-template', 'PUT', { template });
      setDirty(false);
      onDone('PDF design saved. Every price list without its own design now downloads with it.');
    } catch (err) {
      setError((err as Error).message);
    }
    setSaving(false);
  }

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <h2 className={styles.title}>Shared PDF design</h2>
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => {
              if (confirm('Reset every setting to the original Vastu Vihar flyer design? Nothing is saved until you click Save.')) {
                change({ ...DEFAULT_PDF_TEMPLATE });
              }
            }}
          >
            Reset to original
          </button>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => {
              if (!dirty || confirm('Discard your unsaved changes?')) onDone();
            }}
          >
            Back to list
          </button>
        </div>
      </div>
      {withOwnDesign.length ? <p className={styles.hint}>These lists have their own design and are not affected: {withOwnDesign.join(', ')}.</p> : null}

      <div className={styles.editorLayout}>
        <div className={styles.editorForm}>
          <PdfDesignForm value={template} onChange={change} />
          <div className={styles.stickyBar}>
            <span className={styles.hint}>{dirty ? 'Unsaved changes' : 'No unsaved changes'}</span>
            <button type="button" className={styles.primary} onClick={save} disabled={saving || !dirty}>
              {saving ? 'Saving…' : 'Save design'}
            </button>
          </div>
          {error ? (
            <p role="alert" className={`${styles.message} ${styles.error}`}>
              {error}
            </p>
          ) : null}
        </div>
        <div className={styles.previewColumn}>
          <label className={styles.field} style={{ marginBottom: 8 }}>
            Preview with
            <select value={sample} onChange={(e) => setSample(e.target.value)}>
              {lists.map((entry) => (
                <option key={entry.project.slug} value={entry.project.slug}>
                  {entry.project.projectName}
                </option>
              ))}
            </select>
          </label>
          {sampleProject ? (
            <PdfPreview project={sampleProject} template={template} />
          ) : (
            <p className={styles.hint}>{lists.length ? 'Loading the price list…' : 'Add a price list to preview the design.'}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PriceListsManager() {
  const { data, error, reload } = useLoad<{ lists: Entry[]; template: PdfTemplate; cities: PriceListCity[] }>('/api/admin/price-lists');
  const [url, setUrlState] = useState<UrlState>(DEFAULT_URL);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const [target, setTarget] = useState<EditorTarget | null>(null);
  const [targetError, setTargetError] = useState('');
  const [bulkEditing, setBulkEditing] = useState(false);

  const lists = useMemo(() => data?.lists || [], [data]);
  const cities = useMemo(() => data?.cities || [], [data]);
  const template = data?.template || DEFAULT_PDF_TEMPLATE;
  const notDeleted = useMemo(() => lists.filter((entry) => !entry.isDeleted), [lists]);
  const cityBySlug = useMemo(() => new Map(cities.map((city) => [city.slug, city])), [cities]);
  const states = useMemo(() => statesInOrder(cities), [cities]);
  const today = todayInIndia();

  // ---- Page address ----

  // The latest address state, so updates can be worked out (and written to the browser
  // history) outside React's state updater, which must not touch the router.
  const urlRef = useRef(url);

  /** push: a new history entry (changing screen); otherwise the current one is updated (filters, typing). */
  const setUrl = useCallback((patch: Partial<UrlState>, push = false) => {
    const next = { ...urlRef.current, ...patch };
    urlRef.current = next;
    const href = urlFor(next);
    if (href !== window.location.pathname + window.location.search) {
      window.history[push ? 'pushState' : 'replaceState'](null, '', href);
    }
    setUrlState(next);
  }, []);

  useEffect(() => {
    const sync = () => {
      urlRef.current = readUrl();
      setUrlState(urlRef.current);
    };
    sync();
    const onPop = sync;
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // ---- Editor: the full list is fetched when it is opened ----

  const listsRef = useRef(lists);
  listsRef.current = lists;

  useEffect(() => {
    if (url.view !== 'edit' && url.view !== 'new') {
      setTarget(null);
      setTargetError('');
      return;
    }
    if (url.view === 'new' && !url.from) {
      setTarget({ project: BLANK_PROJECT, isNew: true, isBuiltIn: false, isPublished: false, activeFrom: null, activeUntil: null, pdfDesign: null });
      return;
    }
    const slug = url.view === 'edit' ? url.list : url.from;
    let cancelled = false;
    setTarget(null);
    setTargetError('');
    api(listPath(slug))
      .then(({ entry }: { entry: FullEntry }) => {
        if (cancelled) return;
        if (url.view === 'edit') {
          setTarget({
            project: entry.project,
            isNew: false,
            isBuiltIn: entry.isBuiltIn,
            isPublished: entry.isPublished,
            activeFrom: entry.activeFrom,
            activeUntil: entry.activeUntil,
            pdfDesign: entry.pdfDesign,
          });
          return;
        }
        // Duplicate: a fresh URL, hidden until the admin switches it on.
        const taken = (s: string) => listsRef.current.some((item) => item.project.slug === s);
        let copySlug = `${slug}-copy`;
        for (let n = 2; taken(copySlug); n += 1) copySlug = `${slug}-copy-${n}`;
        setTarget({
          project: { ...entry.project, slug: copySlug, projectName: `${entry.project.projectName} (copy)`, phaseLabel: undefined },
          isNew: true,
          isBuiltIn: false,
          isPublished: false,
          activeFrom: null,
          activeUntil: null,
          pdfDesign: entry.pdfDesign,
        });
      })
      .catch((err: Error) => {
        if (!cancelled) setTargetError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [url.view, url.list, url.from]);

  // ---- Filtering ----

  const q = url.q.trim().toLowerCase();
  const chosenCity = url.city ? cityBySlug.get(url.city) : undefined;

  /** Lists inside the chosen state, city and search, before the status filter. */
  const scope = useMemo(
    () =>
      lists.filter((entry) => {
        const city = entry.citySlug ? cityBySlug.get(entry.citySlug) : undefined;
        if (url.city && entry.citySlug !== url.city) return false;
        if (url.state && city?.state !== url.state) return false;
        if (!q) return true;
        return [entry.project.projectName, entry.project.slug, entry.project.phaseLabel, city?.name, city?.state]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q));
      }),
    [lists, cityBySlug, url.city, url.state, q],
  );

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: 0, active: 0, expiring: 0, inactive: 0, scheduled: 0, expired: 0, deleted: 0 };
    scope.forEach((entry) => {
      c[entry.status] += 1;
      if (!entry.isDeleted) c.all += 1;
      if (isExpiringSoon(entry, today)) c.expiring += 1;
    });
    return c;
  }, [scope, today]);

  const shown = useMemo(
    () =>
      scope.filter((entry) => {
        if (url.filter === 'all') return !entry.isDeleted;
        if (url.filter === 'expiring') return isExpiringSoon(entry, today);
        return entry.status === url.filter;
      }),
    [scope, url.filter, today],
  );

  const anyFilter = Boolean(q) || url.filter !== 'all' || Boolean(url.state) || Boolean(url.city);
  const selectedShown = shown.filter((entry) => selected.has(entry.project.slug));
  const allShownSelected = shown.length > 0 && selectedShown.length === shown.length;
  const canReorder = !anyFilter;
  const columns = canReorder ? 8 : 7;

  // State › City groups, in the order set under Cities. Empty groups are left out.
  const groups = useMemo(
    () =>
      states
        .map((state) => {
          const cityGroups = cities
            .filter((city) => city.state === state)
            .map((city) => ({ city, entries: shown.filter((entry) => entry.citySlug === city.slug) }))
            .filter((group) => group.entries.length);
          return { state, cityGroups, lists: cityGroups.flatMap((group) => group.entries) };
        })
        .filter((group) => group.cityGroups.length),
    [states, cities, shown],
  );
  const noCity = shown.filter((entry) => !entry.citySlug || !cityBySlug.has(entry.citySlug));

  // While searching or filtering, every group with a match is open so results are visible.
  const isOpen = (key: string) => anyFilter || openGroups.has(key);
  const toggleOpen = (key: string) =>
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  const allGroupKeys = [...groups.flatMap((g) => [`s:${g.state}`, ...g.cityGroups.map((c) => `c:${c.city.slug}`)]), ...(noCity.length ? ['none'] : [])];

  function changeFilters(patch: Partial<UrlState>) {
    setUrl(patch);
    setSelected(new Set());
    setBulkEditing(false);
    setMessage('');
  }

  function selectMany(entries: Entry[], on: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      entries.forEach((entry) => (on ? next.add(entry.project.slug) : next.delete(entry.project.slug)));
      return next;
    });
  }

  function toggleSelected(slug: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  // ---- Actions ----

  async function act(fn: () => Promise<unknown>, done: string) {
    setBusy(true);
    setMessage('');
    try {
      await fn();
      setMessage(done);
      await reload();
    } catch (err) {
      setMessage((err as Error).message);
    }
    setBusy(false);
  }

  const plural = (n: number) => `${n} price ${n === 1 ? 'list' : 'lists'}`;

  function bulk(action: 'activate' | 'deactivate' | 'delete' | 'restore') {
    const slugs = selectedShown.map((entry) => entry.project.slug);
    if (!slugs.length) return;
    if (action === 'delete' && !confirm(`Delete ${plural(slugs.length)}? Their pages stop working. You can restore them from the Deleted filter.`)) return;
    const verb = { activate: 'Activated', deactivate: 'Deactivated', delete: 'Deleted', restore: 'Restored' }[action];
    act(async () => {
      await api('/api/admin/price-lists', 'PATCH', { slugs, action });
      setSelected(new Set());
    }, `${verb} ${plural(slugs.length)}.`);
  }

  function bulkEdit(fields: BulkEditFields) {
    const slugs = selectedShown.map((entry) => entry.project.slug);
    if (!slugs.length) return;
    act(async () => {
      await api('/api/admin/price-lists', 'PATCH', { slugs, action: 'edit', fields });
      setSelected(new Set());
      setBulkEditing(false);
    }, `Updated ${plural(slugs.length)}.`);
  }

  function setActive(entry: Entry, isPublished: boolean) {
    const name = entry.project.projectName;
    // Switching on does not override the schedule; say so when the dates still hide it.
    const blocked =
      isPublished && entry.activeUntil && entry.activeUntil < today
        ? ' It stays hidden because its "Active until" date has passed. Edit the list to change the date.'
        : isPublished && entry.activeFrom && entry.activeFrom > today
          ? ` It goes live on ${formatScheduleDate(entry.activeFrom)}.`
          : '';
    act(() => api(listPath(entry.project.slug), 'PATCH', { isPublished }), isPublished ? `"${name}" is switched on.${blocked}` : `"${name}" is inactive.`);
  }

  /** Moves a phase up or down among the other phases of its city. */
  function reorder(entry: Entry, by: number) {
    const siblings = notDeleted.filter((item) => item.citySlug === entry.citySlug);
    const other = siblings[siblings.indexOf(entry) + by];
    if (!other) return;
    const order = notDeleted.map((item) => item.project.slug);
    const a = order.indexOf(entry.project.slug);
    const b = order.indexOf(other.project.slug);
    [order[a], order[b]] = [order[b], order[a]];
    act(() => api('/api/admin/price-lists', 'PATCH', { order }), 'Order saved.');
  }

  const goTo = (view: ViewName, extra: Partial<UrlState> = {}) => {
    setMessage('');
    setUrl({ view, list: '', from: '', ...extra }, true);
  };

  const backToList = async (done?: string) => {
    setUrl({ view: 'list', list: '', from: '' }, true);
    if (done) setMessage(done);
    await reload();
  };

  // ---- Other screens ----

  if (url.view === 'edit' || url.view === 'new') {
    if (targetError) {
      return (
        <div className={styles.panel}>
          <p role="alert" className={`${styles.message} ${styles.error}`}>
            {targetError}
          </p>
          <button type="button" className={styles.secondary} onClick={() => backToList()}>
            Back to list
          </button>
        </div>
      );
    }
    if (!target || !data) {
      return (
        <div className={styles.panel}>
          <p className={styles.hint}>Loading the price list…</p>
        </div>
      );
    }
    return (
      <PriceListEditor
        key={`${url.view}:${url.list}:${url.from}`}
        target={target}
        sharedTemplate={template}
        cities={cities}
        onSaved={backToList}
        onCancel={() => backToList()}
      />
    );
  }

  if (url.view === 'cities') return <PriceListCities onBack={() => backToList()} />;

  if (url.view === 'design') {
    if (!data) return <div className={styles.panel}><p className={styles.hint}>Loading…</p></div>;
    return <DesignView lists={notDeleted} initial={template} onDone={backToList} />;
  }

  // ---- List ----

  /** One price list row in the grouped table. */
  const renderRow = (entry: Entry) => {
    const p = entry.project;
    const siblings = notDeleted.filter((item) => item.citySlug === entry.citySlug);
    const index = siblings.indexOf(entry);
    const note = scheduleNote(entry);
    const expiring = isExpiringSoon(entry, today) && entry.activeUntil ? daysUntil(entry.activeUntil, today) : null;
    return (
      <tr key={p.slug} className={entry.isDeleted ? styles.rowDeleted : ''}>
        <td className={styles.checkCell}>
          <input type="checkbox" aria-label={`Select ${p.projectName}`} checked={selected.has(p.slug)} onChange={() => toggleSelected(p.slug)} />
        </td>
        {canReorder ? (
          <td>
            <span className={styles.order}>
              <button type="button" className={styles.iconButton} disabled={busy || index <= 0} onClick={() => reorder(entry, -1)} aria-label={`Move ${p.projectName} up`}>
                ↑
              </button>
              <button
                type="button"
                className={styles.iconButton}
                disabled={busy || index < 0 || index === siblings.length - 1}
                onClick={() => reorder(entry, 1)}
                aria-label={`Move ${p.projectName} down`}
              >
                ↓
              </button>
            </span>
          </td>
        ) : null}
        <td>
          <strong>{p.projectName}</strong>
          <span className={styles.slug}>/price-list/{p.slug}/</span>
        </td>
        <td>{p.phaseLabel || <span className={styles.slug}>{p.projectName}</span>}</td>
        <td>
          {entry.isDeleted ? (
            <span className={styles.slug}>—</span>
          ) : (
            <button
              type="button"
              role="switch"
              aria-checked={entry.isPublished}
              aria-label={`${p.projectName} active`}
              title={entry.isPublished ? 'Switch off to hide it from the website' : 'Switch on to show it on the website'}
              className={`${styles.switch} ${entry.isPublished ? styles.switchOn : ''}`}
              disabled={busy}
              onClick={() => setActive(entry, !entry.isPublished)}
            />
          )}
        </td>
        <td>
          <span className={styles.badges}>
            <span className={`${styles.badge} ${STATUS_BADGE[entry.status]}`}>{STATUS_NAMES[entry.status]}</span>
            {expiring !== null ? <span className={`${styles.badge} ${styles.badgeAmber}`}>{endsIn(expiring)}</span> : null}
            {entry.isBuiltIn ? (
              entry.isModified ? <span className={`${styles.badge} ${styles.badgeBlue}`}>Edited</span> : <span className={styles.badge}>Original</span>
            ) : (
              <span className={`${styles.badge} ${styles.badgeBlue}`}>Added</span>
            )}
            {entry.hasOwnDesign ? <span className={styles.badge}>Own design</span> : null}
          </span>
          {note ? <span className={styles.slug}>{note}</span> : null}
        </td>
        <td className={styles.nowrap}>{when(entry.updatedAt)}</td>
        <td>
          <span className={styles.rowActions}>
            {entry.isDeleted ? (
              <>
                <button
                  type="button"
                  className={styles.small}
                  disabled={busy}
                  onClick={() => act(() => api(listPath(p.slug), 'PATCH', { isDeleted: false }), `Restored "${p.projectName}".`)}
                >
                  Restore
                </button>
                {!entry.isBuiltIn ? (
                  <button
                    type="button"
                    className={styles.danger}
                    disabled={busy}
                    onClick={() => {
                      if (confirm(`Delete "${p.projectName}" forever? This can't be undone.`)) {
                        act(() => api(listPath(p.slug), 'DELETE'), `"${p.projectName}" was removed for good.`);
                      }
                    }}
                  >
                    Delete forever
                  </button>
                ) : null}
              </>
            ) : (
              <>
                <button type="button" className={styles.small} disabled={busy} onClick={() => goTo('edit', { list: p.slug })}>
                  Edit
                </button>
                <button type="button" className={styles.small} disabled={busy} onClick={() => goTo('new', { from: p.slug })}>
                  Duplicate
                </button>
                {entry.isBuiltIn && entry.isModified ? (
                  <button
                    type="button"
                    className={styles.small}
                    disabled={busy}
                    onClick={() => {
                      if (confirm(`Undo every edit to "${p.projectName}" and go back to the original version?`)) {
                        act(() => api(listPath(p.slug), 'DELETE'), `"${p.projectName}" is back to the original version.`);
                      }
                    }}
                  >
                    Reset
                  </button>
                ) : null}
                <button
                  type="button"
                  className={styles.danger}
                  disabled={busy}
                  onClick={() => {
                    if (confirm(`Delete "${p.projectName}"? Its page stops working. You can restore it from the Deleted filter.`)) {
                      act(() => api(listPath(p.slug), 'PATCH', { isDeleted: true }), `Deleted "${p.projectName}".`);
                    }
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </span>
        </td>
      </tr>
    );
  };

  const emptyText = () => {
    if (q) return 'No price lists match your search.';
    if (url.filter === 'expiring') return `No active list ends within ${EXPIRING_DAYS} days. Lists only expire when they have an "Active until" date.`;
    const where = chosenCity ? ` in ${chosenCity.name}` : url.state ? ` in ${url.state}` : '';
    if (url.filter === 'all') return `No price lists${where} yet.`;
    return `No ${STATUS_NAMES[url.filter].toLowerCase()} price lists${where}.`;
  };

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar} data-site-reveal>
        <div className={styles.toolbarGroup}>
          <input
            type="text"
            role="searchbox"
            className={styles.search}
            placeholder="Search by name, city or URL…"
            value={url.q}
            onChange={(e) => changeFilters({ q: e.target.value })}
            aria-label="Search price lists"
          />
          <select
            className={styles.filterSelect}
            aria-label="Filter by state"
            value={url.state}
            onChange={(e) => changeFilters({ state: e.target.value, city: '' })}
          >
            <option value="">All states</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <select
            className={styles.filterSelect}
            aria-label="Filter by city"
            value={url.city}
            onChange={(e) => {
              const city = cityBySlug.get(e.target.value);
              changeFilters({ city: e.target.value, state: city ? city.state : url.state });
            }}
          >
            <option value="">{url.state ? `All cities in ${url.state}` : 'All cities'}</option>
            {(url.state ? [url.state] : states).map((state) => (
              <optgroup key={state} label={state}>
                {cities
                  .filter((city) => city.state === state)
                  .map((city) => (
                    <option key={city.slug} value={city.slug}>
                      {city.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          {anyFilter ? (
            <button type="button" className={styles.small} onClick={() => changeFilters({ q: '', filter: 'all', state: '', city: '' })}>
              Clear filters
            </button>
          ) : null}
        </div>
        <div className={styles.toolbarGroup}>
          <button type="button" className={styles.secondary} onClick={() => goTo('cities')}>
            Cities
          </button>
          <button type="button" className={styles.secondary} onClick={() => goTo('design')} disabled={!data}>
            PDF design
          </button>
          <button type="button" className={styles.primary} onClick={() => goTo('new')}>
            + New price list
          </button>
        </div>
      </div>

      <div className={styles.filters} role="tablist" aria-label="Filter by status">
        {FILTERS.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            title={item.title}
            aria-selected={url.filter === item.key}
            className={`${styles.filter} ${url.filter === item.key ? styles.filterActive : ''}`}
            onClick={() => changeFilters({ filter: item.key })}
          >
            {item.label}
            <span className={styles.filterCount}>{counts[item.key]}</span>
          </button>
        ))}
      </div>

      <div className={styles.toolbarGroup} style={{ marginTop: 10 }}>
        <button type="button" className={styles.small} disabled={anyFilter} onClick={() => setOpenGroups(new Set(allGroupKeys))}>
          Expand all
        </button>
        <button type="button" className={styles.small} disabled={anyFilter} onClick={() => setOpenGroups(new Set())}>
          Collapse all
        </button>
        {anyFilter ? (
          <span className={styles.hint} style={{ margin: 0 }}>
            Showing every match. Clear the filters to reorder phases.
          </span>
        ) : null}
      </div>

      <p className={styles.hint}>
        Only <strong>Active</strong> lists appear on the website and in the sitemap. Inactive, scheduled, expired and deleted lists show &quot;not found&quot;.
        Schedule dates follow India time. This view is saved in the page address, so you can bookmark or share it.
      </p>
      {error || message ? (
        <p role="status" className={`${styles.message} ${error ? styles.error : ''}`}>
          {error || message}
        </p>
      ) : null}
      {!data && !error ? <p className={styles.hint}>Loading…</p> : null}

      {selectedShown.length ? (
        <div className={styles.bulkBar} role="region" aria-label="Bulk actions">
          <strong>{selectedShown.length} selected</strong>
          <div className={styles.toolbarGroup}>
            {url.filter === 'deleted' ? (
              <button type="button" className={styles.small} disabled={busy} onClick={() => bulk('restore')}>
                Restore
              </button>
            ) : (
              <>
                <button type="button" className={styles.small} disabled={busy} onClick={() => bulk('activate')}>
                  Activate
                </button>
                <button type="button" className={styles.small} disabled={busy} onClick={() => bulk('deactivate')}>
                  Deactivate
                </button>
                <button type="button" className={styles.small} disabled={busy} aria-expanded={bulkEditing} onClick={() => setBulkEditing(!bulkEditing)}>
                  Edit details…
                </button>
                <button type="button" className={styles.danger} disabled={busy} onClick={() => bulk('delete')}>
                  Delete
                </button>
              </>
            )}
            <button
              type="button"
              className={styles.small}
              disabled={busy}
              onClick={() => {
                setSelected(new Set());
                setBulkEditing(false);
              }}
            >
              Clear
            </button>
          </div>
        </div>
      ) : null}
      {selectedShown.length && bulkEditing && url.filter !== 'deleted' ? (
        <BulkEditForm count={selectedShown.length} busy={busy} onApply={bulkEdit} onClose={() => setBulkEditing(false)} />
      ) : null}

      {data ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.checkCell}>
                  <input
                    type="checkbox"
                    aria-label="Select all shown"
                    checked={allShownSelected}
                    disabled={!shown.length}
                    onChange={() => setSelected(allShownSelected ? new Set() : new Set(shown.map((entry) => entry.project.slug)))}
                  />
                </th>
                {canReorder ? <th>Order</th> : null}
                <th>Price list</th>
                <th>Button label</th>
                <th>Active</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map(({ state, cityGroups, lists: stateLists }) => {
                const stateKey = `s:${state}`;
                const stateOpen = isOpen(stateKey);
                return (
                  <Fragment key={stateKey}>
                    <tr className={styles.groupState}>
                      <td colSpan={columns}>
                        <button type="button" className={styles.groupToggle} aria-expanded={stateOpen} onClick={() => toggleOpen(stateKey)}>
                          <span aria-hidden="true">{stateOpen ? '▾' : '▸'}</span> {state}
                        </button>
                        <span className={styles.groupMeta}>
                          {cityGroups.length} {cityGroups.length === 1 ? 'city' : 'cities'} · {plural(stateLists.length)} ·{' '}
                          {stateLists.filter((e) => e.status === 'active').length} active
                        </span>
                      </td>
                    </tr>
                    {stateOpen
                      ? cityGroups.map(({ city, entries }) => {
                          const cityKey = `c:${city.slug}`;
                          const cityOpen = isOpen(cityKey);
                          const allSelected = entries.every((e) => selected.has(e.project.slug));
                          return (
                            <Fragment key={cityKey}>
                              <tr className={styles.groupCity}>
                                <td className={styles.checkCell}>
                                  <input
                                    type="checkbox"
                                    aria-label={`Select every phase in ${city.name}`}
                                    checked={allSelected}
                                    onChange={() => selectMany(entries, !allSelected)}
                                  />
                                </td>
                                <td colSpan={columns - 1}>
                                  <button type="button" className={styles.groupToggle} aria-expanded={cityOpen} onClick={() => toggleOpen(cityKey)}>
                                    <span aria-hidden="true">{cityOpen ? '▾' : '▸'}</span> {city.name}
                                  </button>
                                  <span className={styles.groupMeta}>
                                    {entries.length} {entries.length === 1 ? 'phase' : 'phases'} · {entries.filter((e) => e.status === 'active').length} active
                                    {city.isActive ? '' : ' · city switched off (hidden on the website)'}
                                  </span>
                                </td>
                              </tr>
                              {cityOpen ? entries.map(renderRow) : null}
                            </Fragment>
                          );
                        })
                      : null}
                  </Fragment>
                );
              })}
              {noCity.length ? (
                <>
                  <tr className={styles.groupState}>
                    <td colSpan={columns}>
                      <button type="button" className={styles.groupToggle} aria-expanded={isOpen('none')} onClick={() => toggleOpen('none')}>
                        <span aria-hidden="true">{isOpen('none') ? '▾' : '▸'}</span> Not on the index
                      </button>
                      <span className={styles.groupMeta}>{plural(noCity.length)} with no city, reachable only by their link</span>
                    </td>
                  </tr>
                  {isOpen('none') ? noCity.map(renderRow) : null}
                </>
              ) : null}
            </tbody>
          </table>
          {!shown.length ? <p className={styles.hint}>{emptyText()}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
