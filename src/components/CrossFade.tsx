import * as React from "react";

import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";

type CrossFadeProps = {
  components: {
    in: boolean;
    component: React.ReactNode;
  }[];
};

const CrossFade: React.FC<CrossFadeProps> = ({ components }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {components.map((component, index) => (
        <Fade key={index} in={component.in} timeout={1000} mountOnEnter unmountOnExit>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
          >
            {component.component}
          </Box>
        </Fade>
      ))}
    </Box>
  );
};

export { CrossFade };
