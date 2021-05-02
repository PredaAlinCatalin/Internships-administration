import { Switch, Route, Redirect, BrowserRouter as Router } from "react-router-dom";
import React, { Component } from "react";
//import { Route } from 'react-router';
import { Layout } from "./components/Layout";
import Profile from "./components/Student/Profile";
import Internships from "./components/Internships/Internships";
import Companies from "./components/Internships/Companies";
import Company from "./components/Internships/Company";
import Internship from "./components/Internships/Internship";
import InternshipHistory from "./components/Student/InternshipHistory";
import InternshipApplications from "./components/Student/InternshipApplications";
import CompanyProfile from "./components/Company-account/CompanyProfile";
import CompanyInternships from "./components/Company-account/CompanyInternships";
import CreateInternship from "./components/Company-account/CreateInternship";
import ModifyInternship from "./components/Company-account/ModifyInternship";
import ManageInternshipApplications from "./components/Company-account/ManageInternshipApplications";
import StudentProfile from "./components/Company-account/StudentProfile";
import SignUp from "./components/SignUp/SignUp";
import SuccessfulSignUp from "./components/SignUp/SuccessfulSignUp";
import Login from "./components/Login/Login";
import Logout from "./components/Login/Logout";
import InternshipReviews from "./components/Internships/InternshipReviews";
import "./custom.css";
import {
  ProvideAuthentication,
  useIsStudent,
  useIsCompany,
} from "./components/Authentication/Authentication";
import SuccessfulApplication from "./components/Student/SuccessfulApplication";
import MyEditor from "./components/Universal/MyEditor";
import InternshipsList from "./components/Internships/InternshipsList";
import SavedInternships from "./components/Student/SavedInternships";
import StartPage from "./components/Start/StartPage";
import InternshipsQueried from "./components/Internships/InternshipsQueried";

const App = () => {
  const displayName = App.name;

  const renderCompany = (routerProps) => {
    let companyIdCopy = routerProps.match.params.id;
    return <Company companyId={companyIdCopy} />;
  };

  const renderInternship = (routerProps) => {
    let internshipIdCopy = parseInt(routerProps.match.params.id);
    return <Internship internshipId={internshipIdCopy} />;
  };

  const renderModifyInternship = (routerProps) => {
    let internshipIdCopy = parseInt(routerProps.match.params.id);

    return <ModifyInternship internshipId={internshipIdCopy} />;
  };

  const renderManageInternshipApplications = (routerProps) => {
    let internshipIdCopy = parseInt(routerProps.match.params.id);

    return <ManageInternshipApplications internshipId={internshipIdCopy} />;
  };

  const renderStudentProfile = (routerProps) => {
    let studentIdCopy = routerProps.match.params.id;

    return <StudentProfile studentId={studentIdCopy} />;
  };

  const renderInternshipReviews = (routerProps) => {
    let internshipIdCopy = parseInt(routerProps.match.params.id);
    return <InternshipReviews internshipId={internshipIdCopy} />;
  };

  return (
    <ProvideAuthentication>
      <Layout>
        <Route exact path="/">
          <StartPage />
        </Route>

        {/* <Route exact path="/internships/query">
            <InternshipsQueried />
          </Route> */}

        <Route exact path="/internships/:query?">
          <Internships />
        </Route>

        <Route exact path="/companies">
          <Companies />
        </Route>

        <Route exact path="/company/:id" render={renderCompany} />
        <Route exact path="/internship/:id" render={renderInternship} />

        <CompanyRoute exact path="/companyProfile">
          <CompanyProfile />
        </CompanyRoute>

        <CompanyRoute exact path="/companyInternships">
          <CompanyInternships />
        </CompanyRoute>

        <CompanyRoute exact path="/createInternship">
          <CreateInternship />
        </CompanyRoute>

        <CompanyRoute
          exact
          path="/modifyInternship/:id"
          component={renderModifyInternship}
        />
        <CompanyRoute
          exact
          path="/manageInternshipApplications/:id"
          component={renderManageInternshipApplications}
        />
        <CompanyRoute exact path="/studentProfile/:id" component={renderStudentProfile} />

        <CompanyRoute exact path="/Logout">
          <Logout />
        </CompanyRoute>

        <StudentRoute exact path="/internshipHistory">
          <InternshipHistory />
        </StudentRoute>

        <StudentRoute exact path="/internshipApplications">
          <InternshipApplications />
        </StudentRoute>

        <StudentRoute exact path="/savedInternships">
          <SavedInternships />
        </StudentRoute>

        <StudentRoute exact path="/profile">
          <Profile />
        </StudentRoute>

        <StudentRoute exact path="/successfulApplication">
          <SuccessfulApplication />
        </StudentRoute>

        <Route exact path="/SignUp">
          <SignUp />
        </Route>

        <Route exact path="/SuccessfulSignUp">
          <SuccessfulSignUp />
        </Route>

        <Route exact path="/Login">
          <Login />
        </Route>

        <Route exact path="/internshipReviews/:id" render={renderInternshipReviews} />

        <Route exact path="/MyEditor">
          <MyEditor />
        </Route>

        <Route exact path="/InternshipsList">
          <InternshipsList />
        </Route>
      </Layout>
    </ProvideAuthentication>
  );
};

const StudentRoute = ({ children, ...rest }) => {
  const isStudent = useIsStudent();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isStudent ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/Login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

const CompanyRoute = ({ component: Component, ...rest }) => {
  const isCompany = useIsCompany();
  return (
    <Route
      {...rest}
      render={(props) =>
        isCompany ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/Login",
            }}
          />
        )
      }
    />
  );
};

export default App;
