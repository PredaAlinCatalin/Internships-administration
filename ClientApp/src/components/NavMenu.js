import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Collapse,
  Container,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";
import "./NavMenu.css";
import { useIsCompany, useIsStudent } from "./Authentication/Authentication";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { lightBlue } from "@material-ui/core/colors";
import { Block } from "@material-ui/icons";
import { useAuthentication } from "./Authentication/Authentication";

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: lightBlue[500],
    width: 15,
    height: 15,
    // display: "inline-block"
  },
}));

const NavMenu = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  const isCompany = useIsCompany();
  const isStudent = useIsStudent();
  const [student, setStudent] = useState(null);
  const auth = useAuthentication();
  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    // console.log(sessionStorage.getItem("user"));
    // console.log(isStudent);
    // async function PopulateWithData() {
    //   const userData = JSON.parse(sessionStorage.getItem("user"));
    //   if (userData !== null) {
    //     let studentData = "";
    //     const response = await fetch("api/students/" + userData.id);
    //     if (response.ok) {
    //       console.log(studentData);
    //       studentData = await response.json();
    //       setStudent(studentData);
    //     }
    //   }
    //   setLoading(false);
    // }
    // PopulateWithData();
    setLoading(false);
  }, []);

  return !loading ? (
    <header>
      <Navbar
        className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3"
        light
      >
        <Container>
          <NavbarBrand tag={Link} to="/">
            HaiLaStagii
          </NavbarBrand>
          <NavbarToggler onClick={toggleNavbar} className="mr-2" />
          <Collapse
            className="d-sm-inline-flex flex-sm-row-reverse"
            isOpen={!collapsed}
            navbar
          >
            <ul className="navbar-nav flex-grow">
              {!isCompany && (
                <>
                  <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/internships">
                      Stagii
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/companies">
                      Companii
                    </NavLink>
                  </NavItem>
                </>
              )}

              {!isStudent && !isCompany && (
                <>
                  <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/Signup">
                      Înregistrează-te
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/Login">
                      Loghează-te
                    </NavLink>
                  </NavItem>
                </>
              )}

              {isStudent && (
                <>
                  <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/profile">
                      Profil
                    </NavLink>
                  </NavItem>
                  {/* <NavItem tag={Link} className="text-dark" to="/profile">
                    <NavLink>
                      <IconButton
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        color="inherit"
                      >
                        <Avatar
                          aria-label="recipe"
                          className={classes.avatar}
                          alt="logo"
                          src={"/photos/" + student.photoPath}
                          variant="rounded"
                        ></Avatar>
                        <br />
                        Profil
                      </IconButton>
                    </NavLink>
                  </NavItem> */}
                  <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/internshipHistory">
                      Istoric stagii
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      tag={Link}
                      className="text-dark"
                      to="/internshipApplications"
                    >
                      Aplicări la stagii
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/savedInternships">
                      Stagii salvate
                    </NavLink>
                  </NavItem>
                </>
              )}

              {isCompany && (
                <>
                  <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/companyProfile">
                      Profil
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/companyInternships">
                      Stagii
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/createInternship">
                      Creează stagiu
                    </NavLink>
                  </NavItem>
                </>
              )}

              {(isStudent || isCompany) && (
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/Logout">
                    Logout
                  </NavLink>
                </NavItem>
              )}

              {/*<NavItem>
                  <NavLink tag={Link} className="text-dark" to="/companies">Companies</NavLink>
              </NavItem>
              {this.state.isAuthenticated &&
                  <>
                      <NavItem>
                          <NavLink tag={Link} className="text-dark" to="/internshipHistory">Internship History</NavLink>
                      </NavItem>
                      <NavItem>
                          <NavLink tag={Link} className="text-dark" to="/internshipApplications">Internship Applications</NavLink>
                      </NavItem>
                      <NavItem>
                          <NavLink tag={Link} className="text-dark" to="/profile">Profile</NavLink>
                      </NavItem>
                      <NavItem>
                          <NavLink tag={Link} className="text-dark" to="/companyProfile">Company Profile</NavLink>
                      </NavItem>
                      <NavItem>
                          <NavLink tag={Link} className="text-dark" to="/companyInternships">Company Internships</NavLink>
                      </NavItem>
                      <NavItem>
                          <NavLink tag={Link} className="text-dark" to="/createInternship">Create internship</NavLink>
                      </NavItem>
                  </>
              } */}
            </ul>
          </Collapse>
        </Container>
      </Navbar>
    </header>
  ) : (
    ""
  );
};

export default NavMenu;
