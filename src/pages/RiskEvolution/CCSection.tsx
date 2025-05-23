import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { Cause as Cause2023 } from "../../functions/Probability";
import ClimateChangeChart from "../../components/charts/ClimateChangeChart";
import {
  getCascadeParameter,
  getScenarioParameter,
  getScenarioSuffix,
  SCENARIOS,
} from "../../functions/scenarios";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";

type Cause2050 = Cause2023 & {
  p2050: number;
};

export default function CCSection({
  riskFile,
  causes,
  cc,
  scenario,
}: {
  riskFile: DVRiskFile;
  causes: DVRiskCascade<SmallRisk, unknown>[];
  cc: DVRiskCascade<SmallRisk, unknown> | null;
  scenario: SCENARIOS;
}) {
  const [, setCCQuanti] = useState<Cause2050[] | null>(null);
  const [ccQuali, setCCQuali] = useState<string | null>(
    riskFile.cr4de_mrs_cc || null
  );

  useEffect(() => setCCQuali(riskFile.cr4de_mrs_cc || null), [riskFile]);

  const scenarioSuffix = getScenarioSuffix(scenario);
  useEffect(() => {
    const dTPAvg =
      (Math.abs(
        (getScenarioParameter(riskFile, "TP50", SCENARIOS.CONSIDERABLE) ||
          0.000001) -
          (getScenarioParameter(riskFile, "TP", SCENARIOS.CONSIDERABLE) ||
            0.000001)
      ) +
        Math.abs(
          (getScenarioParameter(riskFile, "TP50", SCENARIOS.MAJOR) ||
            0.000001) -
            (getScenarioParameter(riskFile, "TP", SCENARIOS.MAJOR) || 0.000001)
        ) +
        Math.abs(
          (getScenarioParameter(riskFile, "TP50", SCENARIOS.EXTREME) ||
            0.000001) -
            (getScenarioParameter(riskFile, "TP", SCENARIOS.EXTREME) ||
              0.000001)
        )) /
      3;

    const allCauses = [
      {
        id: null,
        name: "No underlying cause",
        p_c:
          getScenarioParameter(riskFile, "DP", SCENARIOS.CONSIDERABLE) ||
          0.000001,
        p2050_c:
          getScenarioParameter(riskFile, "DP50", SCENARIOS.CONSIDERABLE) ||
          0.000001,
        p_m: getScenarioParameter(riskFile, "DP", SCENARIOS.MAJOR) || 0.000001,
        p2050_m:
          getScenarioParameter(riskFile, "DP50", SCENARIOS.MAJOR) || 0.000001,
        p_e:
          getScenarioParameter(riskFile, "DP", SCENARIOS.EXTREME) || 0.000001,
        p2050_e:
          getScenarioParameter(riskFile, "DP50", SCENARIOS.EXTREME) || 0.000001,
      },
      ...(causes
        .filter((c) => getCascadeParameter(c, scenario, "IP50") !== 0)
        .map((c) => {
          return {
            id: c.cr4de_cause_hazard.cr4de_riskfilesid,
            name: c.cr4de_cause_hazard.cr4de_title,
            p_c:
              getCascadeParameter(c, SCENARIOS.CONSIDERABLE, "IP") || 0.000001,
            p2050_c:
              getCascadeParameter(c, SCENARIOS.CONSIDERABLE, "IP50") ||
              0.000001,
            p_m: getCascadeParameter(c, SCENARIOS.MAJOR, "IP") || 0.000001,
            p2050_m:
              getCascadeParameter(c, SCENARIOS.MAJOR, "IP50") || 0.000001,
            p_e: getCascadeParameter(c, SCENARIOS.EXTREME, "IP") || 0.000001,
            p2050_e:
              getCascadeParameter(c, SCENARIOS.EXTREME, "IP50") || 0.000001,
          };
        }) || []),
    ]
      .sort(
        (a, b) =>
          (Math.abs(b.p2050_c - b.p_c) +
            Math.abs(b.p2050_m - b.p_m) +
            Math.abs(b.p2050_e - b.p_e)) /
            3 -
          (Math.abs(a.p2050_c - a.p_c) +
            Math.abs(a.p2050_m - a.p_m) +
            Math.abs(a.p2050_e - a.p_e)) /
            3
      )
      .reduce(
        ([cumulCauses, pCumul], c, i) => {
          if (pCumul / dTPAvg > 0.8 && i > 2)
            return [cumulCauses, pCumul] as [Cause2050[], number];

          return [
            [...cumulCauses, c],
            pCumul +
              (Math.abs(c.p2050_c - c.p_c) +
                Math.abs(c.p2050_m - c.p_m) +
                Math.abs(c.p2050_e - c.p_e)) /
                3,
          ] as [Cause2050[], number];
        },
        [[], 0] as [Cause2050[], number]
      )[0];

    setCCQuanti(allCauses);

    if (ccQuali === null) {
      setCCQuali(
        allCauses
          .map((c) => {
            if (c.id)
              return `<a href="/risks/${c.id}" target="_blank">${c.name}</a>`;

            return (
              "<a href=''>No underlying cause</a><p>" +
              cc?.cr4de_quali +
              "</p><p>" +
              cc?.cr4de_quali_cause +
              "</p>"
            );
          })
          .join("<br />")
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riskFile, causes, scenarioSuffix]);

  return (
    <Box
      sx={{
        borderLeft: "solid 8px #eee",
        px: 2,
        py: 1,
        mt: 2,
        backgroundColor: "white",
      }}
    >
      <Box className="cc-chart" sx={{ margin: "auto", width: "750px" }}>
        <ClimateChangeChart
          riskFile={riskFile}
          causes={causes}
          scenario={scenario}
        />
      </Box>
      <Box className="cc-quali">
        <Box
          className="htmleditor"
          sx={{
            mb: 4,
            fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
          }}
          dangerouslySetInnerHTML={{ __html: ccQuali || "" }}
        />
      </Box>
      <Box sx={{ clear: "both" }} />
    </Box>
  );
}
