import * as React from 'react';

import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {Container, Icon, Label} from "semantic-ui-react";

import {Store} from "../redux";

import DataDirectoryButton from "./DataDirectoryButton";

import './styles/Header.css';

interface StoreProps {
    total?: number,
}

interface OwnProps {
    empty?: null;
}

type LocalProps = OwnProps & StoreProps;

class Header extends React.Component<LocalProps, any> {
    public render() {
        const {total} = this.props;

        return (
            <div className="header-main">
                <Container>
                    <div className="logo">
                        <Link to="/"><Icon fitted={false} color="orange" size={"large"} name="google wallet"/></Link>
                    </div>
                    <div className="links">
                        <li>
                            <Link to="/accounts">
                                <Label>{total}</Label>
                                <Icon size={"big"} color={"black"} name="list alternate outline"/>
                            </Link>
                        </li>
                        <li>
                            <Link to="/configuration">
                                <Icon size={"big"} color={"black"} name="cog"/>
                            </Link>
                        </li>
                        <li>
                            <a><DataDirectoryButton color={"teal"}/></a>
                        </li>
                    </div>
                </Container>
            </div>
        );
    }
}

const mapStoreToProps = (store: Store): StoreProps => ({
});

export default connect<StoreProps, {}, OwnProps, Store>(
    mapStoreToProps
)(Header);
