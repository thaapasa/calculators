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
  // Send inputs via these input handlers; input will be propagated to other streams
  inputs: Record<keyof S, InputChangeHandler>;
  output: B.EventStream<
    any,
    { selected: keyof S; output: Record<keyof S, string> }
  >;
  // This is used to listen for the outputs
  private outputRecord = new B.Bus<any, Record<keyof S, string>>();

  constructor(inputs: S) {
    const inputBuses: Record<keyof S, B.Bus<any, string>> = R.map(
      () => new B.Bus<any, string>(),
      inputs
    );
    const selectedInputStream = new B.Bus<any, [keyof S, string]>();

    this.inputs = mapObject(
      (_, k) => (e: InputChangeType) => {
        const val = typeof e === 'object' ? e.target.value : String(e);
        inputBuses[k].push(val);
        // Input to bus k is directly piped to output of k
        selectedInputStream.push([k, val]);
      },
      inputs
    );

    const convertedInputs = mapObject(
      (_, k) => inputBuses[k].toProperty('').map(inputs[k].read),
      inputs
    );

    B.combineTemplate<any, Record<keyof S, T>>(convertedInputs)
      .sampledBy(selectedInputStream, (values, selected) => ({
        values,
        selected,
      }))
      .onValue(f => {
        const selected = f.selected[0];
        const value = f.values[selected];
        const outputRecord = mapObject(
          (_, k) => (k === selected ? f.selected[1] : inputs[k].write(value)),
          inputs
        );
        this.outputRecord.push(outputRecord);
      });

    this.output = selectedInputStream
      .toProperty([objectKeys(inputs)[0], ''])
      .sampledBy(this.outputRecord, (selected, output) => ({
        output,
        selected: selected[0],
      }));
  }

  // Bind a React class to see the outputs in its state
  bindOutputs = (
    r: React.Component<any, Record<keyof S, string>>,
    process?: (o: Record<keyof S, string>) => void
  ) => {
    return this.outputRecord.onValue(o =>
      r.setState(o, process ? () => process(o) : undefined)
    );
  };
}
