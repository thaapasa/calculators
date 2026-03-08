import {
  buildMoment,
  computeOutputs,
  datePattern,
  EditableField,
  fieldReaders,
  fieldWriters,
  hints,
  reportableFields,
  texts,
  TimeField,
  TimeValues,
} from 'app/calc/time';
import { cn } from 'lib/utils';
import moment from 'moment';
import React, { useCallback, useRef, useState } from 'react';

import { Item } from './component/Item';
import { NameDayItem, NameDaySearch } from './component/NameDaySearch';
import { HalfSection } from './component/Section';
import { publishSelectedValue } from './LastValue';

export function TimePage() {
  const initialMoment = moment();
  const initialOutputs = computeOutputs(initialMoment);

  const [vals, setVals] = useState<TimeValues>(initialOutputs);
  const [reportTarget, setReportTarget] = useState('');

  const currentMomentRef = useRef(initialMoment);

  const updateFromMoment = useCallback(
    (m: moment.Moment, src: EditableField | 'direct' | 'datePicker') => {
      currentMomentRef.current = m;
      const outputs = computeOutputs(m);
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
    [],
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

  const focusChanged = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    const src = event.target.name;
    if (reportableFields[src]) {
      setReportTarget(src);
      if (fieldWriters[src]) {
        publishSelectedValue(fieldWriters[src](currentMomentRef.current));
      }
    }
  }, []);

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

  return (
    <HalfSection
      title="Aikaleimat"
      subtitle={texts.types[reportTarget]}
      image="/img/header-datetime.jpg"
    >
      <Item className="mt-2" name="Päivä" labelWidth={labelWidth}>
        {renderType('date')}
        (
        <input
          type="text"
          className="input-inline ml-1 w-[1.7em]"
          value={vals.weekDay}
          name="weekDay"
          placeholder="la"
          readOnly
          onFocus={focusChanged}
        />
        )
      </Item>
      <Item className="mt-2" name="Kellonaika" labelWidth={labelWidth}>
        {renderType('hour')}:{renderType('minute')}:{renderType('second')}.
        {renderType('millisecond')}
        {renderType('timeZone')}
      </Item>
      <Item className="mt-2" name="Viikko" labelWidth={labelWidth}>
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
      <Item className="mt-2" name="Nimipäivä" labelWidth={labelWidth}>
        <input
          className="input-inline ml-1 flex-1"
          name="nameDay"
          value={vals.nameDay}
          onFocus={focusChanged}
          readOnly
        />
      </Item>
      <Item className="mt-2" name="Etsi nimipäivä" labelWidth={labelWidth}>
        <div className="ml-1 relative w-full">
          <NameDaySearch onSelectNameDay={selectNameDay} />
        </div>
      </Item>
      <Item className="mt-2" name="Java/JS time" labelWidth={labelWidth}>
        {renderType('javaTime')}
      </Item>
      <Item className="mt-2" name="Unixtime" labelWidth={labelWidth}>
        {renderType('unixTime')}
      </Item>
      <Item className="mt-2" name="ISO-8601" labelWidth={labelWidth}>
        {renderType('iso8601')}
      </Item>
      <Item className="mt-2" name="ISO-8601 UTC" labelWidth={labelWidth}>
        {renderType('iso8601utc')}
      </Item>
    </HalfSection>
  );
}
