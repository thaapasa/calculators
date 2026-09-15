import { describe, expect, it } from 'vitest';

import {
  createEmptyDay,
  formatDecimalHours,
  formatDuration,
  formatTime,
  orderRowsByStart,
  parseTime,
  summarize,
  withOrderedRows,
  WorkDay,
} from './worktime';

const t = (s: string) => parseTime(s)!;

function day(rows: WorkDay['rows'], extra: Partial<WorkDay> = {}): WorkDay {
  return { ...createEmptyDay(), rows, ...extra };
}

describe('parseTime / formatTime', () => {
  it('parses valid times', () => {
    expect(parseTime('08:30')).toBe(510);
    expect(parseTime('8:05')).toBe(485);
    expect(parseTime('23:59')).toBe(1439);
  });
  it('rejects invalid times', () => {
    expect(parseTime('')).toBeUndefined();
    expect(parseTime('24:00')).toBeUndefined();
    expect(parseTime('12:60')).toBeUndefined();
    expect(parseTime('abc')).toBeUndefined();
  });
  it('formats minutes, wrapping past midnight', () => {
    expect(formatTime(510)).toBe('08:30');
    expect(formatTime(24 * 60 + 15)).toBe('00:15');
  });
  it('formats durations', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(443)).toBe('7:23');
    expect(formatDuration(-5)).toBe('-0:05');
    expect(formatDecimalHours(450)).toBe('7.50');
  });
});

describe('orderRowsByStart', () => {
  const at = (start: string) => ({ start, end: '' });

  it(`orders rows by start time, keeping each row's index`, () => {
    expect(orderRowsByStart([at('13:00'), at('08:00'), at('12:00')])).toEqual([
      { row: at('08:00'), index: 1 },
      { row: at('12:00'), index: 2 },
      { row: at('13:00'), index: 0 },
    ]);
  });

  it('sorts rows with no readable start last, in the order they were entered', () => {
    expect(orderRowsByStart([at(''), at('08:00'), at('nope')]).map(r => r.index)).toEqual([
      1, 0, 2,
    ]);
  });
});

describe('withOrderedRows', () => {
  it('returns the same day when the rows are already in order', () => {
    const d = day([{ start: '08:00', end: '12:00' }]);
    expect(withOrderedRows(d)).toBe(d);
  });

  it('reorders the rows otherwise', () => {
    const rows = [
      { start: '13:00', end: '16:00' },
      { start: '08:00', end: '12:00' },
    ];
    expect(withOrderedRows(day(rows)).rows).toEqual([rows[1], rows[0]]);
  });
});

