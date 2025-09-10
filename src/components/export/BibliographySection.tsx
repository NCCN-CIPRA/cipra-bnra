import { Page, Text, View } from "@react-pdf/renderer";
import Footer from "./Footer";
import { bodyStyle, h4Style, PAGE_DPI, PAGE_SIZE, PAGE_STYLES } from "./styles";
import { Trans } from "react-i18next";
import { useMemo } from "react";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { BLACK } from "../../functions/colors";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";

export type SpecificAttachment = { cr4de_reference: string } & Omit<
  DVAttachment,
  "cr4de_reference"
>;

export function getSpecificAttachments(
  attachments: DVAttachment<unknown, unknown, DVRiskSnapshot>[]
): SpecificAttachment[] {
  return attachments
    .filter((a) => a.cr4de_reference && a.cr4de_risk_file)
    .sort((a, b) =>
      a.cr4de_risk_file!.cr4de_hazard_id.localeCompare(
        b.cr4de_risk_file!.cr4de_hazard_id
      )
    )
    .map((a) => ({
      ...a,
      cr4de_reference: `${a.cr4de_risk_file!.cr4de_hazard_id}-${
        a.cr4de_reference
      }`,
    }));
}

export default function BibliographySection({
  allAttachments,
}: {
  allAttachments: SpecificAttachment[] | null;
}) {
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
                return a.cr4de_reference.localeCompare(b.cr4de_reference);
              })
              .map((a, i) => (
                <View key={i} wrap={false}>
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
                        width: "1.5cm",
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
                        marginTop: "-10pt",
                        marginBottom: "5pt",
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
