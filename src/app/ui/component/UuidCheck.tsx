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
      <div className="mx-3">
        <label className="text-xs text-muted">Tarkista UUID</label>
        <div className="flex items-center rounded border border-border bg-background px-3 py-2">
          <input
            className="flex-1 bg-transparent outline-none"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          {isDefined(valid) ? (
            <span className="ml-2 whitespace-nowrap">
              {valid ? '✅' : '❌'}
              {valid && version ? ` v${version}` : null}
            </span>
          ) : null}
        </div>
      </div>
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
      <div className="mx-3 mt-2">
        <label className="text-xs text-muted">Aikaleima (ms)</label>
        <input
          className="w-full rounded border border-border bg-background px-3 py-2"
          value={epochMillis}
          readOnly
        />
      </div>
      <div className="mx-3 mt-2">
        <label className="text-xs text-muted">Aika</label>
        <input
          className="w-full rounded border border-border bg-background px-3 py-2"
          value={time.format('YYYY-MM-DD HH:mm:ss.SSS Z')}
          readOnly
        />
      </div>
    </>
  );
}
