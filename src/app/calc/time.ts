import { strToInt } from 'app/calc/numbers';
import { getNameDay } from 'app/util/namedays';
import { zeroPad } from 'app/util/strings';
import { isDefined } from 'app/util/util';
import moment from 'moment';

export function readJavaTime(s: string | number): moment.Moment {
  if (typeof s === 'string') {
    s = parseInt(s, 10);
  }
  return moment(s);
}

export function readUnixTime(s: string | number): moment.Moment {
  if (typeof s === 'string') {
    s = parseInt(s, 10);
  }
  return moment.unix(s);
}

export function toIsoWeek(v: moment.Moment): string {
  return v.isValid() ? `${v.isoWeekYear()}/${v.isoWeek()}` : '';
}

export function pad(val: string | number, len: number): string {
  if (typeof val === 'number' && isNaN(val)) {
    return val.toString();
  }
  return zeroPad(val.toString(), len);
}

export const datePattern = 'D.M.YYYY';

export function readDateText(v: string): object | undefined {
  const c = moment(v, datePattern);
  return c.isValid() ? { day: c.date(), month: c.month(), year: c.year() } : undefined;
}

export function writeDateText(v: moment.Moment): string {
  return v.isValid() ? v.format(datePattern) : '';
}

export const texts = {
  weekDay: ['', 'ma', 'ti', 'ke', 'to', 'pe', 'la', 'su'],
  types: {
    iso8601: 'ISO 8601',
    iso8601utc: 'ISO 8601 UTC',
    javaTime: 'Java/JS time',
    unixTime: 'Unixtime',
    nameDay: 'Nimipäivä',
    week: 'Viikko',
  } as Record<string, string>,
};

export const hints: Record<string, string> = {
  date: '31.12.2016',
  hour: '10',
  minute: '00',
  second: '00',
  millisecond: '000',
  timeZone: '+02:00',
};

function toStateValue(mom: moment.Moment, writer: (x: moment.Moment) => unknown): string {
  if (!moment.isMoment(mom)) return '';
  const s = writer(mom);
  if (!isDefined(s) || (typeof s === 'number' && isNaN(s))) return '';
  return typeof s === 'object' || s === null
    ? (s as unknown as string)
    : typeof s === 'number'
      ? `${s}`
      : (s as string);
}

export function buildMoment(
  dateStr: string,
  hour: string,
  minute: string,
  second: string,
  millisecond: string,
): moment.Moment {
  const d = readDateText(dateStr);
  return moment({
    day: d && (d as { day: number }).day,
    month: d && (d as { month: number }).month,
    year: d && (d as { year: number }).year,
    hour: strToInt(hour),
    minute: strToInt(minute),
    second: strToInt(second),
    millisecond: strToInt(millisecond),
  });
}

export function computeOutputs(m: moment.Moment) {
  return {
    date: writeDateText(m),
    hour: m.isValid() ? pad(m.hour(), 2) : '',
    minute: m.isValid() ? pad(m.minute(), 2) : '',
    second: m.isValid() ? pad(m.second(), 2) : '',
    millisecond: m.isValid() ? pad(m.millisecond(), 3) : '',
    timeZone: m.isValid() ? m.format('Z') : '',
    weekDay: toStateValue(m, v => texts.weekDay[v.isoWeekday()]),
    week: toStateValue(m, toIsoWeek),
    nameDay: toStateValue(m, v => getNameDay(v.month() + 1, v.date())),
    iso8601: m.isValid() ? m.format() : '',
    iso8601utc: m.isValid() ? m.toISOString() : '',
    javaTime: m.isValid() ? String(m.valueOf()) : '',
    unixTime: m.isValid() ? String(m.unix()) : '',
    datePicker: m.isValid() ? m.toDate() : undefined,
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

export const fieldReaders: Record<string, (s: string) => moment.Moment> = {
  iso8601: s => moment(s, moment.ISO_8601),
  iso8601utc: s => moment(s, moment.ISO_8601),
  javaTime: readJavaTime,
  unixTime: readUnixTime,
};

export const fieldWriters: Record<string, (m: moment.Moment) => string> = {
  iso8601: m => (m.isValid() ? m.format() : ''),
  iso8601utc: m => (m.isValid() ? m.toISOString() : ''),
  javaTime: m => (m.isValid() ? String(m.valueOf()) : ''),
  unixTime: m => (m.isValid() ? String(m.unix()) : ''),
  week: m => toStateValue(m, toIsoWeek),
  nameDay: m => toStateValue(m, v => getNameDay(v.month() + 1, v.date())),
  date: m => writeDateText(m),
};
