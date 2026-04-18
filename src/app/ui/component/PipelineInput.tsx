import { binaryData, PipelineData, textData } from 'app/calc/pipeline/types';
import { useTranslation } from 'app/i18n/LanguageContext';
import React, { useCallback, useRef, useState } from 'react';

interface PipelineInputProps {
  value: string;
  onChange: (value: string) => void;
  onDataChange: (data: PipelineData) => void;
}

export function PipelineInput({ value, onChange, onDataChange }: PipelineInputProps) {
  const { t } = useTranslation();
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [url, setUrl] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // Try to decode as text; if it looks like valid UTF-8 text, use text mode
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

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{t('pipeline.input.label')}</span>
        {fileName && <span className="text-xs text-muted-foreground">📎 {fileName}</span>}
        {(value || fileName) && (
          <button
            onClick={handleClear}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {t('pipeline.input.clear')}
          </button>
        )}
      </div>
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
            <span className="text-sm font-medium text-primary">{t('pipeline.input.dropHere')}</span>
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
    </div>
  );
}
