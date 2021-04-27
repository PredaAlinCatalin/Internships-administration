import React from "react";
import Input from "../Universal/Input";
import { Form, Row } from "react-bootstrap";
// import Select from 'react-select';
import API from "../../api";
import BaseSelect from "react-select";
import FixRequiredSelect from "../Universal/FixRequiredSelect";
import "./SignUp.css";
import { withRouter } from "react-router-dom";

const Select = (props) => (
  <FixRequiredSelect {...props} SelectComponent={BaseSelect} options={props.options} />
);

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      roles: [
        {
          label: "Student",
          value: "Student",
        },
        {
          label: "Company",
          value: "Company",
        },
      ],
      role: "",
      error: "",
    };
  }

  handleFormSubmit = async (event) => {
    event.preventDefault();

    const body = {
      email: this.state.email,
      password: this.state.password,
      role: this.state.role.value,
    };

    try {
      // await fetch('api/students/register', {
      //     method: "POST",
      //     headers: {
      //     "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(body)
      // })
      await API.post("/auth/register", body);
      // console.log("DA");
      this.props.history.push("/SuccessfulSignUp");
    } catch (error) {
      const response = error?.response;
      if (response && response.status === 400) {
        const identityErrors = response.data;
        const errorDescriptions = identityErrors.map((error) => error.description);
        this.setState({
          error: errorDescriptions.join(" "),
        });
      } else {
        this.setState({
          error: "Eroare la comunicarea cu serverul",
        });
      }
    }
  };

  renderSignUpData = () => {
    return (
      <>
        <div>
          <h3>Înregistrează-te</h3>
        </div>
        <Form className="container" onSubmit={this.handleFormSubmit}>
          <Row className="justify-content-center">
            <Input
              type={"email"}
              name={"email"}
              label={"Adresa de email"}
              value={this.state.email}
              handleChange={(event) =>
                this.setState({
                  email: event.target.value,
                })
              }
              required={true}
            />
          </Row>

          <Row className="justify-content-center">
            <Input
              type={"password"}
              name={"password"}
              label={"Parola"}
              value={this.state.password}
              handleChange={(event) =>
                this.setState({
                  password: event.target.value,
                })
              }
              required={true}
            />
          </Row>

          <Row className="justify-content-center">
            <Input
              type={"password"}
              name={"confirmPassword"}
              label={"Confirmare parola"}
              value={this.state.confirmPassword}
              handleChange={(event) =>
                this.setState({
                  confirmPassword: event.target.value,
                })
              }
              required={true}
              errors={
                this.state.password !== "" &&
                this.state.confirmPassword !== "" &&
                this.state.password !== this.state.confirmPassword
                  ? "Parolele nu se potrivesc"
                  : ""
              }
            />
          </Row>

          <Row className="justify-content-center">
            <div className="col-md-4">
              Tip de cont:
              <Select
                placeholder="Selecteaza tip de cont"
                value={this.state.role}
                options={this.state.roles}
                onChange={(event) => this.setState({ role: event })}
                isSearchable
                required
              />
            </div>
          </Row>

          <Row className="justify-content-center">
            <div className="col-md-4">
              <button type="submit" className="btn btn-primary mt-2">
                Salveaza
              </button>
            </div>
          </Row>

          <div className="text-danger m-3 justify-content-center">{this.state.error}</div>
        </Form>
      </>
    );
  };

  render() {
    let contents = this.state.loading ? (
      <p>
        <em>Loading...</em>
      </p>
    ) : (
      this.renderSignUpData()
    );

    return <div className="text-center">{contents}</div>;
  }
}

export default withRouter(SignUp);
