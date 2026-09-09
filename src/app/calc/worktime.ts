import { zeroPad } from 'app/util/strings';

/**
 * Work time tracking calculations. All times are local 'HH:mm' strings within a single
 * day. An empty end time means the row is still open and NOW is used as its end.
 */

export interface WorkRow {
  /** Start time as 'HH:mm', or '' if unset */
  readonly start: string;
  /** End time as 'HH:mm', or '' if still open */
  readonly end: string;
}

export interface WorkDay {
  /** Date the rows belong to, as 'YYYY-MM-DD' */
  readonly date: string;
  readonly rows: readonly WorkRow[];
  readonly subtractLunch: boolean;
  readonly lunchMinutes: number;
  readonly subtractCommute: boolean;
  readonly commuteMinutes: number;
  /** Target working day length in minutes */
  readonly targetMinutes: number;
}

export interface WorkSummary {
  /** Net minutes worked (deductions subtracted, clamped to >= 0) */
  readonly workedMinutes: number;
  /** Gross minutes worked, before deductions */
  readonly grossMinutes: number;
  /** Minutes of gaps between rows */
  readonly awayMinutes: number;
  /** Fixed deductions (lunch, commute) actually subtracted */
  readonly deductedMinutes: number;
  /** Minutes still left to reach target; 0 if reached */
  readonly remainingMinutes: number;
  /**
   * Minutes from midnight when target is reached, if a row is open; otherwise the end of
   * the last interval. Undefined if there are no valid rows.
   */
  readonly leaveAtMinutes: number | undefined;
  /** True if any row is open (no end time) */
  readonly hasOpenRow: boolean;
}

const MINUTES_PER_DAY = 24 * 60;

export const DEFAULT_LUNCH_MINUTES = 30;
export const DEFAULT_COMMUTE_MINUTES = 30;
export const DEFAULT_TARGET_MINUTES = 7.5 * 60;

export function parseTime(s: string): number | undefined {
  const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
  if (!m) return undefined;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return undefined;
  return h * 60 + min;
}

export function formatTime(minutesFromMidnight: number): string {
  const m =
    ((Math.round(minutesFromMidnight) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return `${zeroPad(String(Math.floor(m / 60)), 2)}:${zeroPad(String(m % 60), 2)}`;
}

export function formatDuration(minutes: number): string {
  const sign = minutes < 0 ? '-' : '';
  const abs = Math.abs(Math.round(minutes));
  return `${sign}${Math.floor(abs / 60)}:${zeroPad(String(abs % 60), 2)}`;
}

export function formatDecimalHours(minutes: number): string {
  return (minutes / 60).toFixed(2);
}

export function nowMinutes(now: Date = new Date()): number {
  return now.getHours() * 60 + now.getMinutes();
}

export function todayKey(now: Date = new Date()): string {
  return `${now.getFullYear()}-${zeroPad(String(now.getMonth() + 1), 2)}-${zeroPad(String(now.getDate()), 2)}`;
}

interface Interval {
  readonly start: number;
  readonly end: number;
}

/**
 * Resolves rows into concrete minute intervals. Rows with an invalid start are skipped.
 * An empty end resolves to `now` (or `start`, if the start is in the future). If a closed
 * row has end < start, it is assumed to cross midnight.
 */
export function resolveIntervals(rows: readonly WorkRow[], now: number): Interval[] {
  const result: Interval[] = [];
  for (const row of rows) {
    const start = parseTime(row.start);
    if (start === undefined) continue;
    let end = row.end === '' ? Math.max(start, now) : parseTime(row.end);
    if (end === undefined) continue;
    if (end < start) end += MINUTES_PER_DAY;
    result.push({ start, end });
  }
  return result;
}

function mergeIntervals(intervals: Interval[]): Interval[] {
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  const merged: Interval[] = [];
  for (const iv of sorted) {
    const last = merged[merged.length - 1];
    if (last && iv.start <= last.end) {
      merged[merged.length - 1] = { start: last.start, end: Math.max(last.end, iv.end) };
    } else {
      merged.push(iv);
    }
  }
  return merged;
}

export function summarize(day: WorkDay, now: number): WorkSummary {
  const merged = mergeIntervals(resolveIntervals(day.rows, now));
  const grossMinutes = merged.reduce((sum, iv) => sum + (iv.end - iv.start), 0);
  const awayMinutes = merged.reduce(
    (sum, iv, i) => (i === 0 ? 0 : sum + (iv.start - merged[i - 1].end)),
    0,
  );
  const deductions =
    (day.subtractLunch ? Math.max(0, day.lunchMinutes) : 0) +
    (day.subtractCommute ? Math.max(0, day.commuteMinutes) : 0);
  const deductedMinutes = Math.min(deductions, grossMinutes);
  const workedMinutes = grossMinutes - deductedMinutes;
  const remainingMinutes = Math.max(0, day.targetMinutes - workedMinutes);
  const hasOpenRow = day.rows.some(r => r.end === '' && parseTime(r.start) !== undefined);
  const lastEnd = merged.length > 0 ? merged[merged.length - 1].end : undefined;
  // Full deductions still have to be worked off even if not all subtracted yet.
  const leaveAtMinutes = hasOpenRow
    ? now + Math.max(0, day.targetMinutes + deductions - grossMinutes)
    : lastEnd;
  return {
    workedMinutes,
    grossMinutes,
    awayMinutes,
    deductedMinutes,
    remainingMinutes,
    leaveAtMinutes,
    hasOpenRow,
  };
}

export function createEmptyDay(date: string, base?: Partial<WorkDay>): WorkDay {
  return {
    date,
    rows: [],
    subtractLunch: base?.subtractLunch ?? true,
    lunchMinutes: base?.lunchMinutes ?? DEFAULT_LUNCH_MINUTES,
    subtractCommute: base?.subtractCommute ?? false,
    commuteMinutes: base?.commuteMinutes ?? DEFAULT_COMMUTE_MINUTES,
    targetMinutes: base?.targetMinutes ?? DEFAULT_TARGET_MINUTES,
  };
}
