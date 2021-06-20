import { Switch, Route, Redirect } from "react-router-dom";
import React from "react";
import { Layout } from "./components/Layout";
import Profile from "./components/Student/Profile";
import Internships from "./components/Anonymous/Internships";
import Companies from "./components/Anonymous/Companies";
import Company from "./components/Anonymous/Company";
import Internship from "./components/Anonymous/Internship";
import InternshipHistory from "./components/Student/InternshipHistory";
import InternshipApplications from "./components/Student/InternshipApplications";
import CompanyProfile from "./components/Company-account/CompanyProfile";
import CompanyInternships from "./components/Company-account/CompanyInternships";
import CreateInternship from "./components/Company-account/CreateInternship";
import ModifyInternship from "./components/Company-account/ModifyInternship";
import ManageInternshipApplications from "./components/Company-account/ManageInternshipApplications";
import StudentProfile from "./components/Company-account/StudentProfile";
import SignUp from "./components/Authentication/SignUp";
import SuccessfulSignUp from "./components/Authentication/SuccessfulSignUp";
import Login from "./components/Authentication/Login";
import Logout from "./components/Authentication/Logout";
import InternshipReviews from "./components/Anonymous/InternshipReviews";
import "./custom.css";
import {
  ProvideAuthentication,
  useIsStudent,
  useIsCompany,
  useIsAdmin,
} from "./components/Authentication/Authentication";
import SuccessfulApplication from "./components/Student/SuccessfulApplication";
import SavedInternships from "./components/Student/SavedInternships";
import StartPage from "./components/Anonymous/StartPage";
import NotFound from "./components/Universal/NotFound";
import ApproveInternships from "./components/Admin/ApproveInternships";

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
    let queryCopy = routerProps.match.params;
    console.log(queryCopy);
    return (
      <ManageInternshipApplications
        internshipId={internshipIdCopy}
        query={queryCopy !== undefined ? queryCopy : ""}
      />
    );
  };

  const renderStudentProfile = (routerProps) => {
    let studentIdCopy = routerProps.match.params.id;

    return <StudentProfile studentId={studentIdCopy} />;
  };

  const renderInternshipReviews = (routerProps) => {
    let internshipIdCopy = parseInt(routerProps.match.params.id);
    return <InternshipReviews internshipId={internshipIdCopy} />;
  };

  const renderCompanyInternships = (routerProps) => {
    let internshipStatus = routerProps.match.params.internshipStatus;
    return <CompanyInternships internshipStatus={internshipStatus} />;
  };

  // const renderCompanyProfile = (routerProps) => {
  //   let companyId = parseInt(routerProps.match.params.companyId);
  //   return <CompanyProfile companyId={companyId} />;
  // };

  return (
    <ProvideAuthentication>
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

          <Route exact path="/internshipReviews/:id" render={renderInternshipReviews} />

          <Route exact path="/Logout" component={Logout} />

          <CompanyRoute exact path="/companyProfile" component={CompanyProfile} />

          <CompanyRoute
            exact
            path="/companyInternships/:internshipStatus"
            component={renderCompanyInternships}
          />

          <CompanyRoute exact path="/createInternship" component={CreateInternship} />

          <CompanyRoute
            exact
            path="/modifyInternship/:id"
            component={renderModifyInternship}
          />
          <CompanyRoute
            exact
            path="/manageInternshipApplications/:id/:query?"
            component={renderManageInternshipApplications}
          />
          <CompanyRoute
            exact
            path="/studentProfile/:id"
            component={renderStudentProfile}
          />

          <StudentRoute exact path="/internshipHistory" component={InternshipHistory} />

          <StudentRoute
            exact
            path="/internshipApplications"
            component={InternshipApplications}
          />

          <StudentRoute
            exact
            path="/savedInternships"
            component={SavedInternships}
          />

          <StudentRoute exact path="/profile" component={Profile} />

          <StudentRoute
            exact
            path="/successfulApplication"
            component={SuccessfulApplication}
          />

          <AdminRoute exact path="/approveInternships" component={ApproveInternships} />

          <Route component={NotFound} />
        </Switch>
      </Layout>
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

const AdminRoute = ({ component: Component, ...rest }) => {
  const isAdmin = useIsAdmin();
  return (
    <Route
      {...rest}
      render={(props) =>
        isAdmin ? (
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
