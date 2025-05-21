import { View } from "@react-pdf/renderer";
import { ReactNode } from "react";
import { SCALE } from "./styles";
import { Style } from "@react-pdf/types";

export default function LeftBorderSection({
  children,
  debug = false,
  color,
  style = {},
  wrap = true,
}: {
  children: ReactNode;
  debug?: boolean;
  color?: string;
  style?: Style | Style[];
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
