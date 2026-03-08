import { formatHexDump, toRawHex } from 'app/calc/pipeline/operations/display';
import { StepRenderProps, toBinary, toText } from 'app/calc/pipeline/types';
import { Clipboard } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';

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
        <pre className="flex-1 min-w-0 max-h-50 overflow-auto rounded bg-foreground/5 px-2 py-1 text-xs font-mono whitespace-pre-wrap break-all">
          {text}
        </pre>
      </div>
    </div>
  );
}

/** Renders hexdump -C view, copies raw hex string */
export function HexDumpRenderer({ input, params }: StepRenderProps) {
  const bytes = toBinary(input);
  const bytesPerLine = typeof params?.bytesPerLine === 'number' ? params.bytesPerLine : 16;
  const formatted = formatHexDump(bytes, bytesPerLine);
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
        <pre className="flex-1 min-w-0 max-h-50 overflow-auto rounded bg-foreground/5 px-2 py-1 text-xs font-mono whitespace-pre">
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

/** Renders line count, word count, character count, and byte size */
export function StatsRenderer({ input }: StepRenderProps) {
  const text = toText(input);
  const bytes = toBinary(input);
  const lines = text === '' ? 0 : text.split('\n').length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;

  return (
    <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
      <span>
        {lines} {lines === 1 ? 'line' : 'lines'}
      </span>
      <span>
        {words} {words === 1 ? 'word' : 'words'}
      </span>
      <span>
        {chars} {chars === 1 ? 'char' : 'chars'}
      </span>
      <span>{bytes.length} bytes</span>
    </div>
  );
}

/** Detect image MIME type from magic bytes */
function detectImageType(bytes: Uint8Array): string | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return 'image/jpeg';
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47)
    return 'image/png';
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'image/gif';
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46)
    return 'image/webp';
  if (bytes[0] === 0x42 && bytes[1] === 0x4d) return 'image/bmp';
  return null;
}

/** Renders binary image data (PNG, JPEG, GIF, WebP, BMP) */
export function ImageRenderer({ input }: StepRenderProps) {
  const bytes = toBinary(input);
  const mimeType = detectImageType(bytes);
  const src = useMemo(() => {
    const blob = new Blob([bytes.slice().buffer], { type: mimeType ?? 'image/png' });
    return URL.createObjectURL(blob);
  }, [bytes, mimeType]);

  if (!mimeType) {
    return <div className="mt-2 text-xs text-red-500">Tuntematon kuvaformaatti</div>;
  }

  return (
    <div className="mt-2">
      <img src={src} alt="Pipeline output" className="max-w-full max-h-80 rounded" />
    </div>
  );
}

/** Renders SVG markup inline */
export function SvgRenderer({ input }: StepRenderProps) {
  const svg = toText(input);
  const isSvg = svg.trimStart().startsWith('<svg') || svg.trimStart().startsWith('<?xml');

  if (!isSvg) {
    return <div className="mt-2 text-xs text-red-500">Data ei ole SVG-muodossa</div>;
  }

  return (
    <div
      className="mt-2 max-w-full max-h-80 overflow-auto rounded bg-surface p-2"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
