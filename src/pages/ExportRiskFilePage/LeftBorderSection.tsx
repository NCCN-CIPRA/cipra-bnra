import { View } from "@react-pdf/renderer";
import { ReactNode } from "react";
import { POINTS_PER_CM, SCALE } from "./styles";

export default function LeftBorderSection({
  children,
  debug = false,
  color,
  style = {},
  wrap,
}: {
  children: ReactNode;
  debug?: boolean;
  color?: string;
  style?: any;
  wrap?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: 10 * SCALE,
        position: "relative",
        ...style,
      }}
      debug={debug}
      wrap={wrap}
    >
      <View
        style={{
          backgroundColor: color,
          position: "absolute",
          left: 0,
          width: 5 * SCALE,
          top: 0,
          bottom: 0,
        }}
        debug={debug}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          marginBottom: "0pt",
          marginLeft: 10 * SCALE,
        }}
      >
        {children}
      </View>
    </View>
  );
}
