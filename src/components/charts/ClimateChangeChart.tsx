import { XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Legend, Bar } from "recharts";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { SCENARIOS, SCENARIO_PARAMS, getCascadeParameter, getScenarioParameter } from "../../functions/scenarios";
import { useMemo } from "react";
import round from "../../functions/roundNumberString";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import { Cause as Cause2023 } from "../../functions/Probability";

type Cause2050 = Cause2023 & {
  p_c: number;
  p2050_c: number;
  p_m: number;
  p2050_m: number;
  p_e: number;
  p2050_e: number;
};

export default function ClimateChangeChart({
  riskFile,
  causes,
  scenario,
}: {
  riskFile: DVRiskFile;
  causes: DVRiskCascade<SmallRisk, unknown>[];
  scenario: SCENARIOS;
}) {
  const data = useMemo(() => {
    const dTPAvg =
      (Math.abs(
        (getScenarioParameter(riskFile, "TP50", SCENARIOS.CONSIDERABLE) || 0.000001) -
          (getScenarioParameter(riskFile, "TP", SCENARIOS.CONSIDERABLE) || 0.000001)
      ) +
        Math.abs(
          (getScenarioParameter(riskFile, "TP50", SCENARIOS.MAJOR) || 0.000001) -
            (getScenarioParameter(riskFile, "TP", SCENARIOS.MAJOR) || 0.000001)
        ) +
        Math.abs(
          (getScenarioParameter(riskFile, "TP50", SCENARIOS.EXTREME) || 0.000001) -
            (getScenarioParameter(riskFile, "TP", SCENARIOS.EXTREME) || 0.000001)
        )) /
      3;

    const enhCauses = [
      {
        name: "No underlying cause",
        p_c: getScenarioParameter(riskFile, "DP", SCENARIOS.CONSIDERABLE) || 0.000001,
        p2050_c: getScenarioParameter(riskFile, "DP50", SCENARIOS.CONSIDERABLE) || 0.000001,
        p_m: getScenarioParameter(riskFile, "DP", SCENARIOS.MAJOR) || 0.000001,
        p2050_m: getScenarioParameter(riskFile, "DP50", SCENARIOS.MAJOR) || 0.000001,
        p_e: getScenarioParameter(riskFile, "DP", SCENARIOS.EXTREME) || 0.000001,
        p2050_e: getScenarioParameter(riskFile, "DP50", SCENARIOS.EXTREME) || 0.000001,
      },
      ...(causes
        .filter((c) => getCascadeParameter(c, SCENARIOS.CONSIDERABLE, "IP50") !== 0)
        .map((c) => {
          return {
            name: c.cr4de_cause_hazard.cr4de_title,
            p_c: getCascadeParameter(c, SCENARIOS.CONSIDERABLE, "IP") || 0.000001,
            p2050_c: getCascadeParameter(c, SCENARIOS.CONSIDERABLE, "IP50") || 0.000001,
            p_m: getCascadeParameter(c, SCENARIOS.MAJOR, "IP") || 0.000001,
            p2050_m: getCascadeParameter(c, SCENARIOS.MAJOR, "IP50") || 0.000001,
            p_e: getCascadeParameter(c, SCENARIOS.EXTREME, "IP") || 0.000001,
            p2050_e: getCascadeParameter(c, SCENARIOS.EXTREME, "IP50") || 0.000001,
          };
        }) || []),
    ]
      .sort(
        (a, b) =>
          (Math.abs(b.p2050_c - b.p_c) + Math.abs(b.p2050_m - b.p_m) + Math.abs(b.p2050_e - b.p_e)) / 3 -
          (Math.abs(a.p2050_c - a.p_c) + Math.abs(a.p2050_m - a.p_m) + Math.abs(a.p2050_e - a.p_e)) / 3
      )
      .reduce(
        ([cumulCauses, pCumul], c, i) => {
          if (pCumul / dTPAvg > 0.8 && i > 2) return [cumulCauses, pCumul] as [Cause2050[], number];

          return [
            [...cumulCauses, c],
            pCumul + (Math.abs(c.p2050_c - c.p_c) + Math.abs(c.p2050_m - c.p_m) + Math.abs(c.p2050_e - c.p_e)) / 3,
          ] as [Cause2050[], number];
        },
        [[], 0] as [Cause2050[], number]
      )[0];

    const tp50_c = getScenarioParameter(riskFile, "TP50", SCENARIOS.CONSIDERABLE) || 0.000001;
    const tp50_m = getScenarioParameter(riskFile, "TP50", SCENARIOS.MAJOR) || 0.000001;
    const tp50_e = getScenarioParameter(riskFile, "TP50", SCENARIOS.EXTREME) || 0.000001;

    const tp_c = getScenarioParameter(riskFile, "TP", SCENARIOS.CONSIDERABLE) || 0.000001;
    const tp_m = getScenarioParameter(riskFile, "TP", SCENARIOS.MAJOR) || 0.000001;
    const tp_e = getScenarioParameter(riskFile, "TP", SCENARIOS.EXTREME) || 0.000001;

    return [
      {
        name: "Total probability",
        P2023_c: tp50_c >= tp_c ? tp_c : tp50_c,
        P2050_c_inc: tp50_c >= tp_c ? tp50_c - tp_c : 0,
        P2050_c_dec: tp50_c >= tp_c ? 0 : tp_c - tp50_c,
        P2023_m: tp50_m >= tp_m ? tp_m : tp50_m,
        P2050_m_inc: tp50_m >= tp_m ? tp50_m - tp_m : 0,
        P2050_m_dec: tp50_m >= tp_m ? 0 : tp_m - tp50_m,
        P2023_e: tp50_e >= tp_e ? tp_e : tp50_e,
        P2050_e_inc: tp50_e >= tp_e ? tp50_e - tp_e : 0,
        P2050_e_dec: tp50_e >= tp_e ? 0 : tp_e - tp50_e,
      },
      ...enhCauses
        // .reduce(
        //   ([cumulCauses, pCumul], c, i) => {
        //     if (pCumul / tp50 > 0.8 && i > 2) return [cumulCauses, pCumul] as [Cause2050[], number];

        //     return [[...cumulCauses, c], pCumul + c.p2050] as [Cause2050[], number];
        //   },
        //   [[], 0] as [Cause2050[], number]
        // )[0]
        .map((cause) => ({
          name: cause.name,
          P2023_c: cause.p2050_c >= cause.p_c ? cause.p_c : cause.p2050_c,
          P2050_c_inc: cause.p2050_c >= cause.p_c ? cause.p2050_c - cause.p_c : 0,
          P2050_c_dec: cause.p2050_c >= cause.p_c ? 0 : cause.p_c - cause.p2050_c,
          P2023_m: cause.p2050_m >= cause.p_m ? cause.p_m : cause.p2050_m,
          P2050_m_inc: cause.p2050_m >= cause.p_m ? cause.p2050_m - cause.p_m : 0,
          P2050_m_dec: cause.p2050_m >= cause.p_m ? 0 : cause.p_m - cause.p2050_m,
          P2023_e: cause.p2050_e >= cause.p_e ? cause.p_e : cause.p2050_e,
          P2050_e_inc: cause.p2050_e >= cause.p_e ? cause.p2050_e - cause.p_e : 0,
          P2050_e_dec: cause.p2050_e >= cause.p_e ? 0 : cause.p_e - cause.p2050_e,
        })),
    ];
  }, [riskFile, causes, scenario]);

  return (
    <BarChart
      width={750}
      height={450}
      data={data}
      margin={{
        top: 20,
        right: 30,
        left: 30,
        bottom: 30,
      }}
      layout="vertical"
      barCategoryGap="15%"
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        domain={[0, 5.5]}
        ticks={[1, 2, 3, 4, 5]}
        type="number"
        // tickFormatter={(value) => getPercentageProbability(value)}
        label={{ value: "Probability of occurence in the next 12 months", dy: 25 }}
      />
      <YAxis dataKey="name" type="category" width={150} />
      <Tooltip formatter={(value) => `${round(value as number)} / 5`} />
      <Legend align="center" verticalAlign="bottom" wrapperStyle={{ paddingTop: 30 }} />
      <Bar name="Considerable scenario" dataKey="P2023_c" stackId="c" fill={SCENARIO_PARAMS.considerable.color} />
      <Bar name="Major scenario" dataKey="P2023_m" stackId="m" fill={SCENARIO_PARAMS.major.color} />
      <Bar name="Extreme scenario" dataKey="P2023_e" stackId="e" fill={SCENARIO_PARAMS.extreme.color} />
      <Bar name="Increased probability in 2050" dataKey="P2050_c_inc" stackId="c" fill="red" />
      <Bar legendType="none" dataKey="P2050_m_inc" stackId="m" fill="red" />
      <Bar legendType="none" dataKey="P2050_e_inc" stackId="e" fill="red" />
      <Bar name="Decreased probability in 2050" dataKey="P2050_c_dec" stackId="c" fill="green" />
      <Bar legendType="none" dataKey="P2050_m_dec" stackId="m" fill="green" />
      <Bar legendType="none" dataKey="P2050_e_dec" stackId="e" fill="green" />
    </BarChart>
  );
}
