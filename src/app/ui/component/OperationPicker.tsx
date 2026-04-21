import { getOperationsByCategory } from 'app/calc/pipeline/registry';
import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';

interface OperationPickerProps {
  onAdd: (operationId: string) => void;
}

export function OperationPicker({ onAdd }: OperationPickerProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const groups = getOperationsByCategory();

  const handleSelect = useCallback(
    (operationId: string) => {
      onAdd(operationId);
      setOpenCategory(null);
    },
    [onAdd],
  );

  return (
    <div className="flex flex-wrap gap-2">
      {groups.map(({ category, operations }) => (
        <div key={category.id} className="relative">
          <button
            onClick={() => setOpenCategory(v => (v === category.id ? null : category.id))}
            className="flex items-center gap-1 rounded border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <Plus size={14} />
            {category.label}
          </button>
          {openCategory === category.id && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpenCategory(null)} />
              <div className="absolute left-0 top-full mt-1 z-50 min-w-40 max-h-[70vh] overflow-auto rounded border border-border bg-surface shadow-lg">
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
            </>
          )}
        </div>
      ))}
    </div>
  );
}
