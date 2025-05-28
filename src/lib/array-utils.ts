export const getMostFrequent = <T>(values: T[]): T | undefined => {
  if (values.length === 0) return undefined;

  const frequencyMap = new Map<T, number>();

  values.forEach((value) => {
    frequencyMap.set(value, (frequencyMap.get(value) || 0) + 1);
  });

  let mostFrequent: T | undefined;
  let maxCount = 0;

  frequencyMap.forEach((count, value) => {
    if (count > maxCount) {
      maxCount = count;
      mostFrequent = value;
    }
  });

  return mostFrequent;
};
