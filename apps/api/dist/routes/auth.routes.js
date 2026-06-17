"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const zod_1 = require("zod");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
const client_1 = require("@prisma/client");
async function authRoutes(fastify) {
    fastify.post('/register', async (request, reply) => {
        const registerSchema = zod_1.z.object({
            name: zod_1.z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
            email: zod_1.z.string().email('E-mail inválido'),
            password: zod_1.z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
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
            const userExists = await prisma_1.prisma.user.findUnique({
                where: { email },
            });
            if (userExists) {
                return reply.status(400).send({ message: 'Este e-mail já está cadastrado.' });
            }
            const passwordHash = await bcryptjs_1.default.hash(password, 8);
            const user = await prisma_1.prisma.user.create({
                data: {
                    name,
                    email,
                    passwordHash,
                    role: client_1.UserRole.PARTICIPANTE,
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
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Erro interno do servidor ao registrar usuário.' });
        }
    });
    fastify.post('/login', async (request, reply) => {
        const loginSchema = zod_1.z.object({
            email: zod_1.z.string().email('E-mail inválido'),
            password: zod_1.z.string().min(1, 'Senha é obrigatória'),
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
            const user = await prisma_1.prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                return reply.status(401).send({ message: 'E-mail ou senha incorretos.' });
            }
            const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
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
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Erro interno do servidor ao realizar login.' });
        }
    });
}
