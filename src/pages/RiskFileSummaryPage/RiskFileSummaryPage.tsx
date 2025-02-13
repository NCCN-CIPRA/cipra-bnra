import { useNavigate, useOutletContext } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import {
  Avatar,
  Box,
  Container,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AppContext from "../../functions/AppContext";
import getCategoryColor, { CategoryIcon, RiskTypeIcon } from "../../functions/getCategoryColor";
import SummaryCharts from "../../components/charts/SummaryCharts";
import { getWorstCaseScenario, SCENARIOS } from "../../functions/scenarios";
import useAPI from "../../hooks/useAPI";
import TextInputBox from "../../components/TextInputBox";
import { AuthPageContext } from "../AuthPage";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { useTranslation } from "react-i18next";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import RiskFileTitle from "../../components/RiskFileTitle";
import BNRASpeedDial from "../../components/BNRASpeedDial";
import RiskFileSummaryTutorial from "./RiskFileSummaryTutorial";
import { getLanguage } from "../../functions/translations";

export default function RiskFileSummaryPage({}) {
  const api = useAPI();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, riskFile, reloadRiskFile } = useOutletContext<RiskFilePageContext>();

  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [summary, setSummary] = useState(riskFile.cr4de_mrs_summary || "<h6>Not available</h6>");
  const [summaryNL, setSummaryNL] = useState(riskFile.cr4de_mrs_summary_nl || "<h6>Not available</h6>");
  const [summaryFR, setSummaryFR] = useState(riskFile.cr4de_mrs_summary_fr || "<h6>Not available</h6>");
  const [summaryDE, setSummaryDE] = useState(riskFile.cr4de_mrs_summary_de || "<h6>Not available</h6>");

  const labels: { name: string; label: string; color: string }[] = [
    {
      name: `${riskFile.cr4de_risk_category} risk`,
      label: riskFile.cr4de_risk_category[0],
      color: getCategoryColor(riskFile.cr4de_risk_category),
    },
    ...(riskFile.cr4de_label_hilp
      ? [{ name: "High Impact, Low Probability Risk", label: "HILP", color: "green" }]
      : []),
    ...(riskFile.cr4de_label_cc
      ? [{ name: "Risk will be influenced by climate change", label: "CC", color: "orange" }]
      : []),
    ...(riskFile.cr4de_label_cb
      ? [{ name: "Risk with substantial cross-border impact", label: "CB", color: "blue" }]
      : []),
    ...(riskFile.cr4de_label_impact
      ? [{ name: `Risk has primarily ${riskFile.cr4de_label_impact.toLowerCase()} impact`, label: "CB", color: "blue" }]
      : []),
  ];

  const saveRiskFile = async () => {
    setSaving(true);
    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      cr4de_mrs_summary: summary,
      cr4de_mrs_summary_nl: summaryNL,
      cr4de_mrs_summary_fr: summaryFR,
      cr4de_mrs_summary_de: summaryDE,
    });
    await reloadRiskFile({ id: riskFile.cr4de_riskfilesid });

    setEditing(false);
    setSaving(false);
  };
 
  return (
    <Container sx={{ mt: 2, pb: 8 }}>
      <RiskFileTitle riskFile={riskFile} />
      <Stack direction="row" sx={{ mb: 8 }} columnGap={4}>
        <Box id="summary-text" sx={{ flex: 1 }}>
          {!editing && getLanguage(i18n.language) === "en" && (
            <Box
              className="htmleditor"
              sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          )}
          {!editing && getLanguage(i18n.language) === "nl" && (
            <Box
              className="htmleditor"
              sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
              dangerouslySetInnerHTML={{ __html: summaryNL }}
            />
          )}
          {!editing && getLanguage(i18n.language) === "fr" && (
            <Box
              className="htmleditor"
              sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
              dangerouslySetInnerHTML={{ __html: summaryFR }}
            />
          )}
          {!editing && getLanguage(i18n.language) === "de" && (
            <Box
              className="htmleditor"
              sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
              dangerouslySetInnerHTML={{ __html: summaryDE }}
            />
          )}
          {editing && (
            <>
              <Box sx={{ my: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}>
                <Typography variant="h6">English</Typography>
                <TextInputBox
                  limitedOptions
                  initialValue={summary}
                  setUpdatedValue={(str) => setSummary(str || "")}
                  height="600"
                  editorStyle={{ backgroundColor: "white" }}
                />
              </Box>
              <Box sx={{ my: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}>
                <Typography variant="h6">Nederlands</Typography>
                <TextInputBox
                  limitedOptions
                  initialValue={summaryNL}
                  setUpdatedValue={(str) => setSummaryNL(str || "")}
                  height="600"
                  editorStyle={{ backgroundColor: "white" }}
                />
              </Box>
              <Box sx={{ my: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}>
                <Typography variant="h6">Français</Typography>
                <TextInputBox
                  limitedOptions
                  initialValue={summaryFR}
                  setUpdatedValue={(str) => setSummaryFR(str || "")}
                  height="600"
                  editorStyle={{ backgroundColor: "white" }}
                />
              </Box>
              <Box sx={{ my: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}>
                <Typography variant="h6">Deutsh</Typography>
                <TextInputBox
                  limitedOptions
                  initialValue={summaryDE}
                  setUpdatedValue={(str) => setSummaryDE(str || "")}
                  height="600"
                  editorStyle={{ backgroundColor: "white" }}
                />
              </Box>
            </>
          )}
        </Box>
        {riskFile.cr4de_risk_type !== RISK_TYPE.EMERGING && (
          <Box>
            <Box id="summary-charts" sx={{ bgcolor: "white" }}>
              <SummaryCharts
                riskFile={riskFile}
                scenario={riskFile.cr4de_mrs || SCENARIOS.MAJOR}
                manmade={riskFile.cr4de_risk_type === RISK_TYPE.MANMADE}
                canDownload={Boolean(user && user.roles.internal)}
              />
            </Box>
          </Box>
        )}
      </Stack>
      {user && (
        <Box sx={{ position: "fixed", bottom: 96, right: 40 }}>
          {!editing && (
            <BNRASpeedDial
              offset={{ x: 0, y: 56 }}
              editAction={() => setEditing(true)}
              exportAction={() => navigate(`/risks/${riskFile.cr4de_riskfilesid}/export`)}
              HelpComponent={RiskFileSummaryTutorial}
            />
          )}
          {editing && user.roles.admin && (
            <SpeedDial
              ariaLabel="BNRA Speeddial"
              sx={{ position: "fixed", bottom: 72, right: 16 }}
              icon={<SpeedDialIcon />}
            >
              <SpeedDialAction
                icon={<CancelIcon />}
                tooltipTitle={"Cancel"}
                onClick={() => {
                  if (!window.confirm("This will erase all your changes. Are you sure?")) return;

                  setSummary(riskFile.cr4de_mrs_summary || "<h6>Not available</h6>");
                  setSummaryNL(riskFile.cr4de_mrs_summary_nl || "<h6>Not available</h6>");
                  setSummaryFR(riskFile.cr4de_mrs_summary_fr || "<h6>Not available</h6>");
                  setSummaryDE(riskFile.cr4de_mrs_summary_de || "<h6>Not available</h6>");
                  setEditing(false);
                }}
              />
              <SpeedDialAction icon={<SaveIcon />} tooltipTitle={"Save Page"} onClick={() => saveRiskFile()} />
            </SpeedDial>
          )}
        </Box>
      )}
    </Container>
  );
}
