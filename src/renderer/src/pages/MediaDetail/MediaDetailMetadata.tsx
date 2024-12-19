import { format, formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { Media } from "../../../../features/library/entity";
import { formatBytes } from "../../lib/format";

type Props = {
  media: Media;
};

export const MediaDetailMetadata = ({ media }: Props) => {
  const [relativePath, setRelativePath] = useState<string>("");

  useEffect(() => {
    const getLibraryPath = async () => {
      const settings = await window.api["settings:load"]();
      const libraryPath = settings.libraryPath;
      if (media.path.startsWith(libraryPath)) {
        setRelativePath(media.path.slice(libraryPath.length + 1));
      }
    };

    getLibraryPath();
  }, [media.path]);

  return (
    <div className="grid grid-cols-[1fr_3fr] gap-x-4 gap-y-2 text-sm">
      <span className="text-muted-foreground">Type</span>
      <span className="capitalize">{media.type}</span>

      <span className="text-muted-foreground">Size</span>
      <span>{formatBytes(media.size)}</span>

      {media.duration && (
        <>
          <span className="text-muted-foreground">Duration</span>
          <span>{Math.round(media.duration)}s</span>
        </>
      )}

      <span className="text-muted-foreground">Path</span>
      <span className="truncate" title={relativePath}>
        {relativePath}
      </span>

      <span className="text-muted-foreground">Created</span>
      <span title={format(media.fileCreationDate, "PPpp")}>
        {formatDistanceToNow(media.fileCreationDate, { addSuffix: true })}
      </span>

      <span className="text-muted-foreground">Modified</span>
      <span title={format(media.fileModificationDate, "PPpp")}>
        {formatDistanceToNow(media.fileModificationDate, { addSuffix: true })}
      </span>

      <span className="text-muted-foreground">Added to Library</span>
      <span title={format(media.createdAt, "PPpp")}>
        {formatDistanceToNow(media.createdAt, { addSuffix: true })}
      </span>
    </div>
  );
};
