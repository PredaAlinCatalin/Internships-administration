import React, { useContext, useEffect, useState } from "react";
import { InternshipsContext } from "../../contexts/InternshipsContext";
import { SavedInternshipsContext } from "../../contexts/SavedInternshipsContext";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSavedInternships,
  selectAllSavedInternships,
} from "./savedInternshipsSlice";
import Loading from "../Universal/Loading";
import InternshipCard from "../Internships/InternshipCard";
import { v4 as uuidv4 } from "uuid";
import TabMenu from "../Universal/TabMenu";

const SavedInternshipsFunctional = () => {
  const dispatch = useDispatch();
  const savedInternships = useSelector(selectAllSavedInternships);
  const status = useSelector((state) => state.savedInternships.status);
  const error = useSelector((state) => state.savedInternships.error);
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    let user = JSON.parse(sessionStorage.getItem("user"));

    async function populateWithData() {
      const internshipsResponse = await fetch("api/internships");
      var internshipsData = [];
      if (internshipsResponse.ok) internshipsData = await internshipsResponse.json();

      setInternships(internshipsData);
    }

    populateWithData();

    if (status === "idle") {
      dispatch(fetchSavedInternships(user.id));
    }
  }, [status, dispatch]);

  return (
    <>
      <TabMenu />
      <div className="text-center">
        <h5>Stagiile tale salvate</h5>
      </div>
      <br />
      {status === "loading" && <Loading />}
      {status === "succeeded" && (
        <div className="container">
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4">
            {savedInternships.map((savedInternship) => (
              <div key={uuidv4()} className="mb-3 col">
                <div className="card">
                  <InternshipCard
                    internshipId={savedInternship.internshipId}
                    companyId={
                      internships.find((c) => c.id === savedInternship.internshipId)
                        ?.companyId
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {status === "error" && <div>{error}</div>}
    </>
  );
};

export default SavedInternshipsFunctional;
