import React, { useState, useEffect } from "react";
import "./CompanyProfile.css";
import { withRouter } from "react-router-dom";
import Loading from "../Universal/Loading";
import NameForm from "./Profile/NameForm";
import DescriptionForm from "./Profile/DescriptionForm";
import IndustryForm from "./Profile/IndustryForm";
import AddressForm from "./Profile/AddressForm";
import WebsiteForm from "./Profile/WebsiteForm";
import { Paper } from "@material-ui/core";
import CoverForm from "./Profile/CoverForm";
import { fetchCompanies } from "./companiesSlice";
import { useDispatch, useSelector } from "react-redux";

const CompanyProfile = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.companies.status);
  const error = useSelector((state) => state.companies.error);
  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user !== null && user.role === "Company") {
      setCompanyId(user.id);
      setLoading(false);
    }
  }, []);

  return !loading ? (
    <div>
      <Paper className="m-3 p-3" elevation={3} style={{ width: 900 }}>
        <CoverForm companyId={companyId} />
        <br />
        <br />
        <br />

        <div style={{ paddingLeft: 8 }}>
          <b
            style={{
              color: "#0c56a5",
              fontSize: 18,
            }}
          >
            NUME COMPANIE
          </b>
          <hr
            style={{
              marginTop: -5,
              borderTop: "2px solid gray",
            }}
          />
        </div>

        <NameForm companyId={companyId} />

        <br />

        <div style={{ paddingLeft: 8 }}>
          <b
            style={{
              color: "#0c56a5",
              fontSize: 18,
            }}
          >
            DESCRIERE
          </b>
          <hr
            style={{
              marginTop: -5,
              borderTop: "2px solid gray",
            }}
          />
        </div>

        <DescriptionForm companyId={companyId} />

        <br />

        <div style={{ paddingLeft: 8 }}>
          <b
            style={{
              color: "#0c56a5",
              fontSize: 18,
            }}
          >
            INDUSTRIE
          </b>
          <hr
            style={{
              marginTop: -5,
              borderTop: "2px solid gray",
            }}
          />
        </div>

        <IndustryForm companyId={companyId} />

        <br />

        <div style={{ paddingLeft: 8 }}>
          <b
            style={{
              color: "#0c56a5",
              fontSize: 18,
            }}
          >
            ADRESA
          </b>
          <hr
            style={{
              marginTop: -5,
              borderTop: "2px solid gray",
            }}
          />
        </div>

        <AddressForm companyId={companyId} />

        <br />

        <div style={{ paddingLeft: 8 }}>
          <b
            style={{
              color: "#0c56a5",
              fontSize: 18,
            }}
          >
            WEBSITE
          </b>
          <hr
            style={{
              marginTop: -5,
              borderTop: "2px solid gray",
            }}
          />
        </div>

        <WebsiteForm companyId={companyId} />
        {/* </div> */}
      </Paper>
      <br />
    </div>
  ) : (
    <Loading />
  );
};

export default withRouter(CompanyProfile);
