import React, { useState, useEffect } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import { Tabs, Tab } from "@material-ui/core";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import PhoneIcon from "@material-ui/icons/Phone";
import { useHistory } from "react-router-dom";
import WorkIcon from "@material-ui/icons/Work";
import BusinessIcon from "@material-ui/icons/Business";
import AddIcon from "@material-ui/icons/Add";
import { useIsStudent, useIsCompany } from "./Authentication/Authentication";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  // title: {
  //   display: "none",
  //   [theme.breakpoints.up("sm")]: {
  //     display: "block",
  //   },
  // },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    // width: 20
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

export default function NewNavMenu() {
  const isStudent = useIsStudent();
  const isCompany = useIsCompany();
  const navNumber =
    sessionStorage.getItem("navnumber") !== null
      ? sessionStorage.getItem("navnumber")
      : 0;
  const [value, setValue] = useState(parseInt(navNumber));
  const history = useHistory();
  useEffect(() => {
    const navNumber =
      sessionStorage.getItem("navnumber") !== null
        ? sessionStorage.getItem("navnumber")
        : 0;
    setValue(parseInt(navNumber));
  }, [value, isStudent, isCompany]);

  const handleChange = (event, newValue) => {
    sessionStorage.setItem("navnumber", newValue);
    setValue(newValue);

    if (isStudent) {
      switch (newValue) {
        case 0:
          history.push("/internships");
          break;
        case 1:
          history.push("/companies");
          break;
        case 2:
          history.push("/profile");
          break;
        case 3:
          setValue(2);
          sessionStorage.setItem("navnumber", 2);
          history.push("/logout");
          break;
      }
    } else if (isCompany) {
      switch (newValue) {
        case 0:
          history.push("/companyProfile");
          break;
        case 1:
          history.push("/companyInternships");
          break;
        case 2:
          history.push("/createInternship");
          break;
        case 3:
          setValue(2);
          sessionStorage.setItem("navnumber", 2);
          history.push("/logout");
          break;
      }
    } else {
      switch (newValue) {
        case 0:
          history.push("/internships");
          break;
        case 1:
          history.push("/companies");
          break;
        case 2:
          // sessionStorage.setItem("navnumber", 0);
          // setValue(0);
          history.push("/login");
          // setValue(0);
          break;
      }
    }
  };

  const classes = useStyles();

  const renderMenu = (
    <Tabs
      variant="fullWidth"
      // centered={true}
      value={value}
      onChange={handleChange}
      // variant="scrollable"
      // scrollButtons="off"
      aria-label="scrollable prevent tabs example"
    >
      {isCompany && (
        <Tab label="Profil" icon={<BusinessIcon />} aria-label="companyProfile" />
      )}
      {isCompany && (
        <Tab label="Stagii" icon={<WorkIcon />} aria-label="companyInternships" />
      )}
      {isCompany && (
        <Tab label="Nou stagiu" icon={<AddIcon />} aria-label="createInternship" />
      )}

      {isStudent && <Tab label="Stagii" icon={<WorkIcon />} aria-label="internships" />}
      {isStudent && (
        <Tab label="Companii" icon={<BusinessIcon />} aria-label="companies" />
      )}
      {isStudent && <Tab label="Profil" icon={<PersonPinIcon />} aria-label="profile" />}

      {!isStudent && !isCompany && (
        <Tab label="Stagii" icon={<WorkIcon />} aria-label="internships" />
      )}
      {!isStudent && !isCompany && (
        <Tab label="Companii" icon={<BusinessIcon />} aria-label="companies" />
      )}
      {!isStudent && !isCompany && (
        <Tab label="Login" icon={<ExitToAppIcon />} aria-label="login" />
      )}
      {(isCompany || isStudent) && (
        <Tab label="Logout" icon={<ExitToAppIcon />} aria-label="logout" />
      )}
    </Tabs>
  );

  const renderMobileMenu = (
    <Tabs
      variant="fullWidth"
      value={value}
      onChange={handleChange}
      // variant="scrollable"
      // scrollButtons="off"
      aria-label="scrollable prevent tabs example"
    >
      {isCompany && (
        <Tab label="Profil" icon={<BusinessIcon />} aria-label="companyProfile" />
      )}
      {isCompany && (
        <Tab label="Stagii" icon={<WorkIcon />} aria-label="companyInternships" />
      )}
      {isCompany && (
        <Tab label="Nou stagiu" icon={<AddIcon />} aria-label="createInternship" />
      )}

      {isStudent && <Tab label="Stagii" icon={<WorkIcon />} aria-label="internships" />}
      {isStudent && (
        <Tab label="Companii" icon={<BusinessIcon />} aria-label="companies" />
      )}
      {isStudent && <Tab label="Profil" icon={<PersonPinIcon />} aria-label="profile" />}

      {!isStudent && !isCompany && (
        <Tab label="Stagii" icon={<WorkIcon />} aria-label="internships" />
      )}
      {!isStudent && !isCompany && (
        <Tab label="Companii" icon={<BusinessIcon />} aria-label="companies" />
      )}
      {!isStudent && !isCompany && (
        <Tab label="Login" icon={<ExitToAppIcon />} aria-label="login" />
      )}
      {(isCompany || isStudent) && (
        <Tab label="Logout" icon={<ExitToAppIcon />} aria-label="logout" />
      )}
    </Tabs>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          {/* <Typography className={classes.title} variant="h6" noWrap>
            Material-UI
          </Typography> */}
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
          {/* <div className={classes.grow} /> */}
          <div className={classes.sectionDesktop}>{renderMenu}</div>
          <div className={classes.sectionMobile}>{renderMobileMenu}</div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
