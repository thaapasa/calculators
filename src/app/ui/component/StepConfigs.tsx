import { StepConfigProps } from 'app/calc/pipeline/types';
import React from 'react';

/** ROT-N shift amount config (1–25) */
export function RotNConfig({ params, onChange }: StepConfigProps) {
  const shift = typeof params.shift === 'number' ? params.shift : 13;
  return (
    <label className="flex items-center gap-1 text-xs text-muted-foreground">
      N=
      <input
        type="number"
        min={1}
        max={25}
        value={shift}
        onChange={e =>
          onChange({ ...params, shift: Math.max(1, Math.min(25, Number(e.target.value) || 13)) })
        }
        className="w-12 rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground text-center"
      />
    </label>
  );
}

/** JSON pretty indent config */
export function JsonIndentConfig({ params, onChange }: StepConfigProps) {
  const indent = params.indent ?? 2;
  return (
    <label className="flex items-center gap-1 text-xs text-muted-foreground">
      Sisennys
      <select
        value={String(indent)}
        onChange={e =>
          onChange({ ...params, indent: e.target.value === 'tab' ? 'tab' : Number(e.target.value) })
        }
        className="rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground"
      >
        <option value="2">2</option>
        <option value="4">4</option>
        <option value="tab">Tab</option>
      </select>
    </label>
  );
}

/** Hex dump bytes per line config */
export function HexDumpBytesConfig({ params, onChange }: StepConfigProps) {
  const bytesPerLine = typeof params.bytesPerLine === 'number' ? params.bytesPerLine : 16;
  return (
    <label className="flex items-center gap-1 text-xs text-muted-foreground">
      Tavua/rivi
      <select
        value={String(bytesPerLine)}
        onChange={e => onChange({ ...params, bytesPerLine: Number(e.target.value) })}
        className="rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground"
      >
        <option value="8">8</option>
        <option value="16">16</option>
        <option value="32">32</option>
      </select>
    </label>
  );
}
