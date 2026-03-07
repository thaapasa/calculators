import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getOperation } from 'app/calc/pipeline/registry';
import { StepResult } from 'app/util/usePipeline';
import { GripVertical, Trash2 } from 'lucide-react';
import React from 'react';

interface PipelineStepCardProps {
  instanceId: string;
  operationId: string;
  result: StepResult | null;
  onRemove: (instanceId: string) => void;
}

export function PipelineStepCard({
  instanceId,
  operationId,
  result,
  onRemove,
}: PipelineStepCardProps) {
  const op = getOperation(operationId);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: instanceId,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Renderer = op?.render;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded border border-border bg-surface p-3 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <button
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-0.5"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>
        <span className="text-sm font-medium flex-1">{op?.name ?? operationId}</span>
        {result?.error && (
          <span className="text-xs text-red-500" title={result.error}>
            ⚠
          </span>
        )}
        <button
          onClick={() => onRemove(instanceId)}
          className="p-1 text-muted-foreground hover:text-destructive"
          title="Poista"
        >
          <Trash2 size={14} />
        </button>
      </div>
      {result && Renderer && <Renderer input={result.input} output={result.output} />}
    </div>
  );
}
