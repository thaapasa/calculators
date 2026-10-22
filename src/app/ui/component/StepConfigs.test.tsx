// @vitest-environment jsdom
import { cleanup, fireEvent, render } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { BcryptConfig } from './StepConfigs';

/** Renders the config the way a pipeline step does, and records every params change */
function renderBcrypt(initial: Record<string, unknown>) {
  const changes: Record<string, unknown>[] = [];
  function Host() {
    const [params, setParams] = useState(initial);
    return (
      <BcryptConfig
        params={params}
        onChange={p => {
          changes.push(p);
          setParams(p);
        }}
      />
    );
  }
  render(<Host />);
  const [cost, salt] = document.querySelectorAll('input');
  return { cost, salt, changes };
}

describe('BcryptConfig', () => {
  afterEach(cleanup);

  it('passes on only in-range costs while typing', () => {
    const { cost, changes } = renderBcrypt({ cost: 12, salt: '' });
    fireEvent.change(cost, { target: { value: '1' } });
    expect(cost.value).toBe('1');
    expect(changes).toHaveLength(0);
    fireEvent.change(cost, { target: { value: '10' } });
    expect(changes.at(-1)?.cost).toBe(10);
  });

  it('clamps an out-of-range cost on blur', () => {
    const { cost, changes } = renderBcrypt({ cost: 12, salt: '' });
    fireEvent.change(cost, { target: { value: '40' } });
    expect(changes).toHaveLength(0);
    fireEvent.blur(cost);
    expect(cost.value).toBe('16');
    expect(changes.at(-1)?.cost).toBe(16);
  });

  it('restores the current cost when the field is left empty', () => {
    const { cost, changes } = renderBcrypt({ cost: 12, salt: '' });
    fireEvent.change(cost, { target: { value: '' } });
    fireEvent.blur(cost);
    expect(cost.value).toBe('12');
    expect(changes).toHaveLength(0);
  });

  it('marks a salt that is not valid Base64 instead of dropping it', () => {
    const { salt, changes } = renderBcrypt({ cost: 12, salt: '', saltSource: 'base64' });
    fireEvent.change(salt, { target: { value: 'c2F$dA==' } });
    expect(changes.at(-1)?.salt).toBeNull();
    fireEvent.change(salt, { target: { value: 'c2FsdA==' } });
    expect(changes.at(-1)?.salt).toBe('73616c74');
    fireEvent.change(salt, { target: { value: '' } });
    expect(changes.at(-1)?.salt).toBe('');
  });
});
