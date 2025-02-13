import { View } from "@react-pdf/renderer";
import { ReactNode } from "react";

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
        marginTop: "10pt",
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
          width: "5pt",
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
          marginLeft: "10pt",
        }}
      >
        {children}
      </View>
    </View>
  );
}
