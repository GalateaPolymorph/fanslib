export const omitNullValues = (obj: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== null)
  );
