import {
  Box,
  Container,
  Button,
  Stack,
  Link,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useTranslation } from "react-i18next";
import usePageTitle from "../../hooks/usePageTitle";

import indicatorsSVG from "../../assets/icons/indicators.svg";
import scenariosSVG from "../../assets/icons/scenarios.svg";
import cascadesSVG from "../../assets/icons/cascades.svg";
import catalogueSVG from "../../assets/icons/catalogue.svg";
import TTypography from "../../components/TransEdit";

// const getCleanLanguage = (language: string) => {
//   if (language.indexOf("en") >= 0) return "en";
//   if (language.indexOf("nl") >= 0) return "nl";
//   if (language.indexOf("fr") >= 0) return "fr";
//   if (language.indexOf("de") >= 0) return "de";
// };

// const onDownload = (filename: string) => {
//   const link = document.createElement("a");
//   link.download = filename;
//   link.href = `https://raw.githubusercontent.com/NCCN-CIPRA/cipra-bnra/refs/heads/main/src/assets/pdf/${filename}`;
//   link.click();
// };

export default function MethodologyPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  usePageTitle(
    t("methodology.framework.title", "National Risk Assessment Framework")
  );

  useBreadcrumbs(null);

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(128, 180, 180, 0.33)",
          backgroundImage:
            "url('https://bnra.powerappsportals.com/banner.png')",
          backgroundSize: "auto 1000px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          zIndex: -10,
          opacity: 0.6,
        }}
      />
      <Box
        sx={{
          mt: -2,
          width: "100%",
          height: 200,
          backgroundColor: "transparent",
        }}
      >
        <Container
          sx={{
            display: "flex",
            alignItems: "flex-end",
            height: "100%",
            pb: 4,
          }}
        >
          <Stack direction="column">
            <img
              alt="text logo"
              src="https://bnra.powerappsportals.com/logo_text.png"
              style={{ width: 100, marginBottom: 20 }}
            />
            <TTypography variant="h3" i18nKey="methodology.framework.title">
              National Risk Assessment Framework
            </TTypography>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "white", width: "100%", pt: 4, pb: 4 }}>
        <Container>
          <TTypography
            i18nKey="methodology.framework.introduction.1"
            variant="body1"
            sx={{ marginBottom: 2 }}
          >
            To support a more resilient and well-informed society, the National
            Crisis Centre (NCCN) has developed a novel{" "}
            <b>national risk assessment methodology</b> tailored specifically
            for the Belgian National Risk Assessment (BNRA). This methodology
            was designed to better capture the complex and entangled nature of
            risks facing the country, and to enable consistent, relevant, and
            evidence-based prevention and prepardness planning.
          </TTypography>
          <TTypography
            i18nKey="methodology.framework.introduction.2"
            variant="body1"
            sx={{ marginBottom: 2 }}
          >
            At the core of this approach are <b>four foundational elements</b>,
            each of which contributes to a comprehensive and structured risk
            analysis process. These pillars reflect{" "}
            <b>international best practices</b> and are intended to serve as a{" "}
            <b>
              framework for risk analyses across governmental and societal
              domains
            </b>
            .
          </TTypography>
          <TTypography
            i18nKey="methodology.framework.introduction.3"
            variant="body1"
            sx={{ marginBottom: 2 }}
          >
            Whether used by federal institutions, local authorities, or vital
            sector stakeholders, the information provided on these pages should
            offer a solid foundation and clear guidelines for describing,
            assessing and prioritizing risks in a consistent manner.
          </TTypography>
        </Container>
      </Box>

      <Box>
        <Container>
          <Box sx={{ my: 8, position: "relative" }}>
            <Stack direction="row" gap={2}>
              <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <CardMedia
                  component="img"
                  sx={{ aspectRatio: 1.2, objectFit: "contain", p: 3 }}
                  image={indicatorsSVG}
                  title="Standardized scales of probability and impact"
                />
                <CardContent sx={{ flex: 1 }}>
                  <TTypography
                    i18nKey="methodology.framework.scale.title"
                    gutterBottom
                    variant="subtitle2"
                    component="div"
                    sx={{ height: 50 }}
                  >
                    Standardized scales of probability and impact
                  </TTypography>
                  <TTypography
                    i18nKey="methodology.framework.scale.1"
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 1 }}
                  >
                    Risks should be assessed using common scales for both
                    likelihood and impact, ensuring consistent evaluations
                    across different domains. This standardized approach allows
                    for meaningful comparison between diverse types of risks.
                  </TTypography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate("/methodology/scales")}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
              <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <CardMedia
                  component="img"
                  sx={{ aspectRatio: 1.2, objectFit: "contain", p: 3 }}
                  image={scenariosSVG}
                  title="Multi-scenario approach"
                />
                <CardContent sx={{ flex: 1 }}>
                  <TTypography
                    i18nKey="methodology.framework.scenarios.title"
                    gutterBottom
                    variant="subtitle2"
                    component="div"
                    sx={{ height: 50 }}
                  >
                    Multi-scenario approach
                  </TTypography>
                  <TTypography
                    i18nKey="methodology.framework.scenarios.1"
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    Risks should be broken down into multiple, clearly defined
                    scenarios that span a range of magnitudes. These scenarios
                    should be described concretely using risk-specific
                    parameters.
                  </TTypography>
                </CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
              <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <CardMedia
                  component="img"
                  sx={{ aspectRatio: 1.2, objectFit: "contain", p: 3 }}
                  image={cascadesSVG}
                  title="Causes and consequenses"
                />
                <CardContent sx={{ flex: 1 }}>
                  <TTypography
                    i18nKey="methodology.framework.cascades.title"
                    gutterBottom
                    variant="subtitle2"
                    component="div"
                    sx={{ height: 50 }}
                  >
                    Investigating causes and consequences
                  </TTypography>
                  <TTypography
                    i18nKey="methodology.framework.cascades.1"
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    Mapping out both the potential causes and consequences of
                    each risk leads to a deeper understanding. This holistic
                    view supports more relevant insights and informed
                    decision-making.
                  </TTypography>
                </CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
              <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <CardMedia
                  component="img"
                  sx={{ aspectRatio: 1.2, objectFit: "contain", p: 3 }}
                  image={catalogueSVG}
                  title="Standardized catalogue of risks"
                />
                <CardContent sx={{ flex: 1 }}>
                  <TTypography
                    i18nKey="methodology.framework.catalogue.title"
                    gutterBottom
                    variant="subtitle2"
                    component="div"
                    sx={{ height: 50 }}
                  >
                    Standardized catalogue of national risks
                  </TTypography>
                  <TTypography
                    i18nKey="methodology.framework.catalogue.1"
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    Assessments should be based on a validated and coherent
                    catalogue of national risks, which can be further elaborated
                    if necessary. This common reference point improves clarity,
                    fosters alignment and facilitates communication.
                  </TTypography>
                </CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "white", width: "100%", pt: 4, pb: 12 }}>
        <Container>
          <Box sx={{ mt: 4, display: "flex", flexDirection: "column" }}></Box>
        </Container>
      </Box>

      <Box>
        <Container>
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.7)",
              border: "1px solid #fff",
              mx: "auto",
              my: 8,
              width: 500,
              px: 10,
              py: 4,
              textAlign: "center",
            }}
          >
            <TTypography
              i18nKey="landingpage.questions1"
              variant="body1"
              sx={{ textAlign: "center" }}
            >
              Questions, suggestions or other? Please don&#quot;t hesitate to
              contact us!
            </TTypography>
            <Typography variant="body1" paragraph sx={{ textAlign: "center" }}>
              <Link href={`mailto:cipra.bnra@nccn.fgov.be`}>
                cipra.bnra@nccn.fgov.be
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>

      <Stack
        direction="row"
        sx={{
          justifyContent: "space-evenly",
          py: 2,
          backgroundColor: "white",
          borderTop: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <img
          alt="Nationaal Crisiscentrum"
          src="https://bnra.powerappsportals.com/logo_nccn.svg"
          style={{ height: 40 }}
        />
        <img
          alt="BNRA"
          src="https://bnra.powerappsportals.com/logo_text.png"
          style={{ height: 40 }}
        />
      </Stack>
    </>
  );
}
