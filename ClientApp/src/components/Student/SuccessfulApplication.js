import React from "react";
import "./SuccessfulApplication.css";
import { withRouter } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";

class SuccessfulApplication extends React.Component {
  render() {
    return (
      <div className="text-center">
        <div style={{ color: "rgb(58, 181, 74)" }}>
          <Icon.CheckCircleFill size={50} />
        </div>
        <br />
        <h3>Ai aplicat cu succes la stagiu</h3>
        <br />
        <div>
          <button
            className="btn btn-primary mt-2"
            onClick={() => this.props.history.push("/")}
          >
            Mergi la stagii
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(SuccessfulApplication);
