import * as React from 'react';

import {connect} from "react-redux";
import {Button, Modal} from "semantic-ui-react";

import {DefaultProps, Store} from "evml-redux";


export interface LocalAccountsEditProps extends DefaultProps {
    error?: string
}

interface State {
    open: boolean;
}

class AccountTransfer extends React.Component<LocalAccountsEditProps, any & State> {
    public state = {
        open: false,
    };

    public open = () => this.setState({open: true});
    public close = () => this.setState({open: false});

    public handleTransfer = () => {
        // pass
    };

    public render() {
        return (
            <React.Fragment>
                <Modal trigger={<Button basic={false} color='green'>Transfer</Button>}>
                    <Modal.Header>Transfer</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            Transfer modal
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.handleTransfer} color={"green"} type='submit'>Transfer</Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStoreToProps = (store: Store) => ({});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStoreToProps, mapDispatchToProps)(AccountTransfer);