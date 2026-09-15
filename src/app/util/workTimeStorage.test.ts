// @vitest-environment jsdom
import { createEmptyDay } from 'app/calc/worktime';
import { beforeEach, describe, expect, it } from 'vitest';

import { loadWorkDay, storeWorkDay } from './workTimeStorage';

const KEY = 'calculators:work-day';

describe('loadWorkDay', () => {
  beforeEach(() => window.localStorage.clear());

  it('returns an empty day when nothing is stored', () => {
    expect(loadWorkDay()).toEqual(createEmptyDay());
  });

  it('restores a stored day unchanged', () => {
    const day = {
      ...createEmptyDay(),
      rows: [{ start: '08:00', end: '12:00' }],
      subtractCommute: true,
      targetMinutes: 480,
    };
    storeWorkDay(day);
    expect(loadWorkDay()).toEqual(day);
  });

  it('ignores a date field left over from older stored data', () => {
    const rows = [{ start: '09:00', end: '' }];
    window.localStorage.setItem(KEY, JSON.stringify({ date: '2020-01-01', rows }));
    const loaded = loadWorkDay();
    expect(loaded).toEqual({ ...createEmptyDay(), rows });
    expect(loaded).not.toHaveProperty('date');
  });
});
