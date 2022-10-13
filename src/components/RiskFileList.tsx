import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Paper, Stack, Skeleton, TextField, Box, Tooltip, IconButton } from "@mui/material";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import getCategoryColor from "../functions/getCategoryColor";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleOutlineIcon from "@mui/icons-material/TaskAlt";

export interface FinishableRiskFile extends DVRiskFile {
  finished?: boolean;
}

function RiskFileList({
  riskFiles,
  finishedTooltip,
  onClick,
}: {
  riskFiles: FinishableRiskFile[] | null;
  finishedTooltip?: string;
  onClick: (riskFile: FinishableRiskFile) => Promise<void>;
}) {
  const [t] = useTranslation();

  const [filter, setFilter] = useState("");

  const filteredRiskFiles =
    filter === "" || !riskFiles
      ? riskFiles
      : riskFiles.filter((r) => r.cr4de_title.toLowerCase().indexOf(filter.toLowerCase()) >= 0);

  return (
    <>
      <Paper>
        <Box sx={{ px: 2, pt: 2, display: "flex", alignItems: "flex-end" }}>
          <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />

          <TextField
            fullWidth
            placeholder="Filter hazard catalogue"
            size="small"
            variant="standard"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Box>
        <List sx={{ width: "100%", bgcolor: "background.paper", mb: 10 }}>
          {filteredRiskFiles
            ? filteredRiskFiles.map((rf) => (
                <ListItem
                  key={rf.cr4de_riskfilesid}
                  disablePadding
                  secondaryAction={
                    rf.finished && (
                      <Tooltip title={finishedTooltip}>
                        <IconButton>
                          <CheckCircleOutlineIcon color="primary" fontSize="medium" />
                        </IconButton>
                      </Tooltip>
                    )
                  }
                >
                  <ListItemButton onClick={(e) => onClick(rf)}>
                    <ListItemAvatar>
                      <Avatar sx={{ fontSize: 13, bgcolor: getCategoryColor(rf.cr4de_risk_category) }}>
                        {rf.cr4de_hazard_id}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={rf.cr4de_title} secondary={t(rf.cr4de_risk_type)} />
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
