import * as React from 'react';

import styled from 'styled-components';

const Content = styled.div`
	border-top: 1px solid #eee !important;
	background: #fcfcfc !important;
	width: 100% !important;
	position: fixed;
	bottom: 0 !important;
	padding: 10px 20px;
	text-align: right !important;
	z-index: 100000 !important;
`;

interface OwnProps {
	empty?: null;
}

type LocalProps = OwnProps;

class StatusBar extends React.Component<LocalProps, any> {
	public state = {};

	public render() {
		return (
			<React.Fragment>
				<Content>{this.props.children}</Content>
			</React.Fragment>
		);
	}
}

export default StatusBar;
