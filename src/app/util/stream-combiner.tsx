import * as B from 'baconjs';
import * as R from 'ramda';
import {
  InputChangeHandler,
  InputChangeType,
  isInputChangeEvent,
} from './stream-defs';
import { mapObject, objectKeys } from './util';

export interface StreamDefinition<Source, Target> {
  read: (input: Source) => Target;
  write: (input: Target) => Source;
}

export class StreamCombiner<InputKeys extends string, Target> {
  // Send inputs via these input handlers; input will be propagated to other streams
  inputs: Record<InputKeys, InputChangeHandler>;
  output: B.EventStream<{
    selected: InputKeys;
    output: Record<InputKeys, any>;
  }>;
  // This is used to listen for the outputs
  private outputRecord = new B.Bus<Record<InputKeys, Target>>();

  constructor(inputs: Record<InputKeys, StreamDefinition<any, Target>>) {
    const inputBuses: Record<InputKeys, B.Bus<any>> = R.map(
      () => new B.Bus<any>(),
      inputs
    );
    const selectedInputStream = new B.Bus<[InputKeys, any]>();

    this.inputs = mapObject(
      (_, k) => (e: InputChangeType<any>) => {
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

    B.combineTemplate({
      values: B.combineTemplate(convertedInputs),
      selected: selectedInputStream,
    })
      .sampledBy(selectedInputStream)
      .onValue(f => {
        const selected = f.selected[0];
        const value = (f.values as any)[selected];
        const outputRecord = mapObject(
          (_, k) => (k === selected ? f.selected[1] : inputs[k].write(value)),
          inputs
        );
        this.outputRecord.push(outputRecord);
      });

    const sel = selectedInputStream
      .map(s => s[0])
      .toProperty(objectKeys(inputs)[0]);

    this.output = B.combineTemplate({
      selected: sel,
      output: this.outputRecord,
    }).sampledBy(this.outputRecord);
  }

  // Bind a React class to see the outputs in its state
  bindOutputs = (
    r: React.Component<any, Record<InputKeys, any>>,
    process?: (o: Record<InputKeys, any>) => void
  ) => {
    return this.outputRecord.onValue(o =>
      r.setState(o, process ? () => process(o) : undefined)
    );
  };
}
