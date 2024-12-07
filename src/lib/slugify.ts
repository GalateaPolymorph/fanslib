export const slugify = (str: string): string => {
  const slug = str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
  return slug;
};
