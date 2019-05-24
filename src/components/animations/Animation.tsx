import * as React from 'react';

import { Spring, config } from 'react-spring/renderprops';

import Misc from '../../classes/Misc';

interface State {
	constants: {
		marginRight: number;
		marginLeft: number;
	};
}

interface Props {
	direction: 'left' | 'right';
}

class Animation extends React.Component<Props, State> {
	public state = {
		constants: {
			marginLeft: 50,
			marginRight: 50
		}
	};

	public render() {
		const { constants } = this.state;
		const { direction } = this.props;

		return (
			<Spring
				from={{
					[`margin${Misc.capitalize(direction)}`]: -constants[
						`margin${Misc.capitalize(direction)}`
					],
					opacity: 0
				}}
				to={{
					marginRight: 0,
					opacity: 1
				}}
				config={config.wobbly}
			>
				{props => {
					return React.Children.map(
						this.props.children,
						(child: any) => {
							return React.cloneElement(child, {
								style: {
									...child.props.style,
									...props
								}
							});
						}
					);
				}}
			</Spring>
		);
	}
}

export default Animation;
