import { addDays } from "../functions/days";
import { DVContact } from "../types/dataverse/DVContact";
import { DVParticipation } from "../types/dataverse/DVParticipation";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import useAPI from "./useAPI";

export interface ProcessManager {
  organiseValidationConsensus: (rf: DVRiskFile) => Promise<void>;
  startSilenceProcedure: (rf: DVRiskFile) => Promise<void>;
  finishStep2A: (rf: DVRiskFile, participation: DVParticipation) => Promise<void>;
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
    finishStep2A: async function (rf: DVRiskFile, participation: DVParticipation) {
      await api.updateParticipant(participation.cr4de_bnraparticipationid, {
        cr4de_direct_analysis_finished: true,
        cr4de_direct_analysis_finished_on: new Date(),
      });

      // Move the risk file to the next step if possible
      await api.authFetch(
        "https://prod-91.westeurope.logic.azure.com:443/workflows/79ca88049c3644349691202d00a5c58c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ukcGNlwFwdbgAXj-tTEcT7SDTIvxP288eQqkzvgGdH8",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            riskFileId: rf.cr4de_riskfilesid,
            contactId: participation._cr4de_contact_value,
            step: "FINISH_STEP_2A",
          }),
        }
      );

      return;
    },
  };
}
