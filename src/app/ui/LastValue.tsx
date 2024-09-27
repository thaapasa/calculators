import { styled, TextField } from '@mui/material';
import * as Bacon from 'baconjs';
import React from 'react';

import { ClipboardButton } from './component/ToolButton';

const lastValue = new Bacon.Bus<string>();

export function publishSelectedValue(value: string) {
  lastValue.push(value);
}

export function listenToSelectedValues(listener: (value: string) => void): Bacon.Unsub {
  return lastValue.onValue(listener);
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
