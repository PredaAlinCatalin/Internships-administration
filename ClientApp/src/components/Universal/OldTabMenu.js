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
import { useIsStudent, useIsCompany } from "../Authentication/Authentication";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import NoteIcon from "@material-ui/icons/Note";
import HistoryIcon from "@material-ui/icons/History";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";

const useStyles = makeStyles({
  root: {
    // flexGrow: 1,
  },
});

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
          history.push("/savedinternshipsfunctional");
          break;
        case 1:
          history.push("/internshipapplications");
          break;
        case 2:
          history.push("/internshiphistory");
          break;
      }
    }
  };

  const classes = useStyles();

  const renderMenu = (
    <Tabs variant="fullWidth" centered={true} value={value} onChange={handleChange}>
      {isStudent && (
        <Tab
          label="Stagii salvate"
          icon={<BookmarkBorderIcon />}
          aria-label="savedinternshipsfunctional"
        />
      )}
      {isStudent && (
        <Tab
          label="Aplicări stagii"
          icon={<NoteIcon />}
          aria-label="internshipapplications"
        />
      )}
      {isStudent && (
        <Tab
          label="Istoric stagii"
          icon={<HistoryIcon />}
          aria-label="internshiphistory"
        />
      )}
    </Tabs>
  );

  return (
    <div>
      <br />
      <div className="d-flex justify-content-center">
        <div className={classes.root} style={{ width: 500 }}>
          <AppBar position="static">{renderMenu}</AppBar>
        </div>
      </div>
    </div>
  );
}
