import { PipelineData } from 'app/calc/pipeline/types';
import { createContext, useContext } from 'react';

export interface PipelineInfo {
  id: string;
  title: string;
}

export interface PipelineRegistry {
  pipelines: PipelineInfo[];
  outputs: Map<string, PipelineData | null>;
}

export const PipelineRegistryContext = createContext<PipelineRegistry | null>(null);

export const PipelineInstanceContext = createContext<{ id: string } | null>(null);

export function usePipelineRegistry() {
  return useContext(PipelineRegistryContext);
}

export function usePipelineSelfId() {
  return useContext(PipelineInstanceContext)?.id;
}
