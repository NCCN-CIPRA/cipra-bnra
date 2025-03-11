import { useEffect, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { DVRiskFile, RISK_TYPE } from "../types/dataverse/DVRiskFile";
import { SmallRisk } from "../types/dataverse/DVSmallRisk";
import { DataTable } from "../hooks/useAPI";
import { DVRiskCascade } from "../types/dataverse/DVRiskCascade";
import useLazyRecords from "../hooks/useLazyRecords";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Box,
  Drawer,
  Toolbar,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import AodIcon from "@mui/icons-material/Aod";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PsychologyIcon from "@mui/icons-material/Psychology";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { RiskPageContext } from "./BaseRisksPage";
import usePageTitle from "../hooks/usePageTitle";
import useBreadcrumbs from "../hooks/useBreadcrumbs";
import { useTranslation } from "react-i18next";
import satisfies from "../types/satisfies";
import { DVDirectAnalysis } from "../types/dataverse/DVDirectAnalysis";
import { DVCascadeAnalysis } from "../types/dataverse/DVCascadeAnalysis";
import { DVContact } from "../types/dataverse/DVContact";
import { DVParticipation } from "../types/dataverse/DVParticipation";
import NCCNLoader from "../components/NCCNLoader";
import { DVAttachment } from "../types/dataverse/DVAttachment";
import { styled } from "@mui/material/styles";
import HelpSideBar from "./RiskAnalysisPage/HelpSiderBar";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

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

export interface RiskFilePageContext extends RiskPageContext {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;

  riskFile: DVRiskFile;
  // calculation: RiskCalculation;
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
}

export default function BaseRiskFilePage() {
  const { t } = useTranslation();
  const riskContext = useOutletContext<RiskPageContext>();
  const navigate = useNavigate();

  const params = useParams() as RouteParams;
  const { pathname } = useLocation();

  const [isEditing, setIsEditing] = useState(false);

  const user = riskContext.user;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const { data: participants, getData: loadParticipants } = useLazyRecords<
    DVParticipation<DVContact>
  >({
    table: DataTable.PARTICIPATION,
    query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_contact`,
  });

  const { data: directAnalyses, getData: loadDirectAnalyses } = useLazyRecords<
    DVDirectAnalysis<unknown, DVContact>
  >({
    table: DataTable.DIRECT_ANALYSIS,
    query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_expert($select=emailaddress1)`,
  });

  const { data: cascadeAnalyses, getData: loadCascadeAnalyses } =
    useLazyRecords<DVCascadeAnalysis<unknown, unknown, DVContact>>({
      table: DataTable.CASCADE_ANALYSIS,
      query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_expert($select=emailaddress1)`,
    });

  const { data: attachments, getData: loadAttachments } = useLazyRecords<
    DVAttachment<unknown, DVAttachment>
  >({
    table: DataTable.ATTACHMENT,
    query: `$filter=_cr4de_risk_file_value eq ${params.risk_file_id}&$expand=cr4de_referencedSource`,
  });

  let tab = 0;
  const extraTab =
    riskContext.riskFiles[params.risk_file_id] &&
    riskContext.riskFiles[params.risk_file_id].cr4de_risk_type !==
      RISK_TYPE.EMERGING
      ? 1
      : 0;
  if (pathname.indexOf("identification") >= 0) tab = 1;
  if (pathname.indexOf("analysis") >= 0) tab = 2;
  if (pathname.indexOf("evolution") >= 0) tab = 3;
  if (pathname.indexOf("data") >= 0) tab = 3 + extraTab;
  if (pathname.indexOf("input") >= 0) tab = 4 + extraTab;

  useEffect(() => {
    riskContext.loadRiskFile({ id: params.risk_file_id });
  }, [params.risk_file_id]);

  usePageTitle(
    riskContext.riskFiles[params.risk_file_id]
      ? riskContext.riskFiles[params.risk_file_id].cr4de_title
      : "..."
  );
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    {
      name: t("sideDrawer.hazardCatalogue", "Hazard Catalogue"),
      url: "/risks",
    },
    {
      name: riskContext.riskFiles[params.risk_file_id]
        ? t(
            `risk.${
              riskContext.riskFiles[params.risk_file_id].cr4de_hazard_id
            }.name`,
            riskContext.riskFiles[params.risk_file_id].cr4de_title
          )
        : "...",
      url: "",
    },
  ]);

  return (
    <Box sx={{ display: "flex" }}>
      <Main>
        {riskContext.riskFiles[params.risk_file_id] ? (
          <Outlet
            context={satisfies<RiskFilePageContext>({
              ...riskContext,
              isEditing,
              setIsEditing,

              riskFile: riskContext.riskFiles[params.risk_file_id],
              // calculation: riskContext.riskFiles[params.risk_file_id].cr4de_latest_calculation?.cr4de_results!,
              causes: riskContext.cascades[params.risk_file_id].causes,
              effects: riskContext.cascades[params.risk_file_id].effects,
              catalyzingEffects:
                riskContext.cascades[params.risk_file_id].catalyzingEffects,
              climateChange:
                riskContext.cascades[params.risk_file_id].climateChange,

              participants,
              loadParticipants,
              directAnalyses,
              loadDirectAnalyses,
              cascadeAnalyses,
              loadCascadeAnalyses,
              attachments,
              loadAttachments,
            })}
          />
        ) : (
          <Box sx={{ width: "100%", mt: 20, textAlign: "center" }}>
            <NCCNLoader />
          </Box>
        )}
        {riskContext.user && (
          <Paper
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1201,
            }}
            elevation={3}
          >
            <BottomNavigation showLabels value={tab}>
              <BottomNavigationAction
                label={t("risk.bottombar.summary", "Summary")}
                icon={<AodIcon />}
                onClick={() => navigate(`/risks/${params.risk_file_id}`)}
              />
              {user && user.roles.beReader && (
                <BottomNavigationAction
                  label={t(
                    "risk.bottombar.riskIdentification",
                    "Risk Identification"
                  )}
                  icon={<FingerprintIcon />}
                  onClick={() =>
                    navigate(`/risks/${params.risk_file_id}/identification`)
                  }
                />
              )}
              {user && user.roles.beReader && (
                <BottomNavigationAction
                  label={t("risk.bottombar.riskAnalysis", "Risk Analysis")}
                  icon={<AssessmentIcon />}
                  onClick={() =>
                    navigate(`/risks/${params.risk_file_id}/analysis`)
                  }
                />
              )}
              {user &&
                user.roles.beReader &&
                riskContext.riskFiles[params.risk_file_id] &&
                riskContext.riskFiles[params.risk_file_id].cr4de_risk_type ===
                  RISK_TYPE.STANDARD && (
                  <BottomNavigationAction
                    label={t("risk.bottombar.riskEvolution", "Risk Evolution")}
                    icon={<QueryStatsIcon />}
                    onClick={() =>
                      navigate(`/risks/${params.risk_file_id}/evolution`)
                    }
                  />
                )}
              {user &&
                (user.roles.analist ||
                  (user.roles.expert &&
                    user.participations &&
                    user.participations.find(
                      (p) => p._cr4de_risk_file_value === params.risk_file_id
                    ))) && (
                  <BottomNavigationAction
                    label={t("risk.bottombar.rawData", "Raw Data")}
                    icon={<PsychologyIcon />}
                    onClick={() =>
                      navigate(`/risks/${params.risk_file_id}/data`)
                    }
                  />
                )}
              {user && user.roles.analist && (
                <BottomNavigationAction
                  label={t("risk.bottombar.expertInput", "Expert Input")}
                  icon={<GroupsIcon />}
                  onClick={() =>
                    navigate(`/risks/${params.risk_file_id}/input`)
                  }
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
          pointerEvents: "none",
        }}
        variant="persistent"
        anchor="right"
        open={false}
      >
        <Toolbar />
        <HelpSideBar focused={undefined} />
        {/* <BottomNavigation /> */}
      </Drawer>
    </Box>
  );
}
