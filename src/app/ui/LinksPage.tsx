import { useTranslation } from 'app/i18n/LanguageContext';
import { Separator } from 'components/ui/separator';
import { FilePlus, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

import * as store from '../util/store';
import { isString } from '../util/util';
import { Item } from './component/Item';
import Section from './component/Section';

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
  const { t } = useTranslation();
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
    <Section
      title={t('page.links.title')}
      subtitle={t('page.links.subtitle')}
      image="/img/header-links.jpg"
    >
      <Item name={t('page.links.label')}>
        <input
          className="input-inline flex-1"
          name="link"
          value={link}
          onChange={e => setLink(e.target.value)}
        />
      </Item>
      <ul className="list-none p-0 -mb-4">
        <li className="flex items-center px-4 py-2">
          <button onClick={addLink} className="mr-3 text-foreground/60 hover:text-foreground">
            <FilePlus className="h-5 w-5" />
          </button>
          <Link href={validatedLink} />
        </li>
        <Separator className="my-2" />
        {storedLinks.map(l => (
          <li key={l} className="flex items-center px-4 py-2">
            <button
              onClick={() => deleteLink(l)}
              className="mr-3 text-foreground/60 hover:text-foreground"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <Link href={l} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

const Link = ({ href }: { href: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {href}
  </a>
);
