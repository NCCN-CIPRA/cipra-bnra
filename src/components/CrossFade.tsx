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
  const [startFadeOut, setStartFadeOut] = React.useState<number | null>(null);
  const [prevComponents, setPrevComponents] = React.useState(components);

  React.useEffect(() => {
    const outComponent = prevComponents.findIndex(
      (p, i) => p.in && !components[i].in
    );

    if (outComponent >= 0) {
      const newComponents = [...prevComponents];
      newComponents[outComponent] = components[outComponent];
      setPrevComponents(newComponents);
      setStartFadeOut(Date.now());
    } else if (startFadeOut) {
      const timer = setTimeout(() => {
        setPrevComponents(components);
      }, Math.max((startFadeOut || 0) + 1000 - Date.now(), 0));

      return () => clearTimeout(timer);
    } else {
      setPrevComponents(components);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [components, startFadeOut]);

  return (
    <>
      {prevComponents.map((component, index) => (
        <Fade
          key={index}
          in={component.in}
          timeout={500}
          mountOnEnter
          unmountOnExit
        >
          <Box>{component.component}</Box>
        </Fade>
      ))}
    </>
  );
};

const CrossFade2: React.FC<CrossFadeProps> = ({ components }) => {
  const [prevComponents, setPrevComponents] = React.useState(components);
  const [outComponentIndex, setOutComponentIndex] = React.useState<
    number | null
  >(null);
  const [outComponent, setOutComponent] =
    React.useState<React.ReactNode | null>(null);

  React.useEffect(() => {
    const outComponent = prevComponents.findIndex(
      (p, i) => p.in && !components[i].in
    );

    if (outComponent >= 0) {
      setOutComponentIndex(outComponent);
      setOutComponent(prevComponents[outComponent].component);
    }
    setPrevComponents(components);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [components]);

  return (
    <Box sx={{ position: "relative" }}>
      {components.map((component, index) => (
        <Fade
          key={index}
          in={component.in}
          timeout={1000}
          mountOnEnter
          unmountOnExit
        >
          <Box
            sx={{
              position: index === outComponentIndex ? "absolute" : "static",
              top: 0,
            }}
          >
            {index === outComponentIndex ? outComponent : component.component}
          </Box>
        </Fade>
      ))}
    </Box>
  );
};

export { CrossFade, CrossFade2 };
