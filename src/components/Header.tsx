import * as React from 'react';

import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {Container, Icon, Label} from "semantic-ui-react";

import {DefaultProps, Store} from "../redux";

import DataDirectoryButton from "./DataDirectoryButton";

import './styles/Header.css';

export interface HeaderLocalProps extends DefaultProps {
    total: number,
}

class Header extends React.Component<HeaderLocalProps, any> {
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

const mapStoreToProps = (store: Store) => ({
    total: (store.keystore.fetch.response ? store.keystore.fetch.response.length : 0),
});

export default connect(mapStoreToProps)(Header);
