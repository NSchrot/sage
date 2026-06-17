"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const client_1 = require("@prisma/client");
exports.default = (0, fastify_plugin_1.default)(async function (fastify) {
    fastify.decorate('authenticate', async function (request, reply) {
        try {
            await request.jwtVerify();
        }
        catch (err) {
            return reply.status(401).send({ message: 'Não autorizado. Token inválido ou ausente.' });
        }
    });
    fastify.decorate('onlyRole', function (role) {
        return async function (request, reply) {
            try {
                await request.jwtVerify();
            }
            catch (err) {
                return reply.status(401).send({ message: 'Não autorizado. Token inválido ou ausente.' });
            }
            const allowedRoles = Array.isArray(role) ? role : role === client_1.UserRole.ORGANIZADOR ? [role, client_1.UserRole.ADMINISTRADOR] : [role];
            if (!allowedRoles.includes(request.user.role)) {
                return reply.status(403).send({ message: `Acesso negado. Requer perfil ${allowedRoles.join(' ou ')}.` });
            }
        };
    });
});
