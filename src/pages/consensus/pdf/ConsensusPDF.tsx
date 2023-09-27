import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVRiskFile, RISK_TYPE } from "../../../types/dataverse/DVRiskFile";
import { Box } from "@mui/material";
import { AuthPageContext } from "../../AuthPage";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import useRecords from "../../../hooks/useRecords";
import Standard from "./Standard";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export default function ConsensusPDF({
  directAnalysis,
  cascadeAnalyses,
}: {
  directAnalysis: DVDirectAnalysis<DVRiskFile>;
  cascadeAnalyses: DVCascadeAnalysis<DVRiskCascade<SmallRisk, SmallRisk>>[];
}) {
  const { t } = useTranslation();

  return (
    <Document>
      <Page size="A4">
        <View>
          <Text>Section #1</Text>
        </View>
        <View>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
}
