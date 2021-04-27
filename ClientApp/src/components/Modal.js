import React from "react";
import ReactDom from "react-dom";
import "./Modal.css";

const Modal = ({ open, children, onClose }) => {
  if (!open) return null;
  return ReactDom.createPortal(
    <>
      <div onClick={onClose} id="overlay" />
      <div id="modal">
        {children}
        <button className="btn btn-primary mt-2" onClick={onClose}>
          Close
        </button>
      </div>
    </>,
    document.getElementById("portal")
  );
};

export default Modal;
