import "./workerShim";

import "../../components/export/fonts";
import { expose } from "comlink";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import { prepareData } from "./prepareData";
import { runSimulations } from "./monteCarlo";
import { SimulationOptions, SimulationOutput } from "./types";

const simulate = async (
  data: {
    riskFiles: DVRiskSnapshot[];
    cascades: DVCascadeSnapshot[];
    options: SimulationOptions;
  },
  onProgress: (message: string, runIndex?: number) => void
): Promise<SimulationOutput | null> => {
  try {
    const { riskFiles, cascades, options } = data;

    onProgress("Preparing data for monte carlo simulation.");

    const input = prepareData(riskFiles, cascades);
    input.options = options;

    // const onFinishRun = (runIndex: number) => {
    //   onProgress(
    //     `Simulating monte carlo run ${runIndex + 1} / ${
    //       input.numberOfSimulations
    //     }`,
    //     runIndex
    //   );
    // };

    const start = Date.now();

    // const output = runSimulation(input, onFinishRun);
    const output = runSimulations(input, onProgress);

    onProgress(`Done - Simulation took ${(Date.now() - start) / 1000} seconds`);

    return output;
    // return doc;
  } catch (e) {
    console.log("Rendering error", e);

    return null;
  }
};

const operations = { simulate };

expose(operations);

export type SimulationWorker = typeof operations;
