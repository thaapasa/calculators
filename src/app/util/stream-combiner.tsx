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

  private inputBuses: Record<keyof S, B.Bus<any, string>>;
  private convertedInputs: Record<keyof S, B.Property<any, T>>;
  private selectedInputStream = new B.Bus<any, keyof S>();
  private outputBuses: Record<keyof S, B.Bus<any, string>>;

  constructor(inputs: S) {
    this.inputBuses = R.map(() => new B.Bus<any, string>(), inputs);
    this.outputBuses = R.map(() => new B.Bus<any, string>(), inputs);

    this.inputs = mapObject(
      (_, k) => (e: InputChangeType) => {
        const val = typeof e === 'object' ? e.target.value : String(e);
        console.log('Input', k, val);
        this.selectedInputStream.push(k);
        this.inputBuses[k].push(val);
        this.outputBuses[k].push(val);
      },
      inputs
    );

    this.convertedInputs = mapObject(
      (_, k) => this.inputBuses[k].toProperty('').map(inputs[k].read),
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
        .forEach(k => this.outputBuses[k].push(inputs[k].write(value)));
    });
  }

  bindOutputs = (r: React.Component<any, Record<keyof S, string>>) => {
    const disposers = objectKeys(this.outputBuses).map(k =>
      this.outputBuses[k].onValue(v => r.setState({ [k]: v } as any))
    );
    return () => disposers.forEach(d => d());
  };
}
