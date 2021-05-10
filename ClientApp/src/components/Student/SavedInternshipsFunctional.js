import React, { useContext } from "react";
import { SavedInternshipsContext } from "../../contexts/SavedInternshipsContext";
import { withRouter } from "react-router-dom";

const SavedInternshipsFunctional = () => {
  const { savedInternships } = useContext(SavedInternshipsContext);

  return savedInternships.length ? (
    <div>
      <ul>{savedInternships.length}</ul>
    </div>
  ) : (
    <div>Nu sunt stagii salvate</div>
  );
};

export default SavedInternshipsFunctional;
