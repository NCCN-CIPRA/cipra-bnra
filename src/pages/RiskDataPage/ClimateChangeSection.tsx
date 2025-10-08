import { useState } from "react";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import RiskDataAccordion from "./RiskDataAccordion";
import { Box, Link, Stack, Tooltip, Typography } from "@mui/material";
import { SCENARIOS } from "../../functions/scenarios";
import TornadoIcon from "@mui/icons-material/Tornado";
import { Slider } from "./Slider";

export function ClimateChangeSection({
  riskFile,
  cascade,
}: {
  riskFile: DVRiskSnapshot;
  cascade: DVCascadeSnapshot<unknown, DVRiskSnapshot>;
}) {
  const [quali] = useState<string | null>(cascade.cr4de_quali || "");

  // const handleSave = async () => {
  //   setSaving(true);
  //   await api.updateCascade(cascade.cr4de_bnrariskcascadeid, {
  //     cr4de_quali: quali,
  //     cr4de_discussion_required: DiscussionRequired.RESOLVED,
  //   });
  //   await reloadCascades();
  //   setSaving(false);
  //   setOpen(false);
  // };

  return (
    <RiskDataAccordion
      title={
        <Link
          href={`/learning/risk/${cascade.cr4de_cause_risk._cr4de_risk_file_value}`}
          target="_blank"
        >
          {cascade.cr4de_cause_risk.cr4de_title}
        </Link>
      }
    >
      <Stack direction="row" sx={{ width: "100%", justifyContent: "stretch" }}>
        <Box sx={{ p: 4 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Final Consensus Results:
          </Typography>
          <Box
            dangerouslySetInnerHTML={{
              __html: quali || "",
            }}
            sx={{
              mt: 1,
              mb: 2,
              ml: 1,
              pl: 1,
              borderLeft: "4px solid #eee",
            }}
          />
          <Stack direction="column" sx={{ mt: 2 }}>
            {[SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, SCENARIOS.EXTREME].map(
              (n) => (
                <Stack key={n} direction="row" sx={{ alignItems: "center" }}>
                  <Typography variant="caption" sx={{ flex: 1 }}>
                    <i>Direct probability in 2050</i> Estimation:
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: "300px",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    {/* {riskFile.cr4de_consensus_type !== null ? ( */}
                    <Box
                      id={`DP50-slider-${n}`}
                      sx={{ mx: 2, mt: 3, position: "relative" }}
                    >
                      <Tooltip title={"The original DP value "}>
                        <Box
                          sx={{
                            position: "absolute",
                            top: -18,
                            left: `calc(${
                              (riskFile.cr4de_quanti[n].dp50.scale + 0) * 18.18
                            }% - 15px)`,
                            width: 30,
                            height: 30,
                          }}
                          className="original-dp-value"
                        >
                          <TornadoIcon
                            color="secondary"
                            sx={{ fontSize: 30 }}
                          />
                        </Box>
                      </Tooltip>
                      <Slider
                        // mx={0}
                        initialValue={riskFile.cr4de_quanti[n].dp50.scale}
                        prefix={"DP"}
                        maxScale={5}
                        // name={`cr4de_climate_change_quanti${getScenarioSuffix(
                        //   n
                        // )}`}
                        // spread={
                        //   // user.roles.analist
                        //   //   ? getDASpread(
                        //   //       directAnalyses,
                        //   //       `cr4de_dp50_quanti${n.slice(
                        //   //         -2
                        //   //       )}` as keyof DVDirectAnalysis
                        //   //     )
                        //   //   : null
                        //   null
                        // }
                        // onChange={
                        // user.roles.analist
                        //   ? async (newValue) => {
                        //       await api.updateRiskFile(
                        //         riskFile.cr4de_riskfilesid,
                        //         {
                        //           [n]: newValue,
                        //         }
                        //       );
                        //     }
                        //   : null
                        //   null
                        // }
                      />
                    </Box>
                    {/* ) : (
                      <Typography variant="subtitle2">N/A</Typography>
                    )} */}
                  </Box>
                </Stack>
              )
            )}
          </Stack>
          {/* {user.roles.analist && (
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Button
                  loading={saving}
                  onClick={handleSave}
                  variant="outlined"
                >
                  Save & Close
                </Button>
              </Box>
            )} */}
        </Box>
      </Stack>
    </RiskDataAccordion>
  );
}
