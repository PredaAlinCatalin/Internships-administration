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
  let parsedDate = moment(fullDate).format("YYYY-MM-DD");
  return parsedDate;
};

export const checkDateIsPast = (date) => {
  let parsedDate = moment(date).format("YYYY-MM-DD");
  let currentDate = moment(new Date()).format("YYYY-MM-DD");
  return parsedDate < currentDate;
};

export const getCitiesOptions = (cities) => {
  let citiesOptions = [];
  for (let i = 0; i < cities.length; i++) {
    citiesOptions.push({
      value: cities[i].name,
      label: cities[i].name,
    });
  }
  return citiesOptions;
};

export const getCategoriesOptions = (categories) => {
  let categoriesOptions = [];
  for (let i = 0; i < categories.length; i++) {
    categoriesOptions.push({
      value: categories[i].name,
      label: categories[i].name,
    });
  }
  return categoriesOptions;
};

export const getAptitudesOptions = (aptitudes) => {
  let aptitudesOptions = [];
  for (let i = 0; i < aptitudes.length; i++) {
    aptitudesOptions.push({
      value: aptitudes[i].name,
      label: aptitudes[i].name,
    });
  }
  return aptitudesOptions;
};

export const getForeignLanguagesOptions = (foreignlanguages) => {
  let foreignlanguagesOptions = [];
  for (let i = 0; i < foreignlanguages.length; i++) {
    foreignlanguagesOptions.push({
      value: foreignlanguages[i].name,
      label: foreignlanguages[i].name,
    });
  }
  return foreignlanguagesOptions;
};

export const getSelectOptions = (list) => {
  let options = [];
  for (let i = 0; i < list.length; i++) {
    options.push({
      value: list[i].id,
      label: list[i].name,
    });
  }
  return options;
};
