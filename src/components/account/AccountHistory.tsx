import * as React from 'react';

import {Static} from 'evm-lite-lib';
import {Label, Table} from "semantic-ui-react";
import {connect} from "react-redux";
import {withAlert} from "react-alert";

import {DefaultProps, Store} from "../../redux";


export interface AccountsHistoryLocalProps extends DefaultProps {
    test?: string;
}

class AccountHistory extends React.Component<AccountsHistoryLocalProps, any> {

    public render() {
        return (
            <React.Fragment>
                <Table celled={true}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>To</Table.HeaderCell>
                            <Table.HeaderCell>Value</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.props.txs && this.props.txs.map((tx: any) => {
                            return (<Table.Row key={tx.txHash}>
                                <Table.Cell>
                                    {Static.cleanAddress(tx.to)}
                                </Table.Cell>
                                <Table.Cell>{tx.value}</Table.Cell>
                                <Table.Cell><Label color={"green"}>Successful</Label></Table.Cell>
                            </Table.Row>)
                        })}

                    </Table.Body>
                </Table>
            </React.Fragment>
        );
    }
}

const mapStoreToProps = (store: Store) => ({
    histories: store.transaction.histories
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStoreToProps, mapDispatchToProps)(withAlert(AccountHistory));