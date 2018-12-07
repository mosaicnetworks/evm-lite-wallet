import * as React from 'react';

import {withAlert} from 'react-alert';
import {Button, Icon} from "semantic-ui-react";

import {DefaultProps} from "../redux";

interface LoadingButtonLocalProps extends DefaultProps {
    right: boolean;
    onClickHandler: any;
    isLoading: boolean
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

export default withAlert(LoadingButton);