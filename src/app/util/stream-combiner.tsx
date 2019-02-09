import * as B from 'baconjs';
import * as R from 'ramda';
import { objectKeys } from './util';

export interface StreamDefinition<T> {
  read: (input: string) => T;
  write: (input: T) => string;
}

type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
type InputChangeHandler = (input: InputChangeEvent | string | number) => void;

export class StreamCombiner<
  T,
  I,
  S extends { [k in keyof I]: StreamDefinition<T> },
  K extends keyof S
> {
  inputs: Record<K, InputChangeHandler>;
  convertedOutputs: Record<keyof S, B.EventStream<any, T>>;

  private inputBuses: Record<K, B.Bus<any, string>>;
  private convertedInputs: Record<K, B.EventStream<any, T>>;
  private selectedInputStream = new B.Bus<any, K>();
  private outputBuses: Record<keyof S, B.Bus<any, string>>;

  constructor(inputs: S) {
    this.inputBuses = R.map(() => new B.Bus<any, string>(), inputs);
    this.outputBuses = R.map(() => new B.Bus<any, string>(), inputs);

    this.inputs = R.mapObjIndexed(
      (_, k) => (e: InputChangeEvent) => {
        const key = k as K;
        const val = typeof e === 'object' ? e.target.value : String(e);
        this.inputBuses[key].push(val);
        this.selectedInputStream.push(key);
      },
      inputs
    ) as Record<K, InputChangeHandler>;

    this.convertedInputs = R.mapObjIndexed(
      (_, k) => this.inputBuses[k].map(inputs[k].read),
      inputs
    ) as Record<K, B.EventStream<any, T>>;
    this.convertedOutputs = R.mapObjIndexed(
      (_, k) => this.outputBuses[k].map(inputs[k].write),
      inputs
    ) as Record<keyof S, B.EventStream<any, T>>;

    B.combineTemplate({
      inputs: this.convertedInputs,
      selected: this.selectedInputStream,
    }).onValue((f: any) => {
      const selected = f.selected as K;
      objectKeys(inputs)
        .filter(k => k !== selected)
        .forEach(key => this.outputBuses[key].push(f.inputs[selected]));
    });
  }
}
