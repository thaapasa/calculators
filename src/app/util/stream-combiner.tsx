import * as B from 'baconjs';
import * as R from 'ramda';
import { InputChangeHandler, InputChangeType } from './stream-defs';
import { mapObject } from './util';

export interface StreamDefinition<T> {
  read: (input: string) => T;
  write: (input: T) => string;
}

export class StreamCombiner<
  T,
  I,
  S extends { [k in keyof I]: StreamDefinition<T> }
> {
  // Send inputs via these input handlers; input will be propagated to other streams
  inputs: Record<keyof S, InputChangeHandler>;
  // This is used to listen for the outputs
  private output = new B.Bus<any, Record<keyof S, string>>();

  constructor(inputs: S) {
    const inputBuses: Record<keyof S, B.Bus<any, string>> = R.map(
      () => new B.Bus<any, string>(),
      inputs
    );
    const selectedInputStream = new B.Bus<any, [keyof S, string]>();

    this.inputs = mapObject(
      (_, k) => (e: InputChangeType) => {
        const val = typeof e === 'object' ? e.target.value : String(e);
        console.log('Input', k, val);
        // Input to bus k is directly piped to output of k
        selectedInputStream.push([k, val]);
        inputBuses[k].push(val);
      },
      inputs
    );

    const convertedInputs = mapObject(
      (_, k) => inputBuses[k].toProperty('').map(inputs[k].read),
      inputs
    );

    B.combineTemplate<
      any,
      { selected: [keyof S, string]; inputs: Record<keyof S, T> }
    >({
      inputs: convertedInputs,
      selected: selectedInputStream,
    }).onValue(f => {
      console.log('New set', f);
      const selected = f.selected[0];
      const value = f.inputs[selected];
      const outputRecord = mapObject(
        (_, k) => (k === selected ? f.selected[1] : inputs[k].write(value)),
        inputs
      );
      this.output.push(outputRecord);
    });
  }

  // Bind a React class to see the outputs in its state
  bindOutputs = (r: React.Component<any, Record<keyof S, string>>) => {
    return this.output.onValue(o => r.setState(o));
  };
}
