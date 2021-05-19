import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    button: {
      textTransform: "none",
    },
  },
  palette: {
    primary: {
      light: "#69b6ff",
      main: "#1b87e5",
      dark: "#005bb2",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff616f",
      main: "#ff1744",
      dark: "#c4001d",
      contrastText: "#fff",
    },
  },
});

export default theme;
