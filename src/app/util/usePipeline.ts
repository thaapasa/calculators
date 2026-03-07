import { getOperation } from 'app/calc/pipeline/registry';
import {
  generateInstanceId,
  PipelineConfig,
  PipelineData,
  PipelineStep,
  textData,
} from 'app/calc/pipeline/types';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface StepResult {
  input: PipelineData;
  output: PipelineData;
  error?: string;
}

export interface PipelineState {
  input: string;
  setInput: (value: string) => void;
  inputData: PipelineData;
  setInputData: (data: PipelineData) => void;
  steps: PipelineStep[];
  results: (StepResult | null)[];
  addStep: (operationId: string, params?: Record<string, unknown>) => void;
  removeStep: (instanceId: string) => void;
  moveStep: (fromIndex: number, toIndex: number) => void;
  updateStepParams: (instanceId: string, params: Record<string, unknown>) => void;
  toConfig: () => PipelineConfig;
  fromConfig: (config: PipelineConfig) => void;
  processing: boolean;
}

export function usePipeline(): PipelineState {
  const [input, setInput] = useState('');
  const [inputData, setInputDataState] = useState<PipelineData>(textData(''));
  const [steps, setSteps] = useState<PipelineStep[]>([]);
  const [results, setResults] = useState<(StepResult | null)[]>([]);
  const [processing, setProcessing] = useState(false);
  const processingRef = useRef(0);

  const setInputData = useCallback((data: PipelineData) => {
    setInputDataState(data);
    if (data.type === 'text') {
      setInput(data.text);
    }
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    setInputDataState(textData(value));
  }, []);

  // Recompute all step outputs when input or steps change
  useEffect(() => {
    const runId = ++processingRef.current;

    async function compute() {
      if (steps.length === 0) {
        setResults([]);
        setProcessing(false);
        return;
      }

      setProcessing(true);
      const newResults: (StepResult | null)[] = [];
      let currentData: PipelineData = inputData;

      for (const step of steps) {
        if (runId !== processingRef.current) return;
        const op = getOperation(step.operationId);
        if (!op) {
          newResults.push({
            input: currentData,
            output: currentData,
            error: `Unknown operation: ${step.operationId}`,
          });
          continue;
        }
        try {
          const output = await op.process(currentData, step.params);
          newResults.push({ input: currentData, output });
          currentData = output;
        } catch (e) {
          const error = e instanceof Error ? e.message : String(e);
          newResults.push({ input: currentData, output: currentData, error });
        }
      }

      if (runId !== processingRef.current) return;
      setResults(newResults);
      setProcessing(false);
    }

    compute();
  }, [inputData, steps]);

  const addStep = useCallback((operationId: string, params?: Record<string, unknown>) => {
    const op = getOperation(operationId);
    const step: PipelineStep = {
      instanceId: generateInstanceId(),
      operationId,
      params: params ?? op?.defaultParams,
    };
    setSteps(prev => [...prev, step]);
  }, []);

  const removeStep = useCallback((instanceId: string) => {
    setSteps(prev => prev.filter(s => s.instanceId !== instanceId));
  }, []);

  const moveStep = useCallback((fromIndex: number, toIndex: number) => {
    setSteps(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const updateStepParams = useCallback((instanceId: string, params: Record<string, unknown>) => {
    setSteps(prev => prev.map(s => (s.instanceId === instanceId ? { ...s, params } : s)));
  }, []);

  const toConfig = useCallback((): PipelineConfig => {
    return {
      version: 1,
      steps: steps.map(s => ({
        operationId: s.operationId,
        ...(s.params ? { params: s.params } : {}),
      })),
    };
  }, [steps]);

  const fromConfig = useCallback((config: PipelineConfig) => {
    setSteps(
      config.steps.map(s => ({
        instanceId: generateInstanceId(),
        operationId: s.operationId,
        params: s.params,
      })),
    );
  }, []);

  return {
    input,
    setInput: handleInputChange,
    inputData,
    setInputData,
    steps,
    results,
    addStep,
    removeStep,
    moveStep,
    updateStepParams,
    toConfig,
    fromConfig,
    processing,
  };
}
