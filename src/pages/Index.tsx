import * as React from 'react';

interface StoreProps {
	currentDataDirectory: string | null;
}

type LocalProps = StoreProps;

class Index extends React.Component<LocalProps, any> {
	public render() {
		return (
			<React.Fragment>
				<div>index</div>
			</React.Fragment>
		);
	}
}

export default Index;
