import React from 'react';

export type InputChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;
export type InputChangeType = InputChangeEvent | string | number;
export type InputChangeHandler = (input: InputChangeType) => void;
