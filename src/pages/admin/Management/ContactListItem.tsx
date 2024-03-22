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
  ListItemSecondaryAction,
} from "@mui/material";
import ParticipationStepper from "./ParticipationStepper";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useAPI from "../../../hooks/useAPI";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";

export default function ContactListItem({
  index,
  contact,
  sendInvitation,
  reloadData,
  selectContact,
}: {
  index: number;
  contact: SelectableContact;
  sendInvitation: (to: SelectableContact[]) => Promise<void>;
  reloadData: () => Promise<void>;
  selectContact: (c: SelectableContact) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const api = useAPI();

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDeleteParticipation = async (p: DVParticipation<unknown, unknown>) => {
    if (window.confirm("Are you sure you wish to delete this participation?")) {
      setIsLoading(true);

      await api.deleteParticipant(p.cr4de_bnraparticipationid);
      await reloadData();

      setIsLoading(false);
    }
  };

  const deleteContact = async (c: SelectableContact) => {
    if (
      window.confirm(
        `Are you sure you wish to delete this contact (${c.emailaddress1}) and all their participations (${c.participations.length})?`
      )
    ) {
      setIsLoading(true);
      handleClose();

      await Promise.all([
        ...c.participations?.map((p) => api.deleteParticipant(p.cr4de_bnraparticipationid)),
        api.deleteContact(c.contactid),
      ]);

      await reloadData();

      setIsLoading(false);
    }
  };

  return (
    <>
      <ListItem
        key={contact.contactid}
        component="div"
        disablePadding
        secondaryAction={
          isLoading ? (
            <CircularProgress size={20} />
          ) : (
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? "long-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
          )
        }
      >
        <ListItemButton role={undefined} onClick={() => selectContact(contact)}>
          <ListItemIcon>
            <Checkbox edge="start" checked={contact.selected} tabIndex={-1} disableRipple />
          </ListItemIcon>
          <ListItemText primary={`${contact.firstname} ${contact.lastname}`} secondary={`${contact.emailaddress1}`} />
        </ListItemButton>
      </ListItem>
      {contact.participations && contact.participations.length > 0 && (
        <List component="div" disablePadding>
          {contact.participations
            .sort((a, b) => a.cr4de_risk_file.cr4de_hazard_id.localeCompare(b.cr4de_risk_file.cr4de_hazard_id))
            .map((p) => (
              <ListItem
                key={p.cr4de_bnraparticipationid}
                secondaryAction={
                  <IconButton disabled={isLoading} onClick={() => handleDeleteParticipation(p)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemButton
                  sx={{ pl: 4 }}
                  role={undefined}
                  dense
                  component={Link}
                  to={`/hazards/${p.cr4de_risk_file.cr4de_riskfilesid}`}
                  target="_blank"
                >
                  <ListItemAvatar>
                    <Avatar sx={{ fontSize: 12 }}>{p.cr4de_risk_file.cr4de_hazard_id}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={p.cr4de_risk_file.cr4de_title} secondary={p.cr4de_role} />
                  <ParticipationStepper contact={contact} participation={p} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      )}

      <Menu
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
        <MenuItem
          onClick={async () => {
            await api.updateContact(contact.contactid, {
              "ownerid@odata.bind": "/systemusers(412a1781-de11-ea11-a816-000d3aba9502)",
              // "owninguser@odata.value": "/systemusers(412a1781-de11-ea11-a816-000d3aba9502)",
            });
          }}
        >
          Take ownership
        </MenuItem>
        <MenuItem onClick={() => deleteContact(contact)}>Delete</MenuItem>
      </Menu>
    </>
  );
}
