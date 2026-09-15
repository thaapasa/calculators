// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { WorkTimePage } from './WorkTimePage';

const KEY = 'calculators:work-day';

function seed(day: object) {
  window.localStorage.setItem(KEY, JSON.stringify(day));
}

function timeInputValues(): string[] {
  return [...document.querySelectorAll<HTMLInputElement>('input[type="time"]')].map(i => i.value);
}

/** The read-only outputs, in page order: worked, away, remaining, leave-at. */
function outputValues(): string[] {
  return [...document.querySelectorAll<HTMLInputElement>('input[readonly]')].map(i => i.value);
}

describe('WorkTimePage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 15, 20, 0, 0));
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('shows rows in start order and marks the row it cannot count', () => {
    seed({
      rows: [
        { start: '13:00', end: '12:00' },
        { start: '08:00', end: '12:00' },
      ],
      subtractLunch: false,
    });
    render(<WorkTimePage />);

    expect(timeInputValues()).toEqual(['08:00', '12:00', '13:00', '12:00']);
    expect(screen.getByText('Loppuaika on ennen alkuaikaa')).toBeTruthy();
    // Worked total, ignoring the marked row
    expect(screen.getByDisplayValue('4:00')).toBeTruthy();
  });

  it('marks an overlapping row and leaves it out of the total', () => {
    seed({
      rows: [
        { start: '08:00', end: '12:00' },
        { start: '11:00', end: '13:00' },
      ],
      subtractLunch: false,
    });
    render(<WorkTimePage />);

    expect(screen.getByText('Rivi menee edellisen rivin päälle')).toBeTruthy();
    expect(screen.getByDisplayValue('4:00')).toBeTruthy();
  });

  it('re-sorts a row only once its start time is committed', () => {
    seed({
      rows: [
        { start: '08:00', end: '12:00' },
        { start: '13:00', end: '16:00' },
      ],
      subtractLunch: false,
    });
    render(<WorkTimePage />);

    const starts = () => timeInputValues().filter((_, i) => i % 2 === 0);
    const second = document.querySelectorAll<HTMLInputElement>('input[type="time"]')[2];

    // Typing an earlier time leaves the row where it is
    fireEvent.change(second, { target: { value: '07:00' } });
    expect(starts()).toEqual(['08:00', '07:00']);

    // Leaving the field moves it into place
    fireEvent.blur(second);
    expect(starts()).toEqual(['07:00', '08:00']);
  });

  it('keeps the rows when the date changes', () => {
    seed({ rows: [{ start: '08:00', end: '12:00' }], subtractLunch: false });
    render(<WorkTimePage />);

    vi.setSystemTime(new Date(2026, 8, 16, 9, 0, 0));
    vi.advanceTimersByTime(5 * 60_000);

    expect(timeInputValues()).toEqual(['08:00', '12:00']);
    expect(screen.getByDisplayValue('4:00')).toBeTruthy();
  });

  it('clocking in adds a row that counts straight away, with no error', () => {
    render(<WorkTimePage />);

    fireEvent.click(screen.getByRole('button', { name: /Aloita/ }));

    expect(timeInputValues()).toEqual(['20:00', '']);
    expect(screen.queryByText(/Loppuaika|Alkuaika/)).toBeNull();
    // Worked 0:00 so far, and a leave-at time already offered
    expect(outputValues()).toEqual(['0:00', '0:00', '7:30', '04:00']);
  });

  it('does not offer a leave-at time for an open row it cannot count', () => {
    seed({ rows: [{ start: '22:00', end: '' }] });
    vi.setSystemTime(new Date(2026, 8, 16, 9, 0, 0));
    render(<WorkTimePage />);

    expect(screen.getByText('Alkuaika on tulevaisuudessa')).toBeTruthy();
    expect(outputValues()).toEqual(['0:00', '0:00', '7:30', '']);
  });

  it('shows a leave-at time past midnight as a wall-clock time', () => {
    seed({ rows: [{ start: '20:00', end: '' }] });
    render(<WorkTimePage />);

    // 20:00 start, 7.5 h target, 30 min lunch
    expect(screen.getByDisplayValue('04:00')).toBeTruthy();
  });
});
