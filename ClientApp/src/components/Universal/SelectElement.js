import React, { Component } from "react";
import * as Icon from 'react-bootstrap-icons';
import './SelectElement.css';
class SelectElement extends Component {
  onDelete = (event) => {
    event.preventDefault();
    this.props.onDelete(this.props.id);
  };
  render() {
    return (
      <span className="elem">
        <button className="btn btn-danger mt-2" onClick={this.onDelete}><b><Icon.XCircle color="white" size={20} /></b>{" "} {this.props.name}</button>
      </span>
    );
  }
}

export default SelectElement;
