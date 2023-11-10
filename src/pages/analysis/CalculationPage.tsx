import { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Card,
  CardActions,
  CardContent,
  Button,
  Box,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Stack,
} from "@mui/material";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useRecords from "../../hooks/useRecords";
import useAPI, { DataTable } from "../../hooks/useAPI";
import { DVRiskFile, RISK_FILE_QUANTI_FIELDS } from "../../types/dataverse/DVRiskFile";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import prepareRiskFiles from "../../functions/analysis/prepareRiskFiles";
import convergeProbabilities from "../../functions/analysis/convergeProbabilities";
import convergeImpacts from "../../functions/analysis/convergeImpacts";
import { DIRECT_ANALYSIS_QUANTI_FIELDS, DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { CASCADE_ANALYSIS_QUANTI_FIELDS, DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { v4 as uuid } from "uuid";
import { DVParticipation } from "../../types/dataverse/DVParticipation";
import { DVContact } from "../../types/dataverse/DVContact";
import calculateMetrics from "../../functions/analysis/calculateMetrics";
import runAnalysis from "../../functions/analysis/runAnalysis";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import * as d3 from "d3";

const width = 1400;
const height = 600;
const RADIUS = 10;
var margin = {
  top: 50,
  bottom: 50,
  left: 50,
  right: 50,
};

export interface RiskNode extends d3.SimulationNodeDatum {
  id: string;
  riskTitle: string;

  category: string;
  tp: number;
}

export interface CascadeLink extends d3.SimulationLinkDatum<RiskNode> {
  source: string;
  target: string;
  value: number;
}

const roundNumberField = (n: number) => {
  if (n > 10) return Math.round(n);

  return Math.round(1000 * n) / 1000;
};

const roundNumberFields = (obj: object) => {
  return (Object.keys(obj) as Array<keyof typeof obj>).reduce(
    (rounded, key) => ({
      ...rounded,
      [key]: typeof obj[key] === "number" ? roundNumberField(obj[key] as number) : obj[key],
    }),
    {}
  );
};

const roundPerc = (v: number) => Math.round(v * 10000) / 100 + "%";

export default function CalculationPage() {
  const api = useAPI();
  const [useableDAs, setUseableDAs] = useState<DVDirectAnalysis<unknown, DVContact>[] | null>(null);
  const [useableCAs, setUseableCAs] = useState<DVCascadeAnalysis<unknown, unknown, DVContact>[] | null>(null);
  const [graph, setGraph] = useState<{ nodes: RiskNode[]; links: CascadeLink[] } | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [onlyLoops, setOnlyLoops] = useState<boolean>(false);
  const [onlyCauses, setOnlyCauses] = useState<boolean>(false);
  const [onlyEffects, setOnlyEffects] = useState<boolean>(false);
  const [simRuns, setSimRuns] = useState<number>(1);

  const { data: participations, isFetching: loadingParticipations } = useRecords<DVParticipation>({
    table: DataTable.PARTICIPATION,
  });
  const {
    data: riskFiles,
    isFetching: loadingRiskFiles,
    reloadData: reloadRiskFiles,
  } = useRecords<DVRiskFile>({
    table: DataTable.RISK_FILE,
    query: `$filter=cr4de_risk_category ne 'test'&$select=cr4de_title,cr4de_risk_type,cr4de_subjective_importance,cr4de_consensus_date,${RISK_FILE_QUANTI_FIELDS.join(
      ","
    )}`,
  });
  const {
    data: cascades,
    isFetching: loadingCascades,
    reloadData: reloadCascades,
  } = useRecords<DVRiskCascade<SmallRisk, SmallRisk>>({
    table: DataTable.RISK_CASCADE,
    query: `$select=_cr4de_cause_hazard_value,_cr4de_effect_hazard_value,${CASCADE_ANALYSIS_QUANTI_FIELDS.join(
      ","
    )}&$expand=cr4de_cause_hazard($select=cr4de_title),cr4de_effect_hazard($select=cr4de_title)`,
  });
  const {
    data: directAnalyses,
    isFetching: loadingDAs,
    reloadData: reloadDAs,
  } = useRecords<DVDirectAnalysis<unknown, DVContact>>({
    table: DataTable.DIRECT_ANALYSIS,
    query: `$select=_cr4de_risk_file_value,cr4de_expert,cr4de_quality,${DIRECT_ANALYSIS_QUANTI_FIELDS.join(
      ","
    )}&$expand=cr4de_expert($select=emailaddress1)&$filter=_cr4de_expert_value ne null`,
  });
  const {
    data: cascadeAnalyses,
    isFetching: loadingCAs,
    reloadData: reloadCAs,
  } = useRecords<DVCascadeAnalysis<unknown, unknown, DVContact>>({
    table: DataTable.CASCADE_ANALYSIS,
    query: `$select=_cr4de_risk_file_value,_cr4de_cascade_value,cr4de_expert,cr4de_quality,${CASCADE_ANALYSIS_QUANTI_FIELDS.join(
      ","
    )}&$expand=cr4de_expert($select=emailaddress1)&$filter=_cr4de_expert_value ne null`,
  });

  const [log, setLog] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const [results, setResults] = useState<RiskCalculation[] | null>(null);

  usePageTitle("BNRA 2023 - 2026 Result Calculator");
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: "Analysis", url: "/analysis" },
    { name: "Calculator", url: "" },
  ]);

  const isLoading = loadingRiskFiles || loadingCascades || loadingDAs || loadingCAs || loadingParticipations;

  useEffect(() => {
    if (!participations || !participations[0] || !directAnalyses || !cascadeAnalyses) return;

    setUseableDAs(
      directAnalyses.filter((da) => {
        const p = participations.find(
          (p) =>
            p._cr4de_contact_value === da.cr4de_expert.contactid &&
            p._cr4de_risk_file_value === da._cr4de_risk_file_value
        );

        if (!p) return false;

        return p.cr4de_direct_analysis_finished;
      })
    );
    setUseableCAs(
      cascadeAnalyses.filter((ca) => {
        const p = participations.find(
          (p) =>
            p._cr4de_contact_value === ca.cr4de_expert.contactid &&
            p._cr4de_risk_file_value === ca._cr4de_risk_file_value
        );

        if (!p) return false;

        return p.cr4de_cascade_analysis_finished;
      })
    );
  }, [participations, directAnalyses, cascadeAnalyses]);

  const reloadData = () => {
    reloadCascades();
    reloadRiskFiles();
    reloadDAs();
    reloadCAs();
  };

  const saveResults = async () => {
    if (!riskFiles || !results || isCalculating || !participations) return;

    const innerLog = log;

    setLog([...innerLog, `Saving calculations (0/${results.length})`]);

    const analysisId = uuid();

    for (let i = 0; i < results.length; i++) {
      const calculation = results[i];

      const calculatedFields: any = {
        ...roundNumberFields(calculation),
        causes: calculation.causes.map((c) => {
          const cleanCause: any = roundNumberFields(c);
          delete cleanCause.risk;
          return cleanCause;
        }),
        effects: calculation.effects.map((e) => {
          const cleanEffect: any = roundNumberFields(e);
          delete cleanEffect.risk;
          return cleanEffect;
        }),
      };

      const metrics = calculateMetrics(calculatedFields, results, riskFiles, participations);

      const riskId = calculatedFields.riskId;
      delete calculatedFields.riskId;

      const result = await api.createAnalysisRun({
        cr4de_analysis_id: analysisId,
        "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskId})`,
        cr4de_results: JSON.stringify(calculatedFields),
        cr4de_risk_file_metrics: JSON.stringify(metrics),
      });
      await api.updateRiskFile(riskId, {
        "cr4de_latest_calculation@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnraanalysisruns(${result.id})`,
      });

      setLog([...innerLog.slice(0, innerLog.length - 1), `Saving calculations (${i + 1}/${results.length})`]);
    }

    setLog([...innerLog, "Done"]);
  };

  const runCalculations = async () => {
    if (!riskFiles || !cascades || !useableDAs || !useableCAs || !participations) return;

    const logLines: string[] = [];

    setIsCalculating(true);

    const calcs = await runAnalysis({
      riskFiles,
      cascades,
      participations,
      directAnalyses: useableDAs,
      cascadeAnalyses: useableCAs,
      runs: simRuns,
    });

    const g = { nodes: [] as RiskNode[], links: [] as CascadeLink[] };

    for (let c of calcs) {
      g.nodes.push({ id: c.riskId, riskTitle: c.riskTitle, category: "A", tp: c.tp });

      for (let cascade of c.causes) {
        g.links.push({
          source: cascade.cause.riskId,
          target: cascade.effect.riskId,
          value:
            (cascade.c2c +
              cascade.m2c +
              cascade.e2c +
              cascade.c2m +
              cascade.m2m +
              cascade.e2m +
              cascade.c2e +
              cascade.m2e +
              cascade.e2e) /
            9,
        });
      }
    }

    setGraph(g);
    setSelectedNode(null);
    setOnlyLoops(false);
    // const [calculations, daMetrics, caMetrics] = await prepareRiskFiles(riskFiles, cascades, useableDAs, useableCAs);

    // logLines.push(
    //   "Direct Analysis Metrics:",
    //   `\t${roundPerc(daMetrics.consensus / daMetrics.total)} consensus values`,
    //   `\t${roundPerc(daMetrics.average / daMetrics.total)} averages values`,
    //   `\t${roundPerc(daMetrics.missing / daMetrics.total)} missing values`
    // );
    // logLines.push(
    //   "Cascade Analysis Metrics:",
    //   `\t${roundPerc(caMetrics.consensus / caMetrics.total)} consensus values`,
    //   `\t${roundPerc(caMetrics.average / caMetrics.total)} averages values`,
    //   `\t${roundPerc(caMetrics.missing / caMetrics.total)} missing values`,
    //   " "
    // );

    // const log = (line: string) => {
    //   logLines.push(line);
    //   setLog([...logLines]);
    // };

    // await convergeProbabilities(calculations, log, 30);
    // log(" ");
    // await convergeImpacts(calculations, log, 30);
    // log(" ");

    // calculations.forEach((c) => {
    //   c.r = c.ti * c.tp;

    //   const metrics = calculateMetrics(c, calculations, riskFiles, participations);
    // });
    // setResults(calculations);

    // setLog([...logLines, "Done"]);

    setIsCalculating(false);
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!graph) return;

    d3.selectAll("#network-graph > *").remove();

    var svg = d3.select("#network-graph").append("g");
    // .attr("transform", "translate(" + margin.top + "," + margin.left + ")");

    // links between nodes
    var links = graph.links.filter((l) => {
      // @ts-expect-error
      let show = !selectedNode || l.source.id === selectedNode || l.target.id === selectedNode;

      if (onlyLoops) {
        show =
          show &&
          // @ts-expect-error
          graph.links.some((otherL) => otherL.source.id === l.target.id && otherL.target.id === l.source.id);
      }
      if (selectedNode && onlyCauses) {
        // @ts-expect-error
        show = show && l.target.id === selectedNode;
      }
      if (selectedNode && onlyEffects) {
        // @ts-expect-error
        show = show && l.source.id === selectedNode;
      }

      return show;
    });
    // set the nodes
    var nodes = graph.nodes.filter(
      // @ts-expect-error
      (n) => !selectedNode || links.some((l) => l.source.id === n.id || l.target.id === n.id)
    );

    const minTp = nodes.reduce((m, n) => (m > n.tp ? n.tp : m), 0);
    const maxTp = nodes.reduce((m, n) => (m < n.tp ? n.tp : m), 0);
    const minIp = links.reduce((m, l) => (m > l.value ? l.value : m), 0);
    const maxIp = links.reduce((m, l) => (m < l.value ? l.value : m), 0);

    const radius = (n: RiskNode) => 4 + (8 * (n.tp - minTp)) / (maxTp - minTp);

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
        return 2 + (6 * (d.value - minIp)) / (maxIp - minIp);
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
        setSelectedNode(d.id);
      })
      .on("mousedown", (e, d) => {
        if (e.button === 1) {
          setOnlyLoops(!onlyLoops);

          e.preventDefault();
        }
      })
      .on("contextmenu", (e, d) => {
        e.preventDefault();
        setSelectedNode(null);
      });

    // hover text for the node
    node.append("title").text(function (d) {
      return `${d.riskTitle}: ${d.tp}`;
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
          .strength((d) => Math.min(1, d.value / 500))
      )
      .force(
        "collide",
        d3.forceCollide().radius((d) => (d as RiskNode).tp * 1.2)
      )
      .force("charge", d3.forceManyBody().strength(-50))
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
  }, [width, height, graph, selectedNode, onlyLoops, onlyCauses, onlyEffects]);

  return (
    <>
      <Container sx={{ mt: 4, pb: 8 }}>
        <Card>
          <CardContent sx={{ maxHeight: 500, overflowY: "scroll" }}>
            <Typography variant="overline">Loading Risk Files...</Typography>

            {riskFiles && cascades && directAnalyses && cascadeAnalyses && useableDAs && useableCAs && (
              <pre>
                <Typography variant="overline" sx={{ mt: 0, display: "block" }}>
                  Loaded {riskFiles.length} Risk Files
                </Typography>
                <Typography variant="overline" sx={{ mb: 0, display: "block" }}>
                  Loaded {cascades.length} Cascades
                </Typography>
                <Typography variant="overline" sx={{ mb: 0, display: "block" }}>
                  Loaded {directAnalyses.length} Direct Analyses ({useableDAs.length} useable)
                </Typography>
                <Typography variant="overline" sx={{ mb: 2, display: "block" }}>
                  Loaded {cascadeAnalyses.length} Cascade Analyses ({useableCAs.length} useable)
                </Typography>

                {log.map((l, i) => (
                  <Typography key={i} variant="overline" sx={{ mt: 0, display: "block" }}>
                    {l}
                  </Typography>
                ))}
              </pre>
            )}

            <FormGroup sx={{}}>
              <TextField
                placeholder="Simulation Runs to complete"
                type="number"
                value={simRuns}
                helperText="Simulation Runs"
                onChange={(event) => setSimRuns(parseInt(event.target.value, 10))}
              />
              <Stack direction="row" sx={{ m: 1 }}>
                <FormControlLabel
                  control={<Checkbox checked={onlyLoops} onChange={(e) => setOnlyLoops(e.target.checked)} />}
                  label="Show Only Loops"
                />
                <FormControlLabel
                  control={<Checkbox checked={onlyCauses} onChange={(e) => setOnlyCauses(e.target.checked)} />}
                  label="Show Only Causes"
                />
                <FormControlLabel
                  control={<Checkbox checked={onlyEffects} onChange={(e) => setOnlyEffects(e.target.checked)} />}
                  label="Show Only Effects"
                />
              </Stack>
            </FormGroup>
          </CardContent>
          <CardActions>
            <Button disabled={isLoading} onClick={reloadData}>
              Reload data
            </Button>
            <Button disabled={riskFiles === null || cascades === null} onClick={runCalculations}>
              Start calculation
            </Button>
            <Button disabled={results === null || isCalculating} onClick={saveResults}>
              Save results
            </Button>
          </CardActions>
        </Card>
        <Box sx={{ m: 2 }}>
          <svg id="network-graph" width={width} height={height} />
        </Box>
      </Container>
    </>
  );
}
