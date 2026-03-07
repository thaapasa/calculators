import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { setOperationRenderer } from 'app/calc/pipeline/registry';
import { usePipeline } from 'app/util/usePipeline';
import React, { useCallback } from 'react';

import { OperationPicker } from './component/OperationPicker';
import { PipelineInput } from './component/PipelineInput';
import { PipelineOutput } from './component/PipelineOutput';
import { PipelineStepCard } from './component/PipelineStepCard';
import Section from './component/Section';
import { DownloadRenderer, HexDumpRenderer, ShowTextRenderer } from './component/StepRenderers';

// Wire render components to display operations
setOperationRenderer('show-text', ShowTextRenderer);
setOperationRenderer('hex-dump', HexDumpRenderer);
setOperationRenderer('download', DownloadRenderer);

export function PipelinePage() {
  const pipeline = usePipeline();
  const { steps, results, addStep, removeStep, moveStep } = pipeline;

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const fromIndex = steps.findIndex(s => s.instanceId === active.id);
      const toIndex = steps.findIndex(s => s.instanceId === over.id);
      if (fromIndex !== -1 && toIndex !== -1) {
        moveStep(fromIndex, toIndex);
      }
    },
    [steps, moveStep],
  );

  const finalResult = results.length > 0 ? results[results.length - 1] : null;

  return (
    <Section title="Tekstimuunnokset" subtitle="Dataputki" image="/img/header-text-conversion.jpg">
      <div className="mx-3 space-y-4">
        <PipelineInput
          value={pipeline.input}
          onChange={pipeline.setInput}
          onDataChange={pipeline.setInputData}
        />

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={steps.map(s => s.instanceId)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {steps.map((step, i) => (
                <PipelineStepCard
                  key={step.instanceId}
                  instanceId={step.instanceId}
                  operationId={step.operationId}
                  result={results[i] ?? null}
                  onRemove={removeStep}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <OperationPicker onAdd={addStep} />

        {pipeline.processing && <div className="text-xs text-muted-foreground">Käsitellään…</div>}

        {finalResult && !finalResult.error ? (
          <PipelineOutput data={finalResult.output} />
        ) : (
          (pipeline.input || pipeline.inputData.type === 'binary') && (
            <PipelineOutput data={pipeline.inputData} />
          )
        )}
      </div>
    </Section>
  );
}
