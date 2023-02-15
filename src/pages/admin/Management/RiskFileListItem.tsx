import { useEffect, useState } from "react";
import { SelectableContact } from "./Selectables";
import {
  Snackbar,
  SnackbarContent,
  CircularProgress,
  Container,
  ListItem,
  ListItemText,
  Box,
  Paper,
  ListItemIcon,
  ListItemButton,
  List,
  IconButton,
  ListItemAvatar,
  Avatar,
  Checkbox,
  Menu,
  MenuItem,
} from "@mui/material";
import ParticipationStepper from "./ParticipationStepper";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useAPI from "../../../hooks/useAPI";
import { Link } from "react-router-dom";
import { SelectableRiskFile } from "./Selectables";

const roleLetter = (role: string) => {
  if (role === "expert") return "E";
  if (role === "analist") return "A";
  return "B";
};

export default function RiskFileListItem({
  riskFile,
  selectRiskFile,
}: {
  riskFile: SelectableRiskFile;
  selectRiskFile: (c: SelectableRiskFile) => void;
}) {
  return (
    <>
      <ListItem
        key={riskFile.cr4de_riskfilesid}
        component="div"
        disablePadding
        // secondaryAction={
        //   isLoading ? (
        //     <CircularProgress size={20} />
        //   ) : (
        // <IconButton
        //   aria-label="more"
        //   id="long-button"
        //   aria-controls={open ? "long-menu" : undefined}
        //   aria-expanded={open ? "true" : undefined}
        //   aria-haspopup="true"
        //   onClick={handleClick}
        // >
        //   <MoreVertIcon />
        // </IconButton>
        //   )
        // }
      >
        <ListItemButton role={undefined} onClick={() => selectRiskFile(riskFile)}>
          <ListItemIcon>
            <Checkbox edge="start" checked={riskFile.selected} tabIndex={-1} disableRipple />
          </ListItemIcon>
          <ListItemText primary={riskFile.cr4de_title} secondary={riskFile.cr4de_risk_type} />
        </ListItemButton>
      </ListItem>
      {riskFile.participants && riskFile.participants.length > 0 && (
        <List component="div" disablePadding>
          {riskFile.participants
            .sort((a, b) => a.cr4de_contact?.firstname?.localeCompare(b.cr4de_contact?.firstname || "") || 0)
            .map((p) => (
              <ListItem key={p.cr4de_bnraparticipationid}>
                <ListItemButton
                  sx={{ pl: 4 }}
                  role={undefined}
                  dense
                  //   component={Link}
                  //   to={`/hazards/${p.cr4de_risk_file.cr4de_riskfilesid}`}
                  //   target="_blank"
                >
                  <ListItemAvatar>
                    <Avatar>{roleLetter(p.cr4de_role)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${p.cr4de_contact?.firstname} ${p.cr4de_contact?.lastname}`}
                    secondary={p.cr4de_contact?.emailaddress1}
                  />
                  <ParticipationStepper contact={p.cr4de_contact} participation={p} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      )}

      {/* <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
          },
        }}
      >
        <MenuItem
          onClick={async () => {
            handleClose();
            setIsLoading(true);

            await sendInvitation([contact]);

            setIsLoading(false);
          }}
        >
          Resend Invitation Email
        </MenuItem>
        <MenuItem onClick={() => deleteContact(contact)}>Delete</MenuItem>
      </Menu> */}
    </>
  );
}
