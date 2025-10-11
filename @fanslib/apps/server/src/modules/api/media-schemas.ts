import { t } from 'elysia';

export const scanRequestSchema = t.Object({
  contentPath: t.String({
    description: 'Absolute path to content directory to scan',
    example: '/app/content',
  }),
  options: t.Optional(
    t.Object({
      assignShoots: t.Optional(
        t.Boolean({
          description:
            'Whether to detect and assign shoots from folder structure',
          default: true,
        })
      ),
      includeMetadata: t.Optional(
        t.Boolean({
          description:
            'Whether to extract media metadata (dimensions, duration)',
          default: true,
        })
      ),
      includeThumbnails: t.Optional(
        t.Boolean({
          description: 'Whether to generate thumbnails for media files',
          default: true,
        })
      ),
      cleanupRemoved: t.Optional(
        t.Boolean({
          description:
            'Whether to remove database entries for files no longer on disk',
          default: true,
        })
      ),
    })
  ),
});

export const scanResponseSchema = t.Object({
  success: t.Boolean(),
  results: t.Object({
    totalFiles: t.Number({
      description: 'Total number of media files discovered',
    }),
    newFiles: t.Number({
      description: 'Number of new files added to database',
    }),
    updatedFiles: t.Number({
      description: 'Number of existing files updated in database',
    }),
    removedFiles: t.Number({
      description: 'Number of files removed from database (no longer on disk)',
    }),
    errors: t.Array(
      t.Object({
        type: t.String(),
        message: t.String(),
        filePath: t.Optional(t.String()),
      })
    ),
  }),
});

export const scanStatusResponseSchema = t.Object({
  status: t.Union(
    [
      t.Literal('idle'),
      t.Literal('scanning'),
      t.Literal('completed'),
      t.Literal('error'),
      t.Literal('cancelled'),
    ],
    {
      description: 'Current scan status',
    }
  ),
  progress: t.Number({
    description: 'Scan progress percentage (0-100)',
    minimum: 0,
    maximum: 100,
  }),
  totalFiles: t.Number({
    description: 'Total files to process in current/last scan',
  }),
  processedFiles: t.Number({
    description: 'Number of files processed so far',
  }),
  currentFile: t.Optional(
    t.String({
      description: 'Currently processing file path',
    })
  ),
  errors: t.Array(t.String(), {
    description: 'Error messages from current/last scan',
  }),
  startTime: t.Optional(
    t.String({
      format: 'date-time',
      description: 'ISO timestamp when current scan started',
    })
  ),
  endTime: t.Optional(
    t.String({
      format: 'date-time',
      description: 'ISO timestamp when last scan completed',
    })
  ),
});

export const cancelResponseSchema = t.Union([
  t.Object({
    success: t.Literal(true),
    message: t.String(),
  }),
  t.Object({
    success: t.Literal(false),
    error: t.Object({
      type: t.String(),
      message: t.String(),
    }),
  }),
]);
