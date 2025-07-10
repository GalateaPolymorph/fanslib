import { protocol } from "electron";
import { getThumbnailPath } from "../features/library/thumbnail";
import { streamToResponse } from "./stream";

export const registerThumbnailSchemeAsPrivileged = () => {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: "thumbnail",
      privileges: {
        secure: true,
        supportFetchAPI: true,
        bypassCSP: true,
        stream: true,
        standard: true,
        corsEnabled: true,
      },
    },
  ]);
};

export const registerThumbnailProtocolHandler = () => {
  protocol.handle("thumbnail", async (req) => {
    const url = new URL(req.url);
    const mediaId = decodeURIComponent(url.hostname || url.pathname.replace(/^\/+/, ""));
    const thumbnailPath = getThumbnailPath(mediaId);

    try {
      const { createReadStream, stat } = await import("fs");
      const { promisify } = await import("util");
      const statAsync = promisify(stat);

      const stats = await statAsync(thumbnailPath);
      const fileSize = stats.size;

      const headers = new Headers();
      headers.set("Accept-Ranges", "bytes");
      headers.set("Content-Length", fileSize.toString());
      headers.set("Content-Type", "image/jpeg");
      headers.set("Cache-Control", "public, max-age=31536000"); // Cache for 1 year since thumbnails are content-addressed

      const range = req.headers.get("Range");
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        headers.set("Content-Range", `bytes ${start}-${end}/${fileSize}`);
        headers.set("Content-Length", (end - start + 1).toString());

        return new Response(streamToResponse(createReadStream(thumbnailPath, { start, end })), {
          status: 206,
          headers,
        });
      }

      return new Response(streamToResponse(createReadStream(thumbnailPath)), {
        status: 200,
        headers,
      });
    } catch (error) {
      console.error(`Error serving thumbnail for ${mediaId}:`, error);
      return new Response(null, { status: 404 });
    }
  });
};
