import * as React from 'react';
import {Label, Table} from "semantic-ui-react";

class AccountHistory extends React.Component<any, any> {
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
                        <Table.Row>
                            <Table.Cell>
0X925601AFA301AA0E6480A5227450521048F5BBBD
                            </Table.Cell>
                            <Table.Cell>10000</Table.Cell>
                            <Table.Cell><Label color={"green"}>Successful</Label></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>
0X925601AFA301AA0E6480A5227450521048F5BBBD
                            </Table.Cell>
                            <Table.Cell>10000</Table.Cell>
                            <Table.Cell><Label color={"red"}>Failed</Label></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>
0X925601AFA301AA0E6480A5227450521048F5BBBD
                            </Table.Cell>
                            <Table.Cell>10000</Table.Cell>
                            <Table.Cell><Label color={"yellow"}>Pending</Label></Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </React.Fragment>
        );
    }
}

export default AccountHistory;