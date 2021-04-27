import React, { useState } from "react";
import Input from "../Universal/Input";
import { Form, Row } from "react-bootstrap";
import { useAuthentication } from "../Authentication/Authentication";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [input, changeInput] = useState({
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
      history.push("/");
    } catch (error) {
      const response = error?.response;
      if (response && response.status === 400) {
        const identityErrors = response.data;
        const errorDescriptions = identityErrors.map((error) => error.description);
        setError(errorDescriptions.join(" "));
      } else {
        setError("Eroare la comunicarea cu serverul");
      }
    }
  };

  return (
    <div className="text-center">
      <div>
        <h3>Loghează-te</h3>
      </div>
      <Form className="container" onSubmit={handleFormSubmit}>
        <Row className="justify-content-center">
          <Input
            type={"email"}
            name={"email"}
            label={"Adresa de email"}
            value={input.email}
            handleChange={(event) =>
              changeInput({
                ...input,
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
            value={input.password}
            handleChange={(event) =>
              changeInput({
                ...input,
                password: event.target.value,
              })
            }
            required={true}
          />
        </Row>

        <Row className="justify-content-center">
          <div className="col-md-3">
            <button type="submit" className="btn btn-primary mt-2">
              Salveaza
            </button>
          </div>
        </Row>

        <div className="text-danger m-3 justify-content-center">{error}</div>
      </Form>
    </div>
  );
};

export default Login;
