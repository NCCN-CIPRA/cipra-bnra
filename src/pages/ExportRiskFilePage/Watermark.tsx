import { Text, View } from "@react-pdf/renderer";
import { bodyStyle, PAGE_STYLES, SCALE } from "./styles";
import { LoggedInUser } from "../../hooks/useLoggedInUser";

export default function Watermark({
  user,
}: {
  user: LoggedInUser | null | undefined;
}) {
  return (
    <View
      fixed
      style={{
        position: "absolute",
        top: PAGE_STYLES.padding,
        left: PAGE_STYLES.padding,
        right: PAGE_STYLES.padding,
        bottom: PAGE_STYLES.padding,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          ...bodyStyle,
          fontWeight: 700,
          fontSize: 100 * SCALE,
          color: "rgba(0, 0, 0, 0.05)",
          transform: "rotate(45deg)",
          width: `200%`,
        }}
        hyphenationCallback={(w) => w.split("")}
      >
        {user?.emailaddress1}
      </Text>
    </View>
  );
}
