import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSavedInternships,
  selectAllSavedInternships,
} from "./savedInternshipsSlice";
import Loading from "../Universal/Loading";
import InternshipCard from "../Anonymous/InternshipCard";
import { v4 as uuidv4 } from "uuid";
import TabMenu from "../Universal/TabMenu";
const SavedInternships = () => {
  const dispatch = useDispatch();
  const savedInternships = useSelector(selectAllSavedInternships);
  const status = useSelector((state) => state.savedInternships.status);
  const error = useSelector((state) => state.savedInternships.error);

  useEffect(() => {
    let user = JSON.parse(sessionStorage.getItem("user"));

    if (status === "idle") {
      dispatch(fetchSavedInternships(user.id));
    }

    if (status === "succeeded") {
      console.log(savedInternships);
    }
    console.log(savedInternships);
  }, [status, dispatch]);

  return (
    <>
      <TabMenu />

      <br />
      {status === "loading" && <Loading />}
      {status === "succeeded" && (
        <>
          {savedInternships.length > 0 ? (
            <div className="container">
              <div className="row text-center ml-1">
                <h5>Stagii salvate</h5>
              </div>
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
          ) : (
            <div className="text-center text-muted">Nu ai salvat niciun stagiu</div>
          )}
        </>
      )}
      {status === "error" && <div>{error}</div>}
    </>
  );
};

export default SavedInternships;
