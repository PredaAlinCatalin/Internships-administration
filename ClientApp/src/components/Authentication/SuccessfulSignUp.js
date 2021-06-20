import React from "react";
import "./SuccessfulSignUp.css";
import { withRouter } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";
import Button from "@material-ui/core/Button";

class SuccessfulSignUp extends React.Component {
  render() {
    return (
      <div className="text-center">
        <br />
        <div style={{ color: "rgb(58, 181, 74)" }}>
          <Icon.CheckCircleFill size={50} />
        </div>
        <br />
        <h3>Înregistrarea a reușit</h3>
        <br />
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.props.history.push("/Login")}
          >
            Login
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(SuccessfulSignUp);
