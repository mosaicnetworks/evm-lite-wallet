import * as React from 'react';

import { connect } from 'react-redux';
import { InjectedAlertProp, withAlert } from 'react-alert';
import { Button, Card, Divider, Form } from 'semantic-ui-react';

import { Store } from '../redux';

import './styles/Accounts.css';

interface AlertProps {
	alert: InjectedAlertProp;
}

interface StoreProps {
	empty?: null;
}

interface DispatchProps {
	empty?: null;
}

interface OwnProps {
	empty?: null;
}

type LocalProps = OwnProps & StoreProps & DispatchProps & AlertProps;

class Accounts extends React.Component<LocalProps, any> {
	public render() {
		return (
			<React.Fragment>
				<div className={'page-left-right-padding'}>
					<Card fluid={true}>
						<Card.Content>
							<Card.Header>Contract Abstraction</Card.Header>
							<Card.Meta>
								Enter the absolute path of the contract file.
							</Card.Meta>
							<Divider hidden={true} />
							<Card.Description>
								<Form>
									<Form.Field>
										<label>Solidity Contract Path</label>
										<input />
									</Form.Field>
								</Form>
							</Card.Description>
						</Card.Content>
						<Card.Content extra={true}>
							<div className="">
								<Button
									color={'teal'}
									fluid={true}
									content="Load Contract"
								/>
							</div>
						</Card.Content>
					</Card>
				</div>
			</React.Fragment>
		);
	}
}

const mapStoreToProps = (): StoreProps => ({});

const mapsDispatchToProps = (): DispatchProps => ({});

export default connect<StoreProps, DispatchProps, OwnProps, Store>(
	mapStoreToProps,
	mapsDispatchToProps
)(withAlert<AlertProps>(Accounts));
