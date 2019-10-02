import * as B from 'baconjs';
import * as R from 'ramda';
import {
  InputChangeHandler,
  InputChangeType,
  isInputChangeEvent,
} from './stream-defs';
import { mapObject, objectKeys } from './util';

export interface StreamDefinition<S, T> {
  read: (input: S | string) => T;
  write: (input: T) => S;
}

export class StreamCombiner<
  S,
  T,
  I,
  O extends { [k in keyof I]: StreamDefinition<S, T> }
> {
  // Send inputs via these input handlers; input will be propagated to other streams
  inputs: Record<keyof O, InputChangeHandler>;
  output: B.EventStream<{ selected: keyof O; output: Record<keyof O, any> }>;
  // This is used to listen for the outputs
  private outputRecord = new B.Bus<Record<keyof O, S | string>>();

  constructor(inputs: O) {
    const inputBuses: Record<keyof O, B.Bus<S | string>> = R.map(
      () => new B.Bus<S | string>(),
      inputs
    );
    const selectedInputStream = new B.Bus<[keyof O, S | string]>();

    this.inputs = mapObject(
      (_, k) => (e: InputChangeType<S>) => {
        const val = isInputChangeEvent(e) ? e.target.value : e;
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

    B.combineTemplate<Record<keyof O, T>>(convertedInputs)
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
    r: React.Component<any, Record<keyof O, string | S>>,
    process?: (o: Record<keyof O, string | S>) => void
  ) => {
    return this.outputRecord.onValue(o =>
      r.setState(o, process ? () => process(o) : undefined)
    );
  };
}
