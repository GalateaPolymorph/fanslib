import { ReadStream } from "fs";

export const streamToResponse = (stream: ReadStream) => {
  return new ReadableStream({
    start(controller) {
      let isClosed = false;

      stream.on("data", (chunk) => {
        if (!isClosed) {
          try {
            controller.enqueue(chunk);
          } catch (error) {
            console.error("Error enqueueing chunk:", error);
            if (!isClosed) {
              isClosed = true;
              controller.error(error);
              stream.destroy();
            }
          }
        }
      });

      stream.on("end", () => {
        if (!isClosed) {
          isClosed = true;
          controller.close();
        }
      });

      stream.on("error", (err) => {
        if (!isClosed) {
          isClosed = true;
          controller.error(err);
          stream.destroy();
        }
      });
    },
    cancel() {
      stream.destroy();
    },
  });
};
