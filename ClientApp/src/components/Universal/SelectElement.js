import React, { Component } from "react";
import "./SelectElement.css";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";

class SelectElement extends Component {
  onDelete = (event) => {
    event.preventDefault();
    this.props.onDelete(this.props.id);
  };
  render() {
    return (
      <span className="elem">
        <Button
          variant="contained"
          color="secondary"
          onClick={this.onDelete}
          startIcon={<DeleteIcon />}
        >
          {this.props.name}
        </Button>
      </span>
    );
  }
}

export default SelectElement;
