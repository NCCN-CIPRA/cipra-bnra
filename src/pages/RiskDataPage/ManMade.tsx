import { useState } from "react";
import { Box, Stack, Link } from "@mui/material";
import Typography from "@mui/material/Typography";
import TextInputBox from "../../components/TextInputBox";
import { useOutletContext } from "react-router-dom";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import { BasePageContext } from "../BasePage";
import RiskDataAccordion from "./RiskDataAccordion";
import CascadeSankey from "./CascadeSankey";

const getAverageIndirectImpact = (
  c: DVCascadeSnapshot<unknown, unknown, DVRiskSnapshot>,
  riskFile: DVRiskSnapshot
) => {
  const totalTP =
    riskFile.cr4de_quanti.considerable.tp.yearly.scale +
    riskFile.cr4de_quanti.major.tp.yearly.scale +
    riskFile.cr4de_quanti.extreme.tp.yearly.scale;

  return (
    (riskFile.cr4de_quanti.considerable.tp.yearly.scale / totalTP) *
      c.cr4de_quanti_effect.considerable.ii.all.scale +
    (riskFile.cr4de_quanti.major.tp.yearly.scale / totalTP) *
      c.cr4de_quanti_effect.major.ii.all.scale +
    (riskFile.cr4de_quanti.extreme.tp.yearly.scale / totalTP) *
      c.cr4de_quanti_effect.extreme.ii.all.scale
  );
};

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
  return (
    <>
      <Box sx={{ mx: 4 }}>
        <Box sx={{ mb: 8 }}>
          {effects
            .sort(
              (a, b) =>
                getAverageIndirectImpact(b, riskFile) -
                getAverageIndirectImpact(a, riskFile)
            )
            .map((ca) => (
              <AttackSection
                key={ca._cr4de_risk_cascade_value}
                riskFile={riskFile}
                cascade={ca}
                // reloadCascades={reloadCascades}
              />
            ))}
        </Box>
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

function AttackSection({
  riskFile,
  cascade,
}: // reloadCascades,
{
  riskFile: DVRiskSnapshot;
  cascade: DVCascadeSnapshot<unknown, unknown, DVRiskSnapshot>;
  // reloadCascades: () => Promise<unknown>;
}) {
  const { user } = useOutletContext<BasePageContext>();

  const [quali, setQuali] = useState<string | null>(
    cascade.cr4de_quali_cause || ""
  );

  // const handleSave = async () => {
  //   setSaving(true);
  //   await api.updateCascade(cascade.cr4de_bnrariskcascadeid, {
  //     cr4de_quali_cause: quali,
  //     cr4de_discussion_required_cause: DiscussionRequired.RESOLVED,
  //   });
  //   await reloadCascades();
  //   setSaving(false);
  //   setOpen(false);
  // };

  return (
    <RiskDataAccordion
      title={
        <Stack direction="row">
          <Typography sx={{ flex: 1 }}>
            <Link
              href={`/learning/risk/${riskFile._cr4de_risk_file_value}`}
              target="_blank"
            >
              {riskFile.cr4de_title}
            </Link>{" "}
            causes{" "}
            <Link
              href={`/learning/risk/${cascade.cr4de_effect_risk._cr4de_risk_file_value}`}
              target="_blank"
            >
              {cascade.cr4de_effect_risk.cr4de_title}
            </Link>
          </Typography>
          <Typography variant="body1" color="warning">
            <b>
              {Math.round(10000 * getAverageIndirectImpact(cascade, riskFile)) /
                100}
              %
            </b>{" "}
            of expected impact
          </Typography>
        </Stack>
      }
    >
      <Stack direction="column" sx={{ width: "100%" }}>
        {/* <CascadeSnapshotMatrix
            cascade={cascade}
            cause={riskFile}
            effect={cascade.cr4de_effect_risk}
            isCause={true}
            onChange={async () => {}}
            // onChange={async (field, newValue) => {
            //   await api.updateCascade(cascade.cr4de_bnrariskcascadeid, {
            //     [field]: newValue,
            //   });
            //   reloadCascades();
            // }}
          /> */}
        <CascadeSankey
          cause={riskFile}
          effect={cascade.cr4de_effect_risk}
          cascade={cascade}
        />

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
