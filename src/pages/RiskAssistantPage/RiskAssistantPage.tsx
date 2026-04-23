// import {
//   Box,
//   Card,
//   CardContent,
//   CardHeader,
//   Container,
//   TextField,
// } from "@mui/material";
// import { useOutletContext } from "react-router-dom";
// import { RiskFilePageContext } from "../BaseRiskFilePage";
// import RiskFileTitle from "../../components/RiskFileTitle";
// import BNRASpeedDial from "../../components/BNRASpeedDial";
// import handleExportRiskfile from "../../functions/export/exportBNRA";
// import useAPI, { DataTable } from "../../hooks/useAPI";
// import { BasePageContext } from "../BasePage";
// import { useQuery } from "@tanstack/react-query";
// import { Environment } from "../../types/global";
// import {
//   DVRiskCascade,
//   SerializedCPMatrix,
// } from "../../types/dataverse/DVRiskCascade";
// import {
//   DVRiskFile,
//   RiskFileQuantiInput,
//   SerializedRiskFileQuantiInput,
// } from "../../types/dataverse/DVRiskFile";
// import { RISK_TYPE, SerializedScenario } from "../../types/dataverse/Riskfile";
// import { IntensityParameter } from "../../functions/intensityParameters";
// import { CPMatrix } from "../../types/dataverse/DVCascadeSnapshot";

// function scenarioParams(scenario: SerializedScenario | null) {
//   if (!scenario) return "";

//   const s = JSON.parse(scenario) as IntensityParameter[];

//   return s
//     .map((ip) => `  - ${(ip.description || "").replace(/<[^>]+>/g, "")}`)
//     .join("\n");
// }
// function scenarioStr(scenario: SerializedScenario | null) {
//   if (!scenario) return "";

//   const s = JSON.parse(scenario) as IntensityParameter[];

//   return s
//     .map((ip) => `  - ${ip.name}: ${(ip.value || "").replace(/<[^>]+>/g, "")}`)
//     .join("\n");
// }
// function quantiInputStr(quantiInput: SerializedCPMatrix | null) {
//   if (!quantiInput) return "";

//   const m = JSON.parse(quantiInput) as CPMatrix;

//   return `
//   - considerable -> considerable = ${m.considerable.considerable.abs}
//   - considerable -> major = ${m.considerable.considerable.abs}
//   - considerable -> extreme = ${m.considerable.considerable.abs}
//   - major -> considerable = ${m.considerable.considerable.abs}
//   - major -> major = ${m.considerable.considerable.abs}
//   - major -> extreme = ${m.considerable.considerable.abs}
//   - extreme -> considerable = ${m.considerable.considerable.abs}
//   - extreme -> major = ${m.considerable.considerable.abs}
//   - extreme -> extreme = ${m.considerable.considerable.abs}
//   `;
// }

// export default function RiskAssistantPage() {
//   const { user, environment } = useOutletContext<BasePageContext>();
//   const api = useAPI();

//   const { riskSummary, riskSnapshot: riskFile } =
//     useOutletContext<RiskFilePageContext>();

//   const { data: causeCascades } = useQuery({
//     queryKey: [
//       DataTable.RISK_CASCADE,
//       riskSummary._cr4de_risk_file_value,
//       "causes",
//     ],
//     queryFn: () =>
//       api.getRiskCascades(
//         `$filter=_cr4de_effect_hazard_value eq ${riskSummary._cr4de_risk_file_value}&$expand=cr4de_cause_hazard`,
//       ),
//     select: (data) => {
//       return data as unknown as DVRiskCascade<DVRiskFile, unknown>[];
//       // data.map((d) => {
//       //   const cause = parseRiskSnapshot(
//       //     snapshotFromRiskfile(
//       //       parseRiskFile(d.cr4de_cause_hazard as DVRiskFile),
//       //     ),
//       //   );

//       //   return {
//       //     ...parseCascadeSnapshot(snapshotFromRiskCascade(d)),
//       //     cr4de_cause_risk: cause,
//       //   };
//       // }),
//     },
//   });

//   const causes = causeCascades?.filter(
//     (c) => c.cr4de_cause_hazard.cr4de_risk_type !== RISK_TYPE.EMERGING,
//   );

//   const basicInformation = `
// Risk Title: ${riskSummary.cr4de_title}
// Definition: ${(riskSummary.cr4de_definition || "").replace(/<[^>]+>/g, "")}
// Scenario params:
// ${scenarioParams(riskSummary.cr4de_scenario_considerable)}
// Considerable scenario parameters:
// ${scenarioParams(riskSummary.cr4de_scenario_considerable)}
// Major scenario parameters:
// ${scenarioParams(riskSummary.cr4de_scenario_major)}
// Extreme scenario parameters:
// ${scenarioParams(riskSummary.cr4de_scenario_extreme)}
// Most relevant scenario: ${riskSummary.cr4de_mrs}

// Write a short, clear description of the new most relevant scenario. Use formal UK English. Describe the scenario in neutral and analytical terms. Always speak in terms of “could” and avoid deterministic wording. Base the description only on the parameters below:
//   `;

//   const probabilityInformation = `
// These are the most probable causes of the risk above.
// ${causes
//   ?.map(
//     (rf, i) => `
// ${i + 1}. ${rf.cr4de_cause_hazard.cr4de_title}
// Definition: ${(rf.cr4de_cause_hazard.cr4de_definition || "").replace(/<[^>]+>/g, "")}
// Scenario params:
// ${scenarioParams(rf.cr4de_cause_hazard.cr4de_scenario_considerable)}
// Considerable scenario parameters:
// ${scenarioParams(rf.cr4de_cause_hazard.cr4de_scenario_considerable)}
// Major scenario parameters:
// ${scenarioParams(rf.cr4de_cause_hazard.cr4de_scenario_major)}
// Extreme scenario parameters:
// ${scenarioParams(rf.cr4de_cause_hazard.cr4de_scenario_extreme)}

// Conditional probabilities of cause -> effect scenarios: ${quantiInputStr(rf.cr4de_quanti_input)}
//     `,
//   )
//   .join("\n")}
//   `;

//   return (
//     <Container sx={{ mt: 2, pb: 8 }}>
//       <Box sx={{ mb: 10 }}>
//         <RiskFileTitle riskSummary={riskSummary} />

//         <Card sx={{ mb: 4 }}>
//           <CardHeader title="Basic Information - Most Relevant Scenario" />
//           <CardContent>
//             <TextField
//               id="outlined-multiline-static"
//               label="Prompt"
//               multiline
//               rows={4}
//               value={basicInformation}
//               variant="filled"
//               fullWidth
//             />
//           </CardContent>
//         </Card>
//         <Card sx={{ mb: 4 }}>
//           <CardHeader title="Probability Analysis" />
//           <CardContent>
//             <TextField
//               id="outlined-multiline-static"
//               label="Prompt"
//               multiline
//               rows={4}
//               value={probabilityInformation}
//               variant="filled"
//               fullWidth
//             />
//           </CardContent>
//         </Card>
//       </Box>
//     </Container>
//   );
// }
