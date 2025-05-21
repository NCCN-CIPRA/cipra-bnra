import { Font } from "@react-pdf/renderer";

const Robo100 = "./src/assets/fonts/Roboto-Thin.ttf";
const Robo100i = "./src/assets/fonts/Roboto-ThinItalic.ttf";
const Robo200 = "./src/assets/fonts/Roboto-ExtraLight.ttf";
const Robo200i = "./src/assets/fonts/Roboto-ExtraLightItalic.ttf";
const Robo300 = "./src/assets/fonts/Roboto-Light.ttf";
const Robo300i = "./src/assets/fonts/Roboto-LightItalic.ttf";
const Robo400 = "./src/assets/fonts/Roboto-Regular.ttf";
const Robo400i = "./src/assets/fonts/Roboto-Italic.ttf";
const Robo500 = "./src/assets/fonts/Roboto-Medium.ttf";
const Robo500i = "./src/assets/fonts/Roboto-MediumItalic.ttf";
const Robo600 = "./src/assets/fonts/Roboto-SemiBold.ttf";
const Robo600i = "./src/assets/fonts/Roboto-SemiBoldItalic.ttf";
const Robo700 = "./src/assets/fonts/Roboto-Bold.ttf";
const Robo700i = "./src/assets/fonts/Roboto-BoldItalic.ttf";
const Robo800 = "./src/assets/fonts/Roboto-ExtraBold.ttf";
const Robo800i = "./src/assets/fonts/Roboto-ExtraBoldItalic.ttf";
const Robo900 = "./src/assets/fonts/Roboto-Black.ttf";
const Robo900i = "./src/assets/fonts/Roboto-BlackItalic.ttf";

Font.register({
  family: "NH",
  fonts: [
    {
      src: Robo100,
      fontWeight: 100,
    },
    {
      src: Robo100i,
      fontWeight: 100,
      fontStyle: "italic",
    },
    {
      src: Robo200,
      fontWeight: 200,
    },
    {
      src: Robo200i,
      fontWeight: 200,
      fontStyle: "italic",
    },
    {
      src: Robo300,
      fontWeight: 300,
    },
    {
      src: Robo300i,
      fontWeight: 300,
      fontStyle: "italic",
    },
    {
      src: Robo400,
      fontWeight: 400,
    },
    {
      src: Robo400i,
      fontWeight: 400,
      fontStyle: "italic",
    },
    {
      src: Robo500,
      fontWeight: 500,
    },
    {
      src: Robo500i,
      fontWeight: 500,
      fontStyle: "italic",
    },
    {
      src: Robo600,
      fontWeight: 600,
    },
    {
      src: Robo600i,
      fontWeight: 600,
      fontStyle: "italic",
    },
    {
      src: Robo700,
      fontWeight: 700,
    },
    {
      src: Robo700i,
      fontWeight: 700,
      fontStyle: "italic",
    },
    {
      src: Robo800,
      fontWeight: 800,
    },
    {
      src: Robo800i,
      fontWeight: 800,
      fontStyle: "italic",
    },
    {
      src: Robo900,
      fontWeight: 900,
    },
    {
      src: Robo900i,
      fontWeight: 9300,
      fontStyle: "italic",
    },
  ],
});
Font.registerHyphenationCallback((word) => [word]);
