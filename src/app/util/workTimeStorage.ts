import { createEmptyDay, type WorkDay } from 'app/calc/worktime';

import * as store from './store';

const WORK_DAY_STORE_KEY = 'calculators:work-day';

/**
 * Loads the stored work day. The rows are not tied to a date, so they are restored as
 * they were, however long ago they were written.
 */
export function loadWorkDay(): WorkDay {
  const stored = store.getValue<Partial<WorkDay>>(WORK_DAY_STORE_KEY);
  if (!stored || typeof stored !== 'object') return createEmptyDay();
  const base = createEmptyDay(stored);
  return Array.isArray(stored.rows) ? { ...base, rows: stored.rows } : base;
}

export function storeWorkDay(day: WorkDay) {
  store.putValue(WORK_DAY_STORE_KEY, day);
}
