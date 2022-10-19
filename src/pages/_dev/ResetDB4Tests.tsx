import { useEffect } from "react";
import useAPI from "../../hooks/useAPI";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import { DVContact } from "../../types/dataverse/DVContact";
import { DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { DVFeedback } from "../../types/dataverse/DVFeedback";
import { DVParticipation } from "../../types/dataverse/DVParticipation";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { DVValidation } from "../../types/dataverse/DVValidation";

export default function ResetDB4Tests() {
  const api = useAPI();

  useEffect(() => {
    const resetDB = async () => {
      const experts = await api.getContacts<DVContact>("$filter=contains(email,'test_user_expert')");
      const rfs = await api.getRiskFiles<DVRiskFile>("$filter=cr4de_title eq 'Test Risk'");

      if (rfs.length <= 0) return;
      const riskFile = rfs[0];

      const cascades = await api.getRiskCascades<DVRiskCascade>(
        `$filter=_cr4de_cause_hazard_value eq ${riskFile.cr4de_riskfilesid} or _cr4de_effect_hazard_value eq ${riskFile.cr4de_riskfilesid}`
      );

      const participations = await api.getParticipants<DVParticipation>(
        `$filter=_cr4de_risk_file_value eq ${riskFile.cr4de_riskfilesid}`
      );
      const attachments = await api.getAttachments<DVAttachment>(
        `$filter=_cr4de_risk_file_value eq ${riskFile.cr4de_riskfilesid}`
      );

      const validations = await api.getValidations<DVValidation>(
        `$filter=_cr4de_RiskFile_value eq ${riskFile.cr4de_riskfilesid}`
      );
      const DAs = await api.getDirectAnalyses<DVDirectAnalysis>(
        `$filter=${experts.map((e) => `_cr4de_expert_value eq ${e.contactid}`).join(" or ")}`
      );
      const CAs = await api.getDirectAnalyses<DVCascadeAnalysis>(
        `$filter=${experts.map((e) => `_cr4de_expert_value eq ${e.contactid}`).join(" or ")}`
      );
      const feedbacks = await api.getFeedbacks<DVFeedback>(
        `$filter=${experts.map((e) => `_cr4de_expert_value eq ${e.contactid}`).join(" or ")}`
      );

      await Promise.all(feedbacks.map((f) => api.deleteFeedback(f.cr4de_bnrafeedbackid)));
      await Promise.all(CAs.map((CA) => api.deleteCascadeAnalysis(CA.cr4de_bnracascadeanalysisid)));
      await Promise.all(DAs.map((DA) => api.deleteDirectAnalysis(DA.cr4de_bnradirectanalysisid)));
      await Promise.all(validations.map((v) => api.deleteValidation(v.cr4de_bnravalidationid)));

      await Promise.all(participations.map((p) => api.deleteParticipant(p.cr4de_bnraparticipationid)));
      await Promise.all(attachments.map((a) => api.deleteAttachment(a.cr4de_bnraattachmentid)));

      await Promise.all(cascades.map((c) => api.deleteCascade(c.cr4de_bnrariskcascadeid)));
      await api.deleteRiskFile(riskFile.cr4de_riskfilesid);
    };

    resetDB();
  }, []);

  return null;
}
