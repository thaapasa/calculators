import { DateTime, Settings } from 'luxon';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { buildDateTime, computeOutputs, fieldReaders, TimeValues } from './time';

const weekDays = ['', 'ma', 'ti', 'ke', 'to', 'pe', 'la', 'su'];

const outputs = (m: DateTime) => computeOutputs(m, weekDays);
const build = (date: string, h = '10', m = '00', s = '00', ms = '000') =>
  outputs(buildDateTime(date, h, m, s, ms));
const read = (field: string, value: string) => outputs(fieldReaders[field](value));

const empty: TimeValues = {
  date: '',
  hour: '',
  minute: '',
  second: '',
  millisecond: '',
  timeZone: '',
  weekDay: '',
  week: '',
  nameDay: '',
  iso8601: '',
  iso8601utc: '',
  javaTime: '',
  unixTime: '',
};

describe('time', () => {
  const originalZone = Settings.defaultZone;
  beforeAll(() => {
    Settings.defaultZone = 'Europe/Helsinki';
  });
  afterAll(() => {
    Settings.defaultZone = originalZone;
  });

  describe('outputs', () => {
    it('shows every format of a moment', () => {
      expect(build('31.12.2016')).toEqual({
        date: '31.12.2016',
        hour: '10',
        minute: '00',
        second: '00',
        millisecond: '000',
        timeZone: '+02:00',
        weekDay: 'la',
        week: '2016/52',
        nameDay: 'Sylvester, Silvo',
        iso8601: '2016-12-31T10:00:00+02:00',
        iso8601utc: '2016-12-31T08:00:00.000Z',
        javaTime: '1483171200000',
        unixTime: '1483171200',
      });
    });

    it('uses the ISO week year at the turn of the year', () => {
      expect(build('1.1.2021').week).toEqual('2020/53');
      expect(build('31.12.2024').week).toEqual('2025/1');
    });

    it('uses the offset of summer time', () => {
      expect(build('1.7.2020').timeZone).toEqual('+03:00');
    });

    it('moves a time in the summer time gap forward', () => {
      const out = build('29.3.2026', '3', '30');
      expect(out.hour).toEqual('04');
      expect(out.iso8601).toEqual('2026-03-29T04:30:00+03:00');
    });
  });

  describe('date and time fields', () => {
    it('reads a date with or without leading zeros', () => {
      expect(build('01.01.2021', '1', '2', '3', '4').iso8601utc).toEqual(
        '2020-12-31T23:02:03.004Z',
      );
      expect(build('1.1.2021', '1', '2', '3', '4').iso8601utc).toEqual('2020-12-31T23:02:03.004Z');
    });

    it('reads a two-digit year', () => {
      expect(build('1.1.20').date).toEqual('1.1.2020');
      expect(build('1.1.68').date).toEqual('1.1.2068');
      expect(build('1.1.69').date).toEqual('1.1.1969');
    });

    it('uses the current year when the year is left out', () => {
      const year = DateTime.now().year;
      expect(build('1.1.').date).toEqual(`1.1.${year}`);
      expect(build('1.1').date).toEqual(`1.1.${year}`);
    });

    it('gives empty outputs for a date that does not exist', () => {
      expect(build('31.2.2016')).toEqual(empty);
      expect(build('29.2.2025')).toEqual(empty);
      expect(build('29.2.2024').date).toEqual('29.2.2024');
    });

    it('gives empty outputs for input that is not a date', () => {
      expect(build('abc')).toEqual(empty);
      expect(build('')).toEqual(empty);
      expect(build('1.1.2021x')).toEqual(empty);
    });

    it('gives empty outputs for a missing or invalid time', () => {
      expect(build('1.1.2021', '')).toEqual(empty);
      expect(build('1.1.2021', '25')).toEqual(empty);
      expect(build('1.1.2021', '1', '2', '3', '')).toEqual(empty);
    });
  });

  describe('timestamp fields', () => {
    it('reads ISO 8601 and shows it in the local time zone', () => {
      expect(read('iso8601', '2016-12-31T10:00:00+02:00').iso8601).toEqual(
        '2016-12-31T10:00:00+02:00',
      );
      expect(read('iso8601utc', '2016-12-31T08:00:00.123Z')).toMatchObject({
        iso8601: '2016-12-31T10:00:00+02:00',
        millisecond: '123',
      });
      expect(read('iso8601', '2016-12-31T09:00:00+01:00').hour).toEqual('10');
    });

    it('reads partial ISO 8601 as local time', () => {
      expect(read('iso8601', '2016-12-31').iso8601).toEqual('2016-12-31T00:00:00+02:00');
      expect(read('iso8601', '2016-12-31T10:00').iso8601).toEqual('2016-12-31T10:00:00+02:00');
      expect(read('iso8601', '2016').date).toEqual('1.1.2016');
    });

    it('reads Java time and Unix time', () => {
      expect(read('javaTime', '1483171200123').iso8601utc).toEqual('2016-12-31T08:00:00.123Z');
      expect(read('javaTime', '-1000').iso8601utc).toEqual('1969-12-31T23:59:59.000Z');
      expect(read('unixTime', '1483171200').iso8601utc).toEqual('2016-12-31T08:00:00.000Z');
    });

    it('reads the leading digits of a timestamp', () => {
      expect(read('javaTime', '12abc').javaTime).toEqual('12');
      expect(read('unixTime', '1.5').unixTime).toEqual('1');
    });

    it('gives empty outputs for input that is not a timestamp', () => {
      expect(read('iso8601', 'junk')).toEqual(empty);
      expect(read('iso8601', '')).toEqual(empty);
      expect(read('javaTime', '')).toEqual(empty);
      expect(read('unixTime', '')).toEqual(empty);
    });
  });
});
