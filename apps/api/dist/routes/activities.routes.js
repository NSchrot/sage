"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activitiesRoutes = activitiesRoutes;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const client_1 = require("@prisma/client");
const certificates_1 = require("../lib/certificates");
function isWriteConflict(error) {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2034';
}
function isAttendanceWindowOpen(startsAt, endsAt) {
    const now = Date.now();
    const opensAt = startsAt.getTime() - 30 * 60 * 1000;
    const closesAt = endsAt.getTime() + 30 * 60 * 1000;
    return now >= opensAt && now <= closesAt;
}
async function activitiesRoutes(fastify) {
    fastify.get('/activities', async (request, reply) => {
        try {
            const activities = await prisma_1.prisma.activity.findMany({
                include: {
                    creator: {
                        select: { id: true, name: true, email: true }
                    },
                    _count: {
                        select: {
                            enrollments: {
                                where: { status: client_1.EnrollmentStatus.ATIVA }
                            }
                        }
                    }
                },
                orderBy: { startsAt: 'asc' }
            });
            return reply.send(activities);
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Erro ao buscar atividades.' });
        }
    });
    fastify.get('/activities/:id', async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const paramsValidation = paramsSchema.safeParse(request.params);
        if (!paramsValidation.success) {
            return reply.status(400).send({ message: 'ID de atividade inválido.' });
        }
        const { id } = paramsValidation.data;
        try {
            const activity = await prisma_1.prisma.activity.findUnique({
                where: { id },
                include: {
                    creator: {
                        select: { id: true, name: true, email: true }
                    },
                    _count: {
                        select: {
                            enrollments: {
                                where: { status: client_1.EnrollmentStatus.ATIVA }
                            }
                        }
                    }
                }
            });
            if (!activity) {
                return reply.status(404).send({ message: 'Atividade não encontrada.' });
            }
            return reply.send(activity);
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Erro ao buscar detalhes da atividade.' });
        }
    });
    fastify.post('/activities', {
        preHandler: [fastify.onlyRole(client_1.UserRole.ORGANIZADOR)]
    }, async (request, reply) => {
        const activitySchema = zod_1.z.object({
            title: zod_1.z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
            description: zod_1.z.string().min(5, 'A descrição deve ter pelo menos 5 caracteres'),
            location: zod_1.z.string().min(2, 'O local é obrigatório'),
            startsAt: zod_1.z.string().transform(val => new Date(val)),
            endsAt: zod_1.z.string().transform(val => new Date(val)),
            registrationDeadline: zod_1.z.string().transform(val => new Date(val)).optional(),
            capacity: zod_1.z.number().int().min(1, 'A capacidade deve ser de pelo menos 1 vaga'),
        }).refine(data => data.endsAt > data.startsAt, {
            message: 'A data de fim deve ser posterior à data de início',
            path: ['endsAt']
        }).refine(data => !data.registrationDeadline || data.registrationDeadline <= data.startsAt, {
            message: 'O prazo de inscrição deve ser anterior ou igual ao início da atividade',
            path: ['registrationDeadline']
        });
        const validation = activitySchema.safeParse(request.body);
        if (!validation.success) {
            return reply.status(400).send({
                message: 'Dados de validação incorretos',
                errors: validation.error.flatten().fieldErrors
            });
        }
        const { title, description, location, startsAt, endsAt, capacity } = validation.data;
        const registrationDeadline = validation.data.registrationDeadline ?? startsAt;
        const userId = request.user.sub;
        try {
            const activity = await prisma_1.prisma.activity.create({
                data: {
                    title,
                    description,
                    location,
                    startsAt,
                    endsAt,
                    registrationDeadline,
                    capacity,
                    createdById: userId,
                }
            });
            return reply.status(201).send(activity);
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Erro ao criar atividade.' });
        }
    });
    fastify.put('/activities/:id', {
        preHandler: [fastify.onlyRole(client_1.UserRole.ORGANIZADOR)]
    }, async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const paramsValidation = paramsSchema.safeParse(request.params);
        if (!paramsValidation.success) {
            return reply.status(400).send({ message: 'ID de atividade inválido.' });
        }
        const activitySchema = zod_1.z.object({
            title: zod_1.z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
            description: zod_1.z.string().min(5, 'A descrição deve ter pelo menos 5 caracteres'),
            location: zod_1.z.string().min(2, 'O local é obrigatório'),
            startsAt: zod_1.z.string().transform(val => new Date(val)),
            endsAt: zod_1.z.string().transform(val => new Date(val)),
            registrationDeadline: zod_1.z.string().transform(val => new Date(val)).optional(),
            capacity: zod_1.z.number().int().min(1, 'A capacidade deve ser de pelo menos 1 vaga'),
        }).refine(data => data.endsAt > data.startsAt, {
            message: 'A data de fim deve ser posterior à data de início',
            path: ['endsAt']
        }).refine(data => !data.registrationDeadline || data.registrationDeadline <= data.startsAt, {
            message: 'O prazo de inscrição deve ser anterior ou igual ao início da atividade',
            path: ['registrationDeadline']
        });
        const validation = activitySchema.safeParse(request.body);
        if (!validation.success) {
            return reply.status(400).send({
                message: 'Dados de validação incorretos',
                errors: validation.error.flatten().fieldErrors
            });
        }
        const { id } = paramsValidation.data;
        const { title, description, location, startsAt, endsAt, capacity } = validation.data;
        const registrationDeadline = validation.data.registrationDeadline ?? startsAt;
        const userId = request.user.sub;
        try {
            const activity = await prisma_1.prisma.activity.findUnique({
                where: { id }
            });
            if (!activity) {
                return reply.status(404).send({ message: 'Atividade não encontrada.' });
            }
            if (activity.createdById !== userId) {
                return reply.status(403).send({ message: 'Você não tem permissão para editar esta atividade.' });
            }
            const activeEnrollmentsCount = await prisma_1.prisma.enrollment.count({
                where: { activityId: id, status: client_1.EnrollmentStatus.ATIVA }
            });
            if (capacity < activeEnrollmentsCount) {
                return reply.status(400).send({
                    message: `Não é possível reduzir a capacidade para ${capacity} vagas porque existem ${activeEnrollmentsCount} participantes ativos inscritos.`
                });
            }
            const updatedActivity = await prisma_1.prisma.activity.update({
                where: { id },
                data: {
                    title,
                    description,
                    location,
                    startsAt,
                    endsAt,
                    registrationDeadline,
                    capacity,
                }
            });
            return reply.send(updatedActivity);
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Erro ao atualizar atividade.' });
        }
    });
    fastify.delete('/activities/:id', {
        preHandler: [fastify.onlyRole(client_1.UserRole.ORGANIZADOR)]
    }, async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const paramsValidation = paramsSchema.safeParse(request.params);
        if (!paramsValidation.success) {
            return reply.status(400).send({ message: 'ID de atividade inválido.' });
        }
        const { id } = paramsValidation.data;
        const userId = request.user.sub;
        try {
            const activity = await prisma_1.prisma.activity.findUnique({
                where: { id }
            });
            if (!activity) {
                return reply.status(404).send({ message: 'Atividade não encontrada.' });
            }
            if (activity.createdById !== userId) {
                return reply.status(403).send({ message: 'Você não tem permissão para excluir esta atividade.' });
            }
            await prisma_1.prisma.activity.delete({
                where: { id }
            });
            return reply.status(204).send();
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Erro ao excluir atividade.' });
        }
    });
    fastify.post('/activities/:id/enroll', {
        preHandler: [fastify.onlyRole(client_1.UserRole.PARTICIPANTE)]
    }, async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const paramsValidation = paramsSchema.safeParse(request.params);
        if (!paramsValidation.success) {
            return reply.status(400).send({ message: 'ID de atividade inválido.' });
        }
        const { id: activityId } = paramsValidation.data;
        const userId = request.user.sub;
        try {
            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    const result = await prisma_1.prisma.$transaction(async (tx) => {
                        await tx.$queryRaw `SELECT id FROM activities WHERE id = ${activityId} FOR UPDATE`;
                        const activity = await tx.activity.findUnique({
                            where: { id: activityId },
                            include: {
                                enrollments: {
                                    where: { status: client_1.EnrollmentStatus.ATIVA }
                                }
                            }
                        });
                        if (!activity) {
                            return { status: 404, body: { message: 'Atividade não encontrada.' } };
                        }
                        if (new Date() > activity.registrationDeadline) {
                            return { status: 400, body: { message: 'O prazo de inscrição desta atividade já foi encerrado.' } };
                        }
                        if (activity.enrollments.length >= activity.capacity) {
                            return { status: 400, body: { message: 'Esta atividade não possui vagas disponíveis.' } };
                        }
                        const existingEnrollment = await tx.enrollment.findUnique({
                            where: {
                                userId_activityId: {
                                    userId,
                                    activityId
                                }
                            }
                        });
                        if (existingEnrollment) {
                            if (existingEnrollment.status === client_1.EnrollmentStatus.ATIVA) {
                                return { status: 400, body: { message: 'Você já está inscrito nesta atividade.' } };
                            }
                            const updatedEnrollment = await tx.enrollment.update({
                                where: { id: existingEnrollment.id },
                                data: { status: client_1.EnrollmentStatus.ATIVA }
                            });
                            return {
                                status: 200,
                                body: {
                                    message: 'Inscrição realizada com sucesso.',
                                    enrollment: updatedEnrollment
                                }
                            };
                        }
                        const newEnrollment = await tx.enrollment.create({
                            data: {
                                userId,
                                activityId,
                                status: client_1.EnrollmentStatus.ATIVA
                            }
                        });
                        return {
                            status: 201,
                            body: {
                                message: 'Inscrição realizada com sucesso.',
                                enrollment: newEnrollment
                            }
                        };
                    }, {
                        isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable
                    });
                    return reply.status(result.status).send(result.body);
                }
                catch (error) {
                    if (attempt < 3 && isWriteConflict(error)) {
                        continue;
                    }
                    throw error;
                }
            }
            return reply.status(409).send({ message: 'Não foi possível concluir a inscrição. Tente novamente.' });
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Erro ao se inscrever na atividade.' });
        }
    });
    fastify.post('/activities/:id/cancel', {
        preHandler: [fastify.onlyRole(client_1.UserRole.PARTICIPANTE)]
    }, async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const paramsValidation = paramsSchema.safeParse(request.params);
        if (!paramsValidation.success) {
            return reply.status(400).send({ message: 'ID de atividade inválido.' });
        }
        const { id: activityId } = paramsValidation.data;
        const userId = request.user.sub;
        try {
            const existingEnrollment = await prisma_1.prisma.enrollment.findUnique({
                where: {
                    userId_activityId: {
                        userId,
                        activityId
                    }
                }
            });
            if (!existingEnrollment || existingEnrollment.status === client_1.EnrollmentStatus.CANCELADA) {
                return reply.status(400).send({ message: 'Inscrição não encontrada ou já cancelada.' });
            }
            const activity = await prisma_1.prisma.activity.findUnique({
                where: { id: activityId },
                select: { registrationDeadline: true }
            });
            if (!activity) {
                return reply.status(404).send({ message: 'Atividade não encontrada.' });
            }
            if (new Date() > activity.registrationDeadline) {
                return reply.status(400).send({ message: 'O prazo para cancelar esta inscrição já foi encerrado.' });
            }
            const updatedEnrollment = await prisma_1.prisma.enrollment.update({
                where: { id: existingEnrollment.id },
                data: { status: client_1.EnrollmentStatus.CANCELADA }
            });
            return reply.send({
                message: 'Inscrição cancelada com sucesso.',
                enrollment: updatedEnrollment
            });
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Erro ao cancelar inscrição.' });
        }
    });
    fastify.get('/activities/:id/enrollments', {
        preHandler: [fastify.onlyRole(client_1.UserRole.ORGANIZADOR)]
    }, async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const paramsValidation = paramsSchema.safeParse(request.params);
        if (!paramsValidation.success) {
            return reply.status(400).send({ message: 'ID de atividade inválido.' });
        }
        const { id: activityId } = paramsValidation.data;
        const userId = request.user.sub;
        try {
            await (0, certificates_1.autoIssueOverdueCertificates)();
            const activity = await prisma_1.prisma.activity.findUnique({
                where: { id: activityId }
            });
            if (!activity) {
                return reply.status(404).send({ message: 'Atividade não encontrada.' });
            }
            if (activity.createdById !== userId) {
                return reply.status(403).send({ message: 'Você não tem permissão para visualizar os inscritos desta atividade.' });
            }
            const enrollments = await prisma_1.prisma.enrollment.findMany({
                where: {
                    activityId,
                    status: client_1.EnrollmentStatus.ATIVA
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });
            return reply.send(enrollments);
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Erro ao buscar participantes inscritos.' });
        }
    });
    fastify.post('/activities/:id/attendance-token', {
        preHandler: [fastify.onlyRole(client_1.UserRole.ORGANIZADOR)]
    }, async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const paramsValidation = paramsSchema.safeParse(request.params);
        if (!paramsValidation.success) {
            return reply.status(400).send({ message: 'ID de atividade inválido.' });
        }
        const { id: activityId } = paramsValidation.data;
        const userId = request.user.sub;
        try {
            const activity = await prisma_1.prisma.activity.findUnique({
                where: { id: activityId }
            });
            if (!activity) {
                return reply.status(404).send({ message: 'Atividade não encontrada.' });
            }
            if (activity.createdById !== userId) {
                return reply.status(403).send({ message: 'Você não tem permissão para gerar QR Code desta atividade.' });
            }
            const expiresInSeconds = 60;
            const token = fastify.jwt.sign({
                type: 'attendance',
                activityId,
            }, { expiresIn: expiresInSeconds });
            return reply.send({
                token,
                expiresInSeconds,
                expiresAt: new Date(Date.now() + expiresInSeconds * 1000).toISOString()
            });
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Erro ao gerar QR Code de presença.' });
        }
    });
    fastify.post('/activities/:id/certificates', {
        preHandler: [fastify.onlyRole(client_1.UserRole.ORGANIZADOR)]
    }, async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const paramsValidation = paramsSchema.safeParse(request.params);
        if (!paramsValidation.success) {
            return reply.status(400).send({ message: 'ID de atividade inválido.' });
        }
        const { id: activityId } = paramsValidation.data;
        const userId = request.user.sub;
        try {
            const activity = await prisma_1.prisma.activity.findUnique({
                where: { id: activityId }
            });
            if (!activity) {
                return reply.status(404).send({ message: 'Atividade não encontrada.' });
            }
            if (activity.createdById !== userId) {
                return reply.status(403).send({ message: 'Você não tem permissão para emitir certificados desta atividade.' });
            }
            const pendingEnrollments = await prisma_1.prisma.enrollment.findMany({
                where: {
                    activityId,
                    status: client_1.EnrollmentStatus.ATIVA,
                    attendanceConfirmedAt: { not: null },
                    certificateIssuedAt: null
                },
                select: { id: true }
            });
            if (pendingEnrollments.length === 0) {
                return reply.send({ issuedCount: 0, enrollments: [] });
            }
            const issuedAt = new Date();
            const updatedEnrollments = await prisma_1.prisma.$transaction(pendingEnrollments.map(enrollment => prisma_1.prisma.enrollment.update({
                where: { id: enrollment.id },
                data: {
                    certificateIssuedAt: issuedAt,
                    certificateCode: (0, certificates_1.generateCertificateCode)(enrollment.id),
                },
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    }
                }
            })));
            return reply.send({
                issuedCount: updatedEnrollments.length,
                enrollments: updatedEnrollments
            });
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Erro ao emitir certificados em lote.' });
        }
    });
    fastify.get('/my-enrollments', {
        preHandler: [fastify.onlyRole(client_1.UserRole.PARTICIPANTE)]
    }, async (request, reply) => {
        const userId = request.user.sub;
        try {
            await (0, certificates_1.autoIssueOverdueCertificates)();
            const enrollments = await prisma_1.prisma.enrollment.findMany({
                where: {
                    userId,
                },
                include: {
                    activity: {
                        include: {
                            creator: {
                                select: { id: true, name: true }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return reply.send(enrollments);
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Erro ao buscar suas inscrições.' });
        }
    });
    fastify.post('/attendance/confirm', {
        preHandler: [fastify.onlyRole(client_1.UserRole.PARTICIPANTE)]
    }, async (request, reply) => {
        const bodySchema = zod_1.z.object({
            token: zod_1.z.string().min(1),
        });
        const bodyValidation = bodySchema.safeParse(request.body);
        if (!bodyValidation.success) {
            return reply.status(400).send({
                message: 'Dados de validação incorretos',
                errors: bodyValidation.error.flatten().fieldErrors
            });
        }
        let payload;
        try {
            payload = fastify.jwt.verify(bodyValidation.data.token);
        }
        catch (error) {
            return reply.status(400).send({ message: 'QR Code expirado ou inválido. Solicite um novo código ao organizador.' });
        }
        if (payload.type !== 'attendance' || !payload.activityId) {
            return reply.status(400).send({ message: 'QR Code inválido para confirmação de presença.' });
        }
        const userId = request.user.sub;
        try {
            const enrollment = await prisma_1.prisma.enrollment.findUnique({
                where: {
                    userId_activityId: {
                        userId,
                        activityId: payload.activityId
                    }
                },
                include: {
                    activity: true
                }
            });
            if (!enrollment || enrollment.status !== client_1.EnrollmentStatus.ATIVA) {
                return reply.status(404).send({ message: 'Você não possui inscrição ativa nesta atividade.' });
            }
            if (!isAttendanceWindowOpen(enrollment.activity.startsAt, enrollment.activity.endsAt)) {
                return reply.status(400).send({ message: 'A confirmação por QR Code só fica disponível 30 minutos antes até 30 minutos depois da atividade.' });
            }
            const updatedEnrollment = await prisma_1.prisma.enrollment.update({
                where: { id: enrollment.id },
                data: {
                    attendanceConfirmedAt: enrollment.attendanceConfirmedAt ?? new Date(),
                },
                include: {
                    activity: {
                        select: {
                            id: true,
                            title: true,
                            startsAt: true,
                            endsAt: true,
                        }
                    }
                }
            });
            return reply.send(updatedEnrollment);
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Erro ao confirmar presença por QR Code.' });
        }
    });
    fastify.patch('/enrollments/:id/attendance', {
        preHandler: [fastify.onlyRole(client_1.UserRole.ORGANIZADOR)]
    }, async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const bodySchema = zod_1.z.object({
            present: zod_1.z.boolean(),
        });
        const paramsValidation = paramsSchema.safeParse(request.params);
        if (!paramsValidation.success) {
            return reply.status(400).send({ message: 'ID de inscrição inválido.' });
        }
        const bodyValidation = bodySchema.safeParse(request.body);
        if (!bodyValidation.success) {
            return reply.status(400).send({
                message: 'Dados de validação incorretos',
                errors: bodyValidation.error.flatten().fieldErrors
            });
        }
        const { id } = paramsValidation.data;
        const { present } = bodyValidation.data;
        const userId = request.user.sub;
        try {
            const enrollment = await prisma_1.prisma.enrollment.findUnique({
                where: { id },
                include: { activity: true }
            });
            if (!enrollment) {
                return reply.status(404).send({ message: 'Inscrição não encontrada.' });
            }
            if (enrollment.activity.createdById !== userId) {
                return reply.status(403).send({ message: 'Você não tem permissão para homologar presença nesta atividade.' });
            }
            const updatedEnrollment = await prisma_1.prisma.enrollment.update({
                where: { id },
                data: {
                    attendanceConfirmedAt: present ? new Date() : null,
                    certificateIssuedAt: present ? enrollment.certificateIssuedAt : null,
                    certificateCode: present ? enrollment.certificateCode : null,
                },
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });
            return reply.send(updatedEnrollment);
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Erro ao homologar presença.' });
        }
    });
    fastify.post('/enrollments/:id/certificate', {
        preHandler: [fastify.onlyRole(client_1.UserRole.ORGANIZADOR)]
    }, async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const paramsValidation = paramsSchema.safeParse(request.params);
        if (!paramsValidation.success) {
            return reply.status(400).send({ message: 'ID de inscrição inválido.' });
        }
        const { id } = paramsValidation.data;
        const userId = request.user.sub;
        try {
            const enrollment = await prisma_1.prisma.enrollment.findUnique({
                where: { id },
                include: { activity: true }
            });
            if (!enrollment) {
                return reply.status(404).send({ message: 'Inscrição não encontrada.' });
            }
            if (enrollment.activity.createdById !== userId) {
                return reply.status(403).send({ message: 'Você não tem permissão para emitir certificado nesta atividade.' });
            }
            if (!enrollment.attendanceConfirmedAt) {
                return reply.status(400).send({ message: 'Confirme a presença antes de emitir o certificado.' });
            }
            const updatedEnrollment = await prisma_1.prisma.enrollment.update({
                where: { id },
                data: {
                    certificateIssuedAt: enrollment.certificateIssuedAt ?? new Date(),
                    certificateCode: enrollment.certificateCode ?? (0, certificates_1.generateCertificateCode)(enrollment.id),
                },
                include: {
                    user: {
                        select: { id: true, name: true, email: true }
                    }
                }
            });
            return reply.send(updatedEnrollment);
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Erro ao emitir certificado.' });
        }
    });
}
