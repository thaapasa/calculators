import type { PipelineConfig } from 'app/calc/pipeline/types';

import * as store from './store';

export interface StoredPipeline {
  id: string;
  title: string;
  config: PipelineConfig;
}

export interface StoredSetup {
  name: string;
  pipelines: StoredPipeline[];
}

const SETUPS_STORE_KEY = 'calculators:pipeline-setups';

export function getSetupsFromStore(): StoredSetup[] {
  return store.getValue(SETUPS_STORE_KEY) || [];
}

export function storeSetups(setups: StoredSetup[]) {
  store.putValue(SETUPS_STORE_KEY, setups);
}
