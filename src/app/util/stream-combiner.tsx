import * as B from 'baconjs';
import * as R from 'ramda';
import { InputChangeHandler, InputChangeType } from './stream-defs';
import { mapObject, objectKeys } from './util';

export interface StreamDefinition<T> {
  read: (input: string) => T;
  write: (input: T) => string;
}

export class StreamCombiner<
  T,
  I,
  S extends { [k in keyof I]: StreamDefinition<T> },
  K extends keyof S
> {
  inputs: Record<K, InputChangeHandler>;
  convertedOutputs: Record<keyof S, B.EventStream<any, string>>;

  private inputBuses: Record<K, B.Bus<any, string>>;
  private convertedInputs: Record<K, B.EventStream<any, T>>;
  private selectedInputStream = new B.Bus<any, K>();
  private outputBuses: Record<keyof S, B.Bus<any, T>>;

  constructor(inputs: S) {
    this.inputBuses = R.map(() => new B.Bus<any, string>(), inputs);
    this.outputBuses = R.map(() => new B.Bus<any, T>(), inputs);

    this.inputs = mapObject(
      (_, k) => (e: InputChangeType) => {
        const key = k as K;
        const val = typeof e === 'object' ? e.target.value : String(e);
        this.inputBuses[key].push(val);
        this.selectedInputStream.push(key);
      },
      inputs
    );

    this.convertedInputs = mapObject(
      (_, k) => this.inputBuses[k].map(inputs[k].read),
      inputs
    );
    this.convertedOutputs = mapObject(
      (_, k) => this.outputBuses[k].map(inputs[k].write),
      inputs
    );

    B.combineTemplate({
      inputs: this.convertedInputs,
      selected: this.selectedInputStream,
    }).onValue((f: any) => {
      const selected = f.selected as K;
      const value = f.inputs[selected] as T;
      objectKeys(inputs)
        .filter(k => k !== selected)
        .forEach(key => this.outputBuses[key].push(value));
    });
  }
}
