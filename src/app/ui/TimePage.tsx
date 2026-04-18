import {
  buildMoment,
  computeOutputs,
  datePattern,
  EditableField,
  fieldReaders,
  fieldWriters,
  reportableFields,
  TimeField,
  TimeValues,
} from 'app/calc/time';
import { type TranslationKey } from 'app/i18n/fi';
import { useTranslation } from 'app/i18n/LanguageContext';
import { useFocusPublisher } from 'app/util/useFocusPublisher';
import { cn } from 'lib/utils';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Item } from './component/Item';
import { NameDayItem, NameDaySearch } from './component/NameDaySearch';
import { HalfSection } from './component/Section';
import { publishSelectedValue } from './LastValue';

const hints: Record<string, string> = {
  date: '31.12.2016',
  hour: '10',
  minute: '00',
  second: '00',
  millisecond: '000',
  timeZone: '+02:00',
};

const reportTargetLabels = {
  iso8601: 'page.time.label.iso8601',
  iso8601utc: 'page.time.label.iso8601utc',
  javaTime: 'page.time.label.javaTime',
  unixTime: 'page.time.label.unixTime',
  nameDay: 'page.time.label.nameDay',
  week: 'page.time.label.week',
  date: 'page.time.label.date',
} as const satisfies Record<string, TranslationKey>;

