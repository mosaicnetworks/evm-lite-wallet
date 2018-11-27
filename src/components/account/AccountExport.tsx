import * as React from 'react';

import {connect} from "react-redux";
import {Button, Form, Icon, Modal, TextArea} from "semantic-ui-react";

import {DefaultProps, Store} from "evml-redux";

import './styles/AccountExport.css'

export interface LocalAccountsEditProps extends DefaultProps {
    error?: string;
}

interface State {
    open: boolean;
}

class AccountExport extends React.Component<LocalAccountsEditProps, any & State> {
    public state = {
        open: false,
    };

    public open = () => this.setState({open: true});
    public close = () => this.setState({open: false});

    public handleCopy = (e: any) => {
        // pass
    };

    public render() {
        const json = {
            "version": 3,
            "id": "9ed84d6d-6eea-4d13-a915-ece54982e3f7",
            "address": "cf13021ef8748ae7fdfe513aaac0504eaf948aad",
            "crypto": {
                "ciphertext": "f8263181ad9b47254ba7813fcb197b7d58ea31e71b35ae421b3e5ae404afea10",
                "cipherparams": {"iv": "b353a894a4e31fcf5d224f7c0c5ea421"},
                "cipher": "aes-128-ctr",
                "kdf": "scrypt",
                "kdfparams": {
                    "dklen": 32,
                    "salt": "7e72d9e93ec971670d76f6462086c06114cf12f183dbac65ef86ccacdef0390d",
                    "n": 8192,
                    "r": 8,
                    "p": 1
                },
                "mac": "4bee2ee347a497a3afb25712c2f74faa3940ce86ef8b2022b197e9f0cef6df98"
            }
        };
        return (
            <React.Fragment>
                <Modal trigger={<Button basic={false}><Icon name="download"/> Export</Button>}>
                    <Modal.Header>Export: {this.props.account.address}</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Form className={"wrap"}>
                                <Form.Field>
                                    <TextArea autoHeight={true} value={JSON.stringify(json)}/>
                                </Form.Field>
                            </Form>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.handleCopy} color={"green"} type='submit'>Copy</Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStoreToProps = (store: Store) => ({});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStoreToProps, mapDispatchToProps)(AccountExport);