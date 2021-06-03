import React, { useState } from "react";
import { Form, Row } from "react-bootstrap";
import { useAuthentication } from "../Authentication/Authentication";
import { useHistory, Link } from "react-router-dom";
import { InputAdornment, Paper, TextField } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import LockIcon from "@material-ui/icons/Lock";
import Button from "@material-ui/core/Button";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const auth = useAuthentication();
  const history = useHistory();

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      await auth.signIn(input.email, input.password);
      sessionStorage.setItem("navnumber", 0);
      console.log(sessionStorage.getItem("user"));
      let user = JSON.parse(sessionStorage.getItem("user"));
      console.log(user);
      if (user !== null && user.role === "Company") {
        history.push("/companyprofile");
      } else if (user != null && user.role === "Student") {
        history.push("/internships");
      } else if (user != null && user.role === "Admin") {
        history.push("/");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ height: 850 }}
    >
      <Paper style={{ width: 450, height: 500 }}>
        <div className="p-3 text-center">
          <div className="m-4">
            <h4>Loghează-te</h4>
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
                {/* <div className="col-md-3"> */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ textTransform: "none" }}
                >
                  Salvează
                </Button>
                {/* </div> */}
              </Row>

              <div className="text-danger m-3 justify-content-center">{error}</div>
            </Form>
          </div>
          <Link to="/signup">Creează cont</Link>
        </div>
      </Paper>
    </div>
  );
};

export default Login;
