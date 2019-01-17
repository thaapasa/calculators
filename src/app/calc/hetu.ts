import { zeroPad } from '../util/strings';
import { getRandomInt } from '../util/util';

/* Hetu (Henkilötunnus, Finnish Social Security Number) */
/* ---------------------------------------------------- */
const hetuChecks = 'ABCDEFHJKLMNPRSTUVWXY';

const hetuSeparators = ['A', '-', '+'];

export function check(hetu: string): string {
  if (hetu.length !== 10) {
    return '';
  }
  const date = hetu.substr(0, 6);
  const mark = hetu.charAt(6);
  const start = 7;
  if (hetuSeparators.indexOf(mark) === -1) {
    // Invalid separator
    return '';
  }
  // Get hetu order num
  const order = hetu.substr(start, 3);

  const num = parseInt(`${date}${order}`, 10);
  const checksum = num % 31;
  return checksum < 10 ? checksum.toString() : hetuChecks[checksum - 10];
}

export function generate(): string {
  // TODO: Use a date lib to generate all dates
  const day = getRandomInt(1, 29);
  const month = getRandomInt(1, 13);
  let year = getRandomInt(50, 114);
  let separator = '-';
  if (year > 99) {
    year -= 100;
    separator = 'A';
  }
  const counter = getRandomInt(1, 999);
  return (
    zeroPad(day.toString(), 2) +
    zeroPad(month.toString(), 2) +
    zeroPad(year.toString(), 2) +
    separator +
    zeroPad(counter.toString(), 3)
  );
}
