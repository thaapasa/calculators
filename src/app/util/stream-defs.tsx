import React from 'react';

export type InputChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;
export type InputChangeType = InputChangeEvent | string | number;
export type InputChangeHandler = (input: InputChangeType) => void;

export function isInputChangeEvent(x: unknown): x is InputChangeEvent {
  if (!x || typeof x !== 'object') {
    return false;
  }
  const e = x as InputChangeEvent;
  return e.target !== undefined && e.target.value !== undefined;
}
