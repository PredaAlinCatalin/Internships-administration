import React, { Component } from "react";

class Category extends Component {
  onDelete = (event) => {
    event.preventDefault();
    this.props.onDelete(this.props.id);
  };
  render() {
    return (
      <span>
        {this.props.name}
        {` `}
        <button onClick={this.onDelete}>X</button>
        &nbsp; &nbsp;
      </span>
    );
  }
}

export default Category;
