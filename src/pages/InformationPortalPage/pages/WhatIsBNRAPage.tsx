import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Trans, useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import usePageTitle from "../../../hooks/usePageTitle";
import { getLanguage } from "../../../functions/translations";
import { RISK_CATEGORY } from "../../../types/dataverse/Riskfile";
import { CategoryIcon } from "../../../functions/getIcons";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const MandateCard = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "flex-start",
  backgroundColor: "white",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  padding: theme.spacing(2),
}));

const StatCard = styled(Paper)(({ theme }) => ({
  backgroundColor: "white",
  border: `1px solid ${theme.palette.divider}`,
  height: "90px",
  padding: theme.spacing(2),
  textAlign: "center",
  boxShadow: "none",
  borderRadius: theme.shape.borderRadius,
}));

const RiskCategoryCard = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  padding: theme.spacing(1.5, 1),
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  textDecoration: "none",
  transition: "background-color 0.15s",
  "&:hover": {
    backgroundColor: theme.palette.grey[50],
  },
}));

const UseCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  height: "100%",
}));

const AccessCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  height: "100%",
}));

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

// TODO: replace `route` values with the actual catalogue filter query params
//       once the risk catalogue page and its filter API are finalised.
// TODO: replace `icon` values with actual imports or public asset paths,
//       e.g. import NaturalIcon from "../../assets/icons/natural.png"
const RISK_CATEGORIES = [
  {
    key: "natural",
    count: 23,
    color: "#0F6E56",
    icon: RISK_CATEGORY.NATURE,
    route: "/risks?category=natural",
    labelKey: "learning.bnra.categories.natural",
    labelDefault: "Natural hazards",
  },
  {
    key: "societal",
    count: 22,
    color: "#534AB7",
    icon: RISK_CATEGORY.TRANSVERSAL,
    route: "/risks?category=societal",
    labelKey: "learning.bnra.categories.societal",
    labelDefault: "Societal risks",
  },
  {
    key: "economic",
    count: 23,
    color: "#185FA5",
    icon: RISK_CATEGORY.ECOTECH,
    route: "/risks?category=economic",
    labelKey: "learning.bnra.categories.economic",
    labelDefault: "Economic & technological",
  },
  {
    key: "manmade",
    count: 23,
    color: "#BA7517",
    icon: RISK_CATEGORY.MANMADE,
    route: "/risks?category=manmade",
    labelKey: "learning.bnra.categories.manmade",
    labelDefault: "Man-made incidents",
  },
  {
    key: "health",
    count: 10,
    color: "#D85A30",
    icon: RISK_CATEGORY.HEALTH,
    route: "/risks?category=health",
    labelKey: "learning.bnra.categories.health",
    labelDefault: "Health risks",
  },
  {
    key: "cyber",
    count: 5,
    color: "#993556",
    icon: RISK_CATEGORY.CYBER,
    route: "/risks?category=cyber",
    labelKey: "learning.bnra.categories.cyber",
    labelDefault: "Cyber risks",
  },
  {
    key: "emerging",
    count: 12,
    color: "#888780",
    icon: RISK_CATEGORY.EMERGING,
    route: "/risks?category=emerging",
    labelKey: "learning.bnra.categories.emerging",
    labelDefault: "Emerging risks",
    emerging: true,
    span: 2, // spans 2 columns in the 4-col grid
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function WhatIsBNRAPage() {
  const { t, i18n } = useTranslation();

  usePageTitle(t("learning.bnra.title", "What is the BNRA?"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.bnra.title", "What is the BNRA?"),
      url: "/learning/what-is-bnra",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.bnra.title">What is the BNRA?</Trans>
        </Typography>

        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          <Trans i18nKey="learning.bnra.intro">
            The Belgian National Risk Assessment (BNRA) is a structured,
            science-based process to identify and assess the most significant
            risks that Belgium may face, from natural disasters to cyber threats
            and public health crises. It is coordinated by the National Crisis
            Centre (NCCN) and carried out together with more than 160 experts
            from across government, academia, and industry.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Why does it exist?                                                  */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.bnra.mandate.title">
            Why does it exist?
          </Trans>
        </SectionTitle>

        <MandateCard>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.bnra.mandate.text">
              The BNRA originates from{" "}
              <strong>
                EU Decision No 1313/2013 on the Civil Protection Mechanism
              </strong>
              , which requires all member states to produce a national risk
              assessment every three years. By sharing these assessments across
              the EU, member states can exchange information and best practices,
              leading to a more coherent and effective approach to disaster
              prevention and preparedness across Europe. Belgium's current
              assessment covers the period <strong>2023 – 2026</strong>.
            </Trans>
          </Typography>
        </MandateCard>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Risk cycle                                                          */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.bnra.cycle.title">
            Where does it fit in the risk cycle?
          </Trans>
        </SectionTitle>

        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, sm: 5 }}>
            <img
              alt="risicocyclus"
              src={`https://bnra.powerappsportals.com/risicoCyclus${getLanguage(
                i18n.language,
              )}.png`}
              style={{ width: "80%", marginTop: 16 }}
            ></img>
          </Grid>

          <Grid size={{ xs: 12, sm: 7 }}>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", lineHeight: 1.7 }}
            >
              <Trans i18nKey="learning.bnra.cycle.text">
                The NCCN's mission covers{" "}
                <strong>all phases of the risk cycle</strong>, from
                identification and analysis through to prevention, preparedness,
                response, and recovery. The BNRA is the foundation of this
                cycle: it provides the structured risk knowledge that all
                subsequent steps depend on.
                <br />
                <br />
                The results of the BNRA directly inform{" "}
                <strong>
                  emergency planning, national preparedness measures, and crisis
                  management
                </strong>
                . The iterative nature of the BNRA (repeated every three years)
                acts as a continuous driver for improving Belgium's
                understanding of its risk landscape.
              </Trans>
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Key numbers                                                         */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.bnra.numbers.title">
            The BNRA in numbers
          </Trans>
        </SectionTitle>

        <Grid container spacing={1.5}>
          {[
            {
              value: "118",
              labelKey: "learning.bnra.numbers.risks",
              labelDefault: "risks assessed",
            },
            {
              value: "160+",
              labelKey: "learning.bnra.numbers.experts",
              labelDefault: "experts involved",
            },
            {
              value: "3",
              labelKey: "learning.bnra.numbers.scenarios",
              labelDefault: "scenarios per risk",
            },
            {
              value: "2026",
              labelKey: "learning.bnra.numbers.edition",
              labelDefault: "current edition",
              //   small: true,
            },
          ].map((stat) => (
            <Grid key={stat.labelKey} size={{ xs: 6, sm: 3 }}>
              <StatCard>
                <Typography
                  variant={"h4"}
                  sx={{ fontWeight: 500, color: "text.primary" }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.4,
                    display: "block",
                  }}
                >
                  {t(stat.labelKey, stat.labelDefault)}
                </Typography>
              </StatCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Risk categories                                                     */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.bnra.categories.title">
            What risks are covered?
          </Trans>
        </SectionTitle>

        <Grid container spacing={1.5}>
          {RISK_CATEGORIES.map((cat) => (
            <Grid key={cat.key} size={{ xs: 6, sm: cat.span === 2 ? 6 : 3 }}>
              <RouterLink to={cat.route} style={{ textDecoration: "none" }}>
                <RiskCategoryCard>
                  {/* TODO: replace this Box with an <img> once icon assets are available:
                    <img src={cat.icon} alt="" style={{ width: 48, height: 48, borderRadius: "50%", marginBottom: 8 }} />
                */}
                  <CategoryIcon
                    category={cat.icon}
                    size={60}
                    tooltip={false}
                    sx={{ mb: 2 }}
                  />
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 500, color: cat.color, lineHeight: 1 }}
                  >
                    {cat.count}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", mt: 0.5, lineHeight: 1.3 }}
                  >
                    {t(cat.labelKey, cat.labelDefault)}
                  </Typography>
                  {/* {cat.emerging && (
                  <Typography
                    variant="caption"
                    sx={{ color: "text.disabled", fontSize: "0.6rem" }}
                  >
                    {t(
                      "learning.bnra.categories.qualitativeOnly",
                      "(qualitative only)",
                    )}
                  </Typography>
                )} */}
                </RiskCategoryCard>
              </RouterLink>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* How results are used                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.bnra.uses.title">
            How are the results used?
          </Trans>
        </SectionTitle>

        <Grid container spacing={1.5}>
          {[
            {
              titleKey: "learning.bnra.uses.emergency.title",
              titleDefault: "Emergency planning",
              bodyKey: "learning.bnra.uses.emergency.body",
              bodyDefault:
                "BNRA findings feed directly into national emergency plan templates, identifying which consequences must be anticipated and planned for in each type of scenario.",
            },
            {
              titleKey: "learning.bnra.uses.critical.title",
              titleDefault: "Critical infrastructure resilience",
              bodyKey: "learning.bnra.uses.critical.body",
              bodyDefault:
                "Organisations providing vital services can use BNRA results to understand which national risks are relevant to their sector and to build their own risk analyses on a consistent foundation.",
            },
            {
              titleKey: "learning.bnra.uses.subnational.title",
              titleDefault: "Sub-national risk analyses",
              bodyKey: "learning.bnra.uses.subnational.body",
              bodyDefault:
                "Provincial and municipal authorities can use the BNRA as a starting point for their own risk assessments, ensuring coherence across administrative levels and facilitating the aggregation of results upward.",
            },
            {
              titleKey: "learning.bnra.uses.eu.title",
              titleDefault: "EU reporting & cooperation",
              bodyKey: "learning.bnra.uses.eu.body",
              bodyDefault:
                "Belgium's risk assessment is shared with the European Commission and other member states, contributing to a coherent EU-wide approach to civil protection and cross-border risk management.",
            },
          ].map((use) => (
            <Grid key={use.titleKey} size={{ xs: 12, sm: 6 }}>
              <UseCard>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  {t(use.titleKey, use.titleDefault)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  {t(use.bodyKey, use.bodyDefault)}
                </Typography>
              </UseCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Who can access                                                      */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 2 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.bnra.access.title">
            Who can access the results?
          </Trans>
        </SectionTitle>

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <AccessCard>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  {t("learning.bnra.access.public.title", "Risk guide")}
                </Typography>
                <Chip
                  size="small"
                  label={t("learning.bnra.access.public.tag", "Public")}
                  sx={{
                    backgroundColor: "#E1F5EE",
                    color: "#0F6E56",
                    fontWeight: 500,
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                {t(
                  "learning.bnra.access.public.body",
                  "An executive summary is published after every iteration and freely available to the public. It highlights the most significant risks by category.",
                )}
              </Typography>
            </AccessCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <AccessCard>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  {t(
                    "learning.bnra.access.restricted.title",
                    "Online platform",
                  )}
                </Typography>
                <Chip
                  size="small"
                  label={t("learning.bnra.access.restricted.tag", "Restricted")}
                  sx={{
                    backgroundColor: "#EEEDFE",
                    color: "#534AB7",
                    fontWeight: 500,
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                {t(
                  "learning.bnra.access.restricted.body",
                  "In-depth results, including full probability and impact data, are available on this platform to participating experts, organisations, and selected partners.",
                )}
              </Typography>
            </AccessCard>
          </Grid>
        </Grid>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Next page link                                                      */}
      {/* ------------------------------------------------------------------ */}
      <Box
        sx={{
          mt: 6,
          pt: 3,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          component={RouterLink}
          to="/learning/what-is-a-risk"
          endIcon={<ChevronRightIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.bnra.next">Next: What is a risk?</Trans>
        </Button>
      </Box>
    </Container>
  );
}
