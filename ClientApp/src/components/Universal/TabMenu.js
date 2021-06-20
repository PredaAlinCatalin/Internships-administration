import React from "react";
import Paper from "@material-ui/core/Paper";
import NoteIcon from "@material-ui/icons/Note";
import HistoryIcon from "@material-ui/icons/History";
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder";
import { useHistory } from "react-router-dom";

const TabMenu = () => {
  const history = useHistory();
  return (
    <div className="m-3">
      <Paper>
        <div className="container" style={{ width: "60%" }}>
          <div className="row justify-content-center text-center">
            <div
              className="col-md-2 mr-3 mt-2 mb-2"
              style={{ padding: 0 }}
              onClick={() => history.push("/savedinternships")}
              onMouseOver={(e) => (e.target.style.cursor = "pointer")}
              onMouseOut={(e) => (e.target.style.cursor = "normal")}
            >
              <BookmarkBorderIcon />
              <br />
              Stagii salvate
            </div>
            <div
              className="col-md-2 mr-3 mt-2 mb-2"
              style={{ padding: 0 }}
              onClick={() => history.push("/internshipapplications")}
              onMouseOver={(e) => (e.target.style.cursor = "pointer")}
              onMouseOut={(e) => (e.target.style.cursor = "normal")}
            >
              <NoteIcon />
              <br />
              Aplicări stagii
            </div>
            <div
              className="col-md-2 mt-2 mb-2"
              style={{ padding: 0 }}
              onClick={() => history.push("/internshiphistory")}
              onMouseOver={(e) => (e.target.style.cursor = "pointer")}
              onMouseOut={(e) => (e.target.style.cursor = "normal")}
            >
              <HistoryIcon />
              <br />
              Istoric stagii
            </div>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default TabMenu;
