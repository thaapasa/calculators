import * as React from "react"
import Section from "./component/section"
import Item from "./component/item"
import * as Bacon from "baconjs"
import {isString,isArray}  from "../util/util"
import {startsWith} from "../util/strings"
import TextField from "material-ui/TextField"
import Divider from "material-ui/Divider"
import AddIcon from "material-ui/svg-icons/av/library-add"
import DeleteIcon from "material-ui/svg-icons/action/delete"
import {List,ListItem} from "material-ui/List"
import * as storage from "../util/storage"

function validate(link: string) {
    if (!isString(link)) return ""
    if (startsWith(link, "http://", true) || startsWith(link, "https://", true)) return link
    return "http://" + link
}

const linkKey = "links"

export default class Links extends React.Component<{}, any> {

    private linkStream: any

    constructor(props: {}) {
        super(props)
        const links = storage.getArray(linkKey)
        this.state = { link: "", validatedLink: "", storedLinks: isArray(links) ? links : [] }

        this.addLink = this.addLink.bind(this)
        this.deleteLink = this.deleteLink.bind(this)

        this.linkStream = new Bacon.Bus()
        const validated = this.linkStream.map(validate)
        this.linkStream.setState(this, "link")
        validated.setState(this, "validatedLink")
    }

    componentDidMount() {
        this.linkStream.push("")
    }

    addLink(link: string) {
        if (link) {
            const links = this.state.storedLinks
            if (!links.includes(link)) links.push(link)
            storage.setArray(linkKey, links)
            this.setState({ storedLinks: links })
        }
    }

    deleteLink(link: string) {
        if (link) {
            const links = this.state.storedLinks.filter((l: string) => l != link)
            storage.setArray(linkKey, links)
            this.setState({ storedLinks: links })
        }
    }

    render() {
        return <Section title="Linkit">
            <Item name="Linkki">
                <TextField name="link" value={this.state.link} fullWidth={true} onChange={(e, v) => this.linkStream.push(v)} />
            </Item>
            <List>
                <ListItem primaryText={<a href={this.state.validatedLink} title={this.state.validatedLink}>{ this.state.validatedLink }</a>}
                          leftIcon={<AddIcon onClick={m => this.addLink(this.state.validatedLink)} />}/>
                <Divider />
                {
                    this.state.storedLinks.map((l: any) =>
                        <ListItem key={l} primaryText={<a href={l} title={l}>{ l }</a>}
                                  leftIcon={<DeleteIcon onClick={m => this.deleteLink(l)} />}/>)
                }

            </List>
        </Section>

    }
}
