import React, { Component } from "react";
import "./CircleButton.css";
class PlusSign extends Component {
  onClick = (event) => {
    event.preventDefault();
    this.props.onClick();
  };
  render() {
    return (
      <span className="plus">
        <button className="btn btn-primary btn-circle btn-lg" onClick={this.onClick}>
          {children}
        </button>
      </span>
    );
  }
}

export default PlusSign;
