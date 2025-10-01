import { Box, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

export default function LeftBorderSection({
  children,
  color,
  sx = {},
}: {
  children: ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
}) {
  return (
    <Box
      sx={{
        borderLeft: `solid 8px ${color || "#eee"}`,
        pl: 2,
        ml: 2,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
