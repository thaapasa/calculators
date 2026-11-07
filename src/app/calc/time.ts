import { strToInt } from 'app/calc/numbers';
import { getNameDay } from 'app/util/namedays';
import { zeroPad } from 'app/util/strings';
import { DateTime } from 'luxon';

const invalid = DateTime.invalid('unparsable');

function readInt(s: string): number {
  return parseInt(s, 10);
}

export function readJavaTime(s: string): DateTime {
  const millis = readInt(s);
  return isNaN(millis) ? invalid : DateTime.fromMillis(millis);
}

export function readUnixTime(s: string): DateTime {
  const seconds = readInt(s);
  return isNaN(seconds) ? invalid : DateTime.fromSeconds(seconds);
}

export function toIsoWeek(v: DateTime): string {
  return v.isValid ? `${v.weekYear}/${v.weekNumber}` : '';
}

export function pad(val: string | number, len: number): string {
  if (typeof val === 'number' && isNaN(val)) {
    return val.toString();
  }
  return zeroPad(val.toString(), len);
}

interface DateParts {
  day: number;
  month: number;
  year: number;
}

const datePattern = /^(\d{1,2})\.(\d{1,2})(?:\.(\d{1,4})?)?$/;

/** Two-digit years below 69 are in the 2000s, the rest in the 1900s */
function expandYear(year: string): number {
  const num = readInt(year);
  if (year.length !== 2) return num;
  return num + (num > 68 ? 1900 : 2000);
}

/**
 * Reads a date such as `31.12.2016`. If the year is left out, as in `31.12.`, the date is in the
 * current year.
 */
export function readDateText(v: string): DateParts | undefined {
  const match = datePattern.exec(v.trim());
  if (!match) return undefined;
  const [, day, month, year] = match;
  return {
    day: readInt(day),
    month: readInt(month),
    year: year ? expandYear(year) : DateTime.now().year,
  };
}

export function writeDateText(v: DateTime): string {
  return v.isValid ? v.toFormat('d.M.yyyy') : '';
}

export function buildDateTime(
  dateStr: string,
  hour: string,
  minute: string,
  second: string,
  millisecond: string,
): DateTime {
  const date = readDateText(dateStr);
  if (!date) return invalid;
  const time = {
    hour: strToInt(hour),
    minute: strToInt(minute),
    second: strToInt(second),
    millisecond: strToInt(millisecond),
  };
  if (Object.values(time).some(isNaN)) return invalid;
  return DateTime.fromObject({ ...date, ...time });
}

const writeIso8601 = (m: DateTime) => (m.isValid ? m.toFormat("yyyy-MM-dd'T'HH:mm:ssZZ") : '');
const writeIso8601Utc = (m: DateTime) => (m.isValid ? (m.toUTC().toISO() ?? '') : '');
const writeJavaTime = (m: DateTime) => (m.isValid ? String(m.toMillis()) : '');
const writeUnixTime = (m: DateTime) => (m.isValid ? String(m.toUnixInteger()) : '');
const writeNameDay = (m: DateTime) => (m.isValid ? (getNameDay(m.month, m.day) ?? '') : '');

export function computeOutputs(m: DateTime, weekDayLabels: readonly string[]) {
  return {
    date: writeDateText(m),
    hour: m.isValid ? pad(m.hour, 2) : '',
    minute: m.isValid ? pad(m.minute, 2) : '',
    second: m.isValid ? pad(m.second, 2) : '',
    millisecond: m.isValid ? pad(m.millisecond, 3) : '',
    timeZone: m.isValid ? m.toFormat('ZZ') : '',
    weekDay: m.isValid ? (weekDayLabels[m.weekday] ?? '') : '',
    week: toIsoWeek(m),
    nameDay: writeNameDay(m),
    iso8601: writeIso8601(m),
    iso8601utc: writeIso8601Utc(m),
    javaTime: writeJavaTime(m),
    unixTime: writeUnixTime(m),
  };
}

export type TimeValues = ReturnType<typeof computeOutputs>;
export type TimeField = keyof TimeValues;

export type EditableField =
  | 'date'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond'
  | 'iso8601'
  | 'iso8601utc'
  | 'javaTime'
  | 'unixTime';

export const reportableFields: Record<string, boolean> = {
  iso8601: true,
  iso8601utc: true,
  javaTime: true,
  unixTime: true,
  nameDay: true,
  week: true,
  date: true,
};

/** ISO 8601 input is shown in the local time zone, whatever offset it was written with */
const readIso8601 = (s: string) => DateTime.fromISO(s.trim()).toLocal();

export const fieldReaders: Record<string, (s: string) => DateTime> = {
  iso8601: readIso8601,
  iso8601utc: readIso8601,
  javaTime: readJavaTime,
  unixTime: readUnixTime,
};

export const fieldWriters: Record<string, (m: DateTime) => string> = {
  iso8601: writeIso8601,
  iso8601utc: writeIso8601Utc,
  javaTime: writeJavaTime,
  unixTime: writeUnixTime,
  week: toIsoWeek,
  nameDay: writeNameDay,
  date: writeDateText,
};
