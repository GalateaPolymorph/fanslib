export const formatToDecimalSeconds = (milliseconds: number): string => {
  const seconds = milliseconds / 1000;
  return `${seconds.toFixed(2)}s`;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};
