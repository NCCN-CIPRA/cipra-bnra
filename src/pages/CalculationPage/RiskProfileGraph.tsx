import { useEffect, useState, useRef } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Box,
} from "@mui/material";
import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import * as d3 from "d3";

const graphHeight = 600;
const margin = {
  top: 25,
  bottom: 15,
  left: 45,
  right: 25,
};

const gaussianPDF = (m: number, s: number) => (x: number) =>
  (1 / (s * Math.sqrt(2 * Math.PI))) *
  Math.exp((-1 / 2) * Math.pow((x - m) / s, 2));

export default function RiskProfileGraph({
  calculations,
  selectedNodeId,
}: {
  calculations: RiskCalculation[] | null;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
}) {
  const graphElement = useRef<SVGSVGElement | null>(null);
  const [graphWidth, setGraphWidth] = useState<number>(0);

  useEffect(() => {
    if (!graphElement.current) return;

    setGraphWidth(graphElement.current.getBoundingClientRect().width);
  }, []);

  useEffect(() => {
    const riskRaw = calculations?.find((c) => c.riskId === selectedNodeId);

    if (!riskRaw) return;

    const risk = {
      ...riskRaw,
      ti_c: Math.log10(riskRaw.ti_c),
      ti_m: Math.log10(riskRaw.ti_m),
      ti_e: Math.log10(riskRaw.ti_e),
    };

    const TP0 = 1 - risk.tp_c - risk.tp_m - risk.tp_e;
    const maxTI = Math.max(risk.ti_c, risk.ti_m, risk.ti_e);
    const minTI = Math.min(risk.ti_c, risk.ti_m, risk.ti_e);

    const width = graphWidth - margin.left - margin.right;
    const height = graphHeight - margin.top - margin.bottom;

    const gauss_c = gaussianPDF(risk.ti_c, 0.5);
    const gauss_m = gaussianPDF(risk.ti_m, 0.5);
    const gauss_e = gaussianPDF(risk.ti_e, 0.5);
    const gaussLineX = new Array(150)
      .fill(null)
      .map((v, i) => (i * maxTI * 1.5) / 150);
    const gaussLineY_c = gaussLineX.map((x) => gauss_c(x));
    const gaussLineY_m = gaussLineX.map((x) => gauss_m(x));
    const gaussLineY_e = gaussLineX.map((x) => gauss_e(x));
    const gaussLineTot = gaussLineX.map(
      (x, i) =>
        risk.tp_c * gaussLineY_c[i] +
        risk.tp_m * gaussLineY_m[i] +
        risk.tp_e * gaussLineY_e[i]
    );

    const WCS_i = gaussLineX.reduce(
      (maxR_i, x, i) =>
        gaussLineTot[i] * Math.pow(10, x) >
        gaussLineTot[maxR_i] * Math.pow(10, gaussLineX[maxR_i])
          ? i
          : maxR_i,
      0
    );
    const maxTP = Math.max(risk.tp_c, risk.tp_m, risk.tp_e, ...gaussLineTot);

    const x = d3
      .scaleLinear()
      .domain([minTI / 1.5, maxTI * 1.5])
      .range([margin.left, width]);

    const y = d3
      .scaleLinear()
      .domain([0, maxTP])
      .range([height, margin.bottom]);

    const xAxis = d3.axisBottom(x);

    const yAxis = d3.axisLeft(y).ticks(10);

    d3.selectAll("#profile-graph > *").remove();

    const svg = d3.select("#profile-graph").append("g");

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Precent RGB Error (%)");

    svg
      .append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(yAxis);

    svg
      .selectAll(".bar")
      .data([
        { name: "None", p: TP0, i: 0, fill: "black" },
        { name: "Considerable", p: risk.tp_c, i: risk.ti_c, fill: "green" },
        { name: "Major", p: risk.tp_m, i: risk.ti_m, fill: "yellow" },
        { name: "Extreme", p: risk.tp_e, i: risk.ti_e, fill: "red" },
      ])
      .enter()
      .insert("rect", ".axis")
      .attr("class", "bar")
      .attr("x", (d) => x(d.i))
      .attr("y", (d) => y(d.p))
      .attr("width", 10)
      .attr("height", (d) => height - y(d.p))
      .attr("fill", (d) => d.fill);

    // svg
    //   .append("path")
    //   .datum(gaussLineY_0.map((y, i) => [gaussLineX[i], y]) as [number, number][])
    //   .attr("fill", "none")
    //   .attr("stroke", "grey")
    //   .attr("stroke-width", 4)
    //   .attr(
    //     "d",
    //     d3
    //       .line()
    //       .x((d) => x(d[0]))
    //       .y((d) => y(d[1]))
    //   );
    // svg
    //   .append("path")
    //   .datum(gaussLineY_c.map((y, i) => [gaussLineX[i], y]) as [number, number][])
    //   .attr("fill", "none")
    //   .attr("stroke", "navy")
    //   .attr("stroke-width", 4)
    //   .attr(
    //     "d",
    //     d3
    //       .line()
    //       .x((d) => x(d[0]))
    //       .y((d) => y(d[1]))
    //   );
    // svg
    //   .append("path")
    //   .datum(gaussLineY_m.map((y, i) => [gaussLineX[i], y]) as [number, number][])
    //   .attr("fill", "none")
    //   .attr("stroke", "yellow")
    //   .attr("stroke-width", 4)
    //   .attr(
    //     "d",
    //     d3
    //       .line()
    //       .x((d) => x(d[0]))
    //       .y((d) => y(d[1]))
    //   );
    // svg
    //   .append("path")
    //   .datum(gaussLineY_e.map((y, i) => [gaussLineX[i], y]) as [number, number][])
    //   .attr("fill", "none")
    //   .attr("stroke", "red")
    //   .attr("stroke-width", 4)
    //   .attr(
    //     "d",
    //     d3
    //       .line()
    //       .x((d) => x(d[0]))
    //       .y((d) => y(d[1]))
    //   );
    svg
      .append("path")
      .datum(
        gaussLineX.map((x, i) => [x, gaussLineTot[i]]) as [number, number][]
      )
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 4)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(d[0]))
          .y((d) => y(d[1]))
      );
    svg
      .append("path")
      .datum([
        [gaussLineX[WCS_i], 0],
        [gaussLineX[WCS_i], maxTP],
      ] as [number, number][])
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(d[0]))
          .y((d) => y(d[1]))
      );
  }, [calculations, selectedNodeId]);

  if (!selectedNodeId) return null;

  return (
    <Accordion disabled={!calculations || !selectedNodeId}>
      <AccordionSummary>
        <Typography variant="subtitle2">Risk profile</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{}}>
        <Box sx={{ border: "1px solid #eee" }}>
          <svg
            id="profile-graph"
            ref={graphElement}
            width={`calc(100% - 10px)`}
            height={graphHeight - 10}
            style={{
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
            }}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
