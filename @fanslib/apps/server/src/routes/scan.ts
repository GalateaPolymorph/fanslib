import { Elysia } from 'elysia';
import {
  cancelResponseSchema,
  scanRequestSchema,
  scanResponseSchema,
  scanStatusResponseSchema,
} from '../modules/api/media-schemas';
import {
  cancelCurrentScan,
  executeScan,
  getScanStatusInfo,
} from '../modules/scanning/scan-controller';

export const mediaRoutes = new Elysia({ prefix: '/api/media' })
  .post(
    '/scan',
    async ({ body }) => {
      const { contentPath, options = {} } = body;
      return await executeScan(contentPath, options);
    },
    {
      body: scanRequestSchema,
      response: scanResponseSchema,
      detail: {
        tags: ['Media'],
        summary: 'Trigger full content library scan',
        description:
          'Scans the specified directory for media files, extracts metadata, generates thumbnails, and syncs to database with automatic shoot detection',
      },
    }
  )
  .get('/scan/status', () => getScanStatusInfo(), {
    response: scanStatusResponseSchema,
    detail: {
      tags: ['Media'],
      summary: 'Get scan progress status',
      description:
        'Returns current scan status including progress percentage and any errors',
    },
  })
  .post('/scan/cancel', () => cancelCurrentScan(), {
    response: cancelResponseSchema,
    detail: {
      tags: ['Media'],
      summary: 'Cancel current scan operation',
      description:
        'Cancels the currently running scan operation if one is in progress',
    },
  });
