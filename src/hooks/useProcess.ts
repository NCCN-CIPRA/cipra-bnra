import { addDays } from "../functions/days";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import useAPI from "./useAPI";

export interface ProcessManager {
  organiseValidationConsensus: (rf: DVRiskFile) => Promise<void>;
  startSilenceProcedure: (rf: DVRiskFile) => Promise<void>;
  finishSilenceProcedure: (rf: DVRiskFile) => Promise<void>;
  startStep2A: (rf: DVRiskFile) => Promise<void>;
}

export default function useProcess(): ProcessManager {
  const api = useAPI();

  return {
    organiseValidationConsensus: async function (rf: DVRiskFile) {
      return await api.updateRiskFile(rf.cr4de_riskfilesid, {
        cr4de_validations_processed: true,
        cr4de_validation_silent_procedure_until: null,
      });
    },
    startSilenceProcedure: async function (rf: DVRiskFile) {
      return api.updateRiskFile(rf.cr4de_riskfilesid, {
        cr4de_validations_processed: true,
        cr4de_validation_silent_procedure_until: addDays(new Date(), 7),
      });
    },
    finishSilenceProcedure: async function (rf: DVRiskFile) {
      return;
    },
    startStep2A: async function (rf: DVRiskFile) {
      return;
    },
  };
}
