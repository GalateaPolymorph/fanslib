import { Data, Effect } from 'effect';
import { tryPromise } from 'effect/Effect';
import ffmpeg from 'fluent-ffmpeg';

export type VideoMetadata = {
  width: number;
  height: number;
  duration: number;
  format: string;
};

export class VideoMetadataError extends Data.TaggedError('VideoMetadataError')<{
  absolutePath: string;
  cause: Error;
}> { }

export const extractVideoMetadata = Effect.fn('extractVideoMetadata')(
  function*(absolutePath: string) {
    const metadata = yield* tryPromise({
      try: () =>
        new Promise<ffmpeg.FfprobeData>((resolve, reject) => {
          ffmpeg.ffprobe(absolutePath, (error: unknown, metadata: unknown) => {
            if (error) {
              reject(error);
            } else {
              resolve(metadata);
            }
          });
        }),
      catch: (error) =>
        new VideoMetadataError({
          absolutePath,
          cause: error as Error,
        }),
    });

    const videoStream = metadata.streams.find(
      (stream: { codec_type: string }) => stream.codec_type === 'video'
    );

    if (!videoStream) {
      return yield* Effect.fail(
        new VideoMetadataError({
          absolutePath,
          cause: new Error('No video stream found in file'),
        })
      );
    }

    const width = videoStream.width;
    const height = videoStream.height;
    const duration = Math.round(parseFloat(metadata.format.duration ?? '0'));
    const format = videoStream.codec_name ?? 'unknown';

    if (!width || !height) {
      return yield* Effect.fail(
        new VideoMetadataError({
          absolutePath,
          cause: new Error('Could not extract video dimensions'),
        })
      );
    }

    const out: VideoMetadata = {
      width,
      height,
      duration,
      format,
    };

    return out;
  }
);
