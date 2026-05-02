import { StepConfigProps, toBinary, toText } from 'app/calc/pipeline/types';
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
  const sourceIsMissing =
    saltSource === 'pipeline' &&
    !!saltPipelineId &&
    !availablePipelines.some(p => p.id === saltPipelineId);

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

  const sourceInfo = sourceIsMissing
    ? '(pipeline deleted)'
    : sourceOutput
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
          {sourceIsMissing && <option value={`pipeline:${saltPipelineId}`}>From: (deleted)</option>}
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

/** JSON extract path config */
export function JsonExtractConfig({ params, onChange }: StepConfigProps) {
  const path = typeof params.path === 'string' ? params.path : '';
  return (
    <label className="flex flex-1 items-center gap-1 text-xs text-muted-foreground">
      Path
      <input
        type="text"
        value={path}
        placeholder="$.user.name"
        onChange={e => onChange({ ...params, path: e.target.value })}
        className="flex-1 min-w-0 rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground font-mono"
      />
    </label>
  );
}

/** JSON set-value config: path + value source (text or pipeline) + value type */
export function JsonMergeConfig({ params, onChange }: StepConfigProps) {
  const registry = usePipelineRegistry();
  const selfId = usePipelineSelfId();

  const path = typeof params.path === 'string' ? params.path : '';
  const valueType: 'auto' | 'string' | 'json' =
    params.valueType === 'string' || params.valueType === 'json' ? params.valueType : 'auto';
  const valueSource: 'text' | 'pipeline' = params.valueSource === 'pipeline' ? 'pipeline' : 'text';
  const valueInput =
    typeof params.valueInput === 'string'
      ? params.valueInput
      : typeof params.value === 'string'
        ? params.value
        : '';
  const valuePipelineId = typeof params.valuePipelineId === 'string' ? params.valuePipelineId : '';

  const availablePipelines = (registry?.pipelines ?? []).filter(p => p.id !== selfId);
  const sourceOutput =
    valueSource === 'pipeline' && valuePipelineId
      ? (registry?.outputs.get(valuePipelineId) ?? null)
      : null;
  const sourceIsMissing =
    valueSource === 'pipeline' &&
    !!valuePipelineId &&
    !availablePipelines.some(p => p.id === valuePipelineId);

  useEffect(() => {
    if (valueSource !== 'pipeline') return;
    if (!sourceOutput) {
      if (params.value !== '') onChange({ ...params, value: '' });
      return;
    }
    const text = toText(sourceOutput);
    if (params.value !== text) onChange({ ...params, value: text });
  }, [valueSource, sourceOutput, params, onChange]);

  const selectValue =
    valueSource === 'pipeline' && valuePipelineId ? `pipeline:${valuePipelineId}` : 'text';

  const handleSourceChange = (value: string) => {
    if (value === 'text') {
      onChange({
        ...params,
        valueSource: 'text',
        valuePipelineId: undefined,
        value: valueInput,
      });
    } else if (value.startsWith('pipeline:')) {
      const pid = value.slice('pipeline:'.length);
      onChange({ ...params, valueSource: 'pipeline', valuePipelineId: pid });
    }
  };

  const sourceInfo = sourceIsMissing
    ? '(pipeline deleted)'
    : sourceOutput
      ? sourceOutput.type === 'binary'
        ? `Binary, ${sourceOutput.bytes.length} bytes`
        : `${sourceOutput.text.length} chars`
      : '(no output)';

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <label className="flex items-center gap-1">
        Path
        <input
          type="text"
          value={path}
          placeholder="$.user.name"
          onChange={e => onChange({ ...params, path: e.target.value })}
          className="w-40 rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground font-mono"
        />
      </label>
      <label className="flex items-center gap-1">
        Value
        <select
          value={selectValue}
          onChange={e => handleSourceChange(e.target.value)}
          className="rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground"
        >
          <option value="text">Text</option>
          {availablePipelines.map(p => (
            <option key={p.id} value={`pipeline:${p.id}`}>
              From: {p.title}
            </option>
          ))}
          {sourceIsMissing && (
            <option value={`pipeline:${valuePipelineId}`}>From: (deleted)</option>
          )}
        </select>
      </label>
      {valueSource === 'pipeline' ? (
        <span className="font-mono">{sourceInfo}</span>
      ) : (
        <input
          type="text"
          value={valueInput}
          placeholder='"text", 42, true, {"a":1}'
          onChange={e => onChange({ ...params, valueInput: e.target.value, value: e.target.value })}
          className="w-48 rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground font-mono"
        />
      )}
      <label className="flex items-center gap-1">
        As
        <select
          value={valueType}
          onChange={e => onChange({ ...params, valueType: e.target.value })}
          className="rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground"
        >
          <option value="auto">Auto</option>
          <option value="string">String</option>
          <option value="json">JSON</option>
        </select>
      </label>
    </div>
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
