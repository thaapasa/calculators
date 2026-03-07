import { ComponentType } from 'react';

import { compressOperations } from './operations/compress';
import { displayOperations } from './operations/display';
import { encodingOperations } from './operations/encoding';
import { formatOperations } from './operations/format';
import { hashOperations } from './operations/hash';
import { textOperations } from './operations/text';
import { OperationDef, StepConfigProps, StepRenderProps } from './types';

/** All available operations */
export const allOperations: OperationDef[] = [
  ...displayOperations,
  ...encodingOperations,
  ...textOperations,
  ...formatOperations,
  ...hashOperations,
  ...compressOperations,
];

/** Lookup operation by id */
const operationMap = new Map<string, OperationDef>(allOperations.map(op => [op.id, op]));

export function getOperation(id: string): OperationDef | undefined {
  return operationMap.get(id);
}

/** Attach a render component to an operation (called from UI layer) */
export function setOperationRenderer(id: string, render: ComponentType<StepRenderProps>) {
  const op = operationMap.get(id);
  if (op) op.render = render;
}

/** Attach a config component to an operation (called from UI layer) */
export function setOperationConfig(id: string, configComponent: ComponentType<StepConfigProps>) {
  const op = operationMap.get(id);
  if (op) op.configComponent = configComponent;
}

/** Category metadata for UI grouping */
export const categories = [
  { id: 'display', label: 'Display' },
  { id: 'encoding', label: 'Encoding' },
  { id: 'text', label: 'Text' },
  { id: 'format', label: 'Format' },
  { id: 'hash', label: 'Hash' },
  { id: 'compress', label: 'Compression' },
] as const;

/** Get operations grouped by category */
export function getOperationsByCategory(): Array<{
  category: (typeof categories)[number];
  operations: OperationDef[];
}> {
  return categories
    .map(cat => ({
      category: cat,
      operations: allOperations.filter(op => op.category === cat.id),
    }))
    .filter(g => g.operations.length > 0);
}
