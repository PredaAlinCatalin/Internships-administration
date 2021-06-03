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
    flexGrow: 1,
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

    if (isCompany) {
      switch (newValue) {
        case 0:
          history.push("/companyInternships/all");
          break;
        case 1:
          history.push("/companyInternships/pending");
          break;
        case 2:
          history.push("/companyInternships/approved");
          break;
        case 3:
          history.push("/companyInternships/refused");
          break;
        case 4:
          history.push("/companyInternships/closed");
          break;
      }
    }
  };

  const classes = useStyles();

  const renderMenu = (
    <Tabs variant="fullWidth" centered={true} value={value} onChange={handleChange}>
      {isCompany && (
        <Tab
          label="Toate stagiile"
          icon={<BookmarkBorderIcon />}
          aria-label="companyInternships/"
          onClick={() => history.push("/companyInternships/all")}
        />
      )}

      {isCompany && (
        <Tab
          label="Stagii în așteptare"
          icon={<HistoryIcon />}
          aria-label="pendingCompanyInternships"
        />
      )}
      {isCompany && (
        <Tab
          label="Stagii aprobate"
          icon={<NoteIcon />}
          aria-label="approvedCompanyInternships"
        />
      )}
      {isCompany && (
        <Tab
          label="Stagii refuzate"
          icon={<NoteIcon />}
          aria-label="refusedCompanyInternships"
        />
      )}
      {isCompany && (
        <Tab
          label="Stagii închise"
          icon={<HistoryIcon />}
          aria-label="closedCompanyInternships"
        />
      )}
    </Tabs>
  );

  return (
    <div>
      <br />
      <div className="d-flex justify-content-center ml-3 mr-3">
        <div className={classes.root}>
          <AppBar position="static">{renderMenu}</AppBar>
        </div>
      </div>
    </div>
  );
}
