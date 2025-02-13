import { useTranslation } from "react-i18next";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { Text } from "@react-pdf/renderer";

export default function Header({ riskFile }: { riskFile: DVRiskFile }) {
  const { t } = useTranslation();

  return (
    <Text
      style={{
        position: "absolute",
        top: "0.75cm",
        left: "1.5cm",
        right: "1.5cm",
        textAlign: "left",
        fontFamily: "NH",
        fontWeight: 300,
        fontSize: "8pt",
      }}
      render={({}) => {
        return t(`risk.${riskFile.cr4de_hazard_id}.name`, riskFile.cr4de_title);
      }}
      fixed
    />
  );
}
