import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function SideDrawer({
  open,
  width,
  onClose,
}: {
  open: boolean;
  width: number;
  onClose: () => void;
}) {
  return (
    <Drawer
      open={open}
      sx={{
        width: width,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: width,
          boxSizing: "border-box",
        },
      }}
      onClose={onClose}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/validation" onClick={onClose}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Risk File Editor" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/validation" onClick={onClose}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Validation" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/analysisA" onClick={onClose}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Analysis A" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/analysisA" onClick={onClose}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Analysis B" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/analysisA" onClick={onClose}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Consensus" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/reporting" onClick={onClose}>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Results Overview" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/analysis/averager"
              onClick={onClose}
            >
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Result Averager" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/analysis/calculator"
              onClick={onClose}
            >
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Risk Calculator" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
