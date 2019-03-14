import * as React from 'react';

import { InjectedAlertProp, withAlert } from 'react-alert';
import { Button } from 'semantic-ui-react';

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
					className={right ? 'right' : ''}
					onClick={onClickHandler}
					icon={'circle notch'}
					labelPosition="left"
					loading={isLoading}
					disabled={isLoading}
					content={isLoading ? 'Loading' : 'Refresh'}
					color={isLoading ? 'grey' : 'teal'}
				/>
			</React.Fragment>
		);
	}
}

export default withAlert(LoadingButton);
