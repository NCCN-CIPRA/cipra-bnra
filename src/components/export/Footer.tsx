import { Text, View } from "@react-pdf/renderer";
import { PAGE_STYLES, smallStyle } from "./styles";

export default function Footer() {
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
      <Text style={smallStyle} render={({ pageNumber }) => `${pageNumber}`} />
    </View>
  );
}
