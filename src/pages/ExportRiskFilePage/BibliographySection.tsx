import { Image, Page, Text, View } from "@react-pdf/renderer";
import Footer from "./Footer";
import { bodyStyle, h4Style, PAGE_DPI, PAGE_SIZE, PAGE_STYLES } from "./styles";
import html2PDF from "../../functions/html2pdf";
import { Trans, useTranslation } from "react-i18next";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { useEffect, useMemo, useState } from "react";
import svg2PDF from "../../functions/svg2PDF";
import getScaleString from "../../functions/getScaleString";
import Header from "./Header";
import { unwrap as unwrapHE } from "../../functions/historicalEvents";
import { colors } from "../../functions/getCategoryColor";
import { unwrap as unwrapParams } from "../../functions/intensityParameters";
import {
  SCENARIO_PARAMS,
  SCENARIOS,
  unwrap as unwrapScenarios,
} from "../../functions/scenarios";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { BLACK } from "../../functions/colors";
import { LoggedInUser } from "../../hooks/useLoggedInUser";

export default function BibliographySection({
  riskFile,
  allAttachments,
  user,
}: {
  riskFile: DVRiskFile;
  allAttachments: DVAttachment[] | null;
  user: LoggedInUser | null | undefined;
}) {
  const { t } = useTranslation();

  const attachments = useMemo(() => {
    if (!allAttachments) return [];

    return allAttachments.filter((a) => {
      // If the viewer is external, only show CIPRA sources
      if (a.cr4de_reference !== null) return true;

      return false;
    });
  }, [allAttachments]);

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
          <Trans i18nKey="Bibliography">Bibliography</Trans>
        </Text>
      </View>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "0pt",
          paddingBottom: "0.5cm",
        }}
        // debug={true}
      >
        {/* <View
          style={{
            width: "5pt",
            marginRight: "5pt",
            height: "100%",
            backgroundColor: "#eee",
          }}
        /> */}
        <View
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            marginTop: "5pt",
            marginBottom: "0cm",
          }}
        >
          {attachments && attachments.length > 0 ? (
            attachments
              .sort((a, b) => {
                if (a.cr4de_reference === null && b.cr4de_reference !== null) {
                  return 1;
                }
                if (b.cr4de_reference === null && a.cr4de_reference !== null) {
                  return -1;
                }
                if (a.cr4de_reference !== null && b.cr4de_reference !== null) {
                  return a.cr4de_reference - b.cr4de_reference;
                }

                if (a.cr4de_field === null && b.cr4de_field !== null) {
                  return 1;
                }
                if (b.cr4de_field === null && a.cr4de_field !== null) {
                  return -1;
                }
                if (a.cr4de_field !== null && b.cr4de_field !== null) {
                  if (a.cr4de_field > b.cr4de_field) {
                    return 1;
                  }
                  return -1;
                }

                if (a.cr4de_name > b.cr4de_name) {
                  return 1;
                }
                return -1;
              })
              .map((a) => (
                <View wrap={false}>
                  <View
                    key={a.cr4de_bnraattachmentid}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        ...bodyStyle,
                        position: "relative",
                        width: "0.5cm",
                      }}
                    >
                      {a.cr4de_reference}.
                    </Text>
                    <Text
                      style={{
                        ...bodyStyle,
                        flex: 1,
                      }}
                    >
                      {a.cr4de_name}
                    </Text>
                  </View>
                  {a.cr4de_url && (
                    <Text
                      style={{
                        ...bodyStyle,
                        width: "100%",
                        textDecoration: "underline",
                        marginTop: "-5pt",
                        paddingLeft: "0.5cm",
                      }}
                      hyphenationCallback={(url) => [...url.split("")]}
                    >
                      {a.cr4de_url}
                    </Text>
                  )}
                </View>
              ))
          ) : (
            <View style={{ flex: 1, textAlign: "left" }}>
              <Text style={bodyStyle}>
                <Trans i18nKey="source.list.noSources">
                  No sources attached
                </Trans>
              </Text>
            </View>
          )}
        </View>
      </View>
    </Page>
  );
}
