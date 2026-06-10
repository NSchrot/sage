"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
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
            if (request.user.role !== role) {
                return reply.status(403).send({ message: `Acesso negado. Requer perfil ${role}.` });
            }
        };
    });
});
