import { MediaFile } from "../../../features/library/shared/types";

type Media = {
  file: MediaFile;
};
export const Media = ({ file }: Media) => {
  if (file.type === "image") {
    return (
      <img
        src={`media://${file.path}`}
        alt={file.name}
        className="w-full h-full object-cover rounded-lg overflow-hidden"
      />
    );
  }

  if (file.type === "video") {
    return (
      <video
        src={`media://${file.path}`}
        className="w-full h-full object-cover rounded-lg overflow-hidden"
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center text-muted-foreground rounded-lg">
      Unsupported media type
    </div>
  );
};
