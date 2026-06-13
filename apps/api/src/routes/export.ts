import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@/database/client';
import { exportToPDF, exportToCSV } from '@/services/exporter';

export async function exportRoutes(fastify: FastifyInstance) {
  fastify.post('/pdf', async (request: FastifyRequest<{ Body: { analysisId: string } }>, reply: FastifyReply) => {
    try {
      const { analysisId } = request.body as { analysisId: string };
      const result = await db.query(
        'SELECT data FROM recommendations WHERE upload_id = $1 LIMIT 1',
        [analysisId]
      );

      if (result.rows.length === 0) {
        return reply.code(404).send({ error: 'Not found' });
      }

      const pdf = await exportToPDF(result.rows[0].data);
      return reply.type('application/pdf').send(pdf);
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Failed to export PDF' });
    }
  });

  fastify.post('/csv', async (request: FastifyRequest<{ Body: { analysisId: string } }>, reply: FastifyReply) => {
    try {
      const { analysisId } = request.body as { analysisId: string };
      const result = await db.query(
        'SELECT data FROM recommendations WHERE upload_id = $1 LIMIT 1',
        [analysisId]
      );

      if (result.rows.length === 0) {
        return reply.code(404).send({ error: 'Not found' });
      }

      const csv = await exportToCSV(result.rows[0].data);
      return reply.type('text/csv').send(csv);
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Failed to export CSV' });
    }
  });
}