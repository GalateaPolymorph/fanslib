import { protocol } from "electron";
import { streamToResponse } from "./stream";

export const registerMediaSchemeAsPrivileged = () => {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: "media",
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

export const registerMediaProtocolHandler = () => {
  protocol.handle("media", async (req) => {
    const pathToMedia = decodeURIComponent(new URL(req.url).href.replace("media:/", ""));

    try {
      const { createReadStream, stat } = await import("fs");
      const { promisify } = await import("util");
      const statAsync = promisify(stat);

      const stats = await statAsync(pathToMedia);
      const fileSize = stats.size;

      const headers = new Headers();
      headers.set("Accept-Ranges", "bytes");
      headers.set("Content-Length", fileSize.toString());

      // If it's a video file, set appropriate content type and handle range requests
      if (pathToMedia.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/)) {
        headers.set("Content-Type", "video/mp4");

        const range = req.headers.get("Range");
        if (range) {
          const parts = range.replace(/bytes=/, "").split("-");
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

          headers.set("Content-Range", `bytes ${start}-${end}/${fileSize}`);
          headers.set("Content-Length", (end - start + 1).toString());

          return new Response(streamToResponse(createReadStream(pathToMedia, { start, end })), {
            status: 206,
            headers,
          });
        }
      }

      return new Response(streamToResponse(createReadStream(pathToMedia)), {
        status: 200,
        headers,
      });
    } catch (error) {
      console.error("Error handling media request:", error);
      return new Response("Error fetching media", { status: 500 });
    }
  });
};
