import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { UserRole } from '@prisma/client';

export interface UserPayload {
  sub: string;
  name: string;
  email: string;
  role: UserRole;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: UserPayload;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    onlyRole: (role: UserRole) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export default fp(async function (fastify: FastifyInstance) {
  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        return reply.status(401).send({ message: 'Não autorizado. Token inválido ou ausente.' });
      }
    }
  );

  fastify.decorate(
    'onlyRole',
    function (role: UserRole) {
      return async function (request: FastifyRequest, reply: FastifyReply) {
        try {
          await request.jwtVerify();
        } catch (err) {
          return reply.status(401).send({ message: 'Não autorizado. Token inválido ou ausente.' });
        }

        if (request.user.role !== role) {
          return reply.status(403).send({ message: `Acesso negado. Requer perfil ${role}.` });
        }
      };
    }
  );
});
