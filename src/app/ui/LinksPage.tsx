import { Delete, NoteAdd } from '@mui/icons-material';
import { Divider, Input, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React, { useCallback, useState } from 'react';

import * as store from '../util/store';
import { isString } from '../util/util';
import { Item } from './component/Item';
import { HalfSection } from './component/Section';

function validate(link: string): string {
  if (!isString(link)) {
    return '';
  }
  if (link.includes('://')) {
    return link;
  }
  return 'http://' + link;
}

const LINKS_STORE_KEY = 'calculators:links';

function getLinksFromStore(): string[] {
  return store.getValue(LINKS_STORE_KEY) || [];
}

function storeLinks(links: string[]) {
  store.putValue(LINKS_STORE_KEY, links);
}

export function LinksPage() {
  const [link, setLink] = useState('');
  const [storedLinks, setStoredLinks] = useState<string[]>(getLinksFromStore);

  const validatedLink = validate(link);

  const addLink = useCallback(() => {
    if (validatedLink) {
      setStoredLinks(prev => {
        if (prev.indexOf(validatedLink) >= 0) return prev;
        const next = [...prev, validatedLink];
        storeLinks(next);
        return next;
      });
    }
  }, [validatedLink]);

  const deleteLink = useCallback((linkToDelete: string) => {
    setStoredLinks(prev => {
      const next = prev.filter(l => l !== linkToDelete);
      storeLinks(next);
      return next;
    });
  }, []);

  return (
    <HalfSection title="Linkit" image="/img/header-links.jpg">
      <Item name="Linkki">
        <Input name="link" value={link} fullWidth={true} onChange={e => setLink(e.target.value)} />
      </Item>
      <List>
        <ListItem>
          <ListItemIcon onClick={addLink}>
            <NoteAdd />
          </ListItemIcon>
          <ListItemText>
            <Link href={validatedLink} />
          </ListItemText>
        </ListItem>
        <Divider />
        {storedLinks.map(l => (
          <ListItem key={l}>
            <ListItemIcon onClick={() => deleteLink(l)}>
              <Delete />
            </ListItemIcon>
            <ListItemText>
              <Link href={l} />
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </HalfSection>
  );
}

const Link = ({ href }: { href: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {href}
  </a>
);
