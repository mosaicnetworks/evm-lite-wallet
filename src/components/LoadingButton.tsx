import * as React from 'react';

import { InjectedAlertProp, withAlert } from 'react-alert';
import { Button } from 'semantic-ui-react';

import './styles/LoadingButton.css';

interface AlertProps {
	alert: InjectedAlertProp;
}

interface OwnProps {
	isLoading: boolean;
	right: boolean;
	onClickHandler: any;
}

type LocalProps = OwnProps & AlertProps;

class LoadingButton extends React.Component<LocalProps, any> {
	public render() {
		const { isLoading, onClickHandler, right } = this.props;

		return (
			<React.Fragment>
				<Button
					// basic={true}
					className={right ? 'right' : ''}
					onClick={onClickHandler}
					icon={'circle notch'}
					loading={isLoading}
					disabled={isLoading}
					color={'blue'}
				/>
			</React.Fragment>
		);
	}
}

export default withAlert(LoadingButton);
