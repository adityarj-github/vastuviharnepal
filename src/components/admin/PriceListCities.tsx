'use client';

import { Fragment, useMemo, useState } from 'react';
import { SHARED_FIELD_NAMES, SHARED_FIELDS, cityHas, statesInOrder, type CityDetails, type PriceListCity } from '@/lib/priceListTypes';
import { api, useLoad } from './adminApi';
import CityDetailsForm from './CityDetailsForm';
import styles from './PriceLists.module.css';

type City = PriceListCity & {
  listCount: number;
  activeCount: number;
  deletedCount: number;
  /** Lists that take at least one field from this city's details. */
  sharingCount: number;
  lists: Array<{ slug: string; projectName: string }>;
};

const NEW_STATE = '__new__';

/** Cities on the /price-list index: add, rename, move, reorder, switch off, delete. */
export default function PriceListCities({ onBack }: { onBack: () => void }) {
  const { data, error, reload } = useLoad<{ cities: City[] }>('/api/admin/price-list-cities');
  const cities = useMemo(() => [...(data?.cities || [])].sort((a, b) => a.sortOrder - b.sortOrder), [data]);
  const states = useMemo(() => statesInOrder(cities), [cities]);

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState('');
  const [addState, setAddState] = useState('');
  const [addNewState, setAddNewState] = useState('');
  const [addName, setAddName] = useState('');
  const [editing, setEditing] = useState<{ slug: string; name: string; state: string } | null>(null);
  const [renaming, setRenaming] = useState<{ from: string; to: string } | null>(null);
  const [detailsFor, setDetailsFor] = useState('');

  async function act(fn: () => Promise<unknown>, done: string) {
    setBusy(true);
    setMessage('');
    setIsError(false);
    try {
      await fn();
      setMessage(done);
      await reload();
      return true;
    } catch (err) {
      setMessage((err as Error).message);
      setIsError(true);
      return false;
    } finally {
      setBusy(false);
    }
  }

  const path = (slug: string) => `/api/admin/price-list-cities/${encodeURIComponent(slug)}`;
  const saveOrder = (order: string[], done: string) => act(() => api('/api/admin/price-list-cities', 'PATCH', { order }), done);

  function moveCity(city: City, by: number) {
    const inState = cities.filter((c) => c.state === city.state);
    const index = inState.indexOf(city);
    const target = inState[index + by];
    if (!target) return;
    const order = cities.map((c) => c.slug);
    const a = order.indexOf(city.slug);
    const b = order.indexOf(target.slug);
    [order[a], order[b]] = [order[b], order[a]];
    saveOrder(order, 'Order saved.');
  }

  function moveState(state: string, by: number) {
    const list = [...states];
    const index = list.indexOf(state);
    const target = index + by;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    saveOrder(
      list.flatMap((s) => cities.filter((c) => c.state === s).map((c) => c.slug)),
      `${state} moved ${by < 0 ? 'up' : 'down'}.`,
    );
  }

  const q = query.trim().toLowerCase();
  const visible = (city: City) => !q || city.name.toLowerCase().includes(q) || city.state.toLowerCase().includes(q);
  // The state picker starts on the first state until the admin picks another.
  const chosenState = addState || states[0] || NEW_STATE;

  async function addCity() {
    const state = chosenState === NEW_STATE ? addNewState.trim() : chosenState;
    const name = addName.trim();
    const ok = await act(() => api('/api/admin/price-list-cities', 'POST', { state, name }), `Added ${name} under ${state}.`);
    if (ok) {
      setAddName('');
      if (chosenState === NEW_STATE) {
        setAddState(state);
        setAddNewState('');
      }
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <h2 className={styles.title}>Cities</h2>
        <button type="button" className={styles.secondary} onClick={onBack}>
          Back to price lists
        </button>
      </div>
      <p className={styles.hint}>
        These are the cities on the public price list page, in this order. A city with no active price list shows &quot;Contact us for prices&quot;. Switch a
        city off to hide it from the page without deleting it.
      </p>

      <form
        className={styles.addRow}
        onSubmit={(e) => {
          e.preventDefault();
          addCity();
        }}
      >
        <label className={styles.field}>
          State
          <select value={chosenState} onChange={(e) => setAddState(e.target.value)}>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            <option value={NEW_STATE}>+ New state…</option>
          </select>
        </label>
        {chosenState === NEW_STATE ? (
          <label className={styles.field}>
            New state name
            <input value={addNewState} onChange={(e) => setAddNewState(e.target.value)} placeholder="Madhya Pradesh" />
          </label>
        ) : null}
        <label className={styles.field}>
          City name
          <input value={addName} onChange={(e) => setAddName(e.target.value)} placeholder="Bettiah" />
        </label>
        <button
          type="submit"
          className={styles.primary}
          disabled={busy || !addName.trim() || (chosenState === NEW_STATE && !addNewState.trim())}
        >
          Add city
        </button>
      </form>

      <div className={styles.toolbar} style={{ marginTop: 16 }}>
        <input
          type="text"
          role="searchbox"
          className={styles.search}
          placeholder="Find a city or state…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Find a city"
        />
        <span className={styles.hint}>
          {cities.length} cities in {states.length} states · {cities.filter((c) => !c.isActive).length} switched off
        </span>
      </div>

      {error || message ? <p role="status" className={`${styles.message} ${error || isError ? styles.error : ''}`}>{error || message}</p> : null}
      {!data && !error ? <p className={styles.hint}>Loading…</p> : null}

      {states.map((state, stateIndex) => {
        const inState = cities.filter((c) => c.state === state);
        const shownCities = inState.filter(visible);
        if (!shownCities.length) return null;
        return (
          <section key={state} className={styles.stateBlock}>
            <div className={styles.stateHead}>
              {renaming?.from === state ? (
                <form
                  className={styles.toolbarGroup}
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const ok = await act(
                      () => api('/api/admin/price-list-cities', 'PATCH', { renameState: renaming }),
                      `Renamed ${renaming.from} to ${renaming.to.trim()}.`,
                    );
                    if (ok) setRenaming(null);
                  }}
                >
                  <input
                    className={styles.cellInput}
                    aria-label={`New name for ${state}`}
                    value={renaming.to}
                    onChange={(e) => setRenaming({ from: state, to: e.target.value })}
                    autoFocus
                  />
                  <button type="submit" className={styles.small} disabled={busy || !renaming.to.trim()}>
                    Save
                  </button>
                  <button type="button" className={styles.small} onClick={() => setRenaming(null)}>
                    Cancel
                  </button>
                </form>
              ) : (
                <h3 className={styles.stateName}>
                  {state}
                  <span className={styles.slug}>
                    {inState.length} {inState.length === 1 ? 'city' : 'cities'} · {inState.reduce((n, c) => n + c.listCount, 0)} price lists
                  </span>
                </h3>
              )}
              <span className={styles.rowButtons}>
                <button type="button" className={styles.small} disabled={busy} onClick={() => setRenaming({ from: state, to: state })}>
                  Rename state
                </button>
                <button type="button" className={styles.iconButton} disabled={busy || stateIndex === 0} onClick={() => moveState(state, -1)} aria-label={`Move ${state} up`}>
                  ↑
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  disabled={busy || stateIndex === states.length - 1}
                  onClick={() => moveState(state, 1)}
                  aria-label={`Move ${state} down`}
                >
                  ↓
                </button>
              </span>
            </div>

            <div className={styles.tableWrap} style={{ marginTop: 0 }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>City</th>
                    <th>Price lists</th>
                    <th>Shown</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shownCities.map((city) => {
                    const index = inState.indexOf(city);
                    const isEditing = editing?.slug === city.slug;
                    const filled = SHARED_FIELDS.filter((field) => cityHas(city.details, field));
                    return (
                      <Fragment key={city.slug}>
                      <tr className={city.isActive ? '' : styles.rowDeleted}>
                        <td>
                          <span className={styles.order}>
                            <button type="button" className={styles.iconButton} disabled={busy || index === 0 || Boolean(q)} onClick={() => moveCity(city, -1)} aria-label={`Move ${city.name} up`}>
                              ↑
                            </button>
                            <button
                              type="button"
                              className={styles.iconButton}
                              disabled={busy || index === inState.length - 1 || Boolean(q)}
                              onClick={() => moveCity(city, 1)}
                              aria-label={`Move ${city.name} down`}
                            >
                              ↓
                            </button>
                          </span>
                        </td>
                        <td>
                          {isEditing ? (
                            <span className={styles.toolbarGroup}>
                              <input
                                className={styles.cellInput}
                                aria-label="City name"
                                value={editing.name}
                                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                                autoFocus
                              />
                              <select
                                className={styles.cellInput}
                                aria-label="State"
                                value={editing.state}
                                onChange={(e) => setEditing({ ...editing, state: e.target.value })}
                              >
                                {states.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </span>
                          ) : (
                            <>
                              <strong>{city.name}</strong>
                              <span className={styles.slug}>
                                {city.isActive ? 'Shown on the price list page' : 'Switched off: hidden'}
                                {filled.length
                                  ? ` · shares ${filled.map((field) => SHARED_FIELD_NAMES[field].toLowerCase()).join(', ')}`
                                  : ''}
                              </span>
                            </>
                          )}
                        </td>
                        <td className={styles.nowrap}>
                          {city.listCount ? `${city.listCount} · ${city.activeCount} active` : <span className={styles.slug}>None yet</span>}
                          {city.sharingCount ? <span className={styles.slug}>{city.sharingCount} use shared details</span> : null}
                        </td>
                        <td>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={city.isActive}
                            aria-label={`Show ${city.name}`}
                            className={`${styles.switch} ${city.isActive ? styles.switchOn : ''}`}
                            disabled={busy}
                            onClick={() =>
                              act(
                                () => api(path(city.slug), 'PUT', { isActive: !city.isActive }),
                                city.isActive ? `${city.name} is hidden from the price list page.` : `${city.name} is shown again.`,
                              )
                            }
                          />
                        </td>
                        <td>
                          <span className={styles.rowActions}>
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  className={styles.small}
                                  disabled={busy || !editing.name.trim()}
                                  onClick={async () => {
                                    const ok = await act(() => api(path(city.slug), 'PUT', { name: editing.name, state: editing.state }), 'City saved.');
                                    if (ok) setEditing(null);
                                  }}
                                >
                                  Save
                                </button>
                                <button type="button" className={styles.small} onClick={() => setEditing(null)}>
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className={styles.small}
                                  disabled={busy}
                                  aria-expanded={detailsFor === city.slug}
                                  onClick={() => setDetailsFor(detailsFor === city.slug ? '' : city.slug)}
                                >
                                  Details
                                </button>
                                <button
                                  type="button"
                                  className={styles.small}
                                  disabled={busy}
                                  onClick={() => setEditing({ slug: city.slug, name: city.name, state: city.state })}
                                >
                                  Rename / move
                                </button>
                                <button
                                  type="button"
                                  className={styles.danger}
                                  disabled={busy || city.listCount + city.deletedCount > 0}
                                  title={city.listCount + city.deletedCount > 0 ? 'Move or remove its price lists first' : undefined}
                                  onClick={() => {
                                    if (confirm(`Delete ${city.name}? It has no price lists.`)) {
                                      act(() => api(path(city.slug), 'DELETE'), `Deleted ${city.name}.`);
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
                      {detailsFor === city.slug ? (
                        <tr>
                          <td colSpan={5}>
                            <CityDetailsForm
                              cityName={city.name}
                              initial={city.details}
                              lists={city.lists}
                              sharingCount={city.sharingCount}
                              busy={busy}
                              onClose={() => setDetailsFor('')}
                              onSave={(details: CityDetails) =>
                                act(() => api(path(city.slug), 'PUT', { details }), `Saved ${city.name}'s shared details.`)
                              }
                            />
                          </td>
                        </tr>
                      ) : null}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
      {data && q && !cities.some(visible) ? <p className={styles.hint}>No city matches &quot;{query}&quot;.</p> : null}
    </div>
  );
}
