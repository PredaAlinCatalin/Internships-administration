import React, { Component } from "react";
import { Container } from "reactstrap";
import NavMenu from "./NavMenu";
import TabMenu from "./TabMenu";
import NewNavMenu from "./NewNavMenu";
import NewNavMenuTest from "./NewNavMenuTest";

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <NewNavMenu />
        {/* <NewNavMenuTest/> */}
        {/* <TabMenu/> */}
        {/* <NavMenu/> */}
        <Container style={{height:870}}>{this.props.children}</Container>
      </div>
    );
  }
}
