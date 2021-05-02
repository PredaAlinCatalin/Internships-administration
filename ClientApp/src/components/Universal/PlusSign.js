import React, { Component } from "react";
import * as Icon from "react-bootstrap-icons";
import "./PlusSign.css";
class PlusSign extends Component {
  onClick = (event) => {
    event.preventDefault();
    this.props.onClick();
  };
  render() {
    return (
      <span className="plus">
        <button className="btn btn-primary btn-circle btn-lg" onClick={this.onClick}>
          <b>+</b>
        </button>
      </span>
    );
  }
}

export default PlusSign;
