import { useState, useEffect } from "react";
import { DIRECT_ANALYSIS_QUANTI_FIELDS, DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import LoadingTab from "../LoadingTab";
import { Box, Card, Stack, CardContent, Typography, useTheme, Select, MenuItem, CardHeader } from "@mui/material";
import { DVContact } from "../../../types/dataverse/DVContact";
import TextInputBox from "../../../components/TextInputBox";
import { getAbsoluteImpact, getImpactScale } from "../../../functions/Impact";
import { getAbsoluteProbability, getProbabilityScale } from "../../../functions/Probability";

export default function Step2APage({
  riskFile,
  participants,
  directAnalyses,

  getDirectAnalyses,
}: {
  riskFile: DVRiskFile | null;
  participants: DVParticipation[] | null;
  directAnalyses: DVDirectAnalysis<unknown, DVContact>[] | null;

  getDirectAnalyses: () => Promise<void>;
}) {
  const theme = useTheme();
  const [scenario, setScenario] = useState("c");
  const [parameter, setParameter] = useState("dp");

  useEffect(() => {
    if (!directAnalyses) {
      getDirectAnalyses();
    }
  }, [riskFile]);

  if (!riskFile || directAnalyses === null) return <LoadingTab />;

  const qualiName = `cr4de_${parameter === "dp" ? "dp" : "di"}_quali${
    parameter !== "dp" ? "_" + parameter : ""
  }_${scenario}`;

  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            <Select value={scenario} sx={{ width: 300 }} onChange={(e) => setScenario(e.target.value)}>
              <MenuItem value={"c"}>Considerable Scenario</MenuItem>
              <MenuItem value={"m"}>Major Scenario</MenuItem>
              <MenuItem value={"e"}>Extreme Scenario</MenuItem>
            </Select>
            <Select value={parameter} sx={{ flex: 1 }} onChange={(e) => setParameter(e.target.value)}>
              <MenuItem value={"dp"}>Direct Probability</MenuItem>
              <MenuItem value={"h"}>Direct Human Impact</MenuItem>
              <MenuItem value={"s"}>Direct Societal Impact</MenuItem>
              <MenuItem value={"e"}>Direct Environmental Impact</MenuItem>
              <MenuItem value={"f"}>Direct Financial</MenuItem>
            </Select>
          </Stack>

          <TextInputBox initialValue={""} onSave={() => {}} setUpdatedValue={() => {}} disabled={false} />

          <Stack direction="column" sx={{ mt: 2 }}>
            {DIRECT_ANALYSIS_QUANTI_FIELDS.filter(
              (f) =>
                (f.indexOf("quanti_" + parameter) >= 0 || f.indexOf(parameter + "_quanti") >= 0) &&
                f.indexOf("_" + scenario) >= 0
            ).map((f) => {
              const validDAs = directAnalyses.filter((da) => da[f] != null);

              if (validDAs.length > 0) {
                const avg =
                  parameter === "dp"
                    ? getProbabilityScale(
                        validDAs.reduce((tot, da) => tot + getAbsoluteProbability(da[f] as string), 0) /
                          validDAs.length,
                        "DP"
                      )
                    : getImpactScale(
                        validDAs.reduce((tot, da) => tot + getAbsoluteImpact(da[f] as string), 0) / validDAs.length,
                        f
                          .replace("cr4de_di_quanti_", "")
                          .replace("_" + scenario, "")
                          .replace(parameter, parameter.toUpperCase())
                      );
                return <Box>{avg}</Box>;
              }
              return (
                <Stack direction="row" sx={{ mt: 2 }}>
                  <Box>{f}:</Box>
                  <Box>"-"</Box>
                </Stack>
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      {directAnalyses.map((da) => (
        <Card>
          <CardHeader subheader={da.cr4de_expert.emailaddress1} />
          <CardContent>
            <Box
              dangerouslySetInnerHTML={{ __html: (da[qualiName as keyof DVDirectAnalysis] || "") as string }}
              sx={{ mb: 2 }}
            />
            {DIRECT_ANALYSIS_QUANTI_FIELDS.filter(
              (f) => f.indexOf("quanti_" + parameter) >= 0 && f.indexOf("_" + scenario) >= 0
            ).map((f) => {
              return (
                <Stack direction="row">
                  <Box>{da[f]}</Box>
                </Stack>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
