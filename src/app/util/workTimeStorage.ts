import { createEmptyDay, todayKey, type WorkDay } from 'app/calc/worktime';

import * as store from './store';

const WORK_DAY_STORE_KEY = 'calculators:work-day';

/**
 * Loads the stored work day. Rows from a previous day are discarded, but the
 * lunch and target settings are carried over.
 */
export function loadWorkDay(today: string = todayKey()): WorkDay {
  const stored = store.getValue<Partial<WorkDay>>(WORK_DAY_STORE_KEY);
  if (!stored || typeof stored !== 'object') return createEmptyDay(today);
  if (stored.date === today && Array.isArray(stored.rows)) {
    return { ...createEmptyDay(today, stored), rows: stored.rows };
  }
  return createEmptyDay(today, stored);
}

export function storeWorkDay(day: WorkDay) {
  store.putValue(WORK_DAY_STORE_KEY, day);
}
