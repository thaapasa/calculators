import * as B from 'baconjs';
import * as R from 'ramda';
import { InputChangeHandler, InputChangeType } from './stream-defs';
import { mapObject, objectKeys } from './util';

export class InputCombiner<
  T extends string | number,
  I,
  S extends { [k in keyof I]: T }
> {
  inputs: Record<keyof S, InputChangeHandler>;
  // inputs: Record<K, B.Bus<any, string>>;
  combined: B.Observable<any, string>;
  outputs: Record<keyof S, B.Bus<any, string>>;
  private inputBuses: Record<keyof S, B.Bus<any, string>>;

  constructor(
    initialValues: S,
    read: (inputs: S) => string,
    write: (val: string) => S
  ) {
    this.inputBuses = R.map(() => new B.Bus<any, string>(), initialValues);

    this.inputs = mapObject(
      (_, k) => (e: InputChangeType) => {
        const val = typeof e === 'object' ? e.target.value : String(e);
        this.inputBuses[k].push(val);
      },
      initialValues
    );

    this.combined = B.combineTemplate<any, S>(this.inputs).map(read);
    this.outputs = mapObject((_, k) => this.inputBuses[k], this.inputBuses);

    objectKeys(initialValues).forEach(k => this.inputs[k](initialValues[k]));
  }

  bindOutputs = <RS extends { [k in keyof I]: string }>(
    r: React.Component<any, RS>
  ) => {
    const disposers = objectKeys(this.outputs).map(k =>
      this.outputs[k].onValue(v => r.setState({ [k]: v } as any))
    );
    return () => disposers.forEach(d => d());
  };
}
