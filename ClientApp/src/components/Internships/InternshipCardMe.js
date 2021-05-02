import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Loading from "../Universal/Loading";
import * as Icon from "react-bootstrap-icons";
import { Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 300,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function InternshipCardMe({ internshipData, companyData }) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [aptitudes, setAptitudes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    async function populateWithData() {
      await fetch("api/internshipAptitudes/internship/" + internshipData.id)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          // setAptitudes(data)
        });

      await fetch("api/internshipCategories/internship/" + internshipData.id)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          // setCategories(data);
        });

      setLoading(false);
    }
    populateWithData();
  }, []);

  return !loading ? (
    <Paper className={classes.root}>
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            {internshipData.name}
            <br />
            {companyData.name}
          </div>
          <div className="col-md-4">
            <Icon.Bookmark />
          </div>
        </div>
      </div>
      <br />

      <div className="container">
        <div className="row">
          <div className="col-md-6">
            Aptitudini:{" "}
            <ul>{aptitudes !== [] ? aptitudes.map((apt) => <li>{apt.name}</li>) : ""}</ul>
          </div>

          <div className="col-md-6">
            Categorii:{" "}
            <ul>
              {categories !== [] ? categories.map((categ) => <li>{categ.name}</li>) : ""}
            </ul>
          </div>
        </div>
      </div>
    </Paper>
  ) : (
    <Loading />
  );
}
