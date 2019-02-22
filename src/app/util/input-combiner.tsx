import * as B from 'baconjs';
import * as R from 'ramda';
import { InputChangeHandler, InputChangeType } from './stream-defs';
import { mapObject, objectKeys } from './util';

export class InputCombiner<I, S extends { [k in keyof I]: string }> {
  // Attachment points for input values. Send as string values or bind to input change events.
  inputs: Record<keyof S, InputChangeHandler>;
  // Combined value can be observed via this
  combined: B.Observable<any, string>;

  private inputBuses: Record<keyof S, B.Bus<any, string>>;
  private initialValues: S;
  private triggerOutput = new B.Bus<any, void>();
  private write: (val: string) => S;

  constructor(
    initialValues: S,
    read: (inputs: S) => string,
    write: (val: string) => S
  ) {
    this.write = write;
    this.initialValues = initialValues;
    this.inputBuses = R.map(() => new B.Bus<any, string>(), initialValues);

    this.inputs = mapObject(
      (_, k) => (e: InputChangeType) => {
        const val = typeof e === 'object' ? e.target.value : String(e);
        this.inputBuses[k].push(val);
        this.triggerOutput.push();
      },
      initialValues
    );

    this.combined = B.combineTemplate<any, S>(this.inputBuses)
      .sampledBy(this.triggerOutput)
      .map(read);
  }

  init(r: React.Component<any, Record<keyof S, string>>) {
    objectKeys(this.initialValues).forEach(k => {
      this.inputs[k](this.initialValues[k]);
    });
    r.setState(this.initialValues);
  }

  setValue = (value: string, propagate: boolean = false) => {
    const r = this.write(value);
    objectKeys(r).forEach(k => this.inputBuses[k].push(r[k]));
    if (propagate) {
      this.triggerOutput.push();
    }
  };
}
