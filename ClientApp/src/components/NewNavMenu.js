import React, { useState, useEffect } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import { useHistory } from "react-router-dom";
import WorkIcon from "@material-ui/icons/Work";
import BusinessIcon from "@material-ui/icons/Business";
import AddIcon from "@material-ui/icons/Add";
import { useIsStudent, useIsCompany } from "./Authentication/Authentication";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import NoteIcon from "@material-ui/icons/Note";
import HistoryIcon from "@material-ui/icons/History";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import ReactTooltip from "react-tooltip";

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
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
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const anchor = "left";
  const classes = useStyles();

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

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

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {!isCompany && (
          <ListItem
            button
            key={"Internships"}
            onClick={() => history.push("/internships")}
          >
            <ListItemIcon>
              <WorkIcon />
            </ListItemIcon>
            <ListItemText primary={"Stagii"} />
          </ListItem>
        )}

        {!isCompany && (
          <ListItem button key={"Companies"} onClick={() => history.push("/companies")}>
            <ListItemIcon>
              <BusinessIcon />
            </ListItemIcon>
            <ListItemText primary={"Companii"} />
          </ListItem>
        )}

        {isStudent && (
          <ListItem button key={"Profile"} onClick={() => history.push("/profile")}>
            <ListItemIcon>
              <PersonPinIcon />
            </ListItemIcon>
            <ListItemText primary={"Profil"} />
          </ListItem>
        )}

        {isCompany && (
          <ListItem
            button
            key={"CompanyInternships"}
            onClick={() => history.push("/CompanyInternships")}
          >
            <ListItemIcon>
              <WorkIcon />
            </ListItemIcon>
            <ListItemText primary={"Stagiile companiei"} />
          </ListItem>
        )}

        {isCompany && (
          <ListItem
            button
            key={"CompanyProfile"}
            onClick={() => history.push("/CompanyProfile")}
          >
            <ListItemIcon>
              <BusinessIcon />
            </ListItemIcon>
            <ListItemText primary={"Profil companie"} />
          </ListItem>
        )}

        {isCompany && (
          <ListItem
            button
            key={"CreateInternship"}
            onClick={() => history.push("/CreateInternship")}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary={"Creare stagiu"} />
          </ListItem>
        )}
      </List>
      <Divider />
      <List>
        {isStudent && (
          <ListItem
            button
            key={"SavedInternships"}
            onClick={() => history.push("/savedInternships")}
          >
            <ListItemIcon>
              <BookmarkBorderIcon />
            </ListItemIcon>
            <ListItemText primary={"Stagii salvate"} />
          </ListItem>
        )}

        {isStudent && (
          <ListItem
            button
            key={"InternshipApplications"}
            onClick={() => history.push("/internshipApplications")}
          >
            <ListItemIcon>
              <NoteIcon />
            </ListItemIcon>
            <ListItemText primary={"Aplicări stagii"} />
          </ListItem>
        )}

        {isStudent && (
          <ListItem
            button
            key={"InternshipHistory"}
            onClick={() => history.push("/InternshipHistory")}
          >
            <ListItemIcon>
              <HistoryIcon />
            </ListItemIcon>
            <ListItemText primary={"Istoric stagii"} />
          </ListItem>
        )}

        {(isStudent || isCompany) && (
          <ListItem button key={"Logout"} onClick={() => history.push("/Logout")}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary={"Logout"} />
          </ListItem>
        )}
      </List>
    </div>
  );

  const renderMenu = (
    <>
      {isCompany && (
        <>
          <a data-tip data-for="companyProfile">
            <IconButton color="inherit" onClick={() => history.push("/companyProfile")}>
              <PersonPinIcon />
            </IconButton>
          </a>
          <ReactTooltip id="companyProfile" place="bottom">
            <span>Profil</span>
          </ReactTooltip>
        </>
      )}

      {isCompany && (
        <>
          <a data-tip data-for="companyInternships">
            <IconButton
              color="inherit"
              onClick={() => history.push("/companyInternships")}
            >
              <WorkIcon />
            </IconButton>
          </a>
          <ReactTooltip id="companyInternships" place="bottom">
            <span>Stagiile companiei</span>
          </ReactTooltip>
        </>
      )}

      {isCompany && (
        <>
          <a data-tip data-for="createInternship">
            <IconButton color="inherit" onClick={() => history.push("/createInternship")}>
              <AddIcon />
            </IconButton>
          </a>
          <ReactTooltip id="createInternship" place="bottom">
            <span>Creează stagiu</span>
          </ReactTooltip>
        </>
      )}

      {isStudent && (
        <>
          <a data-tip data-for="internships">
            <IconButton color="inherit" onClick={() => history.push("/internships")}>
              <WorkIcon />
            </IconButton>
          </a>
          <ReactTooltip id="internships" place="bottom">
            <span>Stagii</span>
          </ReactTooltip>
        </>
      )}

      {isStudent && (
        <>
          <a data-tip data-for="companies">
            <IconButton color="inherit" onClick={() => history.push("/companies")}>
              <BusinessIcon />
            </IconButton>
          </a>
          <ReactTooltip id="companies" place="bottom">
            <span>Companii</span>
          </ReactTooltip>
        </>
      )}

      {isStudent && (
        <>
          <a data-tip data-for="profile">
            <IconButton color="inherit" onClick={() => history.push("/profile")}>
              <PersonPinIcon />
            </IconButton>
          </a>
          <ReactTooltip id="profile" place="bottom">
            <span>Profil</span>
          </ReactTooltip>
        </>
      )}

      {(isStudent || isCompany) && (
        <>
          <a data-tip data-for="logout">
            <IconButton color="inherit" onClick={() => history.push("/logout")}>
              <ExitToAppIcon />
            </IconButton>
          </a>
          <ReactTooltip id="logout" place="bottom">
            <span>Logout</span>
          </ReactTooltip>
        </>
      )}

      {!isStudent && !isCompany && (
        <>
          <a data-tip data-for="internships">
            <IconButton color="inherit" onClick={() => history.push("/internships")}>
              <WorkIcon />
            </IconButton>
          </a>
          <ReactTooltip id="internships" place="bottom">
            <span>Stagii</span>
          </ReactTooltip>
        </>
      )}

      {!isStudent && !isCompany && (
        <>
          <a data-tip data-for="companies">
            <IconButton color="inherit" onClick={() => history.push("/companies")}>
              <BusinessIcon />
            </IconButton>
          </a>
          <ReactTooltip id="companies" place="bottom">
            <span>Companii</span>
          </ReactTooltip>
        </>
      )}

      {!isStudent && !isCompany && (
        <>
          <a data-tip data-for="login">
            <IconButton color="inherit" onClick={() => history.push("/login")}>
              <ExitToAppIcon />
            </IconButton>
          </a>
          <ReactTooltip id="login" place="bottom">
            <span>Login</span>
          </ReactTooltip>
        </>
      )}
    </>
  );

  const renderMobileMenu = (
    <>
      {isCompany && (
        <IconButton color="inherit" onClick={() => history.push("/companyProfile")}>
          <PersonPinIcon />
        </IconButton>
      )}

      {isCompany && (
        <IconButton color="inherit" onClick={() => history.push("/companyInternships")}>
          <WorkIcon />
        </IconButton>
      )}

      {isCompany && (
        <IconButton color="inherit" onClick={() => history.push("/createInternship")}>
          <AddIcon />
        </IconButton>
      )}

      {isStudent && (
        <IconButton color="inherit" onClick={() => history.push("/internships")}>
          <WorkIcon />
        </IconButton>
      )}

      {isStudent && (
        <IconButton color="inherit" onClick={() => history.push("/companies")}>
          <BusinessIcon />
        </IconButton>
      )}

      {isStudent && (
        <IconButton color="inherit" onClick={() => history.push("/profile")}>
          <PersonPinIcon />
        </IconButton>
      )}

      {(isStudent || isCompany) && (
        <IconButton color="inherit" onClick={() => history.push("/logout")}>
          <ExitToAppIcon />
        </IconButton>
      )}

      {!isStudent && !isCompany && (
        <IconButton color="inherit" onClick={() => history.push("/internships")}>
          <WorkIcon />
        </IconButton>
      )}

      {!isStudent && !isCompany && (
        <IconButton color="inherit" onClick={() => history.push("/companies")}>
          <BusinessIcon />
        </IconButton>
      )}

      {!isStudent && !isCompany && (
        <IconButton color="inherit" onClick={() => history.push("/login")}>
          <ExitToAppIcon />
        </IconButton>
      )}
    </>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <React.Fragment key={anchor}>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer(anchor, true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
            >
              {list(anchor)}
            </Drawer>
          </React.Fragment>
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
