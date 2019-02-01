import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@material-ui/core';
import { Delete, NoteAdd } from '@material-ui/icons';
import Bacon from 'baconjs';
import React from 'react';
import * as store from '../util/store';
import { startsWith } from '../util/strings';
import { isString } from '../util/util';
import Item from './component/item';
import { HalfSection } from './component/section';

function validate(link: string): string {
  if (!isString(link)) {
    return '';
  }
  if (startsWith(link, 'http://', true) || startsWith(link, 'https://', true)) {
    return link;
  }
  return 'http://' + link;
}

interface LinksState {
  link: string;
  validatedLink: string;
  storedLinks: string[];
}

const LINKS_STORE_KEY = 'calculators:links';

function getLinksFromStore(): string[] {
  return store.getValue(LINKS_STORE_KEY) || [];
}

function storeLinks(links: string[]) {
  store.putValue(LINKS_STORE_KEY, links);
}

export default class Links extends React.Component<{}, LinksState> {
  public state: LinksState = {
    link: '',
    validatedLink: '',
    storedLinks: getLinksFromStore(),
  };

  private linkStream = new Bacon.Bus<any, string>();

  public componentDidMount() {
    const validated = this.linkStream.map(l => validate(l));
    this.linkStream.onValue(v => this.setState({ link: v }));
    validated.onValue(v => this.setState({ validatedLink: v }));

    this.linkStream.push('');
  }

  public render() {
    return (
      <HalfSection title="Linkit" image="/img/header-links.jpg">
        <Item name="Linkki">
          <TextField
            name="link"
            value={this.state.link}
            fullWidth={true}
            onChange={e => this.linkStream.push(e.target.value)}
          />
        </Item>
        <List>
          <ListItem>
            <ListItemIcon onClick={this.onClickAdd}>
              <NoteAdd />
            </ListItemIcon>
            <ListItemText>
              <Link href={this.state.validatedLink} />
            </ListItemText>
          </ListItem>
          <Divider />
          {this.state.storedLinks.map(l => (
            <ListItem key={l}>
              <ListItemIcon onClick={() => this.deleteLink(l)}>
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

  private onClickAdd = () => {
    this.addLink(this.state.validatedLink);
  };

  private addLink = (link: string) => {
    if (link) {
      const links = this.state.storedLinks;
      if (links.indexOf(link) < 0) {
        links.push(link);
        this.setState({ storedLinks: links });
        storeLinks(links);
      }
    }
  };

  private deleteLink = (link: string) => {
    if (link) {
      const links = this.state.storedLinks.filter(l => l !== link);
      this.setState({ storedLinks: links });
      storeLinks(links);
    }
  };
}

const Link = ({ href }: { href: string }) => (
  <a href={href} target="_blank">
    {href}
  </a>
);
