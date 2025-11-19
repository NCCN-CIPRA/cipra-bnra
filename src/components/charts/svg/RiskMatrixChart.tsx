import { Stack, Typography } from "@mui/material";
import {
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  TooltipContentProps,
  XAxis,
  YAxis,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { Scenario } from "../../../functions/simulation/types";
import { RISK_CATEGORY } from "../../../types/dataverse/Riskfile";
import getCategoryColor from "../../../functions/getCategoryColor";
import { SCENARIO_PARAMS } from "../../../functions/scenarios";
import { hexToRGB } from "../../../functions/colors";

export type MatrixRisk = {
  id: string;
  hazardId: string;
  name: string;
  scenario: Scenario;
  category: RISK_CATEGORY;
  totalProbability: number;
  probabilitError?: [number, number];
  totalImpact: number;
  impactError?: [number, number];
  expectedImpact: number;
};

const CATEGORIES: Partial<{
  [key in RISK_CATEGORY]: {
    color: string;
    shape:
      | "circle"
      | "cross"
      | "diamond"
      | "square"
      | "star"
      | "triangle"
      | "wye";
  };
}> = {
  Cyber: {
    shape: "square",
    color: getCategoryColor("Cyber"),
  },
  EcoTech: {
    shape: "star",
    color: getCategoryColor("EcoTech"),
  },
  Health: {
    shape: "diamond",
    color: getCategoryColor("Health"),
  },
  "Man-made": {
    shape: "wye",
    color: getCategoryColor("Man-made"),
  },
  Nature: {
    shape: "triangle",
    color: getCategoryColor("Nature"),
  },
  Transversal: {
    shape: "circle",
    color: getCategoryColor("Transversal"),
  },
};

const CustomTooltip = ({
  active,
  payload,
}: TooltipContentProps<ValueType, NameType>) => {
  if (active) {
    return (
      <Stack
        sx={{
          backgroundColor: "rgba(255,255,255,0.8)",
          border: "1px solid #eee",
          p: 1,
        }}
      >
        <Typography variant="subtitle1">
          {payload?.[0]?.payload.name}
        </Typography>
        <Typography variant="subtitle2">
          {`Probability: P${
            Math.round((payload?.[1]?.value as number) * 2) / 2
          }`}
        </Typography>
        <Typography variant="subtitle2">
          {`Impact: I${Math.round((payload?.[0]?.value as number) * 2) / 2}`}
        </Typography>
        <Typography variant="subtitle2">
          {`Yearly Expected Impact: I${
            payload?.[0]?.payload.expectedImpact as number
          }`}
        </Typography>
      </Stack>
    );
  }

  return null;
};

export default function RiskMatrixChart({
  data,
  selectedNodeId = null,
  setSelectedNodeId = () => {},
  labels = true,
  labelSize = 12,
  categoryDisplay = "shapes",
  scenarioDisplay = "colors",
}: {
  data?: MatrixRisk[];
  selectedNodeId?: string | null;
  setSelectedNodeId?: (id: string | null) => void;
  labels?: boolean;
  labelSize?: number;
  categoryDisplay?: "shapes" | "colors" | "both" | "none";
  scenarioDisplay?: "colors" | "shapes" | "none";
}) {
  const getColor = (entry: MatrixRisk, opacity: number = 1) => {
    if (scenarioDisplay === "colors") {
      return hexToRGB(SCENARIO_PARAMS[entry.scenario].color, opacity);
    }
    if (categoryDisplay === "colors" || categoryDisplay === "both") {
      return hexToRGB(
        CATEGORIES[entry.category]?.color || `rgba(150,150,150,${opacity})`,
        opacity
      );
    }

    return `rgba(150,150,150,${opacity})`;
  };

  return (
    <ResponsiveContainer width={"100%"} height={1000}>
      <ScatterChart>
        <defs>
          <linearGradient id="colorUv" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="25%" stopColor="#f4b183" stopOpacity={0.4} />
            <stop offset="50%" stopColor="#ffd966" stopOpacity={0.4} />
            <stop offset="75%" stopColor="#A9D18E" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <CartesianGrid fill="url(#colorUv)" />

        {[2, 4, 6, 8, 10, 12, 14, 16].map((i) => (
          <ReferenceLine
            stroke="rgba(0,0,0,0.2)"
            strokeDasharray="3 3"
            segment={[
              { x: Math.min(8, i), y: Math.max(0, i - 8) },
              { x: Math.max(0, i - 8), y: Math.min(8, i) },
            ]}
          />
        ))}

        <YAxis
          type="number"
          dataKey="totalProbability"
          name="probability"
          unit=""
          scale="linear"
          domain={[0, 8]}
        />
        <XAxis
          type="number"
          dataKey="totalImpact"
          name="impact"
          domain={[0, 8]}
        />
        <Tooltip
          shared={false}
          cursor={{ strokeDasharray: "3 3" }}
          content={CustomTooltip}
        />
        {/* <Tooltip /> */}
        {/* <Scatter
          data={data}
          // shape={(props: any) => {
          //   const category = props.payload.category;
          //   return <Circle />;
          // }}
        >
          {data?.map((entry, i) => (
            <Cell
              key={i}
              fill={getColor(entry)}
              stroke={`rgba(150,150,150,0.4)`}
              onClick={() => setSelectedNodeId(entry.id)}
            />
          ))}
        </Scatter> */}
        {Object.entries(CATEGORIES).map(([CATEGORY, shape]) => {
          const catData = data?.filter((d) => d.category === CATEGORY) || [];

          return (
            <Scatter
              // key={CATEGORY}
              name={`${CATEGORY} Risks`}
              data={catData}
              dataKey={CATEGORY}
              fill="#8884d8"
              shape={
                categoryDisplay === "shapes" || categoryDisplay === "both"
                  ? shape.shape
                  : "circle"
              }
            >
              {labels && (
                <LabelList
                  dataKey="hazardId"
                  position="insideTop"
                  offset={15}
                  fontSize={labelSize}
                />
              )}
              {catData.map((entry, index) => {
                let opacity = 1;
                const strokeOpacity = 0.4;
                if (selectedNodeId !== null) {
                  if (selectedNodeId !== entry.id) opacity = opacity * 0.2;
                }

                // if (nonKeyRisks !== "show" && !entry.keyRisk) {
                //   if (nonKeyRisks === "fade") {
                //     opacity = opacity * 0.2;
                //   } else {
                //     opacity = 0;
                //   }
                // }

                // if (worstCase && !entry.worstCase) {
                //   opacity = 0;
                // }

                return (
                  <Cell
                    key={`cell-${categoryDisplay}-${index}`}
                    // fill={}
                    stroke={`rgba(150,150,150,${strokeOpacity})`}
                    strokeWidth={1}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNodeId(entry.id);
                    }}
                    style={{
                      // opacity: entry.visible ? opacity : 0,
                      fill: getColor(entry, opacity),
                      transition: "all 1s ease",
                    }}
                  />
                );
              })}
            </Scatter>
          );
        })}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
