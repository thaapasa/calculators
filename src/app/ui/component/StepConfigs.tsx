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

type ByteSource = 'text' | 'hex' | 'base64' | 'pipeline';

/**
 * Picker for a byte-valued parameter such as a salt or a key. The value is typed as text, hex or
 * Base64, or taken from another pipeline's output. Whatever the source, the operation receives it
 * as hex in `params[name]`; the picker keeps its own state in `${name}Source`, `${name}Input` and
 * `${name}PipelineId`.
 */
function ByteSourceInput({
  params,
  onChange,
  name,
  label,
  allowText = false,
  emptyPlaceholder,
}: StepConfigProps & {
  name: string;
  label: string;
  allowText?: boolean;
  emptyPlaceholder?: string;
}) {
  const registry = usePipelineRegistry();
  const selfId = usePipelineSelfId();
  const sourceKey = `${name}Source`;
  const inputKey = `${name}Input`;
  const pipelineKey = `${name}PipelineId`;

  const rawSource = params[sourceKey];
  const source: ByteSource =
    rawSource === 'base64' || rawSource === 'pipeline' || (rawSource === 'text' && allowText)
      ? rawSource
      : rawSource === 'hex' || !allowText
        ? 'hex'
        : 'text';
  const textInput =
    typeof params[inputKey] === 'string'
      ? params[inputKey]
      : typeof params[name] === 'string'
        ? params[name]
        : '';
  const pipelineId = typeof params[pipelineKey] === 'string' ? params[pipelineKey] : '';

  const availablePipelines = (registry?.pipelines ?? []).filter(p => p.id !== selfId);
  const sourceOutput =
    source === 'pipeline' && pipelineId ? (registry?.outputs.get(pipelineId) ?? null) : null;
  const sourceIsMissing =
    source === 'pipeline' && !!pipelineId && !availablePipelines.some(p => p.id === pipelineId);

  useEffect(() => {
    if (source !== 'pipeline') return;
    const hex = sourceOutput ? bytesToHex(toBinary(sourceOutput)) : '';
    if (params[name] !== hex) onChange({ ...params, [name]: hex });
  }, [source, sourceOutput, params, onChange, name]);

  const toHex = (src: ByteSource, value: string): string => {
    if (src === 'text') return bytesToHex(new TextEncoder().encode(value));
    if (src === 'base64') {
      try {
        return base64ToHex(value);
      } catch {
        return '';
      }
    }
    return value;
  };

  const selectValue = source === 'pipeline' && pipelineId ? `pipeline:${pipelineId}` : source;

  const handleSourceChange = (value: string) => {
    if (value.startsWith('pipeline:')) {
      const pid = value.slice('pipeline:'.length);
      onChange({ ...params, [sourceKey]: 'pipeline', [pipelineKey]: pid });
    } else {
      const src = value as ByteSource;
      onChange({
        ...params,
        [sourceKey]: src,
        [pipelineKey]: undefined,
        [name]: toHex(src, textInput),
      });
    }
  };

  const sourceInfo = sourceIsMissing
    ? '(pipeline deleted)'
    : sourceOutput
      ? sourceOutput.type === 'binary'
        ? `Binary data, ${sourceOutput.bytes.length} bytes`
        : `Text, ${new TextEncoder().encode(sourceOutput.text).length} bytes`
      : '(no output)';
  const placeholder =
    emptyPlaceholder ??
    (source === 'base64' ? 'e.g. oYa3...' : source === 'text' ? '' : 'e.g. a1b2c3...');

  return (
    <>
      <label className="flex items-center gap-1">
        {label}
        <select
          value={selectValue}
          onChange={e => handleSourceChange(e.target.value)}
          className="rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground"
        >
          {allowText && <option value="text">Text</option>}
          <option value="hex">Hex</option>
          <option value="base64">Base64</option>
          {availablePipelines.map(p => (
            <option key={p.id} value={`pipeline:${p.id}`}>
              From: {p.title}
            </option>
          ))}
          {sourceIsMissing && <option value={`pipeline:${pipelineId}`}>From: (deleted)</option>}
        </select>
      </label>
      {source === 'pipeline' ? (
        <span className="font-mono">{sourceInfo}</span>
      ) : (
        <input
          type="text"
          value={textInput}
          placeholder={placeholder}
          onChange={e =>
            onChange({
              ...params,
              [inputKey]: e.target.value,
              [name]: toHex(source, e.target.value),
            })
          }
          className="w-48 rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground font-mono"
        />
      )}
    </>
  );
}

/** PBKDF2 config: iterations, salt source (hex/base64/pipeline), output bits */
export function Pbkdf2Config({ params, onChange }: StepConfigProps) {
  const iterations = typeof params.iterations === 'number' ? params.iterations : 27500;
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
      <ByteSourceInput params={params} onChange={onChange} name="salt" label="Salt" />
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

/** Argon2id config: memory cost, iterations, parallelism, salt source (empty = random) */
export function Argon2Config({ params, onChange }: StepConfigProps) {
  const memory = typeof params.memory === 'number' ? params.memory : 19456;
  const iterations = typeof params.iterations === 'number' ? params.iterations : 2;
  const parallelism = typeof params.parallelism === 'number' ? params.parallelism : 1;

  const numberInput = (key: string, value: number, width: string) => (
    <input
      type="number"
      min={1}
      value={value}
      onChange={e => onChange({ ...params, [key]: Math.max(1, Number(e.target.value) || 1) })}
      className={`${width} rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground text-center`}
    />
  );

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <label className="flex items-center gap-1">
        Memory (KiB)
        {numberInput('memory', memory, 'w-24')}
      </label>
      <label className="flex items-center gap-1">
        Iterations
        {numberInput('iterations', iterations, 'w-14')}
      </label>
      <label className="flex items-center gap-1">
        Parallelism
        {numberInput('parallelism', parallelism, 'w-14')}
      </label>
      <ByteSourceInput
        params={params}
        onChange={onChange}
        name="salt"
        label="Salt"
        emptyPlaceholder="random"
      />
    </div>
  );
}

/** bcrypt config: cost factor, salt source (empty = random) */
export function BcryptConfig({ params, onChange }: StepConfigProps) {
  const cost = typeof params.cost === 'number' ? params.cost : 12;
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <label className="flex items-center gap-1">
        Cost
        <input
          type="number"
          min={4}
          max={31}
          value={cost}
          onChange={e =>
            onChange({ ...params, cost: Math.max(4, Math.min(31, Number(e.target.value) || 12)) })
          }
          className="w-14 rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground text-center"
        />
      </label>
      <ByteSourceInput
        params={params}
        onChange={onChange}
        name="salt"
        label="Salt (16 bytes)"
        emptyPlaceholder="random"
      />
    </div>
  );
}

/** HMAC config: digest algorithm, key source (text/hex/base64/pipeline) */
export function HmacConfig({ params, onChange }: StepConfigProps) {
  const digest = typeof params.digest === 'string' ? params.digest : 'SHA-256';
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <label className="flex items-center gap-1">
        Digest
        <select
          value={digest}
          onChange={e => onChange({ ...params, digest: e.target.value })}
          className="rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground"
        >
          <option value="SHA-1">SHA-1</option>
          <option value="SHA-256">SHA-256</option>
          <option value="SHA-384">SHA-384</option>
          <option value="SHA-512">SHA-512</option>
        </select>
      </label>
      <ByteSourceInput params={params} onChange={onChange} name="key" label="Key" allowText />
    </div>
  );
}
