import { Layer, Rectangle, ResponsiveContainer, Sankey } from "recharts";
import {
  CPMatrix,
  DVCascadeSnapshot,
  parseCPMatrix,
  serializeCPMatrix as serializeCPMatrixSnapshot,
} from "../../types/dataverse/DVCascadeSnapshot";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { LinkProps, NodeProps } from "recharts/types/chart/Sankey";
import { SCENARIO_PARAMS, SCENARIOS } from "../../functions/scenarios";
import { Box, Button, Slider, Stack, Typography } from "@mui/material";
import { IntensityParameter } from "../../functions/intensityParameters";
import { SankeyLink, SankeyNode } from "recharts/types/util/types";
import {
  getIntervalStringMScale3,
  getIntervalStringMScale7,
  mScale3FromPAbs,
  mScale7FromPAbs,
  pAbsFromMScale3,
  pAbsFromMScale7,
} from "../../functions/indicators/motivation";
import { Indicators } from "../../types/global";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../BasePage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DVRiskCascade,
  serializeCPMatrix,
} from "../../types/dataverse/DVRiskCascade";
import useAPI, { DataTable } from "../../hooks/useAPI";

const scenarioHeight = 300;

type ScenarioSankeyNode = {
  index: number;
  name: string;
  //   description: ReactNode;
  color: string;
  align: "left" | "right";
  description: ReactNode;
};

interface ScenarioSankeyLink extends SankeyLink {
  index: number;
  causeScenario: SCENARIOS;
  effectScenario: SCENARIOS;
  cpValue: number;
}

const ScenarioText = ({
  scenario,
}: {
  scenario: IntensityParameter<string>[];
}) => (
  <Stack direction="column" sx={{ mt: 2 }}>
    {scenario.map((p) => (
      <Typography variant="body1" sx={{}}>
        <b>{p.name}:</b> {p.value}
      </Typography>
    ))}
  </Stack>
);

const getLinkProps = (
  cpMatrix: CPMatrix,
  causeScenario: SCENARIOS,
  effectScenario: SCENARIOS,
  indicators: Indicators
) => {
  const mValue =
    indicators === Indicators.V1
      ? cpMatrix[causeScenario][effectScenario].scale3
      : cpMatrix[causeScenario][effectScenario].scale7;

  return {
    causeScenario,
    effectScenario,
    value: Math.max(indicators === Indicators.V1 ? 0.2 : 0.5, mValue),
    cpValue: mValue,
  };
};

