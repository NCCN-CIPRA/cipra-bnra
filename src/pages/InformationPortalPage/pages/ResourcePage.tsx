import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DownloadIcon from "@mui/icons-material/Download";
import { Trans, useTranslation } from "react-i18next";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import usePageTitle from "../../../hooks/usePageTitle";
import { useParams } from "react-router-dom";

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------

const MetaRow = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  paddingTop: theme.spacing(1.25),
  paddingBottom: theme.spacing(1.25),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": { borderBottom: "none", paddingBottom: 0 },
}));

const MetaLabel = styled(Typography)(({ theme }) => ({
  flexShrink: 0,
  width: 120,
  fontSize: "0.8rem",
  fontWeight: 500,
  color: theme.palette.text.secondary,
  paddingTop: 1,
}));

const MetaValue = styled(Typography)(() => ({
  fontSize: "0.8rem",
  color: "rgba(0,0,0,0.75)",
  lineHeight: 1.6,
}));

type RouteParams = {
  resource_id: string;
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function ResourcePage() {
  const { t } = useTranslation();
  const params = useParams() as RouteParams;

  const resources = {
    indicators: {
      title: t(
        "learning.resources.indicators.title",
        "Indicators for probability and impact",
      ),
      description: t(
        "learning.resources.indicators.description",
        `
            A complete reference for the ten damage indicators and the three
            probability scales used in the BNRA framework. Includes the full
            scale tables with interval values, units, weighting factors, and
            qualitative descriptions for each class — designed for use by
            organisations conducting their own risk analyses in a manner
            compatible with the national framework.`,
      ),
      filename: "BNRA-Indicators-V2.pdf",
      meta: "PDF · Version 2.0 · 2025",
      link: "https://bnra.powerappsportals.com/documents/BNRA_Indicators_2_0.pdf",
      citation:
        "NCCN, CIPRA (2025). National Risk Assessment Framework. Indicators for probability and impact.",
    },
  };

  const resource =
    resources[params.resource_id as keyof typeof resources] ||
    resources.indicators;

  // TODO: update page title and breadcrumb label to match the document
  usePageTitle(resource.title);
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: resource.title,
      url: `/learning/resources/${params.resource_id}`,
    },
  ]);

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="overline"
          sx={{
            color: "text.secondary",
            letterSpacing: "0.08em",
            display: "block",
            mb: 0.5,
          }}
        >
          <Trans i18nKey="learning.resources.indicators.category">
            National Risk Assessment Framework
          </Trans>
        </Typography>

        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 500, lineHeight: 1.3 }}
        >
          {resource.title}
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          {resource.description}
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Download                                                            */}
      {/* ------------------------------------------------------------------ */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          boxShadow: "none",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.25 }}>
            {resource.filename}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            {resource.meta}
          </Typography>
        </Box>

        {/* TODO: replace href with the actual hosted URL for this document */}
        <Button
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<DownloadIcon />}
          variant="contained"
          color="primary"
          size="small"
          sx={{ flexShrink: 0 }}
        >
          <Trans i18nKey="learning.resources.download">Download</Trans>
        </Button>
      </Paper>

      {/* ------------------------------------------------------------------ */}
      {/* Reference information                                               */}
      {/* ------------------------------------------------------------------ */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 2 }}>
          <Trans i18nKey="learning.resources.reference.title">
            Reference information
          </Trans>
        </Typography>

        <Divider sx={{ mb: 0 }} />

        <MetaRow>
          <MetaLabel>
            {t("learning.resources.reference.citation", "Citation")}
          </MetaLabel>
          <MetaValue>{resource.citation}</MetaValue>
        </MetaRow>

        <MetaRow>
          <MetaLabel>
            {t("learning.resources.reference.publisher", "Publisher")}
          </MetaLabel>
          <MetaValue>Belgian National Crisis Centre</MetaValue>
        </MetaRow>

        <MetaRow>
          <MetaLabel>
            {t("learning.resources.reference.directorate", "Directorate")}
          </MetaLabel>
          <MetaValue>
            Directorate of Critical Infrastructure Protection and Risk Analysis
          </MetaValue>
        </MetaRow>

        <MetaRow>
          <MetaLabel>
            {t("learning.resources.reference.contact", "Contact")}
          </MetaLabel>
          <MetaValue>
            <Box
              component="a"
              href="mailto:cipra.bnra@nccn.fgov.be"
              sx={{
                color: "primary.main",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              cipra.bnra@nccn.fgov.be
            </Box>
          </MetaValue>
        </MetaRow>
      </Box>
    </Container>
  );
}
