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
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { useEffect, useState } from "react";
import svg2PDF from "../../functions/svg2PDF";
import getScaleString from "../../functions/getScaleString";
import { BLACK, NCCN_GREEN } from "../../functions/colors";
import Header from "./Header";
import { Cascades } from "../BaseRisksPage";
import { LoggedInUser } from "../../hooks/useLoggedInUser";

export default function EvolutionSection({
  riskFile,
  cascades,
  user,
}: {
  riskFile: DVRiskFile;
  cascades: Cascades;
  user: LoggedInUser | null | undefined;
}) {
  const { t } = useTranslation();

  const [ccChart, setCCChart] = useState("");

  useEffect(() => {
    setTimeout(() => {
      svg2PDF(
        document.querySelector(
          `#climateChart-${riskFile.cr4de_riskfilesid} svg`
        )?.outerHTML || "",
        750,
        450
      ).then((uri) => setCCChart(uri || ""));
    }, 5000);
  }, []);

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
        {ccChart && (
          <Image
            src={ccChart}
            style={{
              marginTop: 0.25 * POINTS_PER_CM,
              marginLeft: "auto",
              marginRight: "auto",
              width: "80%",
            }}
            // debug={true}
          />
        )}
        {html2PDF(riskFile.cr4de_mrs_cc, "evolution")}
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
          <View style={{ marginBottom: 10 * SCALE }}>
            <Text
              style={{
                ...bodyStyle,
                textDecoration: "underline",
                marginBottom: 2 * SCALE,
              }}
            >
              {c.cr4de_cause_hazard.cr4de_title}
            </Text>
            {html2PDF(c.cr4de_description, "evolution")}
          </View>
        ))}
      </View>
    </Page>
  );
}
