import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import useAPI, { DataTable } from "../../hooks/useAPI";
import { useEffect, useRef, useState } from "react";
import { parseRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import {
  snapshotFromRiskCascade,
  snapshotFromRiskfile,
} from "../../functions/snapshot";
import { parseCascadeSnapshot } from "../../types/dataverse/DVRiskCascade";
import { getRiskCatalogueFromSnapshots } from "../../functions/riskfiles";
import { useQuery } from "@tanstack/react-query";
import {
  Risk,
  RiskCascade,
  RiskEvent,
  Scenario,
  SimulationInput,
} from "../../functions/simulation/types";
import { RISK_TYPE } from "../../types/dataverse/Riskfile";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import useSavedState from "../../hooks/useSavedState";
import { SCENARIO_PARAMS, SCENARIOS } from "../../functions/scenarios";
import * as d3 from "d3"; // we will need d3.js
import {
  constructEventGraph,
  expandEventGraph,
} from "../../functions/simulation/monteCarlo";
import { prepareData } from "../../functions/simulation/prepareData";

type Data = {
  nodes: Node[];
  links: Link[];
};

const RADIUS = 10;

function getNodeId(riskId: string, scenario: Scenario) {
  return `${riskId}__${scenario}`;
}

function startSimulation(risk: Risk, scenario: Scenario) {
  return constructEventGraph(risk, scenario);
}

function simulationStep(
  nodesToExpand: RiskEvent[],
  riskCatalogue: Risk[],
  cascadeCatalogue: Record<string, RiskCascade>,
  existingNodes: Risk[],
) {
  const newEvents: RiskEvent[] = [];
  const newNodes: Node[] = [];
  const newLinks: Link[] = [];

  for (const node of nodesToExpand) {
    const expandedNodes = expandEventGraph(
      node,
      riskCatalogue,
      cascadeCatalogue,
      existingNodes,
    );

    newEvents.push(...expandedNodes);
    newNodes.push(
      ...expandedNodes.map((n) => ({
        id: getNodeId(n.risk.id, n.scenario),
        name: n.risk.name,
        scenario: n.scenario,
      })),
    );
    newLinks.push(
      ...expandedNodes.map((n) => ({
        source: getNodeId(node.risk.id, node.scenario),
        target: getNodeId(n.risk.id, n.scenario),
        value: 1,
      })),
    );
  }

  return { newEvents, newNodes, newLinks };
}

type Node = {
  id: string;
  name?: string;
  scenario: Scenario;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  opacity?: number;
  bornAt?: number;
  order?: number;
  rowOrder?: number;
};

type Link = {
  source: string | Node;
  target: string | Node;
};

type TooltipState = {
  node: Node;
  x: number;
  y: number;
} | null;

type NetworkDiagramProps = {
  width: number;
  height: number;
  data: Data;
};

export const NetworkDiagram = ({
  width,
  height,
  data,
}: NetworkDiagramProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);
  const hoveredNodeRef = useRef<Node | null>(null);

  const nodeMapRef = useRef<Map<string, Node>>(new Map());
  const linkMapRef = useRef<Map<string, Link>>(new Map());

  const insertionCounterRef = useRef(0);

  const [tooltip, setTooltip] = useState<TooltipState>(null);

  /* -------------------- mouse handling -------------------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const nodes = [...nodeMapRef.current.values()];
      const hit = getNodeAtPosition(nodes, x, y);

      hoveredNodeRef.current = hit;
      setTooltip(hit ? { node: hit, x, y } : null);
    };

    const onLeave = () => {
      hoveredNodeRef.current = null;
      setTooltip(null);
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* -------------------- simulation init -------------------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const sim = d3
      .forceSimulation<Node>()
      .force(
        "link",
        d3
          .forceLink<Node, Link>()
          .id((d) => d.id)
          .distance(60),
      )
      .force("charge", d3.forceManyBody().strength(-80))
      .force("collide", d3.forceCollide().radius(RADIUS))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "jitterY",
        d3
          .forceY<Node>((n) => height / 2 + (n.rowOrder || 0) * height * 0.3)
          .strength(0.2),
      )
      .force(
        "hierarchyX",
        d3
          .forceX<Node>((d) => {
            if (d.order === 0) return width * 0.15;
            return Math.min(width * 0.85, width * 0.6 + (d.order ?? 0) * 15);
          })
          .strength((d) => {
            if (d.order === 0) return 0.6;
            if (d.order != null && d.order > insertionCounterRef.current - 5)
              return 0.25;
            return 0.05;
          }),
      )
      .alphaDecay(0.02)
      .on("tick", () => {
        drawNetwork(
          ctx,
          width,
          height,
          [...nodeMapRef.current.values()],
          [...linkMapRef.current.values()],
          hoveredNodeRef.current,
        );
      });

    simulationRef.current = sim;
    return () => {
      sim.stop();
    };
  }, [width, height]);

  /* -------------------- data updates -------------------- */

  useEffect(() => {
    const sim = simulationRef.current;
    if (!sim) return;

    // reset
    if (data.nodes.length === 0) {
      nodeMapRef.current.clear();
      linkMapRef.current.clear();
      insertionCounterRef.current = 0;

      sim.nodes([]);
      (sim.force("link") as d3.ForceLink<Node, Link>).links([]);
      return;
    }

    const now = performance.now();

    // add nodes
    let rowIndex = 0;
    for (const n of data.nodes) {
      if (!nodeMapRef.current.has(n.id)) {
        nodeMapRef.current.set(n.id, {
          ...n,
          x: width / 2 + Math.random() * 40 - 20,
          y: height / 2 + Math.random() * 40 - 20,
          opacity: 0,
          bornAt: now,
          order: insertionCounterRef.current++,
          rowOrder: rowIndex,
        });
        rowIndex++;
      }
    }

    // add links
    for (const l of data.links) {
      const key = `${l.source}-${l.target}`;
      if (!linkMapRef.current.has(key)) {
        linkMapRef.current.set(key, { ...l });
      }
    }

    const nodes = [...nodeMapRef.current.values()];
    const links = [...linkMapRef.current.values()];

    sim.nodes(nodes);
    (sim.force("link") as d3.ForceLink<Node, Link>).links(links);

    sim.alpha(0.4).restart();
  }, [data, width, height]);

  return (
    <div style={{ position: "relative", width, height }}>
      <canvas ref={canvasRef} width={width} height={height} />
      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: tooltip.x + 12,
            top: tooltip.y + 12,
            background: "rgba(0,0,0,0.8)",
            color: "#fff",
            padding: "6px 8px",
            borderRadius: 4,
            fontSize: 12,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <strong>{tooltip.node.id}</strong>
          {tooltip.node.name && <div>{tooltip.node.name}</div>}
        </div>
      )}
    </div>
  );
};

