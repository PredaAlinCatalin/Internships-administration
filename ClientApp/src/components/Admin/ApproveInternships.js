import React, { useState, useEffect } from "react";
import Loading from "../Universal/Loading";
import { useDispatch, useSelector } from "react-redux";
import CompanyCard from './CompanyCard';

export default function ApproveInternships() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.internships.status);


  useEffect(() => {
    async function populateApproveInternshipsData() {
      let user = JSON.parse(sessionStorage.getItem("user"));

      let companiesData = "";
      const companiesResponse = await fetch("api/companies");
      if (companiesResponse.ok) companiesData = await companiesResponse.json();

      setCompanies(companiesData);
      setLoading(false);
    }

    populateApproveInternshipsData();
  }, [status, dispatch]);

  return !loading ? (
    <>
      {companies !== []
        ? companies.map((company) => (
            <div key={company.id} className="m-3">
              <CompanyCard companyId={company.id}/>
              
            </div>
          ))
        : ""}
    </>
  ) : (
    <Loading />
  );
}
