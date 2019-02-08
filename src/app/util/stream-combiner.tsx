import * as B from 'baconjs';
import * as R from 'ramda';

export interface StreamDefinition<T> {
  read: (input: string) => T;
  write: (input: T) => string;
}

type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
type InputChangeHandler = (input: InputChangeEvent) => void;

export class StreamCombiner<T, S> {
  inputs: Record<keyof S, InputChangeHandler>;
  values = {} as Record<keyof S, B.EventStream<any, string>>;
  private inputStreams: Record<keyof S, B.Bus<any, string>>;
  private convertedInputs: Record<keyof S, B.EventStream<any, T>>;
  private selectedInputStream = new B.Bus<any, keyof S>();

  constructor(inputs: { [key: string]: StreamDefinition<T> & S }) {
    this.inputStreams = R.map(() => new Bacon.Bus<any, string>(), inputs);

    this.inputs = R.mapObjIndexed(
      (_, k) => (e: InputChangeEvent) => {
        this.inputStreams[k].push(e.target.value);
        this.selectedInputStream.push(k as keyof S);
      },
      inputs
    ) as Record<keyof S, InputChangeHandler>;

    this.convertedInputs = R.mapObjIndexed(
      (_, k) => this.inputStreams[k].map(inputs[k].read),
      inputs
    ) as Record<keyof S, B.EventStream<any, T>>;

    B.combineTemplate({
      inputs: this.convertedInputs,
      selected: this.selectedInputStream,
    }).onValue(f => {
      console.log('Got', f);
    });
  }
}
