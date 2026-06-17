import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import authPlugin from './plugins/auth';
import { authRoutes } from './routes/auth.routes';
import { activitiesRoutes } from './routes/activities.routes';
import { usersRoutes } from './routes/users.routes';
import * as dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({
  logger: true,
});

async function bootstrap() {
  await fastify.register(cors, {
    origin: true,
  });

  const secret = process.env.JWT_SECRET || 'super-secret-key-change-in-production-123456';
  await fastify.register(jwt, {
    secret,
  });

  await fastify.register(authPlugin);

  await fastify.register(authRoutes, { prefix: '/auth' });
  await fastify.register(activitiesRoutes);
  await fastify.register(usersRoutes);

  const port = Number(process.env.PORT) || 3333;

  try {
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Server listening on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

bootstrap();
