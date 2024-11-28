import { fetchCategoryBySlug } from "../categories/fetch";
import { Category } from "../categories/type";
import { RawMediaData, MediaData } from "./type";

export const enrichMediaData = async (rawMediaData: RawMediaData): Promise<MediaData | null> => {
  const categories = rawMediaData.categoryIds
    ? await Promise.all(rawMediaData.categoryIds.map((slug) => fetchCategoryBySlug(slug))).then(
        (cats) => cats.filter(Boolean) as Category[]
      )
    : [];

  return {
    ...rawMediaData,
    categories,
  };
};
