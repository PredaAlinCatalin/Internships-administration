import React, { Component } from "react";
import { Container } from "reactstrap";
import NewNavMenu from "./NewNavMenu";

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <NewNavMenu />
        {/* <NewNavMenuTest/> */}
        {/* <TabMenu/> */}
        {/* <NavMenu/> */}
        <Container style={{ height: 870 }}>{this.props.children}</Container>
      </div>
    );
  }
}
