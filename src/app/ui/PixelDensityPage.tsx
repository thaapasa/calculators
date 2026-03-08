import React, { useCallback, useMemo, useState } from 'react';

import { LinkedField, useLinkedInputs } from '../util/useLinkedInputs';
import { Item } from './component/Item';
import { HalfSection } from './component/Section';
import { FlexRow } from './layout/elements';

interface DensityInfo {
  readonly name: string;
  readonly platform: 'android' | 'ios';
  readonly scale: number;
}

const densities = {
  mdpi: { name: 'mdpi', platform: 'android', scale: 1 },
  hdpi: { name: 'hdpi', platform: 'android', scale: 1.5 },
  xhdpi: { name: 'xhdpi', platform: 'android', scale: 2 },
  xxhdpi: { name: 'xxhdpi', platform: 'android', scale: 3 },
  xxxhdpi: { name: 'xxxhdpi', platform: 'android', scale: 4 },
  ios1x: { name: '@1x', platform: 'ios', scale: 1 },
  ios2x: { name: '@2x', platform: 'ios', scale: 2 },
  ios3x: { name: '@3x', platform: 'ios', scale: 3 },
} satisfies Record<string, DensityInfo>;

type DensityKey = keyof typeof densities;
const densityKeys = Object.keys(densities) as DensityKey[];
const androidKeys = densityKeys.filter(k => densities[k].platform === 'android');
const iosKeys = densityKeys.filter(k => densities[k].platform === 'ios');

function formatValue(v: number): string {
  if (!isFinite(v)) return '';
  return Number.isInteger(v) ? String(v) : v.toFixed(3);
}

function createFields(): Record<DensityKey, LinkedField<number>> {
  return Object.fromEntries(
    densityKeys.map(k => [
      k,
      {
        read: (input: string) => Number(input) / densities[k].scale,
        write: (canonical: number) => formatValue(canonical * densities[k].scale),
      },
    ]),
  ) as Record<DensityKey, LinkedField<number>>;
}

const isValidNumber = (v: number) => typeof v === 'number' && !isNaN(v) && v >= 0;

export function PixelDensityPage() {
  const [selected, setSelected] = useState<DensityKey>('mdpi');

  const widthFields = useMemo(() => createFields(), []);
  const heightFields = useMemo(() => createFields(), []);

  const width = useLinkedInputs(widthFields, isValidNumber);
  const height = useLinkedInputs(heightFields, isValidNumber);

  const onWidthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      width.handleChange(e.target.name as DensityKey, e.target.value);
    },
    [width],
  );

  const onHeightChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      height.handleChange(e.target.name as DensityKey, e.target.value);
    },
    [height],
  );

  const selectSrc = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setSelected(e.target.name as DensityKey);
  }, []);

  return (
    <HalfSection
      title="Pikselitiheys"
      subtitle={densities[selected].name}
      image="/img/header-bytesize.jpg"
    >
      <PlatformHeader title="Android" />
      {androidKeys.map(k => (
        <DensityRow
          key={k}
          densityKey={k}
          info={densities[k]}
          widthValue={width.values[k]}
          heightValue={height.values[k]}
          onWidthChange={onWidthChange}
          onHeightChange={onHeightChange}
          onFocus={selectSrc}
        />
      ))}
      <PlatformHeader title="iOS" />
      {iosKeys.map(k => (
        <DensityRow
          key={k}
          densityKey={k}
          info={densities[k]}
          widthValue={width.values[k]}
          heightValue={height.values[k]}
          onWidthChange={onWidthChange}
          onHeightChange={onHeightChange}
          onFocus={selectSrc}
        />
      ))}
    </HalfSection>
  );
}

function PlatformHeader({ title }: { title: string }) {
  return (
    <Item>
      <FlexRow className="items-center pt-2 pb-1">
        <div className="w-[5em] shrink-0 text-[0.8em] font-semibold uppercase text-muted-foreground">
          {title}
        </div>
        <div className="w-[3em] shrink-0" />
        <div className="flex-1 min-w-0 text-[0.85em] text-muted">Leveys</div>
        <div className="flex-1 min-w-0 text-[0.85em] text-muted">Korkeus</div>
        <div className="w-6.25 shrink-0" />
      </FlexRow>
    </Item>
  );
}

function DensityRow({
  densityKey,
  info,
  widthValue,
  heightValue,
  onWidthChange,
  onHeightChange,
  onFocus,
}: {
  densityKey: DensityKey;
  info: DensityInfo;
  widthValue: string;
  heightValue: string;
  onWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
}) {
  return (
    <Item>
      <FlexRow className="items-center my-1">
        <div className="w-[5em] shrink-0 font-medium">{info.name}</div>
        <div className="w-[3em] shrink-0 text-muted text-[0.85em]">{info.scale}×</div>
        <input
          className="input-inline flex-1 min-w-0 w-[5em]"
          name={densityKey}
          placeholder="leveys"
          value={widthValue}
          onChange={onWidthChange}
          onFocus={onFocus}
        />
        <span className="mx-1 text-foreground/40">×</span>
        <input
          className="input-inline flex-1 min-w-0 w-[5em]"
          name={densityKey}
          placeholder="korkeus"
          value={heightValue}
          onChange={onHeightChange}
          onFocus={onFocus}
        />
        <div className="w-6.25 shrink-0 text-right pr-2 ml-1">px</div>
      </FlexRow>
    </Item>
  );
}
