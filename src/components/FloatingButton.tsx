import * as React from 'react';

import styled from 'styled-components';
import AnimationRight from './AnimationRight';

interface Props {
	bottomOffset: number;
}

class FloatingButton extends React.Component<Props, any> {
	public render() {
		const { bottomOffset } = this.props;
		const Button = styled.div`
			position: fixed;
			bottom: ${bottomOffset}px;
			right: 0;
			width: auto;
			color: white !important;
			border-top-left-radius: 7px;
			border-bottom-left-radius: 7px;

			&:hover {
				cursor: pointer;
			}

			& button {
				border-top-right-radius: 0px !important;
				border-bottom-right-radius: 0px !important;
				margin: 0 !important;
				margin-left: -2px !important;
			}
		`;

		return (
			<AnimationRight>
				<Button>{this.props.children}</Button>
			</AnimationRight>
		);
	}
}

export default FloatingButton;
