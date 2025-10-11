export const thumbnailDimensions = (
  originalWidth: number,
  originalHeight: number
) => {
  const longestSide = Math.max(originalWidth, originalHeight);

  if (longestSide <= 500) {
    return { width: originalWidth, height: originalHeight };
  }

  const scaleFactor = 500 / longestSide;
  const thumbnailWidth = Math.round(originalWidth * scaleFactor);
  const thumbnailHeight = Math.round(originalHeight * scaleFactor);

  return { width: thumbnailWidth, height: thumbnailHeight };
};
