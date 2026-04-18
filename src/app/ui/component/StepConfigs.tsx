import { StepConfigProps } from 'app/calc/pipeline/types';

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
      Indent
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
      Bytes/line
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

/** PBKDF2 config: iterations, salt (hex), output bits */
export function Pbkdf2Config({ params, onChange }: StepConfigProps) {
  const iterations = typeof params.iterations === 'number' ? params.iterations : 27500;
  const salt = typeof params.salt === 'string' ? params.salt : '';
  const bits = typeof params.bits === 'number' ? params.bits : 256;
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <label className="flex items-center gap-1">
        Iterations
        <input
          type="number"
          min={1}
          value={iterations}
          onChange={e =>
            onChange({ ...params, iterations: Math.max(1, Number(e.target.value) || 1) })
          }
          className="w-24 rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground text-center"
        />
      </label>
      <label className="flex items-center gap-1">
        Salt (hex)
        <input
          type="text"
          value={salt}
          placeholder="e.g. a1b2c3..."
          onChange={e => onChange({ ...params, salt: e.target.value })}
          className="w-48 rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground font-mono"
        />
      </label>
      <label className="flex items-center gap-1">
        Output bits
        <select
          value={String(bits)}
          onChange={e => onChange({ ...params, bits: Number(e.target.value) })}
          className="rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground"
        >
          <option value="128">128</option>
          <option value="256">256</option>
          <option value="512">512</option>
        </select>
      </label>
    </div>
  );
}

/** Hex encode case config */
export function HexCaseConfig({ params, onChange }: StepConfigProps) {
  const hexCase = params.case === 'upper' ? 'upper' : 'lower';
  return (
    <label className="flex items-center gap-1 text-xs text-muted-foreground">
      Case
      <select
        value={hexCase}
        onChange={e => onChange({ ...params, case: e.target.value })}
        className="rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground"
      >
        <option value="lower">lower</option>
        <option value="upper">UPPER</option>
      </select>
    </label>
  );
}

/** Line sort direction config */
export function LineSortConfig({ params, onChange }: StepConfigProps) {
  const direction = params.direction === 'desc' ? 'desc' : 'asc';
  return (
    <label className="flex items-center gap-1 text-xs text-muted-foreground">
      <select
        value={direction}
        onChange={e => onChange({ ...params, direction: e.target.value })}
        className="rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground"
      >
        <option value="asc">A → Z</option>
        <option value="desc">Z → A</option>
      </select>
    </label>
  );
}
