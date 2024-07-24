import { styled } from '@mui/material';
import React from 'react';

interface ItemProps {
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly name?: string | JSX.Element;
  readonly valueClassName?: 'top';
}

export default function Item({
  className,
  style,
  name,
  valueClassName,
  children,
}: React.PropsWithChildren<ItemProps>) {
  return (
    <CalculatorItem className={className} style={style}>
      {name ? <div className="name">{name}</div> : undefined}
      <div className={`value ${valueClassName || ''}`}>{children}</div>
    </CalculatorItem>
  );
}

const CalculatorItem = styled('div')`
  margin: 0.2em 0.75em;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  &.inline {
    display: inline-flex;
  }

  & > .name {
    width: 8em;
  }

  & > .value {
    flex-grow: 1;
    white-space: nowrap;
    display: inline-flex;
    width: auto;
    flex-wrap: nowrap;
    align-items: center;

    &.top {
      align-items: flex-start;
    }
  }

  &.multiline > .value {
    white-space: normal;
    display: inherit;
    width: auto;
    flex-wrap: inherit;
  }
`;
