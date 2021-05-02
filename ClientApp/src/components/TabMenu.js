import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PhoneIcon from "@material-ui/icons/Phone";
import FavoriteIcon from "@material-ui/icons/Favorite";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import HelpIcon from "@material-ui/icons/Help";
import ShoppingBasket from "@material-ui/icons/ShoppingBasket";
import ThumbDown from "@material-ui/icons/ThumbDown";
import ThumbUp from "@material-ui/icons/ThumbUp";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useHistory } from "react-router-dom";

function a11yProps(index) {
  return {
    id: `scrollable-prevent-tab-${index}`,
    "aria-controls": `scrollable-prevent-tabpanel-${index}`,
  };
}

const TabMenu = () => {
  const navNumber =
    sessionStorage.getItem("navnumber") !== null
      ? sessionStorage.getItem("navnumber")
      : 0;
  const [value, setValue] = useState(parseInt(navNumber));
  const history = useHistory();
  useEffect(() => {
    console.log(sessionStorage.getItem("navnumber"));
    const navNumber =
      sessionStorage.getItem("navnumber") !== null
        ? sessionStorage.getItem("navnumber")
        : 0;
    console.log("NUMBER", navNumber);
    setValue(parseInt(navNumber));
  }, []);

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };

  const handleChange = (event, newValue) => {
    sessionStorage.setItem("navnumber", newValue);
    setValue(newValue);
    switch (newValue) {
      case 0:
        console.log("CASE 0");
        history.push("/internships");
        break;
      case 1:
        history.push("/companies");
        break;
    }
  };

  return (
    <AppBar position="static">
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="off"
        aria-label="scrollable prevent tabs example"
      >
        <Tab icon={<PhoneIcon />} aria-label="phone" {...a11yProps(0)} />
        <Tab icon={<FavoriteIcon />} aria-label="favorite" {...a11yProps(1)} />
        <Tab icon={<PersonPinIcon />} aria-label="person" {...a11yProps(2)} />
        <Tab icon={<HelpIcon />} aria-label="help" {...a11yProps(3)} />
      </Tabs>
    </AppBar>
  );
};

export default TabMenu;
