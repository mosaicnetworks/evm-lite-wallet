import * as React from 'react';

import Animation from './animations/Animation';

interface Props {
	bottomOffset: number;
}

class FloatingButtonGroup extends React.Component<Props, any> {
	public render() {
		const offset = 100 - 57;

		return (
			<Animation direction="right">
				{React.Children.map(
					this.props.children,
					(child: any, i: number) =>
						React.cloneElement(child, {
							bottomOffset: 57 + i * offset
						})
				)}
			</Animation>
		);
	}
}

export default FloatingButtonGroup;
