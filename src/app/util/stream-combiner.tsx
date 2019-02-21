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
  S extends { [k in keyof I]: StreamDefinition<T> }
> {
  inputs: Record<keyof S, InputChangeHandler>;
  convertedOutputs: Record<keyof S, B.EventStream<any, string>>;

  private inputBuses: Record<keyof S, B.Bus<any, string>>;
  private convertedInputs: Record<keyof S, B.EventStream<any, T>>;
  private selectedInputStream = new B.Bus<any, keyof S>();
  private outputBuses: Record<keyof S, B.Bus<any, T>>;

  constructor(inputs: S) {
    this.inputBuses = R.map(() => new B.Bus<any, string>(), inputs);
    this.outputBuses = R.map(() => new B.Bus<any, T>(), inputs);

    this.inputs = mapObject(
      (_, k) => (e: InputChangeType) => {
        const val = typeof e === 'object' ? e.target.value : String(e);
        this.inputBuses[k].push(val);
        this.selectedInputStream.push(k);
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

    B.combineTemplate<any, { selected: keyof S; inputs: Record<keyof S, T> }>({
      inputs: this.convertedInputs,
      selected: this.selectedInputStream,
    }).onValue(f => {
      const selected = f.selected;
      const value = f.inputs[selected];
      objectKeys(inputs)
        .filter(k => k !== selected)
        .forEach(key => this.outputBuses[key].push(value));
    });
  }
}
