import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import useRecords from "../hooks/useRecords";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import { DVAnalysisRun, RiskCalculation } from "../types/dataverse/DVAnalysisRun";
import { SmallRisk } from "../types/dataverse/DVSmallRisk";
import { DataTable } from "../hooks/useAPI";
import useLazyRecord from "../hooks/useLazyRecord";
import { DVRiskCascade } from "../types/dataverse/DVRiskCascade";
import useLazyRecords from "../hooks/useLazyRecords";
import {
  BottomNavigation,
  BottomNavigationAction,
  CircularProgress,
  Paper,
  Box,
  IconButton,
  Drawer,
  Fab,
  Toolbar,
  Typography,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import AodIcon from "@mui/icons-material/Aod";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PsychologyIcon from "@mui/icons-material/Psychology";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { RiskPageContext } from "./BaseRisksPage";
import { Breadcrumb } from "../components/BreadcrumbNavigation";
import usePageTitle from "../hooks/usePageTitle";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import { useTranslation } from "react-i18next";
import useBottomBarHeight from "../hooks/useBottomBarHeight";
import { getCauses } from "../functions/cascades";
import satisfies from "../types/satisfies";
import { DVDirectAnalysis } from "../types/dataverse/DVDirectAnalysis";
import { DVCascadeAnalysis } from "../types/dataverse/DVCascadeAnalysis";
import { DVContact } from "../types/dataverse/DVContact";
import { DVParticipation } from "../types/dataverse/DVParticipation";
import NCCNLoader from "../components/NCCNLoader";
import { DVAttachment } from "../types/dataverse/DVAttachment";
import { styled, useTheme } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CloseIcon from "@mui/icons-material/Close";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import HelpSideBar, { Section } from "./RiskAnalysisPage/HelpSiderBar";

type RouteParams = {
  risk_file_id: string;
};

const helpDrawerWidth = 400;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: `-${helpDrawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
  /**
   * This is necessary to enable the selection of content. In the DOM, the stacking order is determined
   * by the order of appearance. Following this rule, elements appearing later in the markup will overlay
   * those that appear earlier. Since the Drawer comes after the Main content, this adjustment ensures
   * proper interaction with the underlying content.
   */
  position: "relative",
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${helpDrawerWidth}px)`,
    marginLeft: `${helpDrawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export interface RiskFilePageContext extends RiskPageContext {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;

  riskFile: DVRiskFile;
  calculation: RiskCalculation;
  causes: DVRiskCascade<SmallRisk>[];
  effects: DVRiskCascade<unknown, SmallRisk>[];
  catalyzingEffects: DVRiskCascade<SmallRisk>[];
  climateChange: DVRiskCascade<SmallRisk> | null;

  participants: DVParticipation<DVContact>[] | null;
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[] | null;
  cascadeAnalyses: DVCascadeAnalysis<unknown, unknown, DVContact>[] | null;
  attachments: DVAttachment<unknown, DVAttachment>[] | null;

  loadParticipants: () => Promise<unknown>;
  loadDirectAnalyses: () => Promise<unknown>;
  loadCascadeAnalyses: () => Promise<unknown>;
  loadAttachments: () => Promise<unknown>;

  helpOpen: boolean;
  setHelpFocus: (section: Section) => void;
}

export default function BaseRiskFilePage() {
  const { t } = useTranslation();
  const riskContext = useOutletContext<RiskPageContext>();
  const navigate = useNavigate();
  const theme = useTheme();

  const params = useParams() as RouteParams;
  const location = useLocation();

  const [isEditing, setIsEditing] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpFocus, setHelpFocus] = useState<Section | undefined>();

  const handleDrawerOpen = () => {
    setHelpOpen(true);
  };

  const handleDrawerClose = () => {
    setHelpOpen(false);
  };

  const { data: participants, getData: loadParticipants } = useLazyRecords<DVParticipation<DVContact>>({
    table: DataTable.PARTICIPATION,
    query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_contact`,
  });

  const { data: directAnalyses, getData: loadDirectAnalyses } = useLazyRecords<DVDirectAnalysis<unknown, DVContact>>({
    table: DataTable.DIRECT_ANALYSIS,
    query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_expert($select=emailaddress1)`,
  });

  const { data: cascadeAnalyses, getData: loadCascadeAnalyses } = useLazyRecords<
    DVCascadeAnalysis<unknown, unknown, DVContact>
  >({
    table: DataTable.CASCADE_ANALYSIS,
    query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_expert($select=emailaddress1)`,
  });

  const { data: attachments, getData: loadAttachments } = useLazyRecords<DVAttachment<unknown, DVAttachment>>({
    table: DataTable.ATTACHMENT,
    query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_referencedSource`,
  });

  let tab = 0;
  if (location.pathname.indexOf("identification") >= 0) tab = 1;
  if (location.pathname.indexOf("analysis") >= 0) tab = 2;
  if (location.pathname.indexOf("data") >= 0) tab = 3;
  if (location.pathname.indexOf("input") >= 0) tab = 4;

  useEffect(() => {
    riskContext.loadRiskFile({ id: params.risk_file_id });
  }, [params.risk_file_id]);

  usePageTitle(
    riskContext.riskFiles[params.risk_file_id] ? riskContext.riskFiles[params.risk_file_id].cr4de_title : "..."
  );
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    { name: t("sideDrawer.hazardCatalogue", "Hazard Catalogue"), url: "/risks" },
    {
      name: riskContext.riskFiles[params.risk_file_id] ? riskContext.riskFiles[params.risk_file_id].cr4de_title : "...",
      url: "",
    },
  ]);

  useBottomBarHeight(riskContext.user ? 56 : 0);

  return (
    <Box sx={{ display: "flex" }}>
      <Main open={helpOpen}>
        {riskContext.riskFiles[params.risk_file_id] ? (
          <Outlet
            context={satisfies<RiskFilePageContext>({
              ...riskContext,
              isEditing,
              setIsEditing,

              riskFile: riskContext.riskFiles[params.risk_file_id],
              calculation: riskContext.riskFiles[params.risk_file_id].cr4de_latest_calculation?.cr4de_results!,
              causes: riskContext.cascades[params.risk_file_id].causes,
              effects: riskContext.cascades[params.risk_file_id].effects,
              catalyzingEffects: riskContext.cascades[params.risk_file_id].catalyzingEffects,
              climateChange: riskContext.cascades[params.risk_file_id].climateChange,

              participants,
              loadParticipants,
              directAnalyses,
              loadDirectAnalyses,
              cascadeAnalyses,
              loadCascadeAnalyses,
              attachments,
              loadAttachments,

              helpOpen,
              setHelpFocus,
            })}
          />
        ) : (
          <Box sx={{ width: "100%", mt: 20, textAlign: "center" }}>
            <NCCNLoader />
          </Box>
        )}
        {riskContext.user && (
          <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1201 }} elevation={3}>
            <BottomNavigation showLabels value={tab}>
              <BottomNavigationAction
                label="Summary"
                icon={<AodIcon />}
                onClick={() => navigate(`/risks/${params.risk_file_id}`)}
              />
              {riskContext.user && riskContext.user.admin && (
                <BottomNavigationAction
                  label="Risk Identification"
                  icon={<FingerprintIcon />}
                  onClick={() => navigate(`/risks/${params.risk_file_id}/identification`)}
                />
              )}
              <BottomNavigationAction
                label="Risk Analysis"
                icon={<AssessmentIcon />}
                onClick={() => navigate(`/risks/${params.risk_file_id}/analysis`)}
              />
              {riskContext.user && riskContext.user.admin && (
                <BottomNavigationAction
                  label="Raw Data"
                  icon={<PsychologyIcon />}
                  onClick={() => navigate(`/risks/${params.risk_file_id}/data`)}
                />
              )}
              {riskContext.user && riskContext.user.admin && (
                <BottomNavigationAction
                  label="Expert Input"
                  icon={<GroupsIcon />}
                  onClick={() => navigate(`/risks/${params.risk_file_id}/input`)}
                />
              )}
            </BottomNavigation>
          </Paper>
        )}
      </Main>
      <Drawer
        sx={{
          width: helpDrawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: helpDrawerWidth,
            boxSizing: "border-box",
          },
          position: "relative",
          pointerEvents: helpOpen ? "all" : "none",
        }}
        variant="persistent"
        anchor="right"
        open={helpOpen}
      >
        <Toolbar />
        <HelpSideBar focused={helpFocus} />
        <IconButton sx={{ position: "absolute", top: 60, right: 0 }} onClick={handleDrawerClose}>
          <CloseIcon />
        </IconButton>
        {/* <BottomNavigation /> */}
      </Drawer>

      <Fab color="primary" onClick={handleDrawerOpen} sx={{ position: "fixed", bottom: 62, right: 5 }}>
        <QuestionMarkIcon />
      </Fab>
    </Box>
  );
}
