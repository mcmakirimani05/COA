import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@/database/client';

export async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.get('/:analysisId', async (request: FastifyRequest<{ Params: { analysisId: string } }>, reply: FastifyReply) => {
    try {
      const { analysisId } = request.params;
      const result = await db.query(
        'SELECT data FROM billing_uploads WHERE id = $1',
        [analysisId]
      );

      if (result.rows.length === 0) {
        return reply.code(404).send({ error: 'Not found' });
      }

      const billingData = result.rows[0].data;
      const currentSpend = calculateCurrentSpend(billingData);
      const topOffenders = getTopOffenders(billingData);
      const potentialSavings = calculatePotentialSavings(billingData);
      const savingsPercentage = (potentialSavings / currentSpend) * 100;

      return reply.code(200).send({
        currentSpend,
        potentialSavings,
        savingsPercentage,
        topOffenders,
      });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Failed to fetch dashboard data' });
    }
  });
}

function calculateCurrentSpend(data: any[]): number {
  return data.reduce((sum, item) => sum + parseFloat(item.cost || 0), 0);
}

function getTopOffenders(data: any[]): Array<{ service: string; cost: number }> {
  const grouped = data.reduce((acc: any, item) => {
    const key = item.service || 'Unknown';
    acc[key] = (acc[key] || 0) + parseFloat(item.cost || 0);
    return acc;
  }, {});
  return Object.entries(grouped)
    .map(([service, cost]) => ({ service, cost: cost as number }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);
}

function calculatePotentialSavings(data: any[]): number {
  return data.reduce((sum, item) => {
    const usage = parseFloat(item.usage || 0);
    if (usage < 20) return sum + parseFloat(item.cost || 0) * 0.8;
    if (usage < 50) return sum + parseFloat(item.cost || 0) * 0.3;
    return sum;
  }, 0);
}