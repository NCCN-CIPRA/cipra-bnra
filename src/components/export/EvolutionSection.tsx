import { Image, Page, Text, View } from "@react-pdf/renderer";
import Footer from "./Footer";
import {
  bodyStyle,
  h4Style,
  h5Style,
  PAGE_DPI,
  PAGE_SIZE,
  PAGE_STYLES,
  POINTS_PER_CM,
  SCALE,
} from "./styles";
import html2PDF from "../../functions/html2pdf";
import { Trans, useTranslation } from "react-i18next";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { BLACK } from "../../functions/colors";
import Header from "./Header";
import { Cascades } from "../../functions/cascades";

export default function EvolutionSection({
  riskFile,
  cascades,
  climateChangeChart,
}: {
  riskFile: DVRiskFile;
  cascades: Cascades;
  climateChangeChart: string;
}) {
  const { t } = useTranslation();

  return (
    <Page
      size={PAGE_SIZE}
      dpi={PAGE_DPI}
      style={{
        ...PAGE_STYLES,
        backgroundColor: "white",
        color: BLACK,
      }}
    >
      <Header riskFile={riskFile} />
      <Footer />

      <View
        style={
          {
            // backgroundColor: "green"
          }
        }
      >
        <Text style={h4Style}>
          <Trans i18nKey="risk.bottombar.riskEvolution">Risk Evolution</Trans>
        </Text>
      </View>

      <View
        style={
          {
            // backgroundColor: "green"
          }
        }
      >
        <Text style={h5Style}>{t("Climate Change", "Climate Change")}</Text>
        <Image
          src={climateChangeChart}
          style={{
            marginTop: 0.25 * POINTS_PER_CM,
            marginLeft: "auto",
            marginRight: "auto",
            width: "80%",
          }}
          // debug={true}
        />
        {html2PDF(riskFile.cr4de_mrs_cc, "evolution", riskFile)}
      </View>

      <View
        style={
          {
            // backgroundColor: "green"
          }
        }
      >
        <Text style={h5Style}>
          {t("Other Catalysing Effects", "Other Catalysing Effects")}
        </Text>
        {cascades.catalyzingEffects.map((c) => (
          <View
            key={c.cr4de_bnrariskcascadeid}
            style={{ marginBottom: 10 * SCALE }}
          >
            <Text
              style={{
                ...bodyStyle,
                textDecoration: "underline",
                marginBottom: 2 * SCALE,
              }}
            >
              {c.cr4de_cause_hazard.cr4de_title}
            </Text>
            {html2PDF(c.cr4de_description, "evolution", riskFile)}
          </View>
        ))}
      </View>
    </Page>
  );
}
