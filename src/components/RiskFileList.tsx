import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Paper, Stack, Skeleton } from "@mui/material";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";

function RiskFileList({
  riskFiles,
  onClick,
}: {
  riskFiles: DVRiskFile[] | null;
  onClick: (riskFile: DVRiskFile) => Promise<void>;
}) {
  return (
    <>
      <Paper>
        <List sx={{ width: "100%", bgcolor: "background.paper", mb: 10 }}>
          {riskFiles
            ? riskFiles.map((rf) => (
                <ListItem key={rf.cr4de_riskfilesid} disablePadding>
                  <ListItemButton onClick={(e) => onClick(rf)}>
                    <ListItemAvatar>
                      <Avatar sx={{ fontSize: 13 }}>{rf.cr4de_hazard_id}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={rf.cr4de_title} secondary={rf.cr4de_risk_type} />
                  </ListItemButton>
                </ListItem>
              ))
            : [1, 2, 3].map((i) => (
                <ListItem key={i}>
                  <Stack direction="row" sx={{ flex: 1 }}>
                    <Skeleton variant="circular" width={42} height={42} sx={{ mr: "14px" }}></Skeleton>
                    <Stack direction="column" sx={{ flex: 1, maxWidth: 300 }}>
                      <Skeleton variant="text" sx={{ fontSize: "1rem" }}></Skeleton>
                      <Skeleton variant="text" sx={{ fontSize: "0.7rem" }}></Skeleton>
                    </Stack>
                  </Stack>
                </ListItem>
              ))}
        </List>
      </Paper>
    </>
  );
}

export default React.memo(RiskFileList);
