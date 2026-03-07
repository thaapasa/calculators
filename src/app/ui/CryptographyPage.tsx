import { hash } from 'app/util/hash';
import { MaybePromise } from 'app/util/util';
import md5 from 'md5';
import React, { useCallback, useRef, useState } from 'react';

import { Item } from './component/Item';
import Section from './component/Section';
import { SelectableOutput, SelectableOutputHandle } from './component/SelectableOutput';
import { publishSelectedValue } from './LastValue';

interface CryptoType {
  readonly name: string;
  readonly calculate: (x: string) => MaybePromise<string>;
  readonly code: string;
}

const cryptoList: CryptoType[] = [
  { name: 'MD5', calculate: x => md5(x), code: 'md5' },
  { name: 'SHA-1', calculate: x => hash(x, 'SHA-1'), code: 'sha1' },
  { name: 'SHA-256', calculate: x => hash(x, 'SHA-256'), code: 'sha256' },
  { name: 'SHA-512', calculate: x => hash(x, 'SHA-512'), code: 'sha512' },
];

export function CryptographyPage() {
  const [selected, setSelected] = useState(cryptoList[0].code);
  const refsMap = useRef<Record<string, SelectableOutputHandle | null>>({});

  const inputChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const inp = event.target.value;
      cryptoList.forEach(c => refsMap.current[c.code]?.setValue(inp));
    },
    [],
  );

  const selectCrypto = useCallback((code: string) => {
    setSelected(code);
  }, []);

  const onCryptoValue = useCallback(
    (code: string, value: string) => {
      if (code === selected) {
        publishSelectedValue(value);
      }
    },
    [selected],
  );

  return (
    <Section
      title="Kryptografia"
      subtitle={cryptoList.find(c => c.code === selected)?.name ?? ''}
      image="/img/header-cryptography.jpg"
    >
      <Item name="Syöte">
        <textarea
          className="input-inline flex-1 resize-none overflow-hidden"
          rows={1}
          onChange={e => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
            inputChanged(e);
          }}
          name="input"
        />
      </Item>
      {cryptoList.map(c => (
        <SelectableOutput
          ref={el => {
            refsMap.current[c.code] = el;
          }}
          type={c.code}
          label={c.name}
          calculate={c.calculate}
          onValue={v => onCryptoValue(c.code, v)}
          key={c.code}
          onSelect={() => selectCrypto(c.code)}
        />
      ))}
    </Section>
  );
}
