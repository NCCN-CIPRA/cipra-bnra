import { useTranslation } from "react-i18next";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { Text, View } from "@react-pdf/renderer";
import { bodyStyle, PAGE_STYLES, smallStyle } from "./styles";
import { DVRiskSummary } from "../../types/dataverse/DVRiskSummary";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";

export default function Header({
  riskFile,
}: {
  riskFile: DVRiskFile | DVRiskSummary | DVRiskSnapshot;
}) {
  const { t } = useTranslation();

  return (
    <View
      fixed
      style={{
        position: "absolute",
        top: PAGE_STYLES.padding / 2,
        left: PAGE_STYLES.padding,
        right: PAGE_STYLES.padding,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
      }}
    >
      <Text
        style={{
          ...bodyStyle,
          ...smallStyle,
        }}
        render={() => {
          return t(
            `risk.${riskFile.cr4de_hazard_id}.name`,
            riskFile.cr4de_title
          );
        }}
      />
    </View>
  );
}
