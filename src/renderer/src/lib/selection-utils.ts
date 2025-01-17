import { Media } from "../../../features/library/entity";

export type SelectionState<T extends string | number = string | number> = {
  id: T;
  state: "selected" | "half-selected" | "unselected";
};

export const getSelectionStates = <T extends { id: string | number }, K extends string | number>(
  items: T[],
  selectedItems: T[],
  getIds: (item: T) => K[]
): SelectionState<K>[] => {
  const counts = new Map<K, number>();

  // Count how many items have each id
  selectedItems.forEach((item) => {
    getIds(item).forEach((id) => {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    });
  });

  // Convert counts to states
  return Array.from(counts.entries()).map(([id, count]) => ({
    id,
    state: count === selectedItems.length ? "selected" : "half-selected",
  }));
};

export const updateSelectionForMedia = async (
  selectedMedia: Media[],
  itemId: string | number,
  updateFn: (mediaId: string, itemIds: (string | number)[]) => Promise<unknown>,
  getItemIds: (media: Media) => (string | number)[]
): Promise<void> => {
  const allHaveItem = selectedMedia.every((media) => getItemIds(media).some((id) => id === itemId));

  await Promise.all(
    selectedMedia.map((media) => {
      const currentIds = getItemIds(media);
      const updatedIds = allHaveItem
        ? currentIds.filter((id) => id !== itemId)
        : [...currentIds, itemId];

      return updateFn(media.id, updatedIds);
    })
  );
};
