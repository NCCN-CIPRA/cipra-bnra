import { useState } from "react";
import { Box, Stack, Link } from "@mui/material";
import Typography from "@mui/material/Typography";
import TextInputBox from "../../components/TextInputBox";
import { useOutletContext } from "react-router-dom";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import { BasePageContext } from "../BasePage";
import RiskDataAccordion from "./RiskDataAccordion";
import {
  getAverageIndirectImpact,
  getAverageIndirectImpactDynamic,
} from "../../functions/Impact";
import { CascadeSection } from "./CascadeSection";
import { Environment } from "../../types/global";

export default function ManMade({
  riskFile,
  effects,
  catalyzingEffects,
}: {
  riskFile: DVRiskSnapshot;
  effects: DVCascadeSnapshot<unknown, unknown, DVRiskSnapshot>[];
  catalyzingEffects: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown>[];
  climateChange: DVCascadeSnapshot<unknown, DVRiskSnapshot, unknown> | null;
}) {
  const { environment } = useOutletContext<BasePageContext>();

  const dynamicAttacks = effects.map((e) => ({
    cascade: e,
    i:
      environment === Environment.PUBLIC
        ? getAverageIndirectImpact(e, riskFile)
        : getAverageIndirectImpactDynamic(
            e,
            riskFile,
            e.cr4de_effect_risk,
            effects
          ),
  }));

  return (
    <>
      <Box sx={{ mx: 4 }}>
        <Typography variant="h4" sx={{ mx: 0, mb: 2 }}>
          Potential attacks
        </Typography>

        <Box sx={{ mb: 8 }}>
          {dynamicAttacks
            .sort((a, b) => b.i - a.i)
            .map((e) => (
              <CascadeSection
                key={e.cascade._cr4de_risk_cascade_value}
                cause={riskFile}
                effect={e.cascade.cr4de_effect_risk}
                cascade={e.cascade}
                subtitle={
                  <Typography variant="body1" color="warning">
                    <b>{Math.round(10000 * e.i) / 100}%</b> of expected impact
                  </Typography>
                }
              />
            ))}
        </Box>

        <Typography variant="h4" sx={{ mx: 0, mb: 2 }}>
          Catalyzing risks
        </Typography>

        <Box sx={{ mb: 8 }}>
          {catalyzingEffects.map((ca) => (
            <EmergingSection
              key={ca._cr4de_risk_cascade_value}
              cascade={ca}
              // reloadCascades={reloadCascades}
            />
          ))}
        </Box>
      </Box>
    </>
  );
}

function EmergingSection({
  cascade,
}: // reloadCascades,
{
  cascade: DVCascadeSnapshot<unknown, DVRiskSnapshot>;
  // reloadCascades: () => Promise<unknown>;
}) {
  const { user } = useOutletContext<BasePageContext>();

  const [quali, setQuali] = useState<string | null>(cascade.cr4de_quali || "");

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
        <>
          Catalyzing Risk:{" "}
          <Link
            href={`/learning/risk/${cascade.cr4de_cause_risk._cr4de_risk_file_value}`}
            target="_blank"
          >
            {cascade.cr4de_cause_risk.cr4de_title}
          </Link>
        </>
      }
    >
      <Stack direction="row" sx={{ width: "100%", justifyContent: "stretch" }}>
        <Box sx={{ p: 4 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Final Consensus Results:
          </Typography>
          {user?.roles.analist ? (
            <TextInputBox
              initialValue={quali}
              setUpdatedValue={(newValue) => {
                setQuali(newValue || null);
              }}
            />
          ) : (
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
          )}
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
