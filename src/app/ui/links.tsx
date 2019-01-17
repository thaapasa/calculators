import React from 'react'
import { HalfSection } from './component/section'
import Item from './component/item'
import Bacon from 'baconjs'
import { isString, isArray } from '../util/util'
import { startsWith } from '../util/strings'
import TextField from 'material-ui/TextField'
import Divider from 'material-ui/Divider'
import AddIcon from 'material-ui/svg-icons/av/library-add'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import { List, ListItem } from 'material-ui/List'
import * as storage from '../util/storage'

function validate(link: string): string {
    if (!isString(link)) { return '' }
    if (startsWith(link, 'http://', true) || startsWith(link, 'https://', true)) { return link }
    return 'http://' + link
}

const linkKey = 'links'

interface LinksState {
    link: string
    validatedLink: string
    storedLinks: string[]
}

export default class Links extends React.Component<{}, LinksState> {

    public state: LinksState = {
        link: '',
        validatedLink: '',
        storedLinks: [],
    }

    private linkStream: Bacon.Bus<string, any>

    public componentDidMount() {
        const links = storage.getArray(linkKey)
        this.setState({ storedLinks: isArray(links) ? links : [] })

        this.linkStream = new Bacon.Bus<string, any>()
        const validated = this.linkStream.map(validate)
        this.linkStream.onValue(v => this.setState({ link: v }))
        validated.onValue(v => this.setState({ validatedLink: v }))

        this.linkStream.push('')
    }

    private addLink = (link: string) => {
        if (link) {
            const links = this.state.storedLinks
            if (links.indexOf(link) < 0) { links.push(link) }
            storage.setArray(linkKey, links)
            this.setState({ storedLinks: links })
        }
    }

    private deleteLink = (link: string) => {
        if (link) {
            const links = this.state.storedLinks.filter(l => l !== link)
            storage.setArray(linkKey, links)
            this.setState({ storedLinks: links })
        }
    }

    public render() {
        return <HalfSection title="Linkit">
            <Item name="Linkki">
                <TextField name="link" value={this.state.link} fullWidth={true} onChange={(e, v) => this.linkStream.push(v)} />
            </Item>
            <List>
                <ListItem primaryText={<a href={this.state.validatedLink} title={this.state.validatedLink}>{this.state.validatedLink}</a>}
                    leftIcon={<AddIcon onClick={m => this.addLink(this.state.validatedLink)} />} />
                <Divider />
                {
                    this.state.storedLinks.map(l =>
                        <ListItem key={l} primaryText={<a href={l} title={l}>{l}</a>}
                            leftIcon={<DeleteIcon onClick={m => this.deleteLink(l)} />} />)
                }

            </List>
        </HalfSection>

    }
}
