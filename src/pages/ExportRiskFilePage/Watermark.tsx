import { useTranslation } from "react-i18next";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { Text, View } from "@react-pdf/renderer";
import {
  bodyStyle,
  PAGE_STYLES,
  POINTS_PER_CM,
  SCALE,
  smallStyle,
} from "./styles";
import { AuthPageContext } from "../AuthPage";
import { useOutletContext } from "react-router-dom";
import { log } from "console";
import { useContext } from "react";
import { LoggedInUser } from "../../hooks/useLoggedInUser";

export default function Watermark({
  user,
}: {
  user: LoggedInUser | null | undefined;
}) {
  const { t } = useTranslation();

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
