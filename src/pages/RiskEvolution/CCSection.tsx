import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Cause as Cause2023 } from "../../functions/Probability";
import ClimateChangeChart from "../../components/charts/ClimateChangeChart";
import { getScenarioSuffix, SCENARIOS } from "../../functions/scenarios";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";

type Cause2050 = Cause2023 & {
  p2050: number;
};

export default function CCSection({
  riskFile,
  causes,
  cc,
  scenario,
}: {
  riskFile: DVRiskSnapshot;
  causes: DVCascadeSnapshot<unknown, DVRiskSnapshot>[];
  cc: DVCascadeSnapshot<unknown, DVRiskSnapshot> | null;
  scenario: SCENARIOS;
}) {
  const [, setCCQuanti] = useState<Cause2050[] | null>(null);
  const [ccQuali, setCCQuali] = useState<string | null>(
    riskFile.cr4de_quali_cc_mrs || null
  );

  useEffect(() => setCCQuali(riskFile.cr4de_quali_cc_mrs || null), [riskFile]);

  const scenarioSuffix = getScenarioSuffix(scenario);
  useEffect(() => {
    const dTPAvg =
      (Math.abs(
        riskFile.cr4de_quanti.considerable.tp50.yearly.scale -
          riskFile.cr4de_quanti.considerable.tp.yearly.scale
      ) +
        Math.abs(
          riskFile.cr4de_quanti.major.tp50.yearly.scale -
            riskFile.cr4de_quanti.major.tp.yearly.scale
        ) +
        Math.abs(
          riskFile.cr4de_quanti.extreme.tp50.yearly.scale -
            riskFile.cr4de_quanti.extreme.tp.yearly.scale
        )) /
      3;

    const allCauses = [
      {
        id: null,
        name: "No underlying cause",
        p_c: riskFile.cr4de_quanti.considerable.dp.scaleTot,
        p2050_c: riskFile.cr4de_quanti.considerable.dp50.scaleTot,
        p_m: riskFile.cr4de_quanti.major.dp.scaleTot,
        p2050_m: riskFile.cr4de_quanti.major.dp.scaleTot,
        p_e: riskFile.cr4de_quanti.extreme.dp.scaleTot,
        p2050_e: riskFile.cr4de_quanti.extreme.dp.scaleTot,
      },
      ...(causes
        .filter((c) => c.cr4de_quanti_cause[scenario].ip50.yearly.scale !== 0)
        .map((c) => {
          return {
            id: c.cr4de_cause_risk._cr4de_risk_file_value,
            name: c.cr4de_cause_risk.cr4de_title,
            p_c: c.cr4de_quanti_cause.considerable.ip.yearly.scale,
            p2050_c: c.cr4de_quanti_cause.considerable.ip50.yearly.scale,
            p_m: c.cr4de_quanti_cause.major.ip.yearly.scale,
            p2050_m: c.cr4de_quanti_cause.major.ip50.yearly.scale,
            p_e: c.cr4de_quanti_cause.extreme.ip.yearly.scale,
            p2050_e: c.cr4de_quanti_cause.extreme.ip50.yearly.scale,
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