/* -------------------- drawing -------------------- */

function drawNetwork(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  nodes: Node[],
  links: Link[],
  hovered: Node | null,
) {
  ctx.clearRect(0, 0, width, height);

  const now = performance.now();

  for (const n of nodes) {
    const age = Math.min((now - (n.bornAt ?? now)) / 600, 1);
    n.opacity = age;
  }

  ctx.globalAlpha = 0.3;
  links.forEach((l) => drawLink(ctx, l));

  nodes.forEach((n) => {
    ctx.globalAlpha = n.opacity ?? 1;
    drawNode(ctx, n, hovered === n);
  });

  ctx.globalAlpha = 1;
}

function drawNode(ctx: CanvasRenderingContext2D, node: Node, hovered: boolean) {
  if (node.x == null || node.y == null) return;

  ctx.beginPath();
  ctx.arc(node.x, node.y, hovered ? RADIUS + 2 : RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = hovered
    ? `${SCENARIO_PARAMS[node.scenario].color}80`
    : SCENARIO_PARAMS[node.scenario].color;
  ctx.fill();
}

function drawLink(ctx: CanvasRenderingContext2D, link: Link) {
  const s = link.source as Node;
  const t = link.target as Node;
  if (!s?.x || !s?.y || !t?.x || !t?.y) return;

  ctx.beginPath();
  ctx.moveTo(s.x, s.y);
  ctx.lineTo(t.x, t.y);
  ctx.strokeStyle = "#999";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function getNodeAtPosition(nodes: Node[], x: number, y: number): Node | null {
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i];
    if (!n.x || !n.y) continue;
    const dx = n.x - x;
    const dy = n.y - y;
    if (dx * dx + dy * dy < RADIUS * RADIUS) return n;
  }
  return null;
}