export function TimePage() {
  const { t } = useTranslation();

  const weekDayLabels = useMemo(
    () => [
      '',
      t('page.time.weekDay.mon'),
      t('page.time.weekDay.tue'),
      t('page.time.weekDay.wed'),
      t('page.time.weekDay.thu'),
      t('page.time.weekDay.fri'),
      t('page.time.weekDay.sat'),
      t('page.time.weekDay.sun'),
    ],
    [t],
  );

  const [vals, setVals] = useState<TimeValues>(() => computeOutputs(moment(), weekDayLabels));
  const { selected: reportTarget, selectSrc } = useFocusPublisher<string>();

  const currentMomentRef = useRef(moment());

  useEffect(() => {
    setVals(prev => ({
      ...prev,
      weekDay: currentMomentRef.current.isValid()
        ? (weekDayLabels[currentMomentRef.current.isoWeekday()] ?? '')
        : '',
    }));
  }, [weekDayLabels]);

  const updateFromMoment = useCallback(
    (m: moment.Moment, src: EditableField | 'direct' | 'datePicker') => {
      currentMomentRef.current = m;
      const outputs = computeOutputs(m, weekDayLabels);
      if (['date', 'hour', 'minute', 'second', 'millisecond'].includes(src)) {
        setVals(prev => ({ ...outputs, [src]: prev[src as TimeField] }));
      } else if (
        src === 'iso8601' ||
        src === 'iso8601utc' ||
        src === 'javaTime' ||
        src === 'unixTime'
      ) {
        setVals(prev => ({ ...outputs, [src]: prev[src] }));
      } else {
        setVals(outputs);
      }
    },
    [weekDayLabels],
  );

  const inputChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const src = event.target.name as EditableField;
      const val = event.target.value;
      setVals(prev => ({ ...prev, [src]: val }));

      let m: moment.Moment;
      if (src in fieldReaders) {
        m = fieldReaders[src](val);
      } else if (src === 'date') {
        m = buildMoment(
          val,
          String(vals.hour),
          String(vals.minute),
          String(vals.second),
          String(vals.millisecond),
        );
      } else {
        const parts = { ...vals, [src]: val };
        m = buildMoment(
          String(parts.date),
          String(parts.hour),
          String(parts.minute),
          String(parts.second),
          String(parts.millisecond),
        );
      }

      updateFromMoment(m, src);

      if (reportTarget && fieldWriters[reportTarget]) {
        publishSelectedValue(fieldWriters[reportTarget](m));
      }
    },
    [vals, updateFromMoment, reportTarget],
  );

  const focusChanged = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const src = event.target.name;
      if (reportableFields[src]) {
        const value = fieldWriters[src] ? fieldWriters[src](currentMomentRef.current) : undefined;
        selectSrc(src, value);
      }
    },
    [selectSrc],
  );

  const selectNameDay = useCallback(
    (day: NameDayItem) => {
      const m = moment()
        .startOf('day')
        .month(day.value.month - 1)
        .date(day.value.day);
      const date = m.format(datePattern);
      const fullMoment = buildMoment(
        date,
        String(vals.hour),
        String(vals.minute),
        String(vals.second),
        String(vals.millisecond),
      );
      updateFromMoment(fullMoment, 'date');
      setVals(prev => ({ ...prev, date }));
    },
    [vals, updateFromMoment],
  );

  const renderType = (type: string) => {
    const widthClass =
      (
        {
          date: 'w-[6em]',
          hour: 'w-[1.7em]',
          minute: 'w-[1.7em]',
          second: 'w-[1.7em]',
          millisecond: 'w-[2.4em]',
          timeZone: 'w-[4.5em]',
        } as Record<string, string>
      )[type] ?? '';

    const maxLength = (
      {
        date: 10,
        hour: 2,
        minute: 2,
        second: 2,
        millisecond: 3,
        timeZone: 6,
      } as Record<string, number>
    )[type];

    const isReadOnly = type === 'timeZone';
    const isFullWidth = ['iso8601', 'iso8601utc', 'javaTime', 'unixTime'].includes(type);

    return (
      <input
        type="text"
        className={cn('input-inline ml-1', widthClass, isFullWidth && 'flex-1')}
        value={(vals[type as TimeField] as string) ?? ''}
        maxLength={maxLength}
        readOnly={isReadOnly}
        name={type}
        placeholder={hints[type]}
        onChange={inputChanged}
        onFocus={focusChanged}
      />
    );
  };
  const labelWidth = 'w-28';

  const labelKey = reportTarget
    ? reportTargetLabels[reportTarget as keyof typeof reportTargetLabels]
    : undefined;
  const subtitle = labelKey ? t(labelKey) : '';

  return (
    <HalfSection title={t('page.time.title')} subtitle={subtitle} image="/img/header-datetime.jpg">
      <Item className="mt-2" name={t('page.time.label.date')} labelWidth={labelWidth}>
        {renderType('date')}
        (
        <input
          type="text"
          className="input-inline ml-1 w-[1.7em]"
          value={vals.weekDay}
          name="weekDay"
          placeholder={weekDayLabels[6]}
          readOnly
          onFocus={focusChanged}
        />
        )
      </Item>
      <Item className="mt-2" name={t('page.time.label.time')} labelWidth={labelWidth}>
        {renderType('hour')}:{renderType('minute')}:{renderType('second')}.
        {renderType('millisecond')}
        {renderType('timeZone')}
      </Item>
      <Item className="mt-2" name={t('page.time.label.week')} labelWidth={labelWidth}>
        <input
          type="text"
          className="input-inline ml-1 w-[4.5em]"
          name="week"
          value={vals.week}
          readOnly
          placeholder="2016/52"
          onFocus={focusChanged}
        />
      </Item>
      <Item className="mt-2" name={t('page.time.label.nameDay')} labelWidth={labelWidth}>
        <input
          className="input-inline ml-1 flex-1"
          name="nameDay"
          value={vals.nameDay}
          onFocus={focusChanged}
          readOnly
        />
      </Item>
      <Item className="mt-2" name={t('page.time.label.nameDaySearch')} labelWidth={labelWidth}>
        <div className="ml-1 relative w-full">
          <NameDaySearch onSelectNameDay={selectNameDay} />
        </div>
      </Item>
      <Item className="mt-2" name={t('page.time.label.javaTime')} labelWidth={labelWidth}>
        {renderType('javaTime')}
      </Item>
      <Item className="mt-2" name={t('page.time.label.unixTime')} labelWidth={labelWidth}>
        {renderType('unixTime')}
      </Item>
      <Item className="mt-2" name={t('page.time.label.iso8601')} labelWidth={labelWidth}>
        {renderType('iso8601')}
      </Item>
      <Item className="mt-2" name={t('page.time.label.iso8601utc')} labelWidth={labelWidth}>
        {renderType('iso8601utc')}
      </Item>
    </HalfSection>
  );
}
