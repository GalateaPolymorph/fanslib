export const CATEGORY_COLORS = [
  "#8A4FFF", // Vibrant Purple
  "#FF6B6B", // Coral Red
  "#4ECDC4", // Teal
  "#45B7D1", // Sky Blue
  "#FDCB6E", // Sunflower Yellow
  "#6C5CE7", // Deep Purple
  "#A8E6CF", // Mint Green
  "#FF8ED4", // Pink
  "#FAD390", // Soft Orange
  "#6A89CC", // Muted Blue
];
export const getRandomColor = () =>
  CATEGORY_COLORS[Math.floor(Math.random() * CATEGORY_COLORS.length)];