export default function RiskEventTab() {
  const api = useAPI();
  const [selectedRF, setSelectedRF] = useSavedState<DVRiskFile | null>(
    "simulationRiskFile",
    null,
  );
  const [selectedScenario, setSelectedScenario] =
    useSavedState<Scenario | null>("simulationScenario", null);
  const [simulationInput, setSimulationInput] =
    useState<SimulationInput | null>(null);
  const [nextNodes, setNextNodes] = useState<RiskEvent[]>([]);
  const [allNodes, setAllNodes] = useState<RiskEvent[]>([]);
  const [networkData, setNetworkData] = useState<Data | null>(null);

  const { data: rfs } = useQuery({
    queryKey: [DataTable.RISK_FILE],
    queryFn: () => api.getRiskFiles(),
    select: (data) => data.filter((rf) => !rf.cr4de_hazard_id.startsWith("X")),
  });

  const { data: cs } = useQuery({
    queryKey: [DataTable.RISK_CASCADE],
    queryFn: () => api.getRiskCascades(),
  });

  const runSimulation = async () => {
    if (!rfs || !cs || !selectedRF || !selectedScenario) return;

    const riskSnapshots = rfs.map(snapshotFromRiskfile).map(parseRiskSnapshot);
    const rc = getRiskCatalogueFromSnapshots(riskSnapshots);
    const cascadeSnapshots = cs
      .filter((cs) => rc[cs._cr4de_cause_hazard_value])
      .map((cs) =>
        snapshotFromRiskCascade(rc[cs._cr4de_cause_hazard_value], cs, true),
      )
      .map(parseCascadeSnapshot);

    const input = prepareData(riskSnapshots, cascadeSnapshots);
    setSimulationInput(input);

    const risk = input.riskCatalogue.find(
      (r) => r.id === selectedRF.cr4de_riskfilesid,
    );

    if (!risk) return;

    const rn = startSimulation(risk, selectedScenario);
    setNetworkData({
      nodes: [
        {
          id: getNodeId(rn.risk.id, rn.scenario),
          name: rn.risk.name,
          scenario: rn.scenario,
        },
      ],
      links: [],
    });
    setNextNodes([rn]);
    setAllNodes([rn]);
  };

  const handleAdvance = () => {
    if (!simulationInput) return;

    const newStuff = simulationStep(
      nextNodes,
      simulationInput.riskCatalogue,
      simulationInput.cascadeCatalogue,
      allNodes.map((n) => n.risk),
    );

    setNextNodes(newStuff.newEvents);
    setAllNodes([...allNodes, ...newStuff.newEvents]);
    setNetworkData({
      nodes: [...(networkData?.nodes || []), ...newStuff.newNodes],
      links: [...(networkData?.links || []), ...newStuff.newLinks],
    });
  };

  return (
    // <Container sx={{ mb: 18 }}>
    <Box sx={{ m: 4 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{}}>
          <FormGroup>
            <FormControl>
              <InputLabel id="rf-label">Riskfile to simulate</InputLabel>
              <Select
                labelId="rf-label"
                variant="outlined"
                label="Riskfile to simulate"
                value={selectedRF?.cr4de_riskfilesid || ""}
                onChange={(e) =>
                  setSelectedRF(
                    rfs?.find(
                      (rf) => rf.cr4de_riskfilesid === e.target.value,
                    ) || null,
                  )
                }
              >
                <MenuItem value={""}>All</MenuItem>
                {rfs
                  ?.filter((rf) => rf.cr4de_risk_type !== RISK_TYPE.EMERGING)
                  .sort((a, b) =>
                    a.cr4de_hazard_id.localeCompare(b.cr4de_hazard_id),
                  )
                  .map((rf) => (
                    <MenuItem value={rf.cr4de_riskfilesid}>
                      {rf.cr4de_hazard_id} {rf.cr4de_title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <InputLabel id="scenario-label">Scenario to simulate</InputLabel>
              <Select<Scenario | "">
                labelId="scenario-label"
                variant="outlined"
                value={selectedScenario || ""}
                onChange={(e) =>
                  setSelectedScenario(
                    e.target.value !== "" ? e.target.value : null,
                  )
                }
                label="Scenario to simulate"
              >
                <MenuItem value={""}>All</MenuItem>
                <MenuItem value={SCENARIOS.CONSIDERABLE}>
                  {SCENARIOS.CONSIDERABLE}
                </MenuItem>
                <MenuItem value={SCENARIOS.MAJOR}>{SCENARIOS.MAJOR}</MenuItem>
                <MenuItem value={SCENARIOS.EXTREME}>
                  {SCENARIOS.EXTREME}
                </MenuItem>
              </Select>
            </FormControl>
          </FormGroup>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button
            disabled={!rfs || !cs}
            color="warning"
            onClick={runSimulation}
          >
            Simulate Risk Event
          </Button>
          <Button
            disabled={!rfs || !cs}
            color="warning"
            onClick={handleAdvance}
          >
            Advance Simulation
          </Button>
          <Button
            disabled={!rfs || !cs}
            color="warning"
            onClick={() => setNetworkData(null)}
          >
            Clear Simulation
          </Button>
        </CardActions>
      </Card>

      <Card sx={{ my: 2, mb: 10 }}>
        <CardHeader title="Event Tree" />
        <CardContent>
          <Box>
            {networkData !== null && (
              <NetworkDiagram data={networkData} width={1000} height={600} />
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
