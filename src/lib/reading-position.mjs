/** Article positions only. Never reads or writes bookmarks or learning records. */
export const POSITION_STORAGE_KEY = 'kenneth-reading-position:v1';
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ACTOR = /^[a-zA-Z0-9-]{1,80}$/;
const own = (value, keys) => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).every(key => keys.includes(key));
const integer = value => Number.isSafeInteger(value) && value >= 0 && value < Number.MAX_SAFE_INTEGER;
const validId = value => typeof value === 'string' && value.length <= 180 && ID.test(value);
const validHeading = value => typeof value === 'string' && value.length > 0 && value.length <= 512 && !/[\u0000-\u001f\u007f]/u.test(value);
const validStamp = value => own(value, ['clock', 'actor']) && integer(value.clock) && typeof value.actor === 'string' && ACTOR.test(value.actor);
const initialReset = () => ({ clock: 0, actor: 'initial' });
export const emptyPositionState = () => ({ version: 1, records: [] });
export const comparePositionStamp = (a, b) => a.clock - b.clock || (a.actor > b.actor ? 1 : a.actor < b.actor ? -1 : 0);
function validPosition(value) {
  return own(value, ['headingId', 'locale', 'sectionId', 'outline', 'stamp', 'at']) && validHeading(value.headingId)
    && ['en', 'zh-Hant'].includes(value.locale) && (value.sectionId === null || validId(value.sectionId))
    && typeof value.outline === 'string' && /^[a-f0-9]{8}$/.test(value.outline) && validStamp(value.stamp) && integer(value.at);
}
function validRecord(value) {
  return own(value, ['id', 'reset', 'position']) && validId(value.id) && validStamp(value.reset)
    && (value.position === null || validPosition(value.position) && comparePositionStamp(value.position.stamp, value.reset) > 0);
}
function copyRecord(record) {
  const position = record.position;
  return { id: record.id, reset: { ...record.reset }, position: position ? {
    headingId: position.headingId, locale: position.locale, sectionId: position.sectionId,
    outline: position.outline, stamp: { ...position.stamp }, at: position.at
  } : null };
}
/** The greatest reset generation wins before positions are compared. Old queued writes cannot revive it. */
export function mergePositionStates(...states) {
  const records = new Map();
  for (const state of states) for (const candidate of state?.records || []) {
    if (!validRecord(candidate)) continue;
    const previous = records.get(candidate.id);
    const resetOrder = previous ? comparePositionStamp(candidate.reset, previous.reset) : 1;
    if (!previous || resetOrder > 0 || resetOrder === 0 && candidate.position && (!previous.position ||
      comparePositionStamp(candidate.position.stamp, previous.position.stamp) > 0 ||
      comparePositionStamp(candidate.position.stamp, previous.position.stamp) === 0 && JSON.stringify(copyRecord(candidate).position) > JSON.stringify(previous.position))) {
      records.set(candidate.id, copyRecord(candidate));
    }
  }
  return { version: 1, records: [...records.values()].sort((a, b) => a.id.localeCompare(b.id, 'en')) };
}
export function parsePositionState(raw) {
  if (!raw) return emptyPositionState();
  try {
    if (typeof raw === 'string' && raw.length > 2000000) return emptyPositionState();
    const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!own(value, ['version', 'records']) || value.version !== 1 || !Array.isArray(value.records)
      || value.records.length > 5000 || !value.records.every(validRecord)) return emptyPositionState();
    return mergePositionStates(value);
  } catch { return emptyPositionState(); }
}
export function positionGeneration(state, id) {
  return state.records.find(record => record.id === id)?.reset || initialReset();
}
export function getReadingPosition(state, id) {
  return state.records.find(record => record.id === id)?.position || null;
}
/** expectedReset is captured when the document starts; a clear in another tab invalidates it. */
export function setReadingPosition(state, id, value, actor, at = Date.now(), expectedReset = positionGeneration(state, id)) {
  if (!validId(id) || !ACTOR.test(actor) || !integer(at) || !validStamp(expectedReset)) throw new Error('Invalid position operation');
  const record = state.records.find(item => item.id === id);
  const reset = positionGeneration(state, id);
  if (comparePositionStamp(reset, expectedReset) !== 0) return state;
  const clock = Math.max(reset.clock, record?.position?.stamp.clock || 0) + 1;
  const position = { headingId: value.headingId, locale: value.locale, sectionId: value.sectionId ?? null,
    outline: value.outline, stamp: { clock, actor }, at };
  if (!validPosition(position)) throw new Error('Invalid article position');
  return mergePositionStates(state, { records: [{ id, reset, position }] });
}
export function clearReadingPosition(state, id, actor) {
  if (!validId(id) || !ACTOR.test(actor)) throw new Error('Invalid position clear');
  const record = state.records.find(item => item.id === id);
  const clock = Math.max(record?.reset.clock || 0, record?.position?.stamp.clock || 0) + 1;
  return mergePositionStates(state, { records: [{ id, reset: { clock, actor }, position: null }] });
}
/** Outline fingerprint detects editorial changes, not a security or content-proof hash. */
export function headingOutline(headings) {
  let hash = 2166136261;
  for (const char of headings.map(heading => heading.slug).join('\n')) { hash ^= char.codePointAt(0); hash = Math.imul(hash, 16777619); }
  return (hash >>> 0).toString(16).padStart(8, '0');
}
export function mappedHeading(headingId, fromLocale, toLocale, sections) {
  return sections.find(section => section[fromLocale] === headingId)?.[toLocale] || null;
}
export function resolveReadingPosition(position, headings, sections, locale) {
  if (!position) return { status: 'empty' };
  let headingId = position.headingId;
  if (position.locale !== locale) {
    const section = sections.find(item => item.id === position.sectionId && item[position.locale] === position.headingId);
    if (!section) return { status: 'unmapped' };
    headingId = section[locale];
  }
  const heading = headings.find(item => item.slug === headingId);
  if (!heading) return { status: 'stale' };
  return { status: 'ready', headingId, label: heading.text };
}
