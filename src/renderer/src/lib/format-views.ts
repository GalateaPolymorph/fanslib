const MILLION = 1_000_000;
const THOUSAND = 1_000;

export const formatViewCount = (views: number): string => {
  if (views >= MILLION) {
    const millions = views / MILLION;
    return `${millions.toFixed(1)}M`.replace(".0M", "M");
  }

  if (views >= THOUSAND) {
    const thousands = views / THOUSAND;
    return `${thousands.toFixed(1)}K`.replace(".0K", "K");
  }

  return views.toString();
};

export const parseViewCount = (input: string): number | null => {
  // Remove any commas and spaces
  const cleanInput = input.replace(/[,\s]/g, "").toUpperCase();

  // Try to parse millions
  if (cleanInput.endsWith("M")) {
    const value = parseFloat(cleanInput.slice(0, -1));
    return isNaN(value) ? null : Math.round(value * MILLION);
  }

  // Try to parse thousands
  if (cleanInput.endsWith("K")) {
    const value = parseFloat(cleanInput.slice(0, -1));
    return isNaN(value) ? null : Math.round(value * THOUSAND);
  }

  // Try to parse regular number
  const value = parseFloat(cleanInput);
  return isNaN(value) ? null : Math.round(value);
};
