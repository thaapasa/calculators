import React from 'react'
import { Drawer, MenuItem, Card, CardHeader } from 'material-ui'
import { history } from '../history'

const ver = require('../../../../package.json')

interface NavigationProps {
    open: boolean
    onToggle: () => void
}

export default class NavigationDrawer extends React.Component<NavigationProps> {
    public render() {
        return (
            <Drawer open={this.props.open} onRequestChange={this.props.onToggle} docked={false}>
                <Card>
                    <CardHeader title="Laskurit" subtitle={`v. ${ver.version}`} avatar="img/calculators.png" />
                </Card>
                <MenuItem onClick={this.goToFullpage}>Kaikki</MenuItem>
                <MenuItem onClick={this.goToNumbers}>Numerot ja merkit</MenuItem>
                <MenuItem onClick={this.goToTime}>Aikaleimat</MenuItem>
                <MenuItem onClick={this.goToIdentifiers}>Tunnisteet</MenuItem>
                <MenuItem onClick={this.goToColors}>Värit</MenuItem>
                <MenuItem onClick={this.goToLinks}>Linkit</MenuItem>
                <MenuItem onClick={this.goToTextConversion}>Tekstimuunnokset</MenuItem>
                <MenuItem onClick={this.goToCryptography}>Kryptografia</MenuItem>
            </Drawer>
        )
    }

    private goToFullpage = this.navigate('/')
    private goToNumbers = this.navigate('/p/numerot')
    private goToTime = this.navigate('/p/aika')
    private goToIdentifiers = this.navigate('/p/tunnisteet')
    private goToColors = this.navigate('/p/värit')
    private goToLinks = this.navigate('/p/linkit')
    private goToTextConversion = this.navigate('/p/tekstimuunnokset')
    private goToCryptography = this.navigate('/p/kryptografia')

    private navigate(path: string) {
        return () => {
            history.push(path)
            this.props.onToggle()
        }
    }
}
