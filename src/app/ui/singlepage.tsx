import React from 'react';
import ByteSizes from './bytesize';
import Colors from './colors';
import Cryptography from './cryptography';
import DateTime from './datetime';
import Identifiers from './identifiers';
import Links from './links';
import Numbers from './numbers';
import TextConversion from './text-conversion';

interface PageProps {
  onValue: (value: string) => void;
}

export default class CalculatorSinglePageLayout extends React.Component<
  PageProps
> {
  public render() {
    return (
      <>
        <div className="section-row">
          <Numbers onValue={this.props.onValue} />
          <DateTime onValue={this.props.onValue} />
        </div>
        <div className="section-row">
          <Identifiers onValue={this.props.onValue} />
          <Colors onValue={this.props.onValue} />
        </div>
        <div className="section-row">
          <ByteSizes onValue={this.props.onValue} />
          <Links />
        </div>
        <TextConversion onValue={this.props.onValue} />
        <Cryptography onValue={this.props.onValue} />
      </>
    );
  }
}
