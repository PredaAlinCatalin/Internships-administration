import React from "react";
import { Form } from "react-bootstrap";

const Input = ({
  label,
  type,
  name,
  placeholder = label,
  value,
  required = false,
  errors = "",
  handleChange,
}) => {
  return (
    <Form.Group className={"col-md-4"}>
      <Form.Label>{label}:</Form.Label>
      <Form.Control
        className={"form-control"}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
      />
      <div className={"text-danger"}>{errors}</div>
    </Form.Group>
  );
};

export default Input;
