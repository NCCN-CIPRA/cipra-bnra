import { Box, Button, Stack, Typography } from "@mui/material";
import ProbabilityOriginPieChart from "../../components/charts/ProbabilityOriginPieChart";
import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { getYearlyProbability } from "../../functions/analysis/calculateTotalRisk";
import TextInputBox from "../../components/TextInputBox";
import { useMemo, useState } from "react";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { LoadingButton } from "@mui/lab";
import useAPI from "../../hooks/useAPI";

type Effect = {
  name: string;
  ha: number;
  hb: number;
  hc: number;
  sa: number;
  sb: number;
  sc: number;
  sd: number;
  ea: number;
  fa: number;
  fb: number;
  h: number;
  s: number;
  e: number;
  f: number;
  quali?: string | null;
  quali_h?: string | null;
  quali_s?: string | null;
  quali_e?: string | null;
  quali_f?: string | null;
};

export default function ImpactSection({
  riskFile,
  effects,
  scenarioSuffix,
  calc,
  mode,
}: {
  riskFile: DVRiskFile;
  effects: Effect[];
  scenarioSuffix: "_c" | "_m" | "_e";
  calc: RiskCalculation;
  mode: "view" | "edit";
}) {
  const ti_H = Math.round(
    calc[`ti_Ha${scenarioSuffix}`] + calc[`ti_Hb${scenarioSuffix}`] + calc[`ti_Hc${scenarioSuffix}`]
  );

  const paretoEffects = useMemo(() => {
    return effects
      .reduce(
        ([cumulEffects, iCumul], e) => {
          if (iCumul / ti_H > 0.8) return [cumulEffects, iCumul] as [Effect[], number];

          return [[...cumulEffects, e], iCumul + e.h] as [Effect[], number];
        },
        [[], 0] as [Effect[], number]
      )[0]
      .sort((a, b) => b.h - a.h);
  }, [riskFile, effects]);

  const getDefaultText = () => {
    const text = `
          <p style="font-size:14px;">
          The human impact represents an estimated <b>${Math.round(
            (100 * ti_H) / calc.ti
          )}%</b> of the total impact of an
        incident of this magnitude. Possible explanation for the human impact are:
          </p>
          <p><br></p>
        `;

    const descriptions = paretoEffects
      .map(
        (e, i) =>
          `<p style="font-weight:bold;font-size:14px;">
                    ${i + 1}. ${e.name} 
                    </p>
                    <p><br></p>
                    ${e.quali || e.quali_h}
                    <p><br></p>
              <p><br></p>`
      )
      .join("\n");

    return text + descriptions;
  };

  const api = useAPI();
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [probQuali, setProbQuali] = useState<string>(riskFile.cr4de_mrs_probability || getDefaultText());

  const saveRiskFile = async (reset = false) => {
    setSaving(true);
    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      cr4de_mrs_probability: reset ? null : probQuali,
    });
    if (reset) {
      setProbQuali(getDefaultText());
    }
    setEditing(false);
    // await reloadRiskFile();
    setSaving(false);
    // setOpen(false);
  };

  return (
    <>
      {!editing && (
        <Box
          className="htmleditor"
          sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
          dangerouslySetInnerHTML={{ __html: probQuali }}
        />
      )}
      {editing && (
        <Box sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}>
          <TextInputBox initialValue={probQuali} setUpdatedValue={(str) => setProbQuali(str || "")} />
        </Box>
      )}
      {mode === "edit" && (
        <Stack direction="row" sx={{ borderTop: "1px solid #eee", pt: 1, mr: 2 }}>
          {!editing && (
            <>
              <Button onClick={() => setEditing(true)}>Edit</Button>
              <Box sx={{ flex: 1 }} />
              <LoadingButton
                color="error"
                loading={saving}
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you wish to reset this field to default? All changes made to this field will be gone."
                    )
                  )
                    saveRiskFile(true);
                }}
              >
                Reset to default
              </LoadingButton>
            </>
          )}
          {editing && (
            <>
              <LoadingButton loading={saving} onClick={() => saveRiskFile()}>
                Save
              </LoadingButton>
              <Box sx={{ flex: 1 }} />
              <Button
                color="warning"
                onClick={() => {
                  if (window.confirm("Are you sure you wish to discard your changes?")) setEditing(false);
                }}
              >
                Discard Changes
              </Button>
            </>
          )}
        </Stack>
      )}
    </>
  );
}

// {
//   effects.filter((c) => c.h >= 0.01 && (c.h * ti_H) / calc.ti > 0.01).length > 0 ? (
//     <>
//       <Typography variant="h6">Human Impact</Typography>
//       <Typography variant="body2" sx={{ mb: 3 }}>
//         The human impact represents an estimated <b>{Math.round((100 * ti_H) / calc.ti)}%</b> of the total impact of an
//         incident of this magnitude. Possible explanation for the human impact are:
//       </Typography>

//       <List sx={{ ml: 2.5, listStyle: "disc" }}>
//         {effects
//           .filter((c) => c.h >= 0.01 && (c.h * ti_H) / calc.ti > 0.01)
//           .sort((a, b) => b.h - a.h)
//           .slice(0, 5)
//           .map((c, i) => (
//             <ListItem sx={{ mb: 1, display: "list-item", pl: 0 }} dense>
//               <Typography variant="subtitle2">{c.name} </Typography>
//               <Typography variant="caption">
//                 <b>{Math.round(10000 * c.h) / 100}%</b> of total human impact,{" "}
//                 <b>{Math.round((10000 * c.h * ti_H) / calc.ti) / 100}%</b> of total impact
//               </Typography>
//               {c.quali ? (
//                 <Box sx={{ ml: 0 }} dangerouslySetInnerHTML={{ __html: c.quali || "" }} />
//               ) : (
//                 <Box sx={{ ml: 0 }} dangerouslySetInnerHTML={{ __html: rf[`cr4de_di_quali_h${MRSSuffix}`] || "" }} />
//               )}
//             </ListItem>
//           ))}
//       </List>
//     </>
//   ) : (
//     <Typography variant="caption">
//       The human impact is within the margin of error and further elaboration is not considered useful.
//     </Typography>
//   );
// }
