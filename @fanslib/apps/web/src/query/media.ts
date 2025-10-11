import { useLiveQuery } from '@tanstack/react-db';
import { mediaCollection } from '../lib/collections';

export type MediaQueryOptions = {
  shootId?: number | null | undefined;
};

export const useMedia = (options: MediaQueryOptions = {}) => {
  const mediaQuery = useLiveQuery(mediaCollection);

  const filteredData = mediaQuery.data
    ? options.shootId
      ? mediaQuery.data.filter((item) => item.shootId === options.shootId)
      : mediaQuery.data
    : [];

  return {
    ...mediaQuery,
    data: filteredData,
  };
};
