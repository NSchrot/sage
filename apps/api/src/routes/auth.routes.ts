import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { UserRole } from '@prisma/client';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request, reply) => {
    const registerSchema = z.object({
      name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
      email: z.string().email('E-mail inválido'),
      password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    });

    const validation = registerSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.status(400).send({ 
        message: 'Dados de validação incorretos', 
        errors: validation.error.flatten().fieldErrors 
      });
    }

    const { name, email, password } = validation.data;

    try {
      const userExists = await prisma.user.findUnique({
        where: { email },
      });

      if (userExists) {
        return reply.status(400).send({ message: 'Este e-mail já está cadastrado.' });
      }

      const passwordHash = await bcrypt.hash(password, 8);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: UserRole.PARTICIPANTE,
        },
      });

      return reply.status(201).send({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Erro interno do servidor ao registrar usuário.' });
    }
  });

  fastify.post('/login', async (request, reply) => {
    const loginSchema = z.object({
      email: z.string().email('E-mail inválido'),
      password: z.string().min(1, 'Senha é obrigatória'),
    });

    const validation = loginSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.status(400).send({ 
        message: 'Dados de validação incorretos', 
        errors: validation.error.flatten().fieldErrors 
      });
    }

    const { email, password } = validation.data;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return reply.status(401).send({ message: 'E-mail ou senha incorretos.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        return reply.status(401).send({ message: 'E-mail ou senha incorretos.' });
      }

      const token = fastify.jwt.sign({
        sub: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });

      return reply.send({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Erro interno do servidor ao realizar login.' });
    }
  });
}
