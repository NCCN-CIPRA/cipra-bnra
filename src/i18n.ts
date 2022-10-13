import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          bnra: {
            shortName: "BNRA 2023 - 2026",
          },
          riskFile: {
            appName: "Hazard Catalogue",
            causes: {
              choices: "Non-causing hazards",
              chosen: "Causing hazards",
              subheader_one: "{{count}} cause identified",
              subheader_other: "{{count}} causes identified",
            },
            effects: {
              choices: "Non-effect hazards",
              chosen: "Effect hazards",
              subheader_one: "{{count}} effect identified",
              subheader_other: "{{count}} effects identified",
            },
            maliciousActions: {
              choices: "Non-potential actions",
              chosen: "Potential actions",
              subheader_one: "{{count}} action identified",
              subheader_other: "{{count}} actions identified",
            },
            catalysedEffects: {
              choices: "Non-catalysed hazards",
              chosen: "Catalysed hazards",
              subheader_one: "{{count}} catalysed hazard identified",
              subheader_other: "{{count}} catalysed hazards identified",
            },
            catalysingEffects: {
              choices: "Non-catalysing hazards",
              chosen: "Catalysing hazards",
              subheader_one: "{{count}} catalysing hazard identified",
              subheader_other: "{{count}} catalysing hazards identified",
            },
          },
          validation: {
            appName: "Risk Identification",
            appFullName: "BNRA 2023 - 2026 Risk File Validation",
            tooltip: {
              finished: "You have finished validating this risk file",
            },
          },
          analysis: {
            A: {
              appName: "Analysis 2A",
            },
            B: {
              appName: "Analysis 2B",
            },
            averager: {
              appName: "Response Averager",
            },
            calculator: {
              appName: "Result Calculator",
            },
          },
          consensus: {
            appName: "Consensus Building",
          },
          reporting: {
            appName: "Reporting",
          },

          intensityParameters: {
            name: "Parameter Name",
            description: "Parameter Description",
          },
          scenarios: {
            considerable: "Considerable",
            major: "Major",
            extreme: "Extreme",
          },

          button: {
            logout: "Log Out",
          },

          "Standard Risk": "Standard risk file",
          "Malicious Man-made Risk": "Malicious actors risk file",
          "Emerging Risk": "Emerging risk file",
        },
      },
    },
  });

export default i18n;
