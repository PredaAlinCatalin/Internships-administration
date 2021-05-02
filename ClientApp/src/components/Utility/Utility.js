import * as moment from "moment";

export const getFormattedDate = (fullDate) => {
  let year = fullDate.getFullYear();
  let month = fullDate.getMonth() + 1;
  if (month < 10) month = "0" + month;
  let day = fullDate.getDate();
  if (day < 10) day = "0" + day;
  let hours = fullDate.getHours();
  if (hours < 10) hours = "0" + hours;
  let minutes = fullDate.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;
  let seconds = fullDate.getSeconds();
  if (seconds < 10) seconds = "0" + seconds;

  let result =
    year + "-" + month + "-" + day + "-" + hours + ":" + minutes + ":" + seconds;
  return result;
};

export const getFormattedDateNoTime = (fullDate) => {
  let year = fullDate.getFullYear();
  let month = fullDate.getMonth() + 1;
  if (month < 10) month = "0" + month;
  let day = fullDate.getDate();
  if (day < 10) day = "0" + day;
  let result = year + "/" + month + "/" + day;
  return result;
};

export const checkDateIsPast = (date) => {
  // date = getFormattedDateNoTime(date);

  let parsedDate = moment(date).format("YYYY-MM-DD");
  let currentFullDate = new Date();
  let year = currentFullDate.getFullYear();
  let month = currentFullDate.getMonth() + 1;
  if (month < 10) month = "0" + month;
  let day = currentFullDate.getDate();
  if (day < 10) day = "0" + day;
  let currentDate = year + "-" + month + "-" + day;
  console.log(parsedDate);
  console.log(currentDate);
  console.log(currentFullDate);
  console.log("--------------");
  console.log(parsedDate < currentDate);
  return parsedDate < currentDate;
};
