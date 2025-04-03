import { Image, Page, Text, View } from "@react-pdf/renderer";
import { DPI, h2Style, PAGE_HEIGHT, PAGE_SIZE, POINTS_PER_CM } from "./styles";
import {
  CATEGORY_NAMES,
  RISK_CATEGORY,
  RISK_TYPE,
  RISK_TYPE_NAMES,
} from "../../types/dataverse/DVRiskFile";
import { NCCN_GREEN } from "../../functions/colors";

const SPLASH: Partial<{ [key in RISK_TYPE.MANMADE | RISK_CATEGORY]: string }> =
  {
    "Malicious Man-made Risk": "splash1.png",
    Cyber: "splash1.png",
    "Emerging Risk": "splash7.png",
    Health: "splash5.png",
    "Man-made": "splash2.png",
    Nature: "splash6.png",
    Transversal: "spalsh3.png",
    EcoTech: "splash4.png",
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SPLASH_STYLE: { [key in RISK_TYPE.MANMADE | RISK_CATEGORY]: any } = {
  "Malicious Man-made Risk": {
    top: 0,
    left: "-100%",
    width: 1.78 * PAGE_HEIGHT * POINTS_PER_CM,
    height: PAGE_HEIGHT * POINTS_PER_CM,
  },
  "Man-made": {
    top: 0,
    left: "-100%",
    width: 1.78 * PAGE_HEIGHT * POINTS_PER_CM,
    height: PAGE_HEIGHT * POINTS_PER_CM,
  },
  Cyber: {
    top: 0,
    left: "-40%",
    width: 1.5 * PAGE_HEIGHT * POINTS_PER_CM,
    height: PAGE_HEIGHT * POINTS_PER_CM,
  },
  EcoTech: {
    top: 0,
    left: "0%",
    aspectRatio: 1,
    width: 0.71 * PAGE_HEIGHT * POINTS_PER_CM,
    height: PAGE_HEIGHT * POINTS_PER_CM,
  },
  Health: {
    top: 3 * POINTS_PER_CM,
    left: -10 * POINTS_PER_CM,
    width: 1.5 * PAGE_HEIGHT * POINTS_PER_CM,
    height: (1.5 * (PAGE_HEIGHT * POINTS_PER_CM)) / 1.78,
    transform: "rotate(90deg)",
  },
  Nature: {
    top: 0,
    left: "0%",
    width: (PAGE_HEIGHT * POINTS_PER_CM) / 1.25,
    height: PAGE_HEIGHT * POINTS_PER_CM,
  },
  Transversal: {
    top: 0,
    left: "0%",
    aspectRatio: 1,
    width: (PAGE_HEIGHT * POINTS_PER_CM) / 1.25,
    height: PAGE_HEIGHT * POINTS_PER_CM,
  },
  "Emerging Risk": {
    top: 0,
    left: "-50%",
    width: PAGE_HEIGHT * POINTS_PER_CM * 1.5,
    height: PAGE_HEIGHT * POINTS_PER_CM,
  },
  Test: {},
};

export default function CategoryFrontPage({
  category,
}: {
  category: RISK_TYPE.MANMADE | RISK_CATEGORY;
}) {
  return (
    <Page
      size={PAGE_SIZE}
      style={{
        backgroundColor: NCCN_GREEN,
      }}
      dpi={DPI}
    >
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0.2,
          zIndex: 1,
        }}
      >
        <Image
          src={`https://bnra.powerappsportals.com/${SPLASH[category]}`}
          style={{ position: "absolute", ...SPLASH_STYLE[category] }}
        />
      </View>
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ ...h2Style }}>
          {category in CATEGORY_NAMES
            ? CATEGORY_NAMES[category as RISK_CATEGORY]
            : RISK_TYPE_NAMES[category as RISK_TYPE]}
        </Text>
      </View>
    </Page>
  );
}
