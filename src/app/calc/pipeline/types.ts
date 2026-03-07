import { ComponentType } from 'react';

/**
 * Data flowing through the pipeline. Either text (string) or binary (Uint8Array).
 */
export type PipelineData = { type: 'text'; text: string } | { type: 'binary'; bytes: Uint8Array };

/** Props passed to an operation's render component */
export interface StepRenderProps {
  input: PipelineData;
  output: PipelineData;
  params?: Record<string, unknown>;
}

/** Props passed to an operation's config component */
export interface StepConfigProps {
  params: Record<string, unknown>;
  onChange: (params: Record<string, unknown>) => void;
}

/**
 * Definition of an available pipeline operation (lives in registry).
 */
export interface OperationDef {
  /** Unique identifier, e.g. 'base64-encode' */
  id: string;
  /** Human-readable name, e.g. 'Base64 Encode' */
  name: string;
  category: 'display' | 'encoding' | 'text' | 'format' | 'hash' | 'compress';
  description?: string;
  /** Process input data, optionally with per-instance params */
  process: (input: PipelineData, params?: Record<string, unknown>) => Promise<PipelineData>;
  /** Optional React component to render inline in the step card */
  render?: ComponentType<StepRenderProps>;
  /** Optional React component to render configuration UI */
  configComponent?: ComponentType<StepConfigProps>;
  /** Default configuration for this operation */
  defaultParams?: Record<string, unknown>;
}

/**
 * A step in the pipeline — serializable (just references an operation by id).
 */
export interface PipelineStep {
  /** Unique per-instance (for React keys and dnd-kit) */
  instanceId: string;
  /** References OperationDef.id in the registry */
  operationId: string;
  /** Per-instance configuration */
  params?: Record<string, unknown>;
}

/**
 * Serializable pipeline configuration (for future presets).
 */
export interface PipelineConfig {
  version: 1;
  steps: Array<{ operationId: string; params?: Record<string, unknown> }>;
}

/** Convert PipelineData to a text string (decodes binary as UTF-8). */
export function toText(data: PipelineData): string {
  if (data.type === 'text') return data.text;
  return new TextDecoder().decode(data.bytes);
}

/** Convert PipelineData to binary (encodes text as UTF-8). */
export function toBinary(data: PipelineData): Uint8Array {
  if (data.type === 'binary') return data.bytes;
  return new TextEncoder().encode(data.text);
}

/** Create text PipelineData */
export function textData(text: string): PipelineData {
  return { type: 'text', text };
}

/** Create binary PipelineData */
export function binaryData(bytes: Uint8Array): PipelineData {
  return { type: 'binary', bytes };
}

/** Generate a unique instance id */
let instanceCounter = 0;
export function generateInstanceId(): string {
  return `step-${Date.now()}-${++instanceCounter}`;
}
