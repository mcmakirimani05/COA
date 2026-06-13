import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { parseCSV } from '@/services/csvParser';
import { analyzeData } from '@/services/analyzer';
import { db } from '@/database/client';
import { v4 as uuidv4 } from 'uuid';

export async function billingRoutes(fastify: FastifyInstance) {
  fastify.post('/upload', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.code(400).send({ error: 'No file provided' });
      }

      const buffer = await data.file.toBuffer();
      const csvData = buffer.toString('utf-8');
      const parsed = await parseCSV(csvData);

      const analysisId = uuidv4();
      await db.query(
        'INSERT INTO billing_uploads (id, filename, data, records_count) VALUES ($1, $2, $3, $4)',
        [analysisId, data.filename, JSON.stringify(parsed), parsed.length]
      );

      const recommendations = await analyzeData(parsed);
      await db.query(
        'INSERT INTO recommendations (id, upload_id, data) VALUES ($1, $2, $3)',
        [uuidv4(), analysisId, JSON.stringify(recommendations)]
      );

      return reply.code(200).send({ analysisId, recordsProcessed: parsed.length });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Failed to process file' });
    }
  });
}