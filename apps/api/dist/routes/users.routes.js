"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = usersRoutes;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const client_1 = require("@prisma/client");
async function usersRoutes(fastify) {
    fastify.get('/users', {
        preHandler: [fastify.onlyRole(client_1.UserRole.ORGANIZADOR)]
    }, async (_request, reply) => {
        try {
            const users = await prisma_1.prisma.user.findMany({
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
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Erro ao buscar usuários.' });
        }
    });
    fastify.patch('/users/:id/role', {
        preHandler: [fastify.onlyRole(client_1.UserRole.ORGANIZADOR)]
    }, async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const bodySchema = zod_1.z.object({
            role: zod_1.z.nativeEnum(client_1.UserRole),
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
            const user = await prisma_1.prisma.user.findUnique({ where: { id } });
            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado.' });
            }
            const updatedUser = await prisma_1.prisma.user.update({
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
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Erro ao atualizar perfil do usuário.' });
        }
    });
    fastify.delete('/users/:id', {
        preHandler: [fastify.onlyRole(client_1.UserRole.ORGANIZADOR)]
    }, async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
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
            const user = await prisma_1.prisma.user.findUnique({ where: { id } });
            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado.' });
            }
            await prisma_1.prisma.user.delete({ where: { id } });
            return reply.status(204).send();
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Erro ao remover usuário.' });
        }
    });
}
