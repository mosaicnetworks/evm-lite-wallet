import * as React from 'react';

import { InjectedAlertProp, withAlert } from 'react-alert';
import { Button, Popup } from 'semantic-ui-react';

import './styles/LoadingButton.css';

interface AlertProps {
	alert: InjectedAlertProp;
}

interface OwnProps {
	isLoading: boolean;
	right: boolean;
	onClickHandler: any;
	content: string;
}

type LocalProps = OwnProps & AlertProps;

class LoadingButton extends React.Component<LocalProps, any> {
	public render() {
		const { isLoading, onClickHandler, right, content } = this.props;

		return (
			<React.Fragment>
				<Popup
					trigger={
						<Button
							className={right ? 'right' : ''}
							onClick={onClickHandler}
							icon={'circle notch'}
							loading={isLoading}
							disabled={isLoading}
							color={'blue'}
						/>
					}
					content={content}
					basic={true}
				/>
			</React.Fragment>
		);
	}
}

export default withAlert(LoadingButton);
