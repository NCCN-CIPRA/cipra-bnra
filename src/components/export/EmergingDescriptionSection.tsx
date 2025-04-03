import { Page, Text, View } from "@react-pdf/renderer";
import Footer from "./Footer";
import {
  h3Style,
  h4Style,
  h5Style,
  PAGE_DPI,
  PAGE_SIZE,
  PAGE_STYLES,
  SCALE,
} from "./styles";
import html2PDF from "../../functions/html2pdf";
import { Trans, useTranslation } from "react-i18next";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import LeftBorderSection from "./LeftBorderSection";
import { BLACK } from "../../functions/colors";
// import { LoggedInUser } from "../../hooks/useLoggedInUser";

export default function EmergingDescriptionSection({
  riskFile,
}: {
  riskFile: DVRiskFile;
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
      <Footer />
      <View>
        <Text style={h3Style}>
          {t(`risk.${riskFile.cr4de_hazard_id}.name`, riskFile.cr4de_title)}
        </Text>
        <Text style={h4Style}>
          <Trans i18nKey="risk.bottombar.riskIdentification">
            Risk Description
          </Trans>
        </Text>
      </View>

      <View
        style={
          {
            // backgroundColor: "green"
          }
        }
      >
        <Text style={h5Style}>
          <Trans i18nKey="riskFile.definition.title">Definition</Trans>
        </Text>
        <LeftBorderSection
          color="#eee"
          style={{ paddingTop: 5 * SCALE, marginBottom: 10 * SCALE }}
        >
          {html2PDF(riskFile.cr4de_definition, "description", riskFile)}
          <View
            style={{ marginTop: -5 * SCALE, width: "100%", height: "1pt" }}
          />
        </LeftBorderSection>
      </View>

      <View
        style={
          {
            // backgroundColor: "green"
          }
        }
      >
        <Text style={h5Style}>
          <Trans i18nKey="Horizon Analysis">Horizon Analysis</Trans>
        </Text>
        <LeftBorderSection
          color="#eee"
          style={{ paddingTop: 5 * SCALE, marginBottom: 10 * SCALE }}
        >
          {html2PDF(riskFile.cr4de_horizon_analysis, "description", riskFile)}
          <View
            style={{ marginTop: -5 * SCALE, width: "100%", height: "1pt" }}
          />
        </LeftBorderSection>
      </View>
    </Page>
  );
}
