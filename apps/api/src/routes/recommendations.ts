import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@/database/client';

export async function recommendationsRoutes(fastify: FastifyInstance) {
  fastify.get('/:analysisId', async (request: FastifyRequest<{ Params: { analysisId: string } }>, reply: FastifyReply) => {
    try {
      const { analysisId } = request.params;
      const result = await db.query(
        'SELECT data FROM recommendations WHERE upload_id = $1 LIMIT 1',
        [analysisId]
      );

      if (result.rows.length === 0) {
        return reply.code(404).send({ error: 'Not found' });
      }

      const recommendations = result.rows[0].data;
      return reply.code(200).send(recommendations);
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Failed to fetch recommendations' });
    }
  });
}