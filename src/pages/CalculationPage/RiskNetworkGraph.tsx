import { useMemo, useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { CascadeCalculation, RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import * as d3 from "d3";
import { SCENARIO_SUFFIX } from "../../functions/scenarios";

export interface RiskNode extends d3.SimulationNodeDatum {
  id: string;
  riskTitle: string;

  category: string;
  value: number;
}

export interface CascadeLink extends d3.SimulationLinkDatum<RiskNode> {
  testId: string;

  source: string;
  target: string;
  value: number;

  p: CascadeCalculation;
  i: CascadeCalculation;
}

const graphHeight = 600;
const margin = {
  top: 5,
  bottom: 5,
  left: 5,
  right: 5,
};

export default function RiskNetworkGraph({
  calculations,
  selectedNodeId,
  setSelectedNodeId,
}: {
  calculations: RiskCalculation[] | null;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
}) {
  const graphElement = useRef<SVGSVGElement | null>(null);
  const [graph, setGraph] = useState<{ nodes: RiskNode[]; links: CascadeLink[] } | null>(null);

  const [graphWidth, setGraphWidth] = useState<number>(0);

  const [parameter, setParameter] = useState<"r" | "p" | "i">("p");
  const [scenario, setScenario] = useState<"all" | SCENARIO_SUFFIX>("all");
  const [filter, setFilter] = useState<"ALL" | "CAUSES" | "EFFECTS">("ALL");

  useMemo(() => {
    if (!calculations) return;

    const g = { nodes: [] as RiskNode[], links: [] as CascadeLink[] };

    // function recurseNode(risk: RiskCalculation, depth: number) {
    //   if (!g.nodes.find((n) => n.id === risk.riskId)) {
    //     g.nodes.push({
    //       id: risk.riskId,
    //       riskTitle: risk.riskTitle,
    //       category: "A",
    //       tp: (risk.tp_c + risk.tp_m + risk.tp_e) / 3,
    //       // tp: depth,
    //     });
    //   }
    //   risk.causes.forEach((c) => {
    //     g.links.push({
    //       source: c.cause.riskId,
    //       target: c.effect.riskId,
    //       value: (c.ip_c + c.ip_m + c.ip_e) / 3,
    //       // value: depth,
    //     });
    //     recurseNode(c.cause, depth - 5);
    //   });
    // }
    // recurseNode(calculations[0], 50);

    for (let c of calculations) {
      const scenarioClean = scenario === "all" ? "" : scenario;

      g.nodes.push({
        id: c.riskId,
        riskTitle: c.riskTitle,
        category: "A",
        value: c[`t${parameter}${scenarioClean}` as keyof RiskCalculation] as number,
      });

      const links = [] as Partial<CascadeLink>[];

      for (let cascade of c.causes) {
        links.push({
          testId: `${cascade.cause.riskId}-${cascade.effect.riskId}`,
          source: cascade.cause.riskId,
          target: cascade.effect.riskId,
          p: cascade,
        });
      }

      for (let cascade of c.effects) {
        const id = `${cascade.cause.riskId}-${cascade.effect.riskId}`;
        const link = links.find((l) => l.testId === id);

        if (!link) {
          links.push({
            testId: `${cascade.cause.riskId}-${cascade.effect.riskId}`,
            source: cascade.cause.riskId,
            target: cascade.effect.riskId,
            i: cascade,
          });
        } else {
          link.i = cascade;
        }
      }

      (links as CascadeLink[]).forEach((l) => {
        if (parameter === "p") {
          l.value = l.p ? (l.p[`i${parameter}${scenarioClean}` as keyof CascadeCalculation] as number) : 0;
        } else if (parameter === "i") {
          l.value = l.i ? (l.i[`i${parameter}${scenarioClean}` as keyof CascadeCalculation] as number) : 0;
        } else {
          l.value =
            (l.p ? (l.p[`i${parameter}${scenarioClean}` as keyof CascadeCalculation] as number) : 0) ||
            (l.i ? (l.i[`i${parameter}${scenarioClean}` as keyof CascadeCalculation] as number) : 0);
        }
      });

      g.links = [...g.links, ...(links as CascadeLink[])];
    }

    setGraph(g);
  }, [calculations, parameter, scenario]);

  useEffect(() => {
    if (!graphElement.current) return;

    setGraphWidth(graphElement.current.getBoundingClientRect().width);
  }, []);

  useEffect(() => {
    if (!graph) return;

    const width = graphWidth - margin.left - margin.right;
    const height = graphHeight - margin.top - margin.bottom;

    d3.selectAll("#network-graph > *").remove();

    var svg = d3.select("#network-graph").append("g");
    // .attr("transform", "translate(" + margin.top + "," + margin.left + ")");

    // links between nodes
    var links = graph.links.filter((l) => {
      // if (l.value < minIp + 0.001 * (maxIp - minIp)) return false;

      let show =
        // @ts-expect-error
        !selectedNodeId || (l.source.id || l.source) === selectedNodeId || (l.target.id || l.target) === selectedNodeId;

      if (selectedNodeId && filter === "CAUSES") {
        // @ts-expect-error
        show = show && (l.target.id || l.target) === selectedNodeId;
      }
      if (selectedNodeId && filter === "EFFECTS") {
        // @ts-expect-error
        show = show && (l.source.id || l.source) === selectedNodeId;
      }

      return show;
    });
    // set the nodes
    var nodes = graph.nodes.filter(
      (n) =>
        !selectedNodeId ||
        n.id === selectedNodeId ||
        // @ts-expect-error
        links.some((l) => (l.source.id || l.source) === n.id || (l.target.id || l.target) === n.id)
    );

    const minTp = nodes.reduce((m, n) => (m > n.value ? n.value : m), Infinity);
    const maxTp = nodes.reduce((m, n) => (m < n.value ? n.value : m), 0);
    const minIp = links.reduce((m, l) => (m > l.value ? l.value : m), Infinity);
    const maxIp = links.reduce((m, l) => (m < l.value ? l.value : m), 0);

    const radius = (n: RiskNode) => 5 + (10 * (n.value - minTp)) / (maxTp - minTp);

    // create a tooltip
    var tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");

    svg
      .append("svg:defs")
      .selectAll("marker")
      .data(["end"]) // Different link/path types can be defined here
      .enter()
      .append("svg:marker") // This section adds in the arrows
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", 0.5)
      .attr("markerWidth", 2)
      .attr("markerHeight", 2)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#aaa");

    // add the curved links to our graphic
    var link = svg
      .selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke-width", function (d) {
        return 1;
        // return 5 + (8 * (d.value - minIp)) / (maxIp - minIp);
      })
      .attr("stroke", function (d) {
        return "#aaa";
      })
      .attr("marker-end", "url(#end)");

    // add the nodes to the graphic
    var node = svg.selectAll(".node").data(nodes).enter().append("g");

    node
      .append("circle")
      .attr("class", "node")
      .attr("r", radius)
      .attr("fill", function (d) {
        return "#0087DC";
      })
      .on("mouseover", mouseOver(0.2))
      .on("mouseout", mouseOut)
      .on("click", (e, d) => {
        setSelectedNodeId(d.id);
      })
      .on("contextmenu", (e, d) => {
        e.preventDefault();
        setSelectedNodeId(null);
      });

    // hover text for the node
    node.append("title").text(function (d) {
      return `${d.riskTitle}: ${d.value}`;
    });
    // hover text for the node
    link.append("title").text(function (d) {
      return `${d.value}`;
    });

    // run d3-force to find the position of nodes on the canvas
    const simulation = d3
      .forceSimulation(nodes)

      // list of forces we apply to get node positions
      .force(
        "link",
        d3
          .forceLink<RiskNode, CascadeLink>(links)
          .id((d) => d.id)
          .strength((d) => Math.min(1, (10 * d.value) / (50 * maxIp)))
      )
      .force(
        "collide",
        d3.forceCollide().radius((d) => radius(d as RiskNode) + 15)
      )
      .force(
        "charge",
        d3.forceManyBody().strength((d) => (-500 * (d as RiskNode).value) / maxTp)
      )
      .force("center", d3.forceCenter(width / 2, height / 2))

      // at each iteration of the simulation, draw the network diagram with the new node positions
      .on("tick", ticked);

    function ticked() {
      link.attr("d", positionLink);
      node.attr("transform", positionNode);
    }

    // links are drawn as curved paths between nodes,
    // through the intermediate nodes
    function positionLink(d: CascadeLink) {
      var offset = 30;

      // @ts-expect-error
      var midpoint_x = (d.source.x + d.target.x) / 2;
      // @ts-expect-error
      var midpoint_y = (d.source.y + d.target.y) / 2;

      // @ts-expect-error
      var dx = d.target.x - d.source.x;
      // @ts-expect-error
      var dy = d.target.y - d.source.y;

      var normalise = Math.sqrt(dx * dx + dy * dy);

      var offSetX = midpoint_x + offset * (dy / normalise);
      var offSetY = midpoint_y - offset * (dx / normalise);

      // @ts-expect-error
      return "M" + d.source.x + "," + d.source.y + "S" + offSetX + "," + offSetY + " " + d.target.x + "," + d.target.y;
    }

    // move the node based on forces calculations
    function positionNode(d: RiskNode) {
      // keep the node within the boundaries of the svg
      // @ts-expect-error
      if (d.x < radius(d)) {
        d.x = radius(d);
      }
      // @ts-expect-error
      if (d.y < radius(d)) {
        d.y = radius(d);
      }
      // @ts-expect-error
      if (d.x > width - radius(d)) {
        d.x = width - radius(d);
      }
      // @ts-expect-error
      if (d.y > height - radius(d)) {
        d.y = height - radius(d);
      }
      return "translate(" + d.x + "," + d.y + ")";
    }

    // build a dictionary of nodes that are linked
    var linkedByIndex: { [key: string]: number } = {};
    links.forEach(function (d) {
      // @ts-expect-error
      linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });

    // check the dictionary to see if nodes are linked
    function isConnected(a: RiskNode, b: RiskNode) {
      return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
    }

    // fade nodes on hover
    function mouseOver(opacity: number) {
      return function (e: MouseEvent, d: RiskNode) {
        // check all other nodes to see if they're connected
        // to this one. if so, keep the opacity at 1, otherwise
        // fade
        node.style("stroke-opacity", function (o) {
          const thisOpacity = isConnected(d, o) ? 1 : opacity;
          return thisOpacity;
        });
        node.style("fill-opacity", function (o) {
          const thisOpacity = isConnected(d, o) ? 1 : opacity;
          return thisOpacity;
        });
        // also style link accordingly
        link.style("stroke-opacity", function (o) {
          // @ts-expect-error
          return o.source === d || o.target === d ? 1 : opacity;
        });
        link.style("stroke", function (o) {
          // @ts-expect-error
          return o.source === d || o.target === d ? o.source.colour : "#ddd";
        });
      };
    }

    function mouseOut() {
      node.style("stroke-opacity", 1);
      node.style("fill-opacity", 1);
      link.style("stroke-opacity", 1);
      link.style("stroke", "#ddd");
    }
  }, [graphWidth, graph, selectedNodeId, filter]);

  return (
    <Accordion disabled={!calculations}>
      <AccordionSummary>
        <Typography variant="subtitle2">Risk network graph</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{}}>
        {!graph && (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="caption">Please run calculations to display graph</Typography>
          </Box>
        )}

        <Box sx={{ border: "1px solid #eee" }}>
          <svg
            id="network-graph"
            ref={graphElement}
            width={`calc(100% - ${margin.left + margin.right}px)`}
            height={graph ? graphHeight - margin.top - margin.bottom : 0}
            style={{
              marginLeft: margin.left,
              marginRight: margin.right,
              marginTop: margin.top,
              marginBottom: margin.bottom,
            }}
          />
        </Box>
      </AccordionDetails>
      <AccordionActions>
        <Stack direction="row" spacing={5} sx={{ flex: 1 }}>
          <FormControl sx={{ flex: 1 }} fullWidth>
            <InputLabel>Node Size</InputLabel>
            <Select value={parameter} label="Node Size" onChange={(e) => setParameter(e.target.value as any)}>
              <MenuItem value={"r"}>Total Risk</MenuItem>
              <MenuItem value={"p"}>Total Probability</MenuItem>
              <MenuItem value={"i"}>Total Impact</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ flex: 1 }} fullWidth>
            <InputLabel>Show Scenario</InputLabel>
            <Select value={scenario} label="Show Scenario" onChange={(e) => setScenario(e.target.value as any)}>
              <MenuItem value={"all"}>All</MenuItem>
              <MenuItem value={"_c"}>Considerable</MenuItem>
              <MenuItem value={"_m"}>Major</MenuItem>
              <MenuItem value={"_e"}>Extreme</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ flex: 1 }} fullWidth>
            <InputLabel>Filter</InputLabel>
            <Select value={filter} label="Filter" onChange={(e) => setFilter(e.target.value as any)}>
              <MenuItem value={"ALL"}>Causes & Effects</MenuItem>
              <MenuItem value={"CAUSES"}>Causes only</MenuItem>
              <MenuItem value={"EFFECTS"}>Effects only</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </AccordionActions>
    </Accordion>
  );
}
