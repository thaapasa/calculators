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
import { generateInstanceId, PipelineConfig } from 'app/calc/pipeline/types';
import { useTranslation } from 'app/i18n/LanguageContext';
import { getSetupsFromStore, StoredSetup, storeSetups } from 'app/util/pipelineSetupStorage';
import { PipelineState, usePipeline } from 'app/util/usePipeline';
import { Badge } from 'components/ui/badge';
import { Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  initialConfig?: PipelineConfig;
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
  const [setups, setSetups] = useState<StoredSetup[]>(getSetupsFromStore);
  const configsRef = useRef<Map<string, PipelineConfig>>(new Map());

  const registerConfig = useCallback((id: string, config: PipelineConfig | null) => {
    if (config) configsRef.current.set(id, config);
    else configsRef.current.delete(id);
  }, []);

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

  const saveSetup = useCallback(() => {
    const name = window.prompt(t('pipeline.saveSetupPrompt'));
    if (!name) return;
    const pipelines = instances.map(inst => ({
      title: inst.title,
      config: configsRef.current.get(inst.id) ?? { version: 1 as const, steps: [] },
    }));
    setSetups(prev => {
      const next = [...prev, { name, pipelines }];
      storeSetups(next);
      return next;
    });
  }, [instances, t]);

  const loadSetup = useCallback((setup: StoredSetup) => {
    setInstances(
      setup.pipelines.map(p => ({
        id: generateInstanceId(),
        title: p.title,
        initialConfig: p.config,
      })),
    );
  }, []);

  const removeSetup = useCallback((index: number) => {
    setSetups(prev => {
      const next = [...prev];
      next.splice(index, 1);
      storeSetups(next);
      return next;
    });
  }, []);

  return (
    <Section
      title={t('page.pipeline.title')}
      subtitle={t('page.pipeline.subtitle')}
      image="/img/header-text-conversion.jpg"
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={saveSetup}
            title={t('pipeline.saveSetup')}
            className="flex items-center gap-1 rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <Save size={14} />
            {t('pipeline.saveSetup')}
          </button>
          <button
            onClick={resetAll}
            title={t('pipeline.reset')}
            className="flex items-center gap-1 rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <RotateCcw size={14} />
            {t('pipeline.reset')}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {setups.length > 0 && (
          <div className="-m-1 mb-4 flex flex-wrap">
            {setups.map((s, i) => (
              <Badge
                key={i}
                className="m-1 px-3 py-1 cursor-pointer"
                onClick={() => loadSetup(s)}
                onDelete={() => removeSetup(i)}
                title={t('pipeline.loadSetup')}
              >
                {s.name}
              </Badge>
            ))}
          </div>
        )}
        {instances.map(inst => (
          <PipelineInstance
            key={inst.id}
            id={inst.id}
            title={inst.title}
            initialConfig={inst.initialConfig}
            onTitleChange={title => renameInstance(inst.id, title)}
            onRemove={instances.length > 1 ? () => removeInstance(inst.id) : undefined}
            onConfigChange={registerConfig}
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
  id: string;
  title: string;
  initialConfig?: PipelineConfig;
  onTitleChange: (title: string) => void;
  onRemove?: () => void;
  onConfigChange: (id: string, config: PipelineConfig | null) => void;
}

function PipelineInstance({
  id,
  title,
  initialConfig,
  onTitleChange,
  onRemove,
  onConfigChange,
}: PipelineInstanceProps) {
  const { t } = useTranslation();
  const pipeline = usePipeline();
  const { fromConfig, toConfig, steps } = pipeline;

  useEffect(() => {
    if (initialConfig) fromConfig(initialConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onConfigChange(id, toConfig());
    return () => onConfigChange(id, null);
  }, [id, steps, toConfig, onConfigChange]);

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
