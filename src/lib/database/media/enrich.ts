import { isNotNil } from "ramda";
import { fetchCategoryBySlug } from "../categories/fetch";
import { Media } from "./type";

export const enrichMedia = async (media: Media): Promise<Media> => {
  const categories = media.categoryIds
    ? await Promise.all((media.categoryIds ?? []).map((slug) => fetchCategoryBySlug(slug))).then(
        (categories) => categories.filter(isNotNil)
      )
    : [];

  return {
    ...media,
    categories,
  };
};
