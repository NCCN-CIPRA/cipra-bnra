import { Text, View } from "@react-pdf/renderer";
import { PAGE_STYLES, smallStyle } from "./styles";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";

export default function Footer({ riskFile }: { riskFile?: DVRiskFile }) {
  return (
    <View
      fixed
      style={{
        position: "absolute",
        bottom: PAGE_STYLES.paddingBottom / 2,
        left: PAGE_STYLES.padding,
        right: PAGE_STYLES.padding,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text style={smallStyle}>NCCN - CIPRA</Text>
      <Text
        style={smallStyle}
        render={({ pageNumber }) => {
          return `${pageNumber}`;
        }}
      />
    </View>
  );
}
