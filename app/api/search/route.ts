import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search docs
 *     description: Full-text search over documentation
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
export const { GET } = createFromSource(source, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: 'english',
});
