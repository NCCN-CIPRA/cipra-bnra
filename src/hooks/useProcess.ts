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
      await api.authFetch(
        "https://prod-91.westeurope.logic.azure.com:443/workflows/79ca88049c3644349691202d00a5c58c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ukcGNlwFwdbgAXj-tTEcT7SDTIvxP288eQqkzvgGdH8",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            riskFileId: rf.cr4de_riskfilesid,
            step: "SILENCE_PROCEDURE",
          }),
        }
      );

      return api.updateRiskFile(rf.cr4de_riskfilesid, {
        cr4de_validations_processed: true,
        cr4de_validation_silent_procedure_until: addDays(new Date(), 14),
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
