import { Box } from "@mui/material";
import { useEffect, useState, PropsWithChildren, useRef } from "react";

type AutoProps = {
  toggle: unknown;
  toggle2: unknown;
  duration: string;
};

export default function AutoHeight({
  children,
  toggle,
  toggle2,
  duration,
}: PropsWithChildren<AutoProps>) {
  const [fixedHeight, setFixedHeight] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      setFixedHeight(ref.current.clientHeight);
    }
  }, [toggle, toggle2]);

  return (
    <>
      <Box
        ref={ref}
        sx={{ position: "absolute", height: "auto", opacity: 0, zIndex: -1 }}
      >
        {children}
      </Box>
      <Box
        sx={{ height: fixedHeight, transition: `height ${duration} ease` }}
      />
    </>
  );
}
