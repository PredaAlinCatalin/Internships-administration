import React, { useState } from "react";
import Input from "../Universal/Input";
import { Form, Row } from "react-bootstrap";
// import Select from 'react-select';
import BaseSelect from "react-select";
import FixRequiredSelect from "../Universal/FixRequiredSelect";
import "./SignUp.css";
import { withRouter, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Paper, TextField, InputAdornment, Button } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import LockIcon from "@material-ui/icons/Lock";

const Select = (props) => (
  <FixRequiredSelect {...props} SelectComponent={BaseSelect} options={props.options} />
);

const SignUp = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const roles = [
    {
      label: "Student",
      value: "Student",
    },
    {
      label: "Company",
      value: "Company",
    },
  ];

  const [error, setError] = useState("");
  const history = useHistory();

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const body = {
      email: input.email,
      password: input.password,
      role: input.role.value,
    };

    try {
      await fetch("api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      history.push("/SuccessfulSignUp");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ height: 850 }}
    >
      <Paper style={{ width: 450, height: 600 }}>
        <div className="p-3 text-center">
          <div className="m-4">
            <h4>Înregistrează-te</h4>
          </div>
          <div
            className="container d-flex align-items-center justify-content-center"
            style={{ width: 350 }}
          >
            <Form className="container" onSubmit={handleFormSubmit}>
              <Row className="justify-content-center">
                <TextField
                  fullWidth={true}
                  label="Adresă de mail"
                  type="email"
                  value={input.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => setInput({ ...input, email: e.target.value })}
                />
              </Row>
              <br />
              <Row className="justify-content-center">
                <TextField
                  fullWidth={true}
                  label="Parolă"
                  type="password"
                  value={input.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => setInput({ ...input, password: e.target.value })}
                />
              </Row>
              <br />
              <Row className="justify-content-center">
                <TextField
                  fullWidth={true}
                  label="Parolă"
                  type="password"
                  value={input.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) =>
                    setInput({ ...input, confirmPassword: e.target.value })
                  }
                  required={true}
                  errors={
                    input.password !== "" &&
                    input.confirmPassword !== "" &&
                    input.password !== input.confirmPassword
                      ? "Parolele nu se potrivesc"
                      : ""
                  }
                />
              </Row>
              <Row className="justify-content-center">
                <div style={{ width: "100%" }}>
                  Tip de cont:
                  <Select
                    placeholder="Selecteaza tip de cont"
                    value={input.role}
                    options={roles}
                    onChange={(event) => setInput({ ...input, role: event })}
                    isSearchable
                    required
                  />
                </div>
              </Row>
              <div style={{ height: 100 }}></div>

              <Row className="justify-content-center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ textTransform: "none" }}
                >
                  Salvează
                </Button>
              </Row>

              <div className="text-danger m-3 justify-content-center">{error}</div>
            </Form>
          </div>
          <Link to="/login">Ai cont? Loghează-te</Link>
        </div>
      </Paper>
    </div>
  );
};

export default withRouter(SignUp);
