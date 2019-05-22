import * as React from 'react';

import { Spring, config } from 'react-spring/renderprops';

class AnimationRight extends React.Component<any, any> {
	public render() {
		return (
			<Spring
				from={{
					marginRight: -50,
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

export default AnimationRight;
