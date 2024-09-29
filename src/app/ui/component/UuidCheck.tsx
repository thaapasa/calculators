import { InputAdornment, TextField } from '@mui/material';
import { isDefined } from 'app/util/util';
import moment from 'moment';
import React from 'react';
import * as uuid from 'uuid';

export function UuidCheck({ input: inputFromProps }: { input?: string }) {
  const [input, setInput] = React.useState('');
  React.useEffect(() => {
    if (inputFromProps) {
      setInput(inputFromProps);
    }
  }, [inputFromProps]);

  const valid = input ? uuid.validate(input) : undefined;
  const version = valid ? uuid.version(input) : undefined;

  return (
    <>
      <TextField
        fullWidth
        label="Tarkista UUID"
        variant="filled"
        value={input}
        onChange={e => setInput(e.target.value)}
        slotProps={{
          input: {
            endAdornment: isDefined(valid) ? (
              <InputAdornment position="end">
                {valid ? '✅' : '❌'}
                {valid && version ? ` v${version}` : null}
              </InputAdornment>
            ) : null,
          },
        }}
      />
      {valid && version === 7 ? <Uuid7Info input={input} /> : null}
    </>
  );
}
function Uuid7Info({ input }: { input: string }) {
  const stampStr = input.slice(0, 8) + input.slice(9, 13);
  const epochMillis = parseInt(stampStr, 16);
  const time = moment(epochMillis);
  return (
    <>
      <TextField
        fullWidth
        variant="filled"
        label="Aikaleima (ms)"
        value={epochMillis}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
      />
      <TextField
        fullWidth
        variant="filled"
        label="Aika"
        value={time.format('YYYY-MM-DD HH:mm:ss.SSS Z')}
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
      />
    </>
  );
}
