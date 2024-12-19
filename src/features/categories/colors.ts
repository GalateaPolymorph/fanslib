export const CATEGORY_COLORS = [
  "#7F00FF",
  "#FCD023",
  "#FF8811",
  "#FFC2E2",
  "#EF476F",
  "#00A8E8",
  "#4CAF50",
];
export const getRandomColor = () =>
  CATEGORY_COLORS[Math.floor(Math.random() * CATEGORY_COLORS.length)];
