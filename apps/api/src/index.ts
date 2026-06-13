import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { billingRoutes } from './routes/billing';
import { recommendationsRoutes } from './routes/recommendations';
import { dashboardRoutes } from './routes/dashboard';
import { exportRoutes } from './routes/export';

const fastify = Fastify({ logger: true });

fastify.register(cors, { origin: true });
fastify.register(multipart);

fastify.get('/health', async () => {
  return { status: 'ok' };
});

fastify.register(billingRoutes, { prefix: '/api/billing' });
fastify.register(recommendationsRoutes, { prefix: '/api/recommendations' });
fastify.register(dashboardRoutes, { prefix: '/api/dashboard' });
fastify.register(exportRoutes, { prefix: '/api/export' });

const start = async () => {
  try {
    await fastify.listen({ port: 4000, host: '0.0.0.0' });
    console.log('Server running on http://localhost:4000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();