import * as React from 'react';

import {InjectedAlertProp, withAlert} from 'react-alert';
import {Button, Icon} from "semantic-ui-react";


interface AlertProps {
    alert: InjectedAlertProp;
}

interface OwnProps {
    isLoading: boolean
    right: boolean;
    onClickHandler: any;
}

type LocalProps = OwnProps & AlertProps;

class LoadingButton extends React.Component<LocalProps, any> {
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