import { DateTime } from 'luxon';

import { zeroPad } from '../util/strings';
import { getRandomInt } from '../util/util';

/* Hetu (Henkilötunnus, Finnish Social Security Number) */
/* ---------------------------------------------------- */
const hetuChecks = 'ABCDEFHJKLMNPRSTUVWXY';

/**
 * The separator gives the century of the birth date. The letters other than A were added in 2023,
 * when codes for the most common birth dates started to run out.
 */
const centuryBySeparator: Record<string, number> = {
  '+': 1800,
  '-': 1900,
  Y: 1900,
  X: 1900,
  W: 1900,
  V: 1900,
  U: 1900,
  A: 2000,
  B: 2000,
  C: 2000,
  D: 2000,
  E: 2000,
  F: 2000,
};

const hetuPattern = /^(\d{2})(\d{2})(\d{2})(.)(\d{3})$/;

/**
 * Gives the check character of a hetu without its check character, such as `131052-308`. If the
 * input is not a hetu, or its date does not exist, gives an empty string.
 */
export function check(hetu: string): string {
  const match = hetuPattern.exec(hetu);
  if (!match) return '';
  const [, day, month, year, separator, order] = match;
  const century = centuryBySeparator[separator];
  if (century === undefined) return '';
  const date = DateTime.fromObject({
    day: Number(day),
    month: Number(month),
    year: century + Number(year),
  });
  if (!date.isValid) return '';

  const checksum = Number(`${day}${month}${year}${order}`) % 31;
  return checksum < 10 ? checksum.toString() : hetuChecks[checksum - 10];
}

const firstBirthDate = DateTime.fromObject({ year: 1950, month: 1, day: 1 });
const lastBirthDate = DateTime.fromObject({ year: 2013, month: 12, day: 31 });

/** Gives a random hetu born between 1950 and 2013, without its check character */
export function generate(): string {
  const days = Math.round(lastBirthDate.diff(firstBirthDate, 'days').days);
  const date = firstBirthDate.plus({ days: getRandomInt(0, days + 1) });
  const separator = date.year >= 2000 ? 'A' : '-';
  // Individual numbers 002-899 are given to people, and 900-999 are for temporary codes
  const counter = getRandomInt(2, 900);
  return date.toFormat('ddMMyy') + separator + zeroPad(counter.toString(), 3);
}
