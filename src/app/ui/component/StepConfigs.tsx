import { StepConfigProps, toBinary } from 'app/calc/pipeline/types';
import { useEffect } from 'react';

import { usePipelineRegistry, usePipelineSelfId } from './PipelineRegistryContext';

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

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

function base64ToHex(b64: string): string {
  const clean = b64.trim();
  if (!clean) return '';
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytesToHex(bytes);
}

/** PBKDF2 config: iterations, salt source (hex/base64/pipeline), output bits */
export function Pbkdf2Config({ params, onChange }: StepConfigProps) {
  const registry = usePipelineRegistry();
  const selfId = usePipelineSelfId();

  const iterations = typeof params.iterations === 'number' ? params.iterations : 27500;
  const bits = typeof params.bits === 'number' ? params.bits : 256;
  const saltSource: 'hex' | 'base64' | 'pipeline' =
    params.saltSource === 'base64' || params.saltSource === 'pipeline' ? params.saltSource : 'hex';
  const saltInput =
    typeof params.saltInput === 'string'
      ? params.saltInput
      : typeof params.salt === 'string'
        ? params.salt
        : '';
  const saltPipelineId = typeof params.saltPipelineId === 'string' ? params.saltPipelineId : '';

  const availablePipelines = (registry?.pipelines ?? []).filter(p => p.id !== selfId);
  const sourceOutput =
    saltSource === 'pipeline' && saltPipelineId
      ? (registry?.outputs.get(saltPipelineId) ?? null)
      : null;

  useEffect(() => {
    if (saltSource !== 'pipeline') return;
    if (!sourceOutput) {
      if (params.salt !== '') onChange({ ...params, salt: '' });
      return;
    }
    const hex = bytesToHex(toBinary(sourceOutput));
    if (params.salt !== hex) onChange({ ...params, salt: hex });
  }, [saltSource, sourceOutput, params, onChange]);

  const selectValue =
    saltSource === 'pipeline' && saltPipelineId ? `pipeline:${saltPipelineId}` : saltSource;

  const handleSourceChange = (value: string) => {
    if (value === 'hex') {
      onChange({
        ...params,
        saltSource: 'hex',
        saltPipelineId: undefined,
        salt: saltInput,
      });
    } else if (value === 'base64') {
      let hex: string;
      try {
        hex = base64ToHex(saltInput);
      } catch {
        hex = '';
      }
      onChange({
        ...params,
        saltSource: 'base64',
        saltPipelineId: undefined,
        salt: hex,
      });
    } else if (value.startsWith('pipeline:')) {
      const pid = value.slice('pipeline:'.length);
      onChange({ ...params, saltSource: 'pipeline', saltPipelineId: pid });
    }
  };

  const handleSaltInputChange = (value: string) => {
    if (saltSource === 'hex') {
      onChange({ ...params, saltInput: value, salt: value });
    } else if (saltSource === 'base64') {
      let hex: string;
      try {
        hex = base64ToHex(value);
      } catch {
        hex = '';
      }
      onChange({ ...params, saltInput: value, salt: hex });
    }
  };

  const sourceInfo = sourceOutput
    ? sourceOutput.type === 'binary'
      ? `Binary data, ${sourceOutput.bytes.length} bytes`
      : `Text, ${new TextEncoder().encode(sourceOutput.text).length} bytes`
    : '(no output)';
  const saltPlaceholder = saltSource === 'base64' ? 'e.g. oYa3...' : 'e.g. a1b2c3...';

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
        Salt
        <select
          value={selectValue}
          onChange={e => handleSourceChange(e.target.value)}
          className="rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground"
        >
          <option value="hex">Hex</option>
          <option value="base64">Base64</option>
          {availablePipelines.map(p => (
            <option key={p.id} value={`pipeline:${p.id}`}>
              From: {p.title}
            </option>
          ))}
        </select>
      </label>
      {saltSource === 'pipeline' ? (
        <span className="font-mono">{sourceInfo}</span>
      ) : (
        <input
          type="text"
          value={saltInput}
          placeholder={saltPlaceholder}
          onChange={e => handleSaltInputChange(e.target.value)}
          className="w-48 rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground font-mono"
        />
      )}
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
