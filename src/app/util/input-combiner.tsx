import * as B from 'baconjs';
import * as R from 'ramda';
import {
  InputChangeHandler,
  InputChangeType,
  isInputChangeEvent,
} from './stream-defs';
import { mapObject, objectKeys } from './util';

export class InputCombiner<Target, Source extends Record<any, any>> {
  // Attachment points for input values. Send as string values or bind to input change events.
  inputs: Record<keyof Source, InputChangeHandler>;
  // Combined value can be observed via this
  combined: B.Observable<Target>;

  private inputBuses: Record<keyof Source, B.Bus<string>>;
  private initialValues: Source;
  private triggerOutput = new B.Bus<void>();
  private write: (val: Target) => Source;

  constructor(
    initialValues: Source,
    read: (inputs: Source) => Target,
    write: (val: Target) => Source
  ) {
    this.write = write;
    this.initialValues = initialValues;
    this.inputBuses = R.map(() => new B.Bus<string>(), initialValues);

    this.inputs = mapObject(
      (_, k) => (e: InputChangeType) => {
        const val = isInputChangeEvent(e) ? e.target.value : String(e);
        this.inputBuses[k].push(val);
        this.triggerOutput.push();
      },
      initialValues
    );

    const combinedOutput = B.combineTemplate(this.inputBuses).sampledBy(
      this.triggerOutput
    );

    this.combined = combinedOutput.map(read) as any;
  }

  init(r: React.Component<any, Record<keyof Source, string>>) {
    objectKeys(this.initialValues).forEach(k => {
      this.inputs[k](this.initialValues[k]);
    });
    r.setState(this.initialValues);
  }

  setValue = (value: Target, propagate: boolean = false) => {
    const r = this.write(value);
    objectKeys(r).forEach(k => this.inputBuses[k].push(r[k]));
    if (propagate) {
      this.triggerOutput.push();
    }
  };
}
