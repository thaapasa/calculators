import {
  closestCenter,
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { setOperationConfig, setOperationRenderer } from 'app/calc/pipeline/registry';
import { useTranslation } from 'app/i18n/LanguageContext';
import { usePipeline } from 'app/util/usePipeline';
import { useCallback } from 'react';

import { OperationPicker } from './component/OperationPicker';
import { PipelineInput } from './component/PipelineInput';
import { PipelineOutput } from './component/PipelineOutput';
import { PipelineStepCard } from './component/PipelineStepCard';
import Section from './component/Section';
import {
  HexDumpBytesConfig,
  JsonIndentConfig,
  LineSortConfig,
  Pbkdf2Config,
  RotNConfig,
} from './component/StepConfigs';
import {
  DownloadRenderer,
  HexDumpRenderer,
  ImageRenderer,
  ShowTextRenderer,
  StatsRenderer,
  SvgRenderer,
} from './component/StepRenderers';

// Wire render components to display operations
setOperationRenderer('show-text', ShowTextRenderer);
setOperationRenderer('hex-dump', HexDumpRenderer);
setOperationRenderer('download', DownloadRenderer);
setOperationRenderer('stats', StatsRenderer);
setOperationRenderer('show-image', ImageRenderer);
setOperationRenderer('show-svg', SvgRenderer);

// Wire config components to configurable operations
setOperationConfig('rot13', RotNConfig);
setOperationConfig('json-pretty', JsonIndentConfig);
setOperationConfig('hex-dump', HexDumpBytesConfig);
setOperationConfig('line-sort', LineSortConfig);
setOperationConfig('pbkdf2-sha256', Pbkdf2Config);
setOperationConfig('pbkdf2-sha512', Pbkdf2Config);

export function PipelinePage() {
  const { t } = useTranslation();
  const pipeline = usePipeline();
  const { steps, results, addStep, removeStep, moveStep, updateStepParams } = pipeline;

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

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
    <Section
      title={t('page.pipeline.title')}
      subtitle={t('page.pipeline.subtitle')}
      image="/img/header-text-conversion.jpg"
    >
      <div className="mx-3 space-y-4">
        <PipelineInput
          value={pipeline.input}
          onChange={pipeline.setInput}
          onDataChange={pipeline.setInputData}
        />

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
                  params={step.params}
                  result={results[i] ?? null}
                  onRemove={removeStep}
                  onParamsChange={updateStepParams}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <OperationPicker onAdd={addStep} />

        {pipeline.processing && (
          <div className="text-xs text-muted-foreground">{t('page.pipeline.processing')}</div>
        )}

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
