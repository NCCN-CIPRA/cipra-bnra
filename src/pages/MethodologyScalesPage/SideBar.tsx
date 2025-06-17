import {
  styled,
  Theme,
  CSSObject,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Drawer as MuiDrawer,
  Divider,
  List,
  ListItemText,
  Tooltip,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// eslint-disable-next-line react-refresh/only-export-components
export const sections = {
  probability: "probability",
  human: "impact-human",
  ha: "impact-human-ha",
  hb: "impact-human-hb",
  hc: "impact-human-hc",
  societal: "impact-societal",
  sa: "impact-societal-sa",
  sb: "impact-societal-sb",
  sc: "impact-societal-sc",
  sd: "impact-societal-sd",
  environmental: "impact-environmental",
  ea: "impact-environmental-ea",
  financial: "impact-financial",
  fa: "impact-financial-fa",
  fb: "impact-financial",
};

export default function SideBar({
  open,
  width,
  pageName,
  activeSection,
  handleDrawerToggle,
}: {
  open: boolean;
  width: number;
  pageName: string;
  activeSection: string | null;
  handleDrawerToggle: () => void;
}) {
  const { t } = useTranslation();

  const probability = [
    {
      title: t("methodology.scales.probability.title", "Probability"),
      id: sections.ha,
      inset: 1,
      letter: "P",
    },
  ];
  const human = [
    {
      title: t("learning.impact.ha.title", ""),
      id: sections.ha,
      inset: 1,
      letter: "Ha",
    },
    {
      title: t("learning.impact.hb.title", ""),
      id: sections.hb,
      inset: 1,
      letter: "Hb",
    },
    {
      title: t("learning.impact.hc.title", ""),
      id: sections.hc,
      inset: 1,
      letter: "Hc",
    },
  ];
  const societal = [
    {
      title: t("learning.impact.sa.title", ""),
      id: sections.sa,
      inset: 1,
      letter: "Sa",
    },
    {
      title: t("learning.impact.sb.title", ""),
      id: sections.sb,
      inset: 1,
      letter: "Sb",
    },
    {
      title: t("learning.impact.sc.title", ""),
      id: sections.sc,
      inset: 1,
      letter: "Sc",
    },
    {
      title: t("learning.impact.sd.title", ""),
      id: sections.sd,
      inset: 1,
      letter: "Sd",
    },
  ];
  const environmental = [
    {
      title: t("learning.impact.ea.title", ""),
      id: sections.ea,
      inset: 1,
      letter: "Ea",
    },
  ];
  const financial = [
    {
      title: t("learning.impact.fa.title", ""),
      id: sections.fa,
      inset: 1,
      letter: "Fa",
    },
    {
      title: t("learning.impact.fb.title", ""),
      id: sections.fb,
      inset: 1,
      letter: "Fb",
    },
  ];

  const openedMixin = (theme: Theme): CSSObject => ({
    width,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    width,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));

  return (
    <Drawer variant="permanent" open={open} anchor="right">
      <ListItem disablePadding sx={{ display: "block", marginTop: "64px" }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: open ? 1 : 2.5,
          }}
          onClick={handleDrawerToggle}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
            }}
          >
            {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
      <Divider />
      <List dense>
        {open && (
          <ListItem>
            <ListItemText
              primary={t("methodology.scales.probability", "Probability")}
              slotProps={{ primary: { style: { fontWeight: "bold" } } }}
            />
          </ListItem>
        )}
        {probability.map(({ title, id, letter, inset }) => (
          <ListItem
            key={id}
            disablePadding
            sx={{ display: "block", whiteSpace: "normal" }}
          >
            {open ? (
              <ListItemButton component={Link} to={`/learning/${id}`}>
                <ListItemText
                  secondary={title}
                  sx={{ opacity: open ? 1 : 0, ml: inset ? 4 : 2 }}
                  slotProps={{
                    secondary: {
                      style:
                        pageName === id
                          ? { fontWeight: "bold", color: "primary" }
                          : {},
                    },
                  }}
                />
              </ListItemButton>
            ) : (
              <Tooltip title={title}>
                <ListItemButton
                  sx={{
                    // minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  component={Link}
                  to={`/learning/${id}`}
                >
                  <Avatar
                    sx={{
                      bgcolor: pageName === id ? "rgb(0, 164, 154)" : undefined,
                      width: 32,
                      height: 32,
                    }}
                  >
                    {letter || title[0]}
                  </Avatar>
                </ListItemButton>
              </Tooltip>
            )}
          </ListItem>
        ))}
      </List>
      <Divider />
      <List dense>
        {open && (
          <ListItem>
            <ListItemText
              primary={t("learning.impact.h.title", "")}
              slotProps={{ primary: { style: { fontWeight: "bold" } } }}
            />
          </ListItem>
        )}
        {human.map(({ title, id, letter, inset }) => (
          <ListItem
            key={id}
            disablePadding
            sx={{ display: "block", whiteSpace: "normal" }}
          >
            {open ? (
              <ListItemButton component={Link} to={`/learning/${id}`}>
                <ListItemText
                  secondary={title}
                  sx={{ opacity: open ? 1 : 0, ml: inset ? 4 : 2 }}
                  slotProps={{
                    secondary:
                      activeSection === id
                        ? { fontWeight: "bold", color: "primary" }
                        : {},
                  }}
                />
              </ListItemButton>
            ) : (
              <Tooltip title={title}>
                <ListItemButton
                  sx={{
                    // minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  component={Link}
                  to={`/learning/${id}`}
                >
                  <Avatar
                    sx={{
                      bgcolor: pageName === id ? "rgb(0, 164, 154)" : undefined,
                      width: 32,
                      height: 32,
                    }}
                  >
                    {letter || title[0]}
                  </Avatar>
                </ListItemButton>
              </Tooltip>
            )}
          </ListItem>
        ))}
      </List>
      <Divider />
      <List dense>
        {open && (
          <ListItem>
            <ListItemText
              primary={t("learning.impact.s.title", "")}
              slotProps={{ primary: { style: { fontWeight: "bold" } } }}
            />
          </ListItem>
        )}
        {societal.map(({ title, id, letter, inset }) => (
          <ListItem
            key={id}
            disablePadding
            sx={{ display: "block", whiteSpace: "normal" }}
          >
            {open ? (
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,

                    justifyContent: "initial",
                  },
                ]}
              >
                <ListItemText
                  secondary={title}
                  sx={{ opacity: open ? 1 : 0, ml: inset ? 4 : 2 }}
                  slotProps={{
                    secondary:
                      activeSection === id
                        ? { fontWeight: "bold", color: "primary" }
                        : {},
                  }}
                />
              </ListItemButton>
            ) : (
              <Tooltip title={title}>
                <ListItemButton
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Avatar
                    sx={{
                      bgcolor: pageName === id ? "rgb(0, 164, 154)" : undefined,
                      width: 32,
                      height: 32,
                    }}
                  >
                    {letter || title[0]}
                  </Avatar>
                </ListItemButton>
              </Tooltip>
            )}
          </ListItem>
        ))}
      </List>

      <Divider />
      <List dense>
        {open && (
          <ListItem>
            <ListItemText
              primary={t("learning.impact.e.title", "")}
              slotProps={{ primary: { style: { fontWeight: "bold" } } }}
            />
          </ListItem>
        )}
        {environmental.map(({ title, id, letter, inset }) => (
          <ListItem
            key={id}
            disablePadding
            sx={{ display: "block", whiteSpace: "normal" }}
          >
            {open ? (
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,

                    justifyContent: "initial",
                  },
                ]}
              >
                <ListItemText
                  secondary={title}
                  sx={{ opacity: open ? 1 : 0, ml: inset ? 4 : 2 }}
                  slotProps={{
                    secondary:
                      activeSection === id
                        ? { fontWeight: "bold", color: "primary" }
                        : {},
                  }}
                />
              </ListItemButton>
            ) : (
              <Tooltip title={title}>
                <ListItemButton
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Avatar
                    sx={{
                      bgcolor: pageName === id ? "rgb(0, 164, 154)" : undefined,
                      width: 32,
                      height: 32,
                    }}
                  >
                    {letter || title[0]}
                  </Avatar>
                </ListItemButton>
              </Tooltip>
            )}
          </ListItem>
        ))}
      </List>

      <Divider />
      <List dense>
        {open && (
          <ListItem>
            <ListItemText
              primary={t("learning.impact.f.title", "")}
              slotProps={{ primary: { style: { fontWeight: "bold" } } }}
            />
          </ListItem>
        )}
        {financial.map(({ title, id, letter, inset }) => (
          <ListItem
            key={id}
            disablePadding
            sx={{ display: "block", whiteSpace: "normal" }}
          >
            {open ? (
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,

                    justifyContent: "initial",
                  },
                ]}
              >
                <ListItemText
                  secondary={title}
                  sx={{ opacity: open ? 1 : 0, ml: inset ? 4 : 2 }}
                  slotProps={{
                    secondary:
                      activeSection === id
                        ? { fontWeight: "bold", color: "primary" }
                        : {},
                  }}
                />
              </ListItemButton>
            ) : (
              <Tooltip title={title}>
                <ListItemButton
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Avatar
                    sx={{
                      bgcolor: pageName === id ? "rgb(0, 164, 154)" : undefined,
                      width: 32,
                      height: 32,
                    }}
                  >
                    {letter || title[0]}
                  </Avatar>
                </ListItemButton>
              </Tooltip>
            )}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
