import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { UserRole } from '@prisma/client';

export async function usersRoutes(fastify: FastifyInstance) {
  fastify.get('/users', {
    preHandler: [fastify.onlyRole(UserRole.ADMINISTRADOR)]
  }, async (_request, reply) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' }
      });

      return reply.send(users);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Erro ao buscar usuários.' });
    }
  });

  fastify.patch('/users/:id/role', {
    preHandler: [fastify.onlyRole(UserRole.ADMINISTRADOR)]
  }, async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });
    const bodySchema = z.object({
      role: z.nativeEnum(UserRole),
    });

    const paramsValidation = paramsSchema.safeParse(request.params);
    if (!paramsValidation.success) {
      return reply.status(400).send({ message: 'ID de usuário inválido.' });
    }

    const bodyValidation = bodySchema.safeParse(request.body);
    if (!bodyValidation.success) {
      return reply.status(400).send({
        message: 'Dados de validação incorretos',
        errors: bodyValidation.error.flatten().fieldErrors
      });
    }

    const { id } = paramsValidation.data;
    const { role } = bodyValidation.data;

    try {
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        return reply.status(404).send({ message: 'Usuário não encontrado.' });
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { role },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        }
      });

      return reply.send(updatedUser);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Erro ao atualizar perfil do usuário.' });
    }
  });

  fastify.delete('/users/:id', {
    preHandler: [fastify.onlyRole(UserRole.ADMINISTRADOR)]
  }, async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const paramsValidation = paramsSchema.safeParse(request.params);
    if (!paramsValidation.success) {
      return reply.status(400).send({ message: 'ID de usuário inválido.' });
    }

    const { id } = paramsValidation.data;

    if (id === request.user.sub) {
      return reply.status(400).send({ message: 'Você não pode remover a própria conta.' });
    }

    try {
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        return reply.status(404).send({ message: 'Usuário não encontrado.' });
      }

      await prisma.user.delete({ where: { id } });

      return reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Erro ao remover usuário.' });
    }
  });
}
