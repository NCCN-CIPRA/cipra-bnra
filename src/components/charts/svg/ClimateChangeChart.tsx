import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Legend,
  Bar,
} from "recharts";
import { SCENARIOS, SCENARIO_PARAMS } from "../../../functions/scenarios";
import { JSXElementConstructor, useMemo } from "react";
import round from "../../../functions/roundNumberString";
import { Cause as Cause2023 } from "../../../functions/Probability";
import { useTranslation } from "react-i18next";
import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";
import { DVCascadeSnapshot } from "../../../types/dataverse/DVCascadeSnapshot";

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
  width = 750,
  height = 450,
  fontSize = "12pt",
  xLabelDy = 25,
  CustomTooltip,
}: {
  riskFile: DVRiskSnapshot;
  causes: DVCascadeSnapshot<unknown, DVRiskSnapshot>[];
  scenario: SCENARIOS;
  width?: number;
  height?: number;
  fontSize?: string;
  xLabelDy?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CustomTooltip?: JSXElementConstructor<any>;
}) {
  const { t } = useTranslation();

  const data = useMemo(() => {
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

    const enhCauses = [
      {
        name: "No underlying cause",
        p_c: riskFile.cr4de_quanti.considerable.dp.yearly.scale,
        p2050_c: riskFile.cr4de_quanti.considerable.dp50.yearly.scale,
        p_m: riskFile.cr4de_quanti.major.dp.yearly.scale,
        p2050_m: riskFile.cr4de_quanti.major.dp50.yearly.scale,
        p_e: riskFile.cr4de_quanti.extreme.dp.yearly.scale,
        p2050_e: riskFile.cr4de_quanti.extreme.dp50.yearly.scale,
      },
      ...(causes
        .filter((c) => c.cr4de_quanti_cause[scenario].ip50.yearly.scale !== 0)
        .map((c) => {
          return {
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
          if (pCumul / dTPAvg > 0.8 && i > 0)
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

    const tp50_c = riskFile.cr4de_quanti.considerable.tp50.yearly.scale;
    const tp50_m = riskFile.cr4de_quanti.major.tp50.yearly.scale;
    const tp50_e = riskFile.cr4de_quanti.extreme.tp50.yearly.scale;

    const tp_c = riskFile.cr4de_quanti.considerable.tp.yearly.scale;
    const tp_m = riskFile.cr4de_quanti.major.tp.yearly.scale;
    const tp_e = riskFile.cr4de_quanti.extreme.tp.yearly.scale;

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
          P2050_c_inc:
            cause.p2050_c >= cause.p_c ? cause.p2050_c - cause.p_c : 0,
          P2050_c_dec:
            cause.p2050_c >= cause.p_c ? 0 : cause.p_c - cause.p2050_c,
          P2023_m: cause.p2050_m >= cause.p_m ? cause.p_m : cause.p2050_m,
          P2050_m_inc:
            cause.p2050_m >= cause.p_m ? cause.p2050_m - cause.p_m : 0,
          P2050_m_dec:
            cause.p2050_m >= cause.p_m ? 0 : cause.p_m - cause.p2050_m,
          P2023_e: cause.p2050_e >= cause.p_e ? cause.p_e : cause.p2050_e,
          P2050_e_inc:
            cause.p2050_e >= cause.p_e ? cause.p2050_e - cause.p_e : 0,
          P2050_e_dec:
            cause.p2050_e >= cause.p_e ? 0 : cause.p_e - cause.p2050_e,
        })),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riskFile, causes, scenario]);

  return (
    <BarChart
      width={width}
      height={height}
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
        label={{
          value: t("Probability"),
          dy: xLabelDy,
          fontSize,
        }}
        style={{
          fontSize,
        }}
      />
      <YAxis
        dataKey="name"
        type="category"
        width={150}
        style={{
          fontSize,
        }}
      />
      {CustomTooltip && (
        <Tooltip
          content={<CustomTooltip />}
          formatter={(value) => `${round(value as number)} / 5`}
        />
      )}
      <Legend
        align="center"
        verticalAlign="bottom"
        wrapperStyle={{ paddingTop: 30 }}
      />
      <Bar
        name="Considerable scenario"
        dataKey="P2023_c"
        stackId="c"
        fill={SCENARIO_PARAMS.considerable.color}
      />
      <Bar
        name="Major scenario"
        dataKey="P2023_m"
        stackId="m"
        fill={SCENARIO_PARAMS.major.color}
      />
      <Bar
        name="Extreme scenario"
        dataKey="P2023_e"
        stackId="e"
        fill={SCENARIO_PARAMS.extreme.color}
      />
      <Bar
        name="Increased probability in 2050"
        dataKey="P2050_c_inc"
        stackId="c"
        fill="red"
        barSize={1}
      />
      <Bar legendType="none" dataKey="P2050_m_inc" stackId="m" fill="red" />
      <Bar legendType="none" dataKey="P2050_e_inc" stackId="e" fill="red" />
      <Bar
        name="Decreased probability in 2050"
        dataKey="P2050_c_dec"
        stackId="c"
        fill="green"
        barSize={1}
        id="test"
      />
      <Bar legendType="none" dataKey="P2050_m_dec" stackId="m" fill="green" />
      <Bar legendType="none" dataKey="P2050_e_dec" stackId="e" fill="green" />
    </BarChart>
  );
}
