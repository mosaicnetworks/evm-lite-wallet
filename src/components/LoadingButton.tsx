import * as React from 'react';

import {Button, Icon} from "semantic-ui-react";

import {DefaultProps} from "../redux";

interface LoadingButtonLocalProps extends DefaultProps {
    isLoading: boolean
    onClickHandler: any;
    right: boolean;
}

class LoadingButton extends React.Component<LoadingButtonLocalProps, any> {
    public render() {
        const {isLoading, onClickHandler, right} = this.props;
        return (
            <React.Fragment>
                <Button className={right ? "right" : ""} onClick={onClickHandler} color={isLoading ? "grey" : 'teal'}>
                    <Icon name={"refresh"} bordered={false} disabled={isLoading} loading={isLoading}/>
                    {isLoading ? 'Loading' : 'Refresh'}
                </Button>
            </React.Fragment>
        );
    }
}

export default LoadingButton;