import { zeroPad } from '../util/strings';
import { getRandomInt } from '../util/util';

/* Company id (Y-tunnus)    */
/* ------------------------ */
const companyIdWeights = [7, 9, 10, 5, 8, 4, 2];

export function check(value: string): string {
  if (value.length !== 7) {
    return '';
  }
  let sum = 0;
  for (let i = 0; i < 7; ++i) {
    const c = parseInt(value.charAt(i), 10);
    if (isNaN(c)) {
      return '';
    }
    sum += c * companyIdWeights[i];
  }
  const div = sum % 11;
  return div === 0 ? '0' : (div === 1 ? '-' : 11 - div).toString();
}

export function generate(): string {
  return zeroPad(getRandomInt(1, 9999999).toString(), 7);
}
