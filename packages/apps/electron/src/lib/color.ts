// Color validation utilities for tags
export const validateHexColor = (color: string): string | null => {
  if (!color) {
    return null; // Color is optional
  }

  // Check if it's a valid hex color format
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  if (!hexColorRegex.test(color)) {
    return "Color must be a valid hex format (e.g., #FF0000 or #F00)";
  }

  return null;
};

export const normalizeHexColor = (color: string): string => {
  if (!color) return color;

  // Convert 3-digit hex to 6-digit hex
  if (color.length === 4 && color.startsWith("#")) {
    const shortHex = color.slice(1);
    return `#${shortHex
      .split("")
      .map((char) => char + char)
      .join("")}`;
  }

  return color.toUpperCase();
};
