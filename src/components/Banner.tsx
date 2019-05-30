import * as React from 'react';

import styled from 'styled-components';

const colors = {
	purple: 'rgba(126, 66, 149, 0.9)',
	orange: '#f2711c',
	black: '#222',
	blue: 'rgba(24, 64, 150, 0.9)'
};

interface Props {
	color: 'purple' | 'orange' | 'black' | 'blue';
	style?: any;
}

class Banner extends React.Component<Props, any> {
	public render() {
		const { color } = this.props;

		const Banner = styled.div`
			background: ${colors[color]} !important;
			color: #fff !important;
			padding: 20px;
			box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3) !important;
			position: relative;
			-webkit-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3),
				0 0 40px rgba(0, 0, 0, 0.1) inset;
			-moz-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3),
				0 0 40px rgba(0, 0, 0, 0.1) inset;
			box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3),
				0 0 40px rgba(0, 0, 0, 0.1) inset;
		`;

		return <Banner style={this.props.style}>{this.props.children}</Banner>;
	}
}

export default Banner;