export default function CascadeSankey({
  cause,
  effect,
  cascade,
}: {
  cause: DVRiskSnapshot;
  effect: DVRiskSnapshot;
  cascade: DVCascadeSnapshot;
}) {
  const api = useAPI();
  const queryClient = useQueryClient();
  const { indicators } = useOutletContext<BasePageContext>();
  const [hoverNodeIndex, setHoverNodeIndex] = useState<number | null>(null);
  const [hoverLinkIndex, setHoverLinkIndex] = useState<number | null>(null);
  const [innerCascade, setInnerCascade] = useState<DVCascadeSnapshot>(cascade);
  const mutation = useMutation({
    mutationFn: async (
      newC: Partial<DVRiskCascade> & { cr4de_bnrariskcascadeid: string }
    ) => api.updateCascade(newC.cr4de_bnrariskcascadeid, newC),
    onSuccess: async () => {
      // If you're invalidating a single query
      await queryClient.invalidateQueries({
        queryKey: [DataTable.RISK_CASCADE],
      });
    },
  });

  const causeScenarios = JSON.parse(cause.cr4de_scenarios || "");
  const effectScenarios = JSON.parse(effect.cr4de_scenarios || "");

  const handleChangeCP = async (
    causeScenario: SCENARIOS,
    effectScenario: SCENARIOS,
    newValue: number
  ) => {
    const pAbs =
      indicators === Indicators.V1
        ? pAbsFromMScale3(newValue)
        : pAbsFromMScale7(newValue);
    const updatedCPMatrix = parseCPMatrix(cascade.cr4de_quanti_cp);
    updatedCPMatrix[causeScenario][effectScenario] = {
      abs: Math.round(100 * pAbs) / 100,
      scale3:
        indicators === Indicators.V1
          ? newValue
          : Math.round(10 * mScale3FromPAbs(pAbs)) / 10,
      scale7:
        indicators === Indicators.V1
          ? Math.round(10 * mScale7FromPAbs(pAbs)) / 10
          : newValue,
    };

    const cpMatrix = updatedCPMatrix;

    mutation.mutate({
      cr4de_bnrariskcascadeid: cascade._cr4de_risk_cascade_value,
      cr4de_quanti_input: serializeCPMatrix(cpMatrix),
    });

    setInnerCascade({
      ...innerCascade,
      cr4de_quanti_cp: serializeCPMatrixSnapshot({
        [SCENARIOS.CONSIDERABLE]: {
          ...cpMatrix[SCENARIOS.CONSIDERABLE],
          avg: 0,
        },
        [SCENARIOS.MAJOR]: { ...cpMatrix[SCENARIOS.MAJOR], avg: 0 },
        [SCENARIOS.EXTREME]: { ...cpMatrix[SCENARIOS.EXTREME], avg: 0 },
      }),
    });
  };

  useEffect(() => {
    setInnerCascade(cascade);
  }, [setInnerCascade, cascade]);

  let isJsonScenario = false;
  try {
    JSON.parse(effectScenarios.considerable);
    isJsonScenario = true;
  } catch {
    // empty
  }

  const cpMatrix = useMemo(
    () => parseCPMatrix(innerCascade.cr4de_quanti_cp),
    [innerCascade]
  );

  const data: {
    nodes: ScenarioSankeyNode[];
    links: ScenarioSankeyLink[];
  } = useMemo(
    () => ({
      nodes: [
        {
          index: 0,
          name: "Considerable Actors",
          color: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
          align: "left",
          description: (
            <Box
              dangerouslySetInnerHTML={{ __html: causeScenarios.considerable }}
            />
          ),
        },
        {
          index: 1,
          name: "Major Actors",
          color: SCENARIO_PARAMS[SCENARIOS.MAJOR].color,
          align: "left",
          description: (
            <Box dangerouslySetInnerHTML={{ __html: causeScenarios.major }} />
          ),
        },
        {
          index: 2,
          name: "Extreme Actors",
          color: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
          align: "left",
          description: (
            <Box dangerouslySetInnerHTML={{ __html: causeScenarios.extreme }} />
          ),
        },
        {
          index: 3,
          name: "Considerable Attack",
          color: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
          align: "right",
          description: isJsonScenario ? (
            <ScenarioText scenario={JSON.parse(effectScenarios.considerable)} />
          ) : (
            <Box
              dangerouslySetInnerHTML={{ __html: effectScenarios.considerable }}
            />
          ),
        },
        {
          index: 4,
          name: "Major Attack",
          color: SCENARIO_PARAMS[SCENARIOS.MAJOR].color,
          align: "right",
          description: isJsonScenario ? (
            <ScenarioText scenario={JSON.parse(effectScenarios.major)} />
          ) : (
            <Box
              dangerouslySetInnerHTML={{ __html: effectScenarios.considerable }}
            />
          ),
        },
        {
          index: 5,
          name: "Extreme Attack",
          color: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
          align: "right",
          description: isJsonScenario ? (
            <ScenarioText scenario={JSON.parse(effectScenarios.extreme)} />
          ) : (
            <Box
              dangerouslySetInnerHTML={{ __html: effectScenarios.considerable }}
            />
          ),
        },
      ],
      links: [
        {
          index: 0,
          source: 0,
          target: 3,
          ...getLinkProps(
            cpMatrix,
            SCENARIOS.CONSIDERABLE,
            SCENARIOS.CONSIDERABLE,
            indicators
          ),
        },
        {
          index: 1,
          source: 0,
          target: 4,
          ...getLinkProps(
            cpMatrix,
            SCENARIOS.CONSIDERABLE,
            SCENARIOS.MAJOR,
            indicators
          ),
        },
        {
          index: 2,
          source: 0,
          target: 5,
          ...getLinkProps(
            cpMatrix,
            SCENARIOS.CONSIDERABLE,
            SCENARIOS.EXTREME,
            indicators
          ),
        },
        {
          index: 3,
          source: 1,
          target: 3,
          ...getLinkProps(
            cpMatrix,
            SCENARIOS.MAJOR,
            SCENARIOS.CONSIDERABLE,
            indicators
          ),
        },
        {
          index: 4,
          source: 1,
          target: 4,
          ...getLinkProps(
            cpMatrix,
            SCENARIOS.MAJOR,
            SCENARIOS.MAJOR,
            indicators
          ),
        },
        {
          index: 5,
          source: 1,
          target: 5,
          ...getLinkProps(
            cpMatrix,
            SCENARIOS.MAJOR,
            SCENARIOS.EXTREME,
            indicators
          ),
        },
        {
          index: 6,
          source: 2,
          target: 3,
          ...getLinkProps(
            cpMatrix,
            SCENARIOS.EXTREME,
            SCENARIOS.CONSIDERABLE,
            indicators
          ),
        },
        {
          index: 7,
          source: 2,
          target: 4,
          ...getLinkProps(
            cpMatrix,
            SCENARIOS.EXTREME,
            SCENARIOS.MAJOR,
            indicators
          ),
        },
        {
          index: 8,
          source: 2,
          target: 5,
          ...getLinkProps(
            cpMatrix,
            SCENARIOS.EXTREME,
            SCENARIOS.EXTREME,
            indicators
          ),
        },
      ],
    }),
    [causeScenarios, cpMatrix, effectScenarios, indicators, isJsonScenario]
  );

  return (
    <Box
      sx={{
        mx: "auto",
        my: 4,
        px: 4,
        width: "100%",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <ResponsiveContainer width="40%" height={3 * scenarioHeight}>
        <Sankey
          data={data}
          node={(props) => (
            <PSankeyNode
              {...props}
              hoverNode={
                hoverNodeIndex === null ? null : data.nodes[hoverNodeIndex]
              }
              hoverLink={
                hoverLinkIndex === null ? null : data.links[hoverLinkIndex]
              }
              setHoverIndex={setHoverNodeIndex}
            />
          )}
          link={(props) => (
            <PSankeyLink
              {...props}
              payload={
                props.payload as unknown as Omit<
                  ScenarioSankeyLink,
                  "source" | "target"
                > & {
                  source: SankeyNode & ScenarioSankeyNode;
                  target: SankeyNode & ScenarioSankeyNode;
                }
              }
              hoverNode={
                hoverNodeIndex === null ? null : data.nodes[hoverNodeIndex]
              }
              hoverLink={
                hoverLinkIndex === null ? null : data.links[hoverLinkIndex]
              }
              setHoverIndex={setHoverLinkIndex}
              onChangeCP={handleChangeCP}
            />
          )}
          iterations={0}
        ></Sankey>
      </ResponsiveContainer>
    </Box>
  );
}

function PSankeyNode({
  index,
  payload,
  x,
  y,
  width,
  height,
  hoverNode,
  hoverLink,
  setHoverIndex,
}: NodeProps & {
  hoverNode: ScenarioSankeyNode | null;
  hoverLink: ScenarioSankeyLink | null;
  setHoverIndex: (i: number | null) => void;
}) {
  const p = payload as unknown as ScenarioSankeyNode;

  const textStyle =
    p.align === "left"
      ? {
          textAnchor: "end",
          x: x - 15,
        }
      : {
          textAnchor: "start",
          x: x + 20,
        };

  const descriptionStyle =
    p.align === "left"
      ? {
          x: "calc(-75% + 0px)",
        }
      : {
          x: "calc(100% + 5px)",
        };

  let shouldBeOpaque,
    shouldShowDescription = false;
  let shouldShowName = true;
  if (hoverNode !== null) {
    if (
      (index < 3 && hoverNode.index < 3) ||
      (index >= 3 && hoverNode.index >= 3)
    ) {
      shouldBeOpaque = hoverNode.index === index;
      shouldShowName = hoverNode.index === index;
    } else {
      shouldBeOpaque = true;
      shouldShowName = true;
    }
  } else if (hoverLink !== null) {
    if (hoverLink.source === index || hoverLink.target === index) {
      shouldBeOpaque = true;
    } else {
      shouldShowName = false;
    }
  }
  if (hoverNode !== null) {
    if (
      (index < 3 && hoverNode.index < 3) ||
      (index >= 3 && hoverNode.index >= 3)
    ) {
      shouldShowDescription = hoverNode.index === index;
    }
  } else if (hoverLink !== null) {
    if (hoverLink.source === index || hoverLink.target === index) {
      shouldShowDescription = true;
    }
  }

  return (
    <Layer
      className="scenario-node"
      key={`scenarioNode${index}`}
      onMouseEnter={() => setHoverIndex(index)}
      onMouseLeave={() => setHoverIndex(null)}
      style={{ opacity: shouldBeOpaque ? 1 : 0.2 }}
    >
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={p.color}
        fillOpacity="1"
        // style={{ cursor: payload.cascade ? "pointer" : "default" }}
      />
      <text
        opacity={shouldShowName ? 1 : 0}
        y={y + 20}
        // fontSize={fontSize ? fontSize - 2 : "14"}
        stroke="#333"
        cursor="pointer"
        {...textStyle}
      >
        {payload.name}
      </text>
      <foreignObject
        opacity={shouldShowDescription ? 1 : 0}
        width="75%"
        height={scenarioHeight}
        {...descriptionStyle}
        y={y + 20}
      >
        <Box>{p.description}</Box>
      </foreignObject>
    </Layer>
  );
}

function PSankeyLink(
  props: LinkProps & {
    payload: Omit<ScenarioSankeyLink, "target" | "source"> & {
      source: ScenarioSankeyNode;
      target: ScenarioSankeyNode;
    };
    hoverNode: ScenarioSankeyNode | null;
    hoverLink: ScenarioSankeyLink | null;
    setHoverIndex: (l: number | null) => void;
    onChangeCP: (
      causeScenario: SCENARIOS,
      effectScenario: SCENARIOS,
      newValue: number
    ) => Promise<void>;
  }
) {
  const {
    index,
    payload,
    hoverNode,
    hoverLink,
    setHoverIndex,
    sourceX,
    sourceY,
    sourceControlX,
    targetX,
    targetY,
    targetControlX,
    linkWidth: rawLinkWidth,
    onChangeCP,
  } = props;
  const { indicators } = useOutletContext<BasePageContext>();
  const [editValue, setEditValue] = useState<number | null>(null);

  let shouldBeOpaque = false;
  if (hoverLink !== null) {
    shouldBeOpaque = index === hoverLink.index;
  } else if (hoverNode !== null) {
    shouldBeOpaque =
      hoverNode.index === payload.target.index ||
      hoverNode.index === payload.source.index;
  }

  const linkWidth = Math.max(10, rawLinkWidth);

  return (
    <Layer
      style={{
        opacity: shouldBeOpaque ? 1 : 0.2,
        pointerEvents: hoverLink === null || shouldBeOpaque ? "auto" : "none",
      }}
    >
      <path
        className="recharts-sankey-link"
        d={`
          M${sourceX},${sourceY}
          C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
        `}
        fill="none"
        stroke="#333"
        strokeWidth={linkWidth}
        strokeOpacity="0.2"
        onMouseEnter={() => setHoverIndex(index)}
        onMouseLeave={() => {
          if (editValue !== null) return;

          setHoverIndex(null);
        }}
        onClick={() => setEditValue(payload.cpValue)}
      />
      {editValue === null && (
        <>
          <text
            pointerEvents="none"
            opacity={shouldBeOpaque ? 1 : 0}
            x={sourceX + (targetX - sourceX) / 2}
            y={(sourceY + targetY) / 2 - 5}
            textAnchor="middle"
            fontWeight="bold"
          >
            M{payload.cpValue}
          </text>
          <text
            pointerEvents="none"
            opacity={shouldBeOpaque ? 1 : 0}
            x={sourceX + (targetX - sourceX) / 2}
            y={(sourceY + targetY) / 2 + 15}
            textAnchor="middle"
          >
            {indicators === Indicators.V1
              ? getIntervalStringMScale3(payload.cpValue)
              : getIntervalStringMScale7(payload.cpValue)}
          </text>
        </>
      )}
      {editValue !== null && (
        <foreignObject
          width="80%"
          height="300"
          y={(sourceY + targetY) / 2 - 150}
          x="10%"
          style={{}}
        >
          <EditMBox
            indicators={indicators}
            editValue={editValue}
            setEditValue={setEditValue}
            setHoverIndex={setHoverIndex}
            onChange={(newVal) =>
              onChangeCP(payload.causeScenario, payload.effectScenario, newVal)
            }
          />
        </foreignObject>
      )}
    </Layer>
  );
}

function EditMBox({
  indicators,
  editValue,
  setEditValue,
  setHoverIndex,
  onChange,
}: {
  indicators: Indicators;
  editValue: number;
  setEditValue: (n: number | null) => void;
  setHoverIndex: (n: number | null) => void;
  onChange: (n: number) => Promise<void>;
}) {
  return (
    <Box
      sx={{
        px: 4,
        py: 4,
        textAlign: "center",
        bgcolor: "rgba(255,255,255,0.9)",
        border: "2px solid #eee",
        height: 300,
      }}
    >
      <Slider
        value={editValue}
        valueLabelDisplay="off"
        step={0.5}
        marks={(indicators === Indicators.V1
          ? [0, 1, 2, 3]
          : [0, 1, 2, 3, 4, 5, 6, 7]
        ).map((m) => ({
          value: m,
          label: `M${m}`,
        }))}
        min={0}
        max={indicators === Indicators.V1 ? 3.5 : 7.5}
        onChange={(_, v) => setEditValue(v)}
      />
      <Typography variant="body1" sx={{ mt: 2 }}>
        This value represents an estimated probability of{" "}
        <b>
          {indicators === Indicators.V1
            ? getIntervalStringMScale3(editValue)
            : getIntervalStringMScale7(editValue)}
        </b>{" "}
        for actors of this group to succesfully execute an attack of this
        magnitude in the next 5 years
      </Typography>
      <Button
        variant="contained"
        color="warning"
        sx={{ mt: 4, mx: 2 }}
        onClick={() => {
          setEditValue(null);
          setHoverIndex(null);
        }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        sx={{ mt: 4, mx: 2 }}
        onClick={() => {
          onChange(editValue);
          setEditValue(null);
          setHoverIndex(null);
        }}
      >
        Save
      </Button>
    </Box>
  );
}
