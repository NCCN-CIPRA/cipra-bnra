// import { Cascades } from "../../pages/BaseRisksPage";
// import { DVAttachment } from "../../types/dataverse/DVAttachment";
// import BibliographySection from "./BibliographySection";
import { Image, Page, Text, View } from "@react-pdf/renderer";
import { DPI, PAGE_SIZE, PAGE_STYLES, POINTS_PER_CM, SCALE } from "./styles";
import { NCCN_GREEN } from "../../functions/colors";
import { Trans } from "react-i18next";

export default function FrontPage({
  nccnLogo,
  bnraLogo,
  triangles,
  raw = false,
}: {
  nccnLogo: string;
  bnraLogo: string;
  triangles: string;
  raw?: boolean;
}) {
  return (
    <>
      <Page
        size={PAGE_SIZE}
        style={{
          backgroundColor: NCCN_GREEN,
        }}
        dpi={DPI}
      >
        <View
          style={{
            width: "40%",
            margin: "auto",
            textAlign: "center",
            marginTop: PAGE_STYLES.padding,
            marginBottom: 0,
            minHeight: 3 * POINTS_PER_CM,
          }}
        >
          {!raw && (
            <Text
              style={{
                fontFamily: "NH",
                fontSize: 30 * SCALE,
                color: "white",
                fontWeight: "bold",
              }}
            >
              <Trans i18nKey="report.frontpage.title">
                Belgian National Risk Assessment
              </Trans>
            </Text>
          )}
        </View>
        <View
          style={{
            width: "80%",
            margin: "auto",
            textAlign: "center",
            marginTop: 10 * SCALE,
            marginBottom: 30 * SCALE,
            minHeight: 3 * POINTS_PER_CM,
          }}
        >
          {!raw && (
            <>
              <Text
                style={{
                  fontFamily: "NH",
                  fontSize: 20 * SCALE,
                  color: "white",
                  fontWeight: "normal",
                }}
              >
                <Trans i18nKey="report.frontpage.full_report">
                  Full Report
                </Trans>
              </Text>
              <Text
                style={{
                  fontFamily: "NH",
                  fontSize: 20 * SCALE,
                  color: "white",
                  fontWeight: "normal",
                }}
              >
                <Trans i18nKey="report.frontpage.year">2023 - 2026</Trans>
              </Text>
            </>
          )}
        </View>
        <Image
          source={{ uri: "https://bnra.powerappsportals.com/report-front.png" }}
        />
        <View
          style={{
            position: "absolute",
            width: "100%",
            bottom: 0,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: PAGE_STYLES.padding - 0.8 * POINTS_PER_CM,
            paddingRight: PAGE_STYLES.padding - 1.5 * POINTS_PER_CM,
            paddingBottom: PAGE_STYLES.padding - 2 * POINTS_PER_CM,
          }}
          // debug={true}
        >
          <Image src={nccnLogo} style={{ height: 4 * POINTS_PER_CM }} />
          <Image src={bnraLogo} style={{ height: 2.6 * POINTS_PER_CM }} />
        </View>
      </Page>
      <Page
        size={PAGE_SIZE}
        style={{
          backgroundColor: NCCN_GREEN,
        }}
        dpi={DPI}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            margin: "auto",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginBottom: 10 * SCALE,
          }}
          // debug={true}
        >
          <Text
            style={{
              fontFamily: "NH",
              fontSize: 16 * SCALE,
              color: "white",
              fontWeight: "semibold",
            }}
          >
            Anticiper pour mieux gérer
          </Text>
          <View
            style={{
              position: "absolute",
              width: "100%",
              bottom: -1 * POINTS_PER_CM,
              left: "0",
            }}
          >
            <Image src={triangles} />
          </View>
        </View>
      </Page>
    </>
  );
}
