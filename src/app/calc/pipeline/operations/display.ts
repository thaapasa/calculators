import { OperationDef } from '../types';

/** Format binary data like `hexdump -C`: offset | hex bytes | ASCII */
export function formatHexDump(bytes: Uint8Array): string {
  const lines: string[] = [];
  for (let offset = 0; offset < bytes.length; offset += 16) {
    const chunk = bytes.slice(offset, offset + 16);
    const hex = Array.from(chunk)
      .map(b => b.toString(16).padStart(2, '0'))
      .join(' ');
    const hexPadded = hex.padEnd(48);
    const ascii = Array.from(chunk)
      .map(b => (b >= 0x20 && b <= 0x7e ? String.fromCharCode(b) : '.'))
      .join('');
    lines.push(`${offset.toString(16).padStart(8, '0')}  ${hexPadded} |${ascii}|`);
  }
  return lines.join('\n');
}

/** Raw hex string (no formatting) for clipboard copy */
export function toRawHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Render components are attached in src/app/ui/component/StepRenderers.tsx
// and wired up via registry initialization.

export const showTextOp: OperationDef = {
  id: 'show-text',
  name: 'Näytä teksti',
  category: 'display',
  description: 'Näytä data tekstinä',
  process: async input => input,
};

export const hexDumpOp: OperationDef = {
  id: 'hex-dump',
  name: 'Hex dump',
  category: 'display',
  description: 'Näytä data hexdump -C -muodossa',
  process: async input => input,
};

export const downloadOp: OperationDef = {
  id: 'download',
  name: 'Lataa tiedosto',
  category: 'display',
  description: 'Lataa data tiedostona',
  process: async input => input,
};

export const displayOperations: OperationDef[] = [showTextOp, hexDumpOp, downloadOp];
