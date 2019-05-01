import * as React from 'react';

import './styles/StatusBar.css';

interface OwnProps {
	empty?: null;
}

type LocalProps = OwnProps;

class StatusBar extends React.Component<LocalProps, any> {
	public state = {};

	public render() {
		return (
			<React.Fragment>
				<br />
				<br />
				<br />
				<div className="status-bar">{this.props.children}</div>
			</React.Fragment>
		);
	}
}

export default StatusBar;
