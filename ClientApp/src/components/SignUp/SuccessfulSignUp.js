import React from "react";
import "./SuccessfulSignUp.css";
import { withRouter } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";

class SuccessfulSignUp extends React.Component {
  render() {
    return (
      <div className="text-center">
        <div style={{ color: "rgb(58, 181, 74)" }}>
          <Icon.CheckCircleFill size={50} />
        </div>
        <br />
        <h3>Înregistrarea a reușit</h3>
        <br />
        <div>
          <button
            className="btn btn-primary mt-2"
            onClick={() => this.props.history.push("/Login")}
          >
            Login
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(SuccessfulSignUp);
