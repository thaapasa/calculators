import { formatHexDump, toRawHex } from 'app/calc/pipeline/operations/display';
import { StepRenderProps, toBinary, toText } from 'app/calc/pipeline/types';
import { Clipboard } from 'lucide-react';
import React, { useCallback } from 'react';

function copyToClipboard(text: string) {
  void navigator.clipboard.writeText(text);
}

/** Renders data as readonly text with copy button */
export function ShowTextRenderer({ input }: StepRenderProps) {
  const text = toText(input);
  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-start gap-1">
        <button
          onClick={() => copyToClipboard(text)}
          className="mt-1 p-1 text-muted-foreground hover:text-foreground shrink-0"
          title="Kopioi leikepöydälle"
        >
          <Clipboard size={14} />
        </button>
        <pre className="flex-1 min-w-0 max-h-50 overflow-auto rounded bg-black/5 px-2 py-1 text-xs font-mono whitespace-pre-wrap break-all">
          {text}
        </pre>
      </div>
    </div>
  );
}

/** Renders hexdump -C view, copies raw hex string */
export function HexDumpRenderer({ input }: StepRenderProps) {
  const bytes = toBinary(input);
  const formatted = formatHexDump(bytes);
  const rawHex = toRawHex(bytes);

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-start gap-1">
        <button
          onClick={() => copyToClipboard(rawHex)}
          className="mt-1 p-1 text-muted-foreground hover:text-foreground shrink-0"
          title="Kopioi hex-merkkijono leikepöydälle"
        >
          <Clipboard size={14} />
        </button>
        <pre className="flex-1 min-w-0 max-h-50 overflow-auto rounded bg-black/5 px-2 py-1 text-xs font-mono whitespace-pre">
          {formatted}
        </pre>
      </div>
    </div>
  );
}

/** Renders a download button */
export function DownloadRenderer({ input }: StepRenderProps) {
  const handleDownload = useCallback(() => {
    const bytes = input.type === 'binary' ? input.bytes : new TextEncoder().encode(input.text);
    const blob = new Blob([bytes.slice().buffer]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.bin';
    a.click();
    URL.revokeObjectURL(url);
  }, [input]);

  return (
    <div className="mt-2">
      <button
        onClick={handleDownload}
        className="rounded border border-border px-3 py-1 text-xs hover:bg-muted transition-colors"
      >
        ⬇ Lataa
      </button>
    </div>
  );
}
