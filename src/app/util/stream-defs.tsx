import React from 'react';

export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type InputChangeType = InputChangeEvent | string | number;
export type InputChangeHandler = (input: InputChangeType) => void;
