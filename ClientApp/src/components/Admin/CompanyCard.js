import React, { useState, useEffect } from "react";
import * as Icon from "react-bootstrap-icons";
import { withRouter, Link, useHistory } from "react-router-dom";
import Loading from "../Universal/Loading";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
// import TabMenuCompany from './TabMenuCompany';
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import axios from "axios";
import {
  fetchInternships,
  selectAllInternships,
  updateInternship,
} from "../Anonymous/internshipsSlice";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { getFormattedDateNoTime } from "../Utility/Utility";

const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 345,
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

export default function CompanyCard({companyId}) {
  const [company, setCompany] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  const history = useHistory();
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(0);
  const internships = useSelector(selectAllInternships);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.internships.status);
  const error = useSelector((state) => state.internships.error);
  const [updateRequestStatus, setUpdateRequestStatus] = useState("idle");

  const handleExpandClick = (companyId) => {
    setExpanded(!expanded);
    setSelected(companyId);
    console.log(companyId)
  };

  useEffect(() => {
    async function populateApproveInternshipsData() {
      let user = JSON.parse(sessionStorage.getItem("user"));

      let companyData = "";
      const companyResponse = await fetch("api/companies/" + companyId);
      if (companyResponse.ok) companyData = await companyResponse.json();

      const citiesResponse = await fetch("api/cities");
      var citiesData = [];
      if (citiesResponse.ok) citiesData = await citiesResponse.json();

      if (status === "idle") {
        dispatch(fetchInternships());
      }

      setCompany(companyData);
      setCities(citiesData);
      setLoading(false);
    }

    populateApproveInternshipsData();
  }, []);

  const handleApproveInternship = async (internship) => {
    let modifiedInternship = { ...internship };
    modifiedInternship.status = "approved";
    console.log(modifiedInternship);
    try {
      setUpdateRequestStatus("pending");
      const resultAction = await dispatch(updateInternship(modifiedInternship));
      unwrapResult(resultAction);
    } catch (error) {
    } finally {
      setUpdateRequestStatus("idle");
    }
  };

  const handleRefuseInternship = async (internship) => {
    let modifiedInternship = { ...internship };
    modifiedInternship.status = "refused";
    try {
      setUpdateRequestStatus("pending");
      const resultAction = await dispatch(updateInternship(modifiedInternship));
      unwrapResult(resultAction);
    } catch (error) {
    } finally {
      setUpdateRequestStatus("idle");
    }
  };

  const getInternshipDescriptionShort = (description, length) => {
    description = description.replaceAll("<br/>", "\n");
    if (description.length > length) return description.substring(0, length) + "...";
    else return description;
  };

  const getCity = (id) => {
    for (let i = 0; i < cities.length; i++) if (cities[i].id === id) return cities[i];
  };
  return !loading ? (
    <div>
      <Card className={classes.root}>
        <CardContent style={{ paddingBottom: 0 }}>
          <div className="container">
            <div className="row">
              <div className="mr-2">
                <Avatar
                  aria-label="recipe"
                  className={classes.avatar}
                  alt="logo"
                  src={"/logos/" + company.logoPath}
                  variant="rounded"
                  style={{ width: 60, height: 60 }}
                ></Avatar>
              </div>
              <div>
                <Link to={"/company/" + company.id}>
                  <h5>{company.name}</h5>
                </Link>
                {company.industry}
                {", "}
                {company.address}
              </div>
            </div>
          </div>
        </CardContent>
        <CardActions disableSpacing style={{ paddingTop: 0 }}>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={() => handleExpandClick(company.id)}
            aria-expanded={expanded && selected === company.id}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            {internships !== [] ? (
              <>
                <div>
                  <div className="m-3">
                    <Paper elevation={3}>
                      <div className="container p-3 pb-2">
                        <div className="table-responsive"></div>
                        <table
                          aria-labelledby="tabelLabel"
                          className="table table-hover"
                        >
                          <thead>
                            <tr className="d-flex">
                              <th className="col-4">Stagiu</th>
                              <th className="col-3">Data creării stagiului</th>
                              <th className="col-1">Status</th>
                              <th className="col-4">Acțiuni</th>
                            </tr>
                          </thead>
                          <tbody>
                            {internships.map((internship, index) => internship.companyId === company.id && (
                              <tr key={internship.id} className="d-flex">
                                {
                                  (
                                    <>
                                      <td className="col-4">
                                        <Link to={"/internship/" + internship.id}>
                                          <b style={{ fontSize: 18 }}>
                                            {" "}
                                            {internship.name}{" "}
                                          </b>
                                        </Link>
                                        <br />

                                        <span
                                          style={{
                                            // paddingLeft: 6,
                                            fontSize: 14,
                                          }}
                                        >
                                          {getCity(internship.cityId).name}
                                          <Icon.GeoAltFill />
                                        </span>
                                      </td>

                                      <td className="col-3">
                                        <span style={{ fontSize: 14 }}>
                                          {getFormattedDateNoTime(
                                            internship.creationDate
                                          )}
                                        </span>
                                      </td>

                                      <td className="col-1">
                                        <span style={{ fontSize: 14 }}>
                                          {internship.status}
                                        </span>
                                      </td>

                                      <td className="col-4">
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          onClick={() =>
                                            handleApproveInternship(internship)
                                          }
                                        >
                                          Aprobă stagiu
                                        </Button>
                                        &nbsp;
                                        <Button
                                          variant="contained"
                                          color="secondary"
                                          onClick={() =>
                                            handleRefuseInternship(internship)
                                          }
                                        >
                                          Refuză stagiu
                                        </Button>
                                        &nbsp;
                                      </td>
                                    </>
                                  )
                                }
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Paper>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
          </CardContent>
        </Collapse>
      </Card>
    </div>
  ) : <Loading/> ;
}