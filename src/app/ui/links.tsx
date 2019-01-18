import Bacon from 'baconjs';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import AddIcon from 'material-ui/svg-icons/av/library-add';
import TextField from 'material-ui/TextField';
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

  private linkStream = new Bacon.Bus<string, any>();

  public componentDidMount() {
    const validated = this.linkStream.map(l => validate(l));
    this.linkStream.onValue(v => this.setState({ link: v }));
    validated.onValue(v => this.setState({ validatedLink: v }));

    this.linkStream.push('');
  }

  public render() {
    return (
      <HalfSection title="Linkit">
        <Item name="Linkki">
          <TextField
            name="link"
            value={this.state.link}
            fullWidth={true}
            onChange={(e, v) => this.linkStream.push(v)}
          />
        </Item>
        <List>
          <ListItem
            primaryText={
              <a
                href={this.state.validatedLink}
                title={this.state.validatedLink}
              >
                {this.state.validatedLink}
              </a>
            }
            leftIcon={<AddIcon onClick={this.onClickAdd} />}
          />
          <Divider />
          {this.state.storedLinks.map(l => (
            <ListItem
              key={l}
              primaryText={
                <a href={l} title={l}>
                  {l}
                </a>
              }
              leftIcon={<DeleteIcon onClick={m => this.deleteLink(l)} />}
            />
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
