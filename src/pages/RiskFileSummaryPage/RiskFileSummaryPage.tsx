import { useOutletContext } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import { Avatar, Box, Container, Fab, Stack, Tooltip, Typography } from "@mui/material";
import AppContext from "../../functions/AppContext";
import getCategoryColor from "../../functions/getCategoryColor";
import SummaryCharts from "../../components/charts/SummaryCharts";
import { getWorstCaseScenario } from "../../functions/scenarios";
import useAPI from "../../hooks/useAPI";
import TextInputBox from "../../components/TextInputBox";
import { AuthPageContext } from "../AuthPage";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useTranslation } from "react-i18next";

export default function RiskFileSummaryPage({}) {
  const api = useAPI();
  const { i18n } = useTranslation();
  const { user, riskFile, reloadRiskFile, calculation } = useOutletContext<RiskFilePageContext>();

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
    <Container>
      <Typography variant="h2">{riskFile.cr4de_title}</Typography>
      <Stack direction="row" sx={{ mb: 8, mt: 2 }} columnGap={4}>
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" sx={{ mt: 1 }} columnGap={1}>
            {labels.map((l) => (
              <Tooltip key={l.name} title={l.name}>
                <Avatar sx={{ bgcolor: l.color, fontSize: 14 }}>{l.label}</Avatar>
              </Tooltip>
            ))}
          </Stack>
          {!editing && i18n.language === "en" && (
            <Box
              className="htmleditor"
              sx={{ my: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
              dangerouslySetInnerHTML={{ __html: summary }}
            />
          )}
          {!editing && i18n.language === "nl" && (
            <Box
              className="htmleditor"
              sx={{ my: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
              dangerouslySetInnerHTML={{ __html: summaryNL }}
            />
          )}
          {!editing && i18n.language === "fr" && (
            <Box
              className="htmleditor"
              sx={{ my: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
              dangerouslySetInnerHTML={{ __html: summaryFR }}
            />
          )}
          {!editing && i18n.language === "de" && (
            <Box
              className="htmleditor"
              sx={{ my: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
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
                />
              </Box>
              <Box sx={{ my: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}>
                <Typography variant="h6">Nederlands</Typography>
                <TextInputBox
                  limitedOptions
                  initialValue={summaryNL}
                  setUpdatedValue={(str) => setSummaryNL(str || "")}
                  height="600"
                />
              </Box>
              <Box sx={{ my: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}>
                <Typography variant="h6">Français</Typography>
                <TextInputBox
                  limitedOptions
                  initialValue={summaryFR}
                  setUpdatedValue={(str) => setSummaryFR(str || "")}
                  height="600"
                />
              </Box>
              <Box sx={{ my: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}>
                <Typography variant="h6">Deutsh</Typography>
                <TextInputBox
                  limitedOptions
                  initialValue={summaryDE}
                  setUpdatedValue={(str) => setSummaryDE(str || "")}
                  height="600"
                />
              </Box>
            </>
          )}
        </Box>
        <Box sx={{ bgcolor: "white" }}>
          <SummaryCharts riskFile={riskFile} calculation={calculation} scenario={getWorstCaseScenario(calculation)} />
        </Box>
      </Stack>
      {user && user.roles.admin && (
        <Box sx={{ position: "fixed", bottom: 96, right: 40 }}>
          {!editing && (
            <Fab color="secondary" aria-label="edit" onClick={() => setEditing(true)}>
              <EditIcon />
            </Fab>
          )}
          {editing && (
            <Fab color="secondary" aria-label="edit" onClick={() => saveRiskFile()}>
              <SaveIcon />
            </Fab>
          )}
        </Box>
      )}
    </Container>
  );
}
