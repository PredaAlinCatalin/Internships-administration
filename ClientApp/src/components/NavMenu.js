import React, { useEffect, useState } from "react";
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

const NavMenu = () => {
  const [collapsed, setCollapsed] = useState(true);

  const isCompany = useIsCompany();
  const isStudent = useIsStudent();

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {}, []);

  return (
    <header>
      <Navbar
        className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3"
        light
      >
        <Container>
          <NavbarBrand tag={Link} to="/">
            Licenta
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
                    <NavLink tag={Link} className="text-dark" to="/">
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
  );
};

export default NavMenu;