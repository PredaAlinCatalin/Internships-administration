import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";
import { Avatar, Paper } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    maxHeight: 200,
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

export default function InternshipReview({ student, review }) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper style={{ padding: "40px 20px" }}>
      <div className="container">
        <div className="row">
          <div className="col-md-2">
            <Avatar alt={student.firstName} src={"/photos/" + student.photoPath} />
            {student.firstName} {student.lastName}
          </div>

          <div className="col-md-10">
            {review.title}
            <Box component="fieldset" mb={3} borderColor="transparent">
              <Rating name="read-only" value={review.grade} readOnly />
            </Box>
            <br />
            {review.comment}
          </div>
        </div>
      </div>
    </Paper>
  );
}
