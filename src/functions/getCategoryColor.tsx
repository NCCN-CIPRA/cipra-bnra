export const colors: { [key: string]: string } = {
  Cyber: "#7D5C65",
  EcoTech: "#A69658",
  "Emerging Risk": "#E5BEED",
  Health: "#74b9ff",
  "Man-made": "#ff7675",
  Nature: "#7EA16B",
  Transversal: "#636e72",
};

export default function getCategoryColor(category: string) {
  if (colors[category]) return colors[category];

  return "rgb(0, 164, 154)";
}
