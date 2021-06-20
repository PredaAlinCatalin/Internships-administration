import React from "react";
import Loading from "../Universal/Loading";
import {useIsCompany, useIsStudent, useIsAdmin} from '../Authentication/Authentication';
import Internships from "./Internships";
import CompanyProfile from "../Company-account/CompanyProfile";
import ApproveInternships from "../Admin/ApproveInternships";
import {Redirect} from 'react-router-dom';

const StartPage = () => {
  const isStudent = useIsStudent();
  const isCompany = useIsCompany();
  const isAdmin = useIsAdmin();

  let component = isStudent ? 
                    <Redirect to="/internships"/>
                    :
                    isCompany ? 
                      <Redirect to="/companyProfile"/>
                      :
                      isAdmin ?
                        <Redirect to="/approveInternships"/>
                        :
                        <Redirect to="/internships"/>

  return (
    <>
    {component}
    </>
  );
};

export default StartPage;
