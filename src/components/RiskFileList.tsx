import { Link } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";

export default function RiskFileList({
  riskFiles,
  onClick,
}: {
  riskFiles: any[] | null;
  onClick: (riskFile: any) => Promise<void>;
}) {
  if (!riskFiles) return null;
  console.log(riskFiles);
  return (
    <>
      <Paper></Paper>
      <Paper>
        <List sx={{ width: "100%", bgcolor: "background.paper", mb: 10 }}>
          {riskFiles.map((rf) => (
            <ListItem key={rf.cr4de_id} disablePadding>
              <ListItemButton onClick={(e) => onClick(rf)}>
                <ListItemAvatar>
                  <Avatar sx={{ fontSize: 13 }}>{rf.cr4de_hazard_id}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={rf.cr4de_title}
                  secondary={rf.cr4de_risk_type}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </>
  );
}
