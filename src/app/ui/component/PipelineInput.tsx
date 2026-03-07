import { binaryData, PipelineData, textData } from 'app/calc/pipeline/types';
import React, { useCallback, useRef, useState } from 'react';

interface PipelineInputProps {
  value: string;
  onChange: (value: string) => void;
  onDataChange: (data: PipelineData) => void;
}

export function PipelineInput({ value, onChange, onDataChange }: PipelineInputProps) {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFileName(null);
      onChange(e.target.value);
    },
    [onChange],
  );

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name);
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

  const handleClear = useCallback(() => {
    setFileName(null);
    onChange('');
    onDataChange(textData(''));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [onChange, onDataChange]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Syöte</span>
        {fileName && <span className="text-xs text-muted-foreground">📎 {fileName}</span>}
        {(value || fileName) && (
          <button
            onClick={handleClear}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Tyhjennä
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
          placeholder="Kirjoita tai liitä tekstiä, tai pudota tiedosto..."
        />
        {dragOver && (
          <div className="absolute inset-0 flex items-center justify-center rounded bg-primary/10 pointer-events-none">
            <span className="text-sm font-medium text-primary">Pudota tiedosto tähän</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileInput} />
          📁 Valitse tiedosto
        </label>
        <span className="text-xs text-muted-foreground">
          {value.length > 0 && `${value.length} merkkiä`}
        </span>
      </div>
    </div>
  );
}
