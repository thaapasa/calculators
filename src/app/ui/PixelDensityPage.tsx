import { Input, styled, Typography } from '@mui/material';
import React, { CSSProperties, useCallback, useMemo, useState } from 'react';

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
      <Item>
        <HeaderRow>
          <DensityLabel />
          <ScaleLabel />
          <ColumnHeader>Leveys</ColumnHeader>
          <ColumnHeader>Korkeus</ColumnHeader>
        </HeaderRow>
      </Item>
      <GroupLabel>Android</GroupLabel>
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
      <GroupLabel>iOS</GroupLabel>
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
      <EditorRow>
        <DensityLabel>{info.name}</DensityLabel>
        <ScaleLabel>{info.scale}×</ScaleLabel>
        <Input
          style={InputStyle}
          name={densityKey}
          placeholder="width"
          value={widthValue}
          onChange={onWidthChange}
          onFocus={onFocus}
        />
        <Separator>×</Separator>
        <Input
          style={InputStyle}
          name={densityKey}
          placeholder="height"
          value={heightValue}
          onChange={onHeightChange}
          onFocus={onFocus}
        />
        <Unit>px</Unit>
      </EditorRow>
    </Item>
  );
}

const HeaderRow = styled(FlexRow)`
  align-items: center;
  padding: 0 0 4px 0;
`;

const EditorRow = styled(FlexRow)`
  align-items: center;
  margin: 4px 0;
`;

const DensityLabel = styled('div')`
  width: 5em;
  font-weight: 500;
`;

const ScaleLabel = styled('div')`
  width: 3em;
  color: rgba(0, 0, 0, 0.5);
  font-size: 0.85em;
`;

const ColumnHeader = styled('div')`
  flex: 1;
  font-size: 0.85em;
  color: rgba(0, 0, 0, 0.5);
`;

const GroupLabel = styled(Typography)`
  padding: 12px 16px 4px;
  font-size: 0.8em;
  font-weight: 600;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.45);
`;

const InputStyle: CSSProperties = {
  flex: 1,
};

const Separator = styled('span')`
  margin: 0 8px;
  color: rgba(0, 0, 0, 0.4);
`;

const Unit = styled('div')`
  width: 25px;
  text-align: right;
  padding-right: 8px;
  margin-left: 8px;
`;
