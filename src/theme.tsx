import { createTheme } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    background: {
      default: "#fafafa",
    },
    primary: {
      main: "rgb(0, 164, 154)",
      light: "#F8F8F8",
    },
    secondary: blueGrey,
  },
});

export default theme;
