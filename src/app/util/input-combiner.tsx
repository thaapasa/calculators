import * as B from 'baconjs';
import * as R from 'ramda';
import { InputChangeHandler, InputChangeType } from './stream-defs';
import { mapObject, objectKeys } from './util';

export class InputCombiner<I, S extends { [k in keyof I]: string }> {
  // Attachment points for input values. Send as string values or bind to input change events.
  inputs: Record<keyof S, InputChangeHandler>;
  // Combined value can be observed via this
  combined: B.Observable<any, string>;

  // Set the value from outside
  outputBus = new B.Bus<any, string>();
  // Overwrite the input values; when the value has been overwritten
  outputs: Record<keyof S, B.EventStream<any, string>>;

  private inputBuses: Record<keyof S, B.Bus<any, string>>;
  private initialValues: S;

  constructor(
    initialValues: S,
    read: (inputs: S) => string,
    write: (val: string) => S
  ) {
    this.initialValues = initialValues;
    this.inputBuses = R.map(() => new B.Bus<any, string>(), initialValues);

    this.inputs = mapObject(
      (_, k) => (e: InputChangeType) => {
        const val = typeof e === 'object' ? e.target.value : String(e);
        this.inputBuses[k].push(val);
      },
      initialValues
    );

    this.combined = B.combineTemplate<any, S>(this.inputBuses).map(read);
    this.combined.onValue(c => console.log('Feeeee', c));
    const convertedOutput = this.outputBus.map(write);
    this.outputs = mapObject(
      (_, k) => convertedOutput.map(o => o[k]),
      initialValues
    );
    this.init = () => {
      console.log('Init!', this.initialValues);
      objectKeys(this.initialValues).forEach(k => {
        console.log('Do', k);
        this.inputs[k](this.initialValues[k]);
      });
      this.outputBus.push(read(this.initialValues));
    };
  }

  init() {
    // Overwritten in constructor
  }

  bindOutputs = (r: React.Component<any, Record<keyof S, string>>) => {
    const disposers = objectKeys(this.outputs).map(k =>
      this.outputs[k].onValue(v => r.setState({ [k]: v } as any))
    );
    return () => disposers.forEach(d => d());
  };
}
