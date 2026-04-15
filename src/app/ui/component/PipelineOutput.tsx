import { PipelineData, toBinary, toText } from 'app/calc/pipeline/types';
import { useTranslation } from 'app/i18n/LanguageContext';
import { Clipboard } from 'lucide-react';
import { useCallback } from 'react';

interface PipelineOutputProps {
  data: PipelineData | null;
}

export function PipelineOutput({ data }: PipelineOutputProps) {
  const { t } = useTranslation();
  const text = data ? toText(data) : '';

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
  }, [text]);

  const handleDownload = useCallback(() => {
    if (!data) return;
    const bytes = toBinary(data);
    const blob = new Blob([bytes.slice().buffer]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.bin';
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  if (!data) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{t('pipeline.output.result')}</span>
        <button
          onClick={handleCopy}
          className="p-1 text-muted-foreground hover:text-foreground"
          title={t('component.copyToClipboard')}
        >
          <Clipboard size={14} />
        </button>
        <button
          onClick={handleDownload}
          className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ⬇ {t('pipeline.output.download')}
        </button>
        <span className="text-xs text-muted-foreground">
          {data.type === 'binary'
            ? `${data.bytes.length} ${t('pipeline.output.bytes')}`
            : `${text.length} ${t('pipeline.output.chars')}`}
        </span>
      </div>
      <pre className="min-h-9 max-h-50 overflow-auto rounded border border-border bg-foreground/5 px-3 py-2 text-xs font-mono whitespace-pre-wrap break-all">
        {text}
      </pre>
    </div>
  );
}
