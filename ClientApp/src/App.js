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

export default class App extends Component {
  static displayName = App.name;

  renderCompany = (routerProps) => {
    let companyIdCopy = routerProps.match.params.id;
    return <Company companyId={companyIdCopy} />;
  };

  renderInternship = (routerProps) => {
    let internshipIdCopy = parseInt(routerProps.match.params.id);
    return <Internship internshipId={internshipIdCopy} />;
  };

  renderModifyInternship = (routerProps) => {
    let internshipIdCopy = parseInt(routerProps.match.params.id);

    return <ModifyInternship internshipId={internshipIdCopy} />;
  };

  renderManageInternshipApplications = (routerProps) => {
    let internshipIdCopy = parseInt(routerProps.match.params.id);

    return <ManageInternshipApplications internshipId={internshipIdCopy} />;
  };

  renderStudentProfile = (routerProps) => {
    let studentIdCopy = routerProps.match.params.id;

    return <StudentProfile studentId={studentIdCopy} />;
  };

  renderInternshipReviews = (routerProps) => {
    let internshipIdCopy = parseInt(routerProps.match.params.id);
    return <InternshipReviews internshipId={internshipIdCopy} />;
  };

  render() {
    return (
      <ProvideAuthentication>
        <Router>
          <Layout>
            <Route exact path="/">
              <Internships />
            </Route>

            <Route exact path="/companies">
              <Companies />
            </Route>

            <Route exact path="/company/:id" render={this.renderCompany} />
            <Route exact path="/internship/:id" render={this.renderInternship} />

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
              component={this.renderModifyInternship}
            />
            <CompanyRoute
              exact
              path="/manageInternshipApplications/:id"
              component={this.renderManageInternshipApplications}
            />
            <CompanyRoute
              exact
              path="/studentProfile/:id"
              component={this.renderStudentProfile}
            />

            <CompanyRoute exact path="/Logout">
              <Logout />
            </CompanyRoute>

            <StudentRoute exact path="/internshipHistory">
              <InternshipHistory />
            </StudentRoute>

            <StudentRoute exact path="/internshipApplications">
              <InternshipApplications />
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

            <Route
              exact
              path="/internshipReviews/:id"
              render={this.renderInternshipReviews}
            />

            <Route exact path="/MyEditor">
              <MyEditor/>
            </Route>
          </Layout>
        </Router>
      </ProvideAuthentication>
    );
  }
}

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
