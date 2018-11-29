import * as React from 'react';

import {Button, Card, Icon, Image, Label} from 'semantic-ui-react'

import AccountUpdate from "./AccountUpdate";
import AccountExport from "./AccountExport";
import AccountTransfer from "./AccountTransfer";
import AccountHistory from "./AccountHistory";

import './styles/Account.css'

class Account extends React.Component<any, any> {
    public state = {
        showTxHistory: false,
    };

    public onTXHistoryClick = () => {
        this.setState({showTxHistory: !(this.state.showTxHistory)});
    };

    public render() {
        return (
            <Card fluid={true}>
                <Card.Content>
                    <Image floated='right' size='mini'>
                        <Icon name="bitcoin" bordered={false} size={'big'}/>
                    </Image>
                    <Card.Header className={"address"}>
                        {this.props.account.address}
                    </Card.Header>
                    <Card.Description>
                        <Label>
                            Balance
                            <Label.Detail>{this.props.account.balance}</Label.Detail>
                        </Label>
                        <Label>
                            Nonce
                            <Label.Detail>{this.props.account.nonce}</Label.Detail>
                        </Label>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra={true}>
                    <div className='ui small four buttons'>
                        <Button primary={true} onClick={this.onTXHistoryClick}>
                            <Icon name="list"/> Transaction History
                        </Button>
                        <AccountTransfer account={this.props.account}/>
                        <AccountUpdate account={this.props.account}/>
                        <AccountExport account={this.props.account}/>
                    </div>
                </Card.Content>
                {(this.state.showTxHistory) ?
                    (<Card.Content><AccountHistory account={this.props.account}/></Card.Content>) : null}
            </Card>
        );
    }
}

export default Account;