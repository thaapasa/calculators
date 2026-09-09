import { describe, expect, it } from 'vitest';

import {
  createEmptyDay,
  formatDecimalHours,
  formatDuration,
  formatTime,
  parseTime,
  summarize,
  WorkDay,
} from './worktime';

const t = (s: string) => parseTime(s)!;

function day(rows: WorkDay['rows'], extra: Partial<WorkDay> = {}): WorkDay {
  return { ...createEmptyDay('2026-09-08'), rows, ...extra };
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
    expect(s.lunchMinutes).toBe(30);
    expect(s.workedMinutes).toBe(450);
    expect(s.awayMinutes).toBe(30);
    expect(s.hasOpenRow).toBe(false);
    expect(s.leaveAtMinutes).toBe(t('16:30'));
    expect(s.remainingMinutes).toBe(0);
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
    expect(s.lunchMinutes).toBe(10);
    expect(s.workedMinutes).toBe(0);
    expect(s.leaveAtMinutes).toBe(t('16:00'));
  });

  it('skips lunch when disabled', () => {
    const s = summarize(day([{ start: '08:00', end: '' }], { subtractLunch: false }), t('10:00'));
    expect(s.workedMinutes).toBe(120);
    expect(s.leaveAtMinutes).toBe(t('15:30'));
  });

  it('merges overlapping rows', () => {
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
    expect(s.grossMinutes).toBe(300);
    expect(s.awayMinutes).toBe(0);
  });

  it('handles rows crossing midnight', () => {
    const s = summarize(
      day([{ start: '22:00', end: '02:00' }], { subtractLunch: false }),
      t('03:00'),
    );
    expect(s.grossMinutes).toBe(240);
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
  });

  it('returns zeros for empty day', () => {
    const s = summarize(day([]), t('10:00'));
    expect(s.workedMinutes).toBe(0);
    expect(s.lunchMinutes).toBe(0);
    expect(s.leaveAtMinutes).toBeUndefined();
  });
});
