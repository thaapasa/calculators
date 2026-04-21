import { binaryData, PipelineData, textData } from 'app/calc/pipeline/types';
import { getRandomString } from 'app/calc/random';
import { useTranslation } from 'app/i18n/LanguageContext';
import { RefreshCw } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';

interface PipelineInputProps {
  value: string;
  onChange: (value: string) => void;
  onDataChange: (data: PipelineData) => void;
}

type InputMode = 'text' | 'randomString' | 'randomBytes';

function randomBytes(len: number): Uint8Array {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

export function PipelineInput({ value, onChange, onDataChange }: PipelineInputProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<InputMode>('text');
  const [randomLength, setRandomLength] = useState(32);
  const [randomBytesHex, setRandomBytesHex] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [url, setUrl] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateRandomString = useCallback(
    (len: number) => {
      const s = getRandomString(len);
      onChange(s);
    },
    [onChange],
  );

  const generateRandomBytes = useCallback(
    (len: number) => {
      const bytes = randomBytes(len);
      setRandomBytesHex(bytesToHex(bytes));
      onDataChange(binaryData(bytes));
    },
    [onDataChange],
  );

  const handleModeChange = useCallback(
    (next: InputMode) => {
      setMode(next);
      setFileName(null);
      setUrlError(null);
      if (next === 'randomString') {
        generateRandomString(randomLength);
      } else if (next === 'randomBytes') {
        generateRandomBytes(randomLength);
      } else {
        // Switching back to text: ensure inputData mirrors the text value
        onChange(value);
        setRandomBytesHex('');
      }
    },
    [randomLength, generateRandomString, generateRandomBytes, onChange, value],
  );

  const handleLengthChange = useCallback(
    (len: number) => {
      const clamped = Math.max(1, Math.min(4096, Math.floor(len) || 1));
      setRandomLength(clamped);
      if (mode === 'randomString') generateRandomString(clamped);
      else if (mode === 'randomBytes') generateRandomBytes(clamped);
    },
    [mode, generateRandomString, generateRandomBytes],
  );

  const handleRegenerate = useCallback(() => {
    if (mode === 'randomString') generateRandomString(randomLength);
    else if (mode === 'randomBytes') generateRandomBytes(randomLength);
  }, [mode, randomLength, generateRandomString, generateRandomBytes]);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFileName(null);
      setUrlError(null);
      onChange(e.target.value);
    },
    [onChange],
  );

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      setUrlError(null);
      const reader = new FileReader();
      reader.onload = () => {
        const bytes = new Uint8Array(reader.result as ArrayBuffer);
        onDataChange(binaryData(bytes));
      };
      reader.readAsArrayBuffer(file);
    },
    [onDataChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleFetchUrl = useCallback(async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setUrlLoading(true);
    setUrlError(null);
    setFileName(null);
    try {
      const response = await fetch(trimmed);
      if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
      const buffer = await response.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      try {
        const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        onChange(text);
      } catch {
        onDataChange(binaryData(bytes));
      }
      setFileName(trimmed);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setUrlError(msg.includes('Failed to fetch') ? t('pipeline.input.fetchFailed') : msg);
    } finally {
      setUrlLoading(false);
    }
  }, [url, onChange, onDataChange, t]);

  const handleUrlKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        void handleFetchUrl();
      }
    },
    [handleFetchUrl],
  );

  const handleClear = useCallback(() => {
    setFileName(null);
    setUrlError(null);
    onChange('');
    onDataChange(textData(''));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [onChange, onDataChange]);

  const modes: { id: InputMode; label: string }[] = [
    { id: 'text', label: t('pipeline.input.mode.text') },
    { id: 'randomString', label: t('pipeline.input.mode.randomString') },
    { id: 'randomBytes', label: t('pipeline.input.mode.randomBytes') },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium">{t('pipeline.input.label')}</span>
        <div className="flex rounded border border-border overflow-hidden">
          {modes.map(m => (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id)}
              className={`px-2 py-0.5 text-xs transition-colors ${
                mode === m.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        {mode === 'text' && fileName && (
          <span className="text-xs text-muted-foreground">📎 {fileName}</span>
        )}
        {mode === 'text' && (value || fileName) && (
          <button
            onClick={handleClear}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {t('pipeline.input.clear')}
          </button>
        )}
      </div>

      {mode !== 'text' && (
        <div className="flex items-center gap-2 flex-wrap">
          <label className="flex items-center gap-1 text-xs text-muted-foreground">
            {t('pipeline.input.length')}
            <input
              type="number"
              min={1}
              max={4096}
              value={randomLength}
              onChange={e => handleLengthChange(Number(e.target.value))}
              className="w-20 rounded border border-border bg-surface px-1 py-0.5 text-xs text-foreground text-center"
            />
          </label>
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-1 rounded border border-border px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <RefreshCw size={12} />
            {t('pipeline.input.regenerate')}
          </button>
        </div>
      )}

      {mode === 'text' && (
        <>
          <div
            className={`relative rounded ${dragOver ? 'border border-primary bg-primary/5' : ''} transition-colors`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <textarea
              className="textarea-box w-full min-h-[80px] rounded px-3 py-2 text-sm resize-y"
              value={value}
              onChange={handleTextChange}
              placeholder={t('pipeline.input.placeholder')}
            />
            {dragOver && (
              <div className="absolute inset-0 flex items-center justify-center rounded bg-primary/10 pointer-events-none">
                <span className="text-sm font-medium text-primary">
                  {t('pipeline.input.dropHere')}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <label className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileInput} />
              📁 {t('pipeline.input.chooseFile')}
            </label>
            <span className="text-xs text-muted-foreground">|</span>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={handleUrlKeyDown}
                placeholder="URL"
                className="w-48 rounded border border-border bg-surface px-2 py-0.5 text-xs text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={() => void handleFetchUrl()}
                disabled={urlLoading || !url.trim()}
                className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
              >
                {urlLoading ? '...' : t('pipeline.input.fetch')}
              </button>
            </div>
            {urlError && <span className="text-xs text-red-500">{urlError}</span>}
            <span className="text-xs text-muted-foreground ml-auto">
              {value.length > 0 && `${value.length} ${t('pipeline.input.chars')}`}
            </span>
          </div>
        </>
      )}

      {mode === 'randomString' && (
        <textarea
          readOnly
          className="textarea-box w-full min-h-[60px] rounded px-3 py-2 text-sm font-mono resize-y"
          value={value}
        />
      )}

      {mode === 'randomBytes' && (
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">
            {t('pipeline.input.randomBytesInfo')}, {randomLength} {t('pipeline.output.bytes')}
          </div>
          <textarea
            readOnly
            className="textarea-box w-full min-h-[60px] rounded px-3 py-2 text-xs font-mono resize-y break-all"
            value={randomBytesHex}
          />
        </div>
      )}
    </div>
  );
}
