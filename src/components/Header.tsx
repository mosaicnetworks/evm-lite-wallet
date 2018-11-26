import * as React from 'react';

import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {Container, Icon} from "semantic-ui-react";

import {DefaultProps, Store} from "../redux";

import './styles/Header.css';


export interface HeaderLocalProps extends DefaultProps {
    test?: any,
}

class Header extends React.Component<HeaderLocalProps, any> {
    public render() {
        return (
            <div className="header-main">
                <Container>
                    <div className="logo">
                        <Link to="/"><Icon fitted={false} color="orange" size={"large"} name="google wallet"/></Link>
                    </div>
                    <div className="links">
                        <li>
                            <Link to="/accounts">
                                <Icon size={"big"} color={"black"} name="list alternate outline"/>
                            </Link>
                            <Link to="/configuration">
                                <Icon size={"big"} color={"black"} name="cog"/>
                            </Link>
                        </li>
                    </div>
                </Container>
            </div>
        );
    }
}

const mapStoreToProps = (store: Store) => ({});

export default connect(mapStoreToProps)(Header);
