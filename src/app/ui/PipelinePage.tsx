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
import { generateInstanceId } from 'app/calc/pipeline/types';
import { useTranslation } from 'app/i18n/LanguageContext';
import { PipelineState, usePipeline } from 'app/util/usePipeline';
import { Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

import { OperationPicker } from './component/OperationPicker';
import { PipelineInput } from './component/PipelineInput';
import { PipelineOutput } from './component/PipelineOutput';
import { PipelineStepCard } from './component/PipelineStepCard';
import Section from './component/Section';
import {
  HexCaseConfig,
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
setOperationConfig('hex-encode', HexCaseConfig);
setOperationConfig('line-sort', LineSortConfig);
setOperationConfig('pbkdf2-sha256', Pbkdf2Config);
setOperationConfig('pbkdf2-sha512', Pbkdf2Config);

interface PipelinePageProps {
  multiInstance?: boolean;
}

export function PipelinePage({ multiInstance = false }: PipelinePageProps = {}) {
  const { t } = useTranslation();
  if (multiInstance) {
    return <MultiPipelinePage />;
  }
  return (
    <Section
      title={t('page.pipeline.title')}
      subtitle={t('page.pipeline.subtitle')}
      image="/img/header-text-conversion.jpg"
    >
      <SinglePipelineBody />
    </Section>
  );
}

function SinglePipelineBody() {
  const pipeline = usePipeline();
  return <PipelineBody pipeline={pipeline} />;
}

interface PipelineInstanceMeta {
  id: string;
  title: string;
}

function MultiPipelinePage() {
  const { t } = useTranslation();
  const makeDefault = useCallback(
    (n: number): PipelineInstanceMeta => ({
      id: generateInstanceId(),
      title: `${t('pipeline.defaultTitle')} ${n}`,
    }),
    [t],
  );
  const [instances, setInstances] = useState<PipelineInstanceMeta[]>(() => [makeDefault(1)]);

  const addInstance = useCallback(() => {
    setInstances(prev => [...prev, makeDefault(prev.length + 1)]);
  }, [makeDefault]);

  const removeInstance = useCallback((id: string) => {
    setInstances(prev => prev.filter(i => i.id !== id));
  }, []);

  const renameInstance = useCallback((id: string, title: string) => {
    setInstances(prev => prev.map(i => (i.id === id ? { ...i, title } : i)));
  }, []);

  const resetAll = useCallback(() => {
    setInstances([makeDefault(1)]);
  }, [makeDefault]);

  return (
    <Section
      title={t('page.pipeline.title')}
      subtitle={t('page.pipeline.subtitle')}
      image="/img/header-text-conversion.jpg"
      action={
        <button
          onClick={resetAll}
          title={t('pipeline.reset')}
          className="flex items-center gap-1 rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
        >
          <RotateCcw size={14} />
          {t('pipeline.reset')}
        </button>
      }
    >
      <div className="space-y-4">
        {instances.map(inst => (
          <PipelineInstance
            key={inst.id}
            title={inst.title}
            onTitleChange={title => renameInstance(inst.id, title)}
            onRemove={instances.length > 1 ? () => removeInstance(inst.id) : undefined}
          />
        ))}
        <button
          onClick={addInstance}
          className="flex items-center gap-1 rounded border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
        >
          <Plus size={14} />
          {t('pipeline.addPipeline')}
        </button>
      </div>
    </Section>
  );
}

interface PipelineInstanceProps {
  title: string;
  onTitleChange: (title: string) => void;
  onRemove?: () => void;
}

function PipelineInstance({ title, onTitleChange, onRemove }: PipelineInstanceProps) {
  const { t } = useTranslation();
  const pipeline = usePipeline();
  return (
    <div className="rounded border border-border bg-surface/50 p-3 space-y-3">
      <div className="flex items-center gap-2">
        <input
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          aria-label={t('pipeline.renameTitle')}
          className="flex-1 min-w-0 bg-transparent border-0 border-b border-transparent hover:border-border focus:border-primary focus:outline-none px-1 py-0.5 text-base font-semibold"
        />
        {onRemove && (
          <button
            onClick={onRemove}
            title={t('pipeline.removePipeline')}
            className="p-1 text-muted-foreground hover:text-destructive"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      <PipelineBody pipeline={pipeline} />
    </div>
  );
}

interface PipelineBodyProps {
  pipeline: PipelineState;
}

function PipelineBody({ pipeline }: PipelineBodyProps) {
  const { t } = useTranslation();
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
  );
}
