import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";
import Loading from "../Universal/Loading";
import { useHistory } from "react-router-dom";
import { useIsStudent } from "../Authentication/Authentication";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import { CardActionArea } from "@material-ui/core";
import { SavedInternshipsContext } from "../../contexts/SavedInternshipsContext";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  addSavedInternship,
  deleteSavedInternship,
} from "../savedInternships/savedInternshipsSlice";
import { unwrapResult } from "@reduxjs/toolkit";

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
    width: 65,
    height: 65,
  },
}));

const InternshipCard = ({ internshipId, companyId }) => {
  const classes = useStyles();
  const [internship, setInternship] = useState(null);
  const [company, setCompany] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [aptitudes, setAptitudes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const history = useHistory();
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const isStudent = useIsStudent();
  const [saved, setSaved] = useState(false);
  const { dispatchSavedInternships } = useContext(SavedInternshipsContext);
  const dispatch = useDispatch();
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const [deleteRequestStatus, setDeleteRequestStatus] = useState("idle");
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    async function populateWithData() {
      let user = JSON.parse(sessionStorage.getItem("user"));
      if (user !== null) {
        setUserId(user.id);
        setUserRole(user.role);
      }

      await fetch("api/internships/" + internshipId)
        .then((res) => res.json())
        .then((internshipData) => {
          setInternship(internshipData);

          return fetch("api/cities/" + internshipData.cityId);
        })
        .then((res) => res.json())
        .then((data) => {
          setCity(data);
        })
        .catch((error) => console.log(error));

      await fetch("api/companies/" + companyId)
        .then((res) => res.json())
        .then((data) => setCompany(data));

      // await fetch("api/aptitudes/internship/" + internshipId)
      //   .then((res) => res.json())
      //   .then((data) => {
      //     if (data.status === 404) return;
      //     setAptitudes(data);
      //   })
      //   .catch((error) => console.log(error));

      await axios
        .get("api/aptitudes/internship/" + internshipId)
        .then((response) => {
          if (response.status.ok) {
            setAptitudes(response.data);
          }
        })
        .catch((error) => console.log(error));

      await fetch("api/categories/internship/" + internshipId)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 404) return;
          setCategories(data);
        })
        .catch((error) => console.log(error));

      if (user !== null && user.role == "Student") {
        let aux =
          "api/savedStudentInternships/student/" +
          user.id +
          "/internship/" +
          internshipId;
        await fetch(aux)
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (data.status === 404) return;
            setSaved(true);
          });
      }
      setLoading(false);
    }
    populateWithData();
  }, [saved, addRequestStatus, deleteRequestStatus, dispatch]);

  const getShortString = (string, length) => {
    if (string !== undefined && string !== null && string.length > length)
      return string.substring(0, length) + "...";
    else return string;
  };

  const handleSave = async (event) => {
    event.stopPropagation();
    const body = {
      internshipId: internshipId,
      studentId: userId,
    };

    try {
      setAddRequestStatus("pending");
      const resultAction = await dispatch(addSavedInternship(body));
      unwrapResult(resultAction);
    } catch (error) {
      console.log(error);
    } finally {
      setAddRequestStatus("idle");
      setSaved(true);
    }
  };

  const handleDelete = async (event) => {
    event.stopPropagation();
    const body = {
      internshipId: internshipId,
      studentId: userId,
    };

    try {
      setDeleteRequestStatus("pending");
      const resultAction = await dispatch(deleteSavedInternship(body));
      unwrapResult(resultAction);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteRequestStatus("idle");
      setSaved(false);
    }
  };

  return !loading ? (
    <Card className={classes.root}>
      {/* <ButtonBase> */}
      <CardActionArea
        className={classes.root}
        onClick={(e) => history.push("/internship/" + internshipId)}
      >
        <CardHeader
          avatar={
            <Avatar
              aria-label="recipe"
              className={classes.avatar}
              alt="logo"
              src={"/logos/" + company.logoPath}
              variant="rounded"
            ></Avatar>
          }
          action={
            isStudent ? (
              saved ? (
                <IconButton onClick={handleDelete}>
                  <BookmarkIcon size={25} />
                </IconButton>
              ) : (
                <IconButton onClick={handleSave}>
                  <BookmarkBorderIcon size={25} />
                </IconButton>
              )
            ) : (
              <span></span>
            )
          }
          // title={internshipData.name}
          // subheader={companyData.name}
        />

        <CardContent>
          <div>
            <div style={{ fontSize: 16, color: "#111854" }}>
              <b>{internship.name}</b>
            </div>
            <div style={{ fontSize: 14 }}>{getShortString(company.name, 20)}</div>
            <div style={{ fontSize: 14 }}>{getShortString(city.name, 20)}</div>

            <br />

            <div style={{ fontSize: 14 }}>
              Aptitudini:{" "}
              {aptitudes !== []
                ? getShortString(aptitudes.map((apt) => apt.name).join(","), 35)
                : ""}
            </div>

            <div style={{ fontSize: 14 }}>
              Categorii:{" "}
              {categories !== []
                ? getShortString(categories.map((categ) => categ.name).join(","), 35)
                : ""}
            </div>
          </div>
        </CardContent>
      </CardActionArea>

      {/* </ButtonBase> */}
    </Card>
  ) : (
    <Loading />
  );
};

export default InternshipCard;
