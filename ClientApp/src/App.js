import { Switch, Route, Redirect } from "react-router-dom";
import React from "react";
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
import SavedInternshipsContextProvider from "./contexts/SavedInternshipsContext";
import SavedInternshipsFunctional from "./components/savedInternships/SavedInternshipsFunctional";
import NotFound from "./components/NotFound/NotFound";
import { InternshipsContextProvider } from "./contexts/InternshipsContext";

const App = () => {
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
      <SavedInternshipsContextProvider>
        <InternshipsContextProvider>
          <Layout>
            <Switch>
              <Route exact path="/" component={StartPage} />

              <Route exact path="/internships/:query?" component={Internships} />

              <Route exact path="/companies" component={Companies} />

              <Route exact path="/company/:id" render={renderCompany} />

              <Route exact path="/internship/:id" render={renderInternship} />

              <Route exact path="/SignUp" component={SignUp} />

              <Route exact path="/SuccessfulSignUp" component={SuccessfulSignUp} />

              <Route exact path="/Login" component={Login} />

              <Route
                exact
                path="/internshipReviews/:id"
                render={renderInternshipReviews}
              />

              <Route exact path="/MyEditor" component={MyEditor} />

              <Route exact path="/InternshipsList" component={InternshipsList} />

              <Route exact path="/Logout" component={Logout} />

              <CompanyRoute exact path="/companyProfile" component={CompanyProfile} />

              <CompanyRoute
                exact
                path="/companyInternships"
                component={CompanyInternships}
              />

              <CompanyRoute exact path="/createInternship" component={CreateInternship} />

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
              <CompanyRoute
                exact
                path="/studentProfile/:id"
                component={renderStudentProfile}
              />

              <StudentRoute
                exact
                path="/internshipHistory"
                component={InternshipHistory}
              />

              <StudentRoute
                exact
                path="/internshipApplications"
                component={InternshipApplications}
              />

              <StudentRoute exact path="/savedInternships" component={SavedInternships} />

              <StudentRoute
                exact
                path="/savedInternshipsfunctional"
                component={SavedInternshipsFunctional}
              />

              <StudentRoute exact path="/profile" component={Profile} />

              <StudentRoute
                exact
                path="/successfulApplication"
                component={SuccessfulApplication}
              />

              <Route component={NotFound} />
            </Switch>
          </Layout>
        </InternshipsContextProvider>
      </SavedInternshipsContextProvider>
    </ProvideAuthentication>
  );
};

const StudentRoute = ({ component: Component, ...rest }) => {
  const isStudent = useIsStudent();
  return (
    <Route
      {...rest}
      render={(props) =>
        isStudent ? (
          <Component {...rest} {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/Login",
              state: {
                from: props.location,
              },
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
          <Component {...rest} {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/Login",
              state: {
                from: props.location,
              },
            }}
          />
        )
      }
    />
  );
};

export default App;
