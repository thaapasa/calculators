import { getOperationsByCategory } from 'app/calc/pipeline/registry';
import { useTranslation } from 'app/i18n/LanguageContext';
import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';

interface OperationPickerProps {
  onAdd: (operationId: string) => void;
}

export function OperationPicker({ onAdd }: OperationPickerProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const groups = getOperationsByCategory();

  const handleSelect = useCallback(
    (operationId: string) => {
      onAdd(operationId);
      setOpen(false);
    },
    [onAdd],
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1 rounded border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
      >
        <Plus size={14} />
        {t('pipeline.addOperation')}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-50 min-w-50 max-h-[70vh] overflow-auto rounded border border-border bg-surface shadow-lg">
            {groups.map(({ category, operations }) => (
              <div key={category.id}>
                <div className="sticky top-0 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-muted">
                  {category.label}
                </div>
                {operations.map(op => (
                  <button
                    key={op.id}
                    onClick={() => handleSelect(op.id)}
                    className="block w-full text-left px-3 py-1.5 text-sm hover:bg-accent transition-colors"
                  >
                    {op.name}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
