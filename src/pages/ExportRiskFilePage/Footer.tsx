import { Text } from "@react-pdf/renderer";

export default function Footer({}) {
  return (
    <>
      <Text
        style={{
          position: "absolute",
          bottom: "0.75cm",
          left: "1.5cm",
          right: "1.5cm",
          textAlign: "left",
          fontFamily: "NH",
          fontWeight: 300,
          fontSize: "8pt",
        }}
      >
        NCCN - CIPRA
      </Text>
      <Text
        style={{
          position: "absolute",
          bottom: "0.75cm",
          left: "1.5cm",
          right: "1.5cm",
          textAlign: "right",
          fontFamily: "NH",
          fontWeight: 300,
          fontSize: "8pt",
        }}
        render={({ pageNumber, totalPages }) => `${pageNumber}`}
        fixed
      />
    </>
  );
}
