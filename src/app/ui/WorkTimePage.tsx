import {
  formatDecimalHours,
  formatDuration,
  formatTime,
  nowMinutes,
  summarize,
  todayKey,
  type WorkDay,
  type WorkRow,
} from 'app/calc/worktime';
import { useTranslation } from 'app/i18n/LanguageContext';
import { loadWorkDay, storeWorkDay } from 'app/util/workTimeStorage';
import { Button } from 'components/ui/button';
import { Checkbox } from 'components/ui/checkbox';
import { cn } from 'lib/utils';
import { Pause, Play, Plus, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Item } from './component/Item';
import { HalfSection } from './component/Section';
import { FlexRow } from './layout/elements';

const TICK_MS = 30_000;

function currentTime(): string {
  return formatTime(nowMinutes());
}

export function WorkTimePage() {
  const { t } = useTranslation();
  const [day, setDay] = useState<WorkDay>(() => loadWorkDay());
  const [now, setNow] = useState(() => nowMinutes());

  // Persist every change
  useEffect(() => {
    storeWorkDay(day);
  }, [day]);

  const summary = summarize(day, now);
  const hasOpenRow = summary.hasOpenRow;

  // Keep NOW fresh while a row is open. Roll over to a new day only when nothing is
  // open, so an entry running past midnight is not wiped.
  useEffect(() => {
    const tick = () => {
      if (hasOpenRow) {
        setNow(nowMinutes());
      } else {
        const today = todayKey();
        setDay(prev => (prev.date === today ? prev : loadWorkDay(today)));
      }
    };
    const id = window.setInterval(tick, TICK_MS);
    return () => window.clearInterval(id);
  }, [hasOpenRow]);

  const update = useCallback((patch: Partial<WorkDay>) => {
    setDay(prev => ({ ...prev, ...patch }));
  }, []);

  const updateRow = useCallback((index: number, patch: Partial<WorkRow>) => {
    setDay(prev => ({
      ...prev,
      rows: prev.rows.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    }));
  }, []);

  const removeRow = useCallback((index: number) => {
    setDay(prev => ({ ...prev, rows: prev.rows.filter((_, i) => i !== index) }));
  }, []);

  const addRow = useCallback((row: WorkRow) => {
    setDay(prev => ({ ...prev, rows: [...prev.rows, row] }));
    setNow(nowMinutes());
  }, []);

  const clockIn = useCallback(() => addRow({ start: currentTime(), end: '' }), [addRow]);

  const pause = useCallback(() => {
    const end = currentTime();
    setDay(prev => ({ ...prev, rows: prev.rows.map(r => (r.end === '' ? { ...r, end } : r)) }));
    setNow(nowMinutes());
  }, []);

  const clear = useCallback(() => update({ rows: [] }), [update]);

  const labelWidth = 'w-28';

  return (
    <HalfSection
      title={t('page.worktime.title')}
      subtitle={t('page.worktime.subtitle')}
      image="/img/header-datetime.jpg"
      action={
        <Button
          variant="ghost"
          size="sm"
          onClick={clear}
          disabled={day.rows.length === 0}
          title={t('page.worktime.clear')}
        >
          <Trash2 size={14} />
          {t('page.worktime.clear')}
        </Button>
      }
    >
      <FlexRow className="gap-2 mx-3 mt-2 mb-3 flex-wrap">
        {hasOpenRow ? (
          <Button size="sm" onClick={pause}>
            <Pause size={14} />
            {t('page.worktime.pause')}
          </Button>
        ) : (
          <Button size="sm" onClick={clockIn}>
            <Play size={14} />
            {day.rows.length === 0 ? t('page.worktime.clockIn') : t('page.worktime.resume')}
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => addRow({ start: '', end: '' })}
          title={t('page.worktime.addRow')}
        >
          <Plus size={14} />
          {t('page.worktime.addRow')}
        </Button>
      </FlexRow>

      {day.rows.length === 0 ? (
        <div className="mx-3 my-2 text-sm text-muted-foreground italic">
          {t('page.worktime.noRows')}
        </div>
      ) : (
        <Item
          className="mb-1 text-[0.8em] font-semibold uppercase text-muted-foreground"
          labelWidth={labelWidth}
          name={t('page.worktime.entries')}
        >
          <div className="ml-1 w-[8.5em]">{t('page.worktime.start')}</div>
          <div className="w-[8.5em]">{t('page.worktime.end')}</div>
        </Item>
      )}
      {day.rows.map((row, i) => (
        <Item key={i} className="my-1" labelWidth={labelWidth}>
          <TimeInput
            value={row.start}
            onChange={start => updateRow(i, { start })}
            onNow={() => updateRow(i, { start: currentTime() })}
            nowTitle={t('page.worktime.setNow')}
          />
          <TimeInput
            value={row.end}
            onChange={end => updateRow(i, { end })}
            onNow={() => updateRow(i, { end: currentTime() })}
            nowTitle={t('page.worktime.setNow')}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground"
            onClick={() => removeRow(i)}
            title={t('page.worktime.removeRow')}
          >
            <Trash2 size={14} />
          </Button>
        </Item>
      ))}

      <Item
        className="mt-4"
        labelWidth={labelWidth}
        name={
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={day.subtractLunch}
              onChange={e => update({ subtractLunch: e.target.checked })}
            />
            {t('page.worktime.subtractLunch')}
          </label>
        }
      >
        <NumberInput
          value={day.lunchMinutes}
          disabled={!day.subtractLunch}
          onChange={lunchMinutes => update({ lunchMinutes })}
        />
        <span className="ml-1 text-muted-foreground">{t('page.worktime.minutes')}</span>
      </Item>
      <Item className="mt-1" name={t('page.worktime.target')} labelWidth={labelWidth}>
        <NumberInput
          value={day.targetMinutes / 60}
          onChange={hours => update({ targetMinutes: hours * 60 })}
        />
        <span className="ml-1 text-muted-foreground">{t('page.worktime.hours')}</span>
      </Item>

      <Item className="mt-4" name={t('page.worktime.worked')} labelWidth={labelWidth}>
        <Output value={formatDuration(summary.workedMinutes)} strong />
        <span className="ml-1 text-muted-foreground">
          = {formatDecimalHours(summary.workedMinutes)} {t('page.worktime.hours')}
        </span>
      </Item>
      <Item className="mt-1" name={t('page.worktime.away')} labelWidth={labelWidth}>
        <Output value={formatDuration(summary.awayMinutes)} />
      </Item>
      <Item className="mt-1" name={t('page.worktime.remaining')} labelWidth={labelWidth}>
        <Output value={formatDuration(summary.remainingMinutes)} />
      </Item>
      <Item className="mt-1" name={t('page.worktime.leaveAt')} labelWidth={labelWidth}>
        <Output
          value={summary.leaveAtMinutes !== undefined ? formatTime(summary.leaveAtMinutes) : ''}
          strong
        />
      </Item>
    </HalfSection>
  );
}

interface TimeInputProps {
  value: string;
  nowTitle: string;
  onChange: (value: string) => void;
  onNow: () => void;
}

function TimeInput({ value, nowTitle, onChange, onNow }: TimeInputProps) {
  const { t } = useTranslation();
  return (
    <div className="inline-flex items-center ml-1 w-[8.5em]">
      <input
        type="time"
        className={cn('input-inline w-[5.5em]', !value && 'text-muted-foreground')}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-1.5 text-xs text-primary"
        onClick={onNow}
        title={nowTitle}
      >
        {t('page.worktime.now')}
      </Button>
    </div>
  );
}

interface NumberInputProps {
  value: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

/** Text input for a non-negative number. Keeps the raw text while typing; commits valid values. */
function NumberInput({ value, disabled, onChange }: NumberInputProps) {
  const [text, setText] = useState(() => String(value));
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    if (parseNumber(text) !== value) setText(String(value));
  }
  return (
    <input
      type="text"
      inputMode="decimal"
      className="input-inline ml-1 w-[3.5em] text-right"
      value={text}
      disabled={disabled}
      onChange={e => {
        setText(e.target.value);
        const n = parseNumber(e.target.value);
        if (n !== undefined) onChange(n);
      }}
    />
  );
}

function parseNumber(text: string): number | undefined {
  const n = Number(text.replace(',', '.'));
  return text.trim() !== '' && isFinite(n) && n >= 0 ? n : undefined;
}

function Output({ value, strong }: { value: string; strong?: boolean }) {
  return (
    <input
      type="text"
      className={cn('input-inline ml-1 w-[3.5em] text-right', strong && 'font-semibold')}
      value={value}
      readOnly
    />
  );
}
