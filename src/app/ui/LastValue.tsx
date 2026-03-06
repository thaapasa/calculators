import { styled, TextField } from '@mui/material';
import React from 'react';

import { ClipboardButton } from './component/ToolButton';

type Listener = (value: string) => void;
const listeners = new Set<Listener>();

export function publishSelectedValue(value: string | Promise<string>) {
  if (value instanceof Promise) {
    value.then(v => listeners.forEach(l => l(v)));
  } else {
    listeners.forEach(l => l(value));
  }
}

export function listenToSelectedValues(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function LastValue() {
  const [value, setValue] = React.useState('');
  React.useEffect(() => listenToSelectedValues(setValue), [setValue]);
  return (
    <Container>
      <ClipboardButton
        title="Kopioi leikepöydälle"
        onClick={() => navigator.clipboard.writeText(value)}
        color="secondary"
      />
      <TextField
        value={value}
        name="lastValue"
        fullWidth={true}
        placeholder="Viimeisin arvo"
        onChange={e => setValue(e.target.value)}
      />
    </Container>
  );
}

const Container = styled('div')`
  display: inline-flex;
  align-items: center;
`;