describe('summarize', () => {
  it('sums closed rows and subtracts lunch once', () => {
    const s = summarize(
      day([
        { start: '08:00', end: '12:00' },
        { start: '12:30', end: '16:30' },
      ]),
      t('20:00'),
    );
    expect(s.grossMinutes).toBe(480);
    expect(s.deductedMinutes).toBe(30);
    expect(s.workedMinutes).toBe(450);
    expect(s.awayMinutes).toBe(30);
    expect(s.hasOpenRow).toBe(false);
    expect(s.leaveAtMinutes).toBe(t('16:30'));
    expect(s.remainingMinutes).toBe(0);
  });

  it('counts no time away when rows meet exactly', () => {
    const s = summarize(
      day(
        [
          { start: '08:00', end: '12:00' },
          { start: '12:00', end: '16:00' },
        ],
        { subtractLunch: false },
      ),
      t('20:00'),
    );
    expect(s.grossMinutes).toBe(480);
    expect(s.awayMinutes).toBe(0);
    expect(s.rowErrors).toEqual({});
  });

  it('uses NOW for open rows and computes leave time', () => {
    const s = summarize(day([{ start: '08:00', end: '' }]), t('10:00'));
    expect(s.grossMinutes).toBe(120);
    expect(s.workedMinutes).toBe(90);
    expect(s.hasOpenRow).toBe(true);
    // 7.5h target + 30 min lunch => 8h from 08:00
    expect(s.leaveAtMinutes).toBe(t('16:00'));
    expect(s.remainingMinutes).toBe(360);
  });

  it('accounts for lunch not yet worked off when computing leave time', () => {
    const s = summarize(day([{ start: '08:00', end: '' }]), t('08:10'));
    expect(s.grossMinutes).toBe(10);
    expect(s.deductedMinutes).toBe(10);
    expect(s.workedMinutes).toBe(0);
    expect(s.leaveAtMinutes).toBe(t('16:00'));
  });

  it('reports a leave-at time past midnight as a wall-clock time', () => {
    const s = summarize(day([{ start: '20:00', end: '' }]), t('20:00'));
    expect(formatTime(s.leaveAtMinutes!)).toBe('04:00');
  });

  it('subtracts commute together with lunch', () => {
    const s = summarize(day([{ start: '08:00', end: '' }], { subtractCommute: true }), t('10:00'));
    expect(s.deductedMinutes).toBe(60);
    expect(s.workedMinutes).toBe(60);
    expect(s.leaveAtMinutes).toBe(t('16:30'));
  });

  it('skips lunch when disabled', () => {
    const s = summarize(day([{ start: '08:00', end: '' }], { subtractLunch: false }), t('10:00'));
    expect(s.workedMinutes).toBe(120);
    expect(s.leaveAtMinutes).toBe(t('15:30'));
  });

  it('reads an end time of 00:00 as the end of the day', () => {
    const s = summarize(day([{ start: '22:00', end: '00:00' }], { subtractLunch: false }), 0);
    expect(s.grossMinutes).toBe(120);
    expect(s.rowErrors).toEqual({});
  });

  it('reads a row of 00:00 to 00:00 as the whole day', () => {
    const s = summarize(day([{ start: '00:00', end: '00:00' }], { subtractLunch: false }), 0);
    expect(s.grossMinutes).toBe(24 * 60);
  });

  it('orders rows by start time regardless of the order they were entered', () => {
    const s = summarize(
      day(
        [
          { start: '13:00', end: '16:00' },
          { start: '08:00', end: '12:00' },
        ],
        { subtractLunch: false },
      ),
      t('20:00'),
    );
    expect(s.grossMinutes).toBe(420);
    expect(s.awayMinutes).toBe(60);
    expect(s.rowErrors).toEqual({});
  });

  it('marks a row whose end is before its start', () => {
    const s = summarize(
      day(
        [
          { start: '13:00', end: '12:00' },
          { start: '08:00', end: '12:00' },
        ],
        { subtractLunch: false },
      ),
      t('20:00'),
    );
    expect(s.grossMinutes).toBe(240);
    expect(s.rowErrors).toEqual({ 0: 'endBeforeStart' });
  });

  it('marks a row crossing midnight instead of counting it', () => {
    const s = summarize(
      day([{ start: '22:00', end: '02:00' }], { subtractLunch: false }),
      t('03:00'),
    );
    expect(s.grossMinutes).toBe(0);
    expect(s.rowErrors).toEqual({ 0: 'endBeforeStart' });
  });

  it('counts a row that has just started as zero length', () => {
    const s = summarize(day([{ start: '10:00', end: '' }], { subtractLunch: false }), t('10:00'));
    expect(s.grossMinutes).toBe(0);
    expect(s.rowErrors).toEqual({});
    expect(s.hasOpenRow).toBe(true);
    expect(s.leaveAtMinutes).toBe(t('17:30'));
  });

  it('counts a closed row of zero length without marking it', () => {
    const s = summarize(day([{ start: '10:00', end: '10:00' }], { subtractLunch: false }), 0);
    expect(s.grossMinutes).toBe(0);
    expect(s.rowErrors).toEqual({});
    expect(s.leaveAtMinutes).toBe(t('10:00'));
  });

  it('marks an open row whose start is in the future', () => {
    const s = summarize(day([{ start: '17:00', end: '' }], { subtractLunch: false }), t('10:00'));
    expect(s.grossMinutes).toBe(0);
    expect(s.hasOpenRow).toBe(true);
    expect(s.rowErrors).toEqual({ 0: 'startInFuture' });
    expect(s.leaveAtMinutes).toBeUndefined();
  });

  it('marks an open row left running overnight, and counts it once it is closed', () => {
    const open = summarize(
      day([{ start: '22:00', end: '' }], { subtractLunch: false }),
      t('09:00'),
    );
    expect(open.grossMinutes).toBe(0);
    expect(open.rowErrors).toEqual({ 0: 'startInFuture' });
    expect(open.leaveAtMinutes).toBeUndefined();

    const closed = summarize(
      day([{ start: '22:00', end: '23:30' }], { subtractLunch: false }),
      t('09:00'),
    );
    expect(closed.grossMinutes).toBe(90);
    expect(closed.rowErrors).toEqual({});
    expect(closed.leaveAtMinutes).toBe(t('23:30'));
  });

  it('reports the last counted end when an open row does not count', () => {
    const s = summarize(
      day(
        [
          { start: '08:00', end: '12:00' },
          { start: '17:00', end: '' },
        ],
        { subtractLunch: false },
      ),
      t('13:00'),
    );
    expect(s.grossMinutes).toBe(240);
    expect(s.hasOpenRow).toBe(true);
    expect(s.rowErrors).toEqual({ 1: 'startInFuture' });
    expect(s.leaveAtMinutes).toBe(t('12:00'));
  });

  it('marks an overlapping row instead of merging it', () => {
    const s = summarize(
      day(
        [
          { start: '08:00', end: '12:00' },
          { start: '11:00', end: '13:00' },
        ],
        { subtractLunch: false },
      ),
      t('20:00'),
    );
    expect(s.grossMinutes).toBe(240);
    expect(s.awayMinutes).toBe(0);
    expect(s.rowErrors).toEqual({ 1: 'overlap' });
  });

  it('ignores rows with invalid start or end', () => {
    const s = summarize(
      day(
        [
          { start: '', end: '12:00' },
          { start: '08:00', end: 'x' },
          { start: '13:00', end: '14:00' },
        ],
        {
          subtractLunch: false,
        },
      ),
      t('20:00'),
    );
    expect(s.grossMinutes).toBe(60);
    expect(s.hasOpenRow).toBe(false);
    expect(s.rowErrors).toEqual({});
  });

  it('returns zeros for empty day', () => {
    const s = summarize(day([]), t('10:00'));
    expect(s.workedMinutes).toBe(0);
    expect(s.deductedMinutes).toBe(0);
    expect(s.leaveAtMinutes).toBeUndefined();
  });
});
