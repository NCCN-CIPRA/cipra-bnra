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

export default function PrioritiesListItem({ riskFile }: { riskFile: SelectableRiskFile }) {
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
        <ListItemButton role={undefined} component={Link} to={`/hazards/${riskFile.cr4de_riskfilesid}`} target="_blank">
          <ListItemAvatar>
            <Avatar sx={{ fontSize: 12 }}>{riskFile.cr4de_hazard_id}</Avatar>
          </ListItemAvatar>
          <ListItemText primary={riskFile.cr4de_title} secondary={riskFile.cr4de_risk_type} />
        </ListItemButton>
      </ListItem>

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
