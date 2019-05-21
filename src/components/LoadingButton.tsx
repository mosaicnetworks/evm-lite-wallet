import * as React from 'react';

import { InjectedAlertProp, withAlert } from 'react-alert';
import { Button } from 'semantic-ui-react';

interface AlertProps {
	alert: InjectedAlertProp;
}

interface OwnProps {
	isLoading: boolean;
	onClickHandler: any;
}

type LocalProps = OwnProps & AlertProps;

class LoadingButton extends React.Component<LocalProps, any> {
	public render() {
		const { isLoading, onClickHandler } = this.props;

		return (
			<React.Fragment>
				<Button
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
