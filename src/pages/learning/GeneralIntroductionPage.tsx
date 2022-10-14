import ReactPlayer from "react-player";
import { Box } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

export default function GeneralIntroductionPage({}) {
  useBreadcrumbs(null);

  return (
    <Box
      className="player-wrapper"
      sx={{ mt: -2, width: "100%", bgcolor: "black", display: "flex", justifyContent: "center" }}
    >
      <ReactPlayer url="https://www.youtube.com/watch?v=ysz5S6PUM-U" width={712} height={400} />
    </Box>
  );
}
