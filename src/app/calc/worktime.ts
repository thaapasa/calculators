import { zeroPad } from 'app/util/strings';

/**
 * Work time tracking calculations. All times are local 'HH:mm' strings within a single
 * day; no row crosses midnight. An empty end time means the row is still open and NOW is
 * used as its end.
 */

export interface WorkRow {
  /** Start time as 'HH:mm', or '' if unset */
  readonly start: string;
  /** End time as 'HH:mm', or '' if still open */
  readonly end: string;
}

export interface WorkDay {
  readonly rows: readonly WorkRow[];
  readonly subtractLunch: boolean;
  readonly lunchMinutes: number;
  readonly subtractCommute: boolean;
  readonly commuteMinutes: number;
  /** Target working day length in minutes */
  readonly targetMinutes: number;
}

/** A row paired with its index in the day's rows, so ordering does not lose it */
export interface OrderedRow<T extends WorkRow = WorkRow> {
  readonly row: T;
  readonly index: number;
}

/** Reason a row does not count towards the totals */
export type WorkRowError = 'endBeforeStart' | 'startInFuture' | 'overlap';

export interface ResolvedRow {
  /** Index of the row in the day's rows */
  readonly index: number;
  readonly start: number;
  /** End of the row, or NOW while it is open */
  readonly end: number;
  /** True while the row has no end time */
  readonly open: boolean;
  /** Reason the row is left out of the totals; undefined when it counts */
  readonly error: WorkRowError | undefined;
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
   * Minutes from midnight when target is reached, if a counted row is open; otherwise the
   * end of the last counted row. Undefined if there are no counted rows.
   */
  readonly leaveAtMinutes: number | undefined;
  /** True if any row is open (no end time) */
  readonly hasOpenRow: boolean;
  /** Reason each row does not count, indexed by its position in the day's rows */
  readonly rowErrors: Readonly<Record<number, WorkRowError>>;
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

/** Parses an end time, where '00:00' means the end of the day rather than its beginning. */
export function parseEndTime(s: string): number | undefined {
  const m = parseTime(s);
  return m === 0 ? MINUTES_PER_DAY : m;
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

/**
 * Pairs each row with its index and orders them by start time. Rows whose start cannot be
 * read sort last, keeping the order they were entered in.
 */
export function orderRowsByStart<T extends WorkRow>(rows: readonly T[]): OrderedRow<T>[] {
  const startOf = (row: T) => parseTime(row.start) ?? Number.MAX_SAFE_INTEGER;
  return rows.map((row, index) => ({ row, index })).sort((a, b) => startOf(a.row) - startOf(b.row));
}

/** Returns the day with its rows in start order, or the day itself if they already are. */
export function withOrderedRows(day: WorkDay): WorkDay {
  const rows = orderRowsByStart(day.rows).map(r => r.row);
  return rows.every((row, i) => row === day.rows[i]) ? day : { ...day, rows };
}

/**
 * Resolves rows into minute intervals, ordered by start time. Rows whose times cannot be
 * read are left out entirely; an empty end resolves to `now`, so a row that has just
 * started counts and contributes nothing yet. A row counts unless its end falls before its
 * start or it overlaps the row before it; any other row is returned with the reason it
 * does not count.
 */
export function resolveIntervals(rows: readonly WorkRow[], now: number): ResolvedRow[] {
  const result: ResolvedRow[] = [];
  let countedEnd: number | undefined;
  for (const { row, index } of orderRowsByStart(rows)) {
    const start = parseTime(row.start);
    if (start === undefined) continue;
    const open = row.end === '';
    const end = open ? now : parseEndTime(row.end);
    if (end === undefined) continue;
    const resolved = { index, start, end, open };
    if (end < start) {
      result.push({ ...resolved, error: open ? 'startInFuture' : 'endBeforeStart' });
    } else if (countedEnd !== undefined && start < countedEnd) {
      result.push({ ...resolved, error: 'overlap' });
    } else {
      result.push({ ...resolved, error: undefined });
      countedEnd = end;
    }
  }
  return result;
}

export function summarize(day: WorkDay, now: number): WorkSummary {
  const resolved = resolveIntervals(day.rows, now);
  const counted = resolved.filter(r => r.error === undefined);
  const rowErrors: Record<number, WorkRowError> = {};
  for (const row of resolved) {
    if (row.error !== undefined) rowErrors[row.index] = row.error;
  }

  const grossMinutes = counted.reduce((sum, iv) => sum + (iv.end - iv.start), 0);
  const awayMinutes = counted.reduce(
    (sum, iv, i) => (i === 0 ? 0 : sum + (iv.start - counted[i - 1].end)),
    0,
  );
  const deductions =
    (day.subtractLunch ? Math.max(0, day.lunchMinutes) : 0) +
    (day.subtractCommute ? Math.max(0, day.commuteMinutes) : 0);
  const deductedMinutes = Math.min(deductions, grossMinutes);
  const workedMinutes = grossMinutes - deductedMinutes;
  const remainingMinutes = Math.max(0, day.targetMinutes - workedMinutes);
  // Drives the Pause button, so a row the totals reject still counts as open here.
  const hasOpenRow = day.rows.some(r => r.end === '' && parseTime(r.start) !== undefined);
  const lastEnd = counted.length > 0 ? counted[counted.length - 1].end : undefined;
  // Full deductions still have to be worked off even if not all subtracted yet.
  const leaveAtMinutes = counted.some(r => r.open)
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
    rowErrors,
  };
}

export function createEmptyDay(base?: Partial<WorkDay>): WorkDay {
  return {
    rows: [],
    subtractLunch: base?.subtractLunch ?? true,
    lunchMinutes: base?.lunchMinutes ?? DEFAULT_LUNCH_MINUTES,
    subtractCommute: base?.subtractCommute ?? false,
    commuteMinutes: base?.commuteMinutes ?? DEFAULT_COMMUTE_MINUTES,
    targetMinutes: base?.targetMinutes ?? DEFAULT_TARGET_MINUTES,
  };
}
