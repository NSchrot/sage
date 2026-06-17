"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsRoutes = reportsRoutes;
const client_1 = require("@prisma/client");
const prisma_1 = require("../lib/prisma");
async function reportsRoutes(fastify) {
    fastify.get('/reports/summary', {
        preHandler: [fastify.onlyRole(client_1.UserRole.ORGANIZADOR)]
    }, async (_request, reply) => {
        try {
            const [participantsTotal, organizersTotal, activities] = await Promise.all([
                prisma_1.prisma.user.count({ where: { role: client_1.UserRole.PARTICIPANTE } }),
                prisma_1.prisma.user.count({ where: { role: client_1.UserRole.ORGANIZADOR } }),
                prisma_1.prisma.activity.findMany({
                    include: {
                        _count: {
                            select: {
                                enrollments: {
                                    where: { status: client_1.EnrollmentStatus.ATIVA }
                                }
                            }
                        }
                    },
                    orderBy: { startsAt: 'asc' }
                })
            ]);
            const activeEnrollmentsTotal = activities.reduce((total, activity) => total + activity._count.enrollments, 0);
            const capacityTotal = activities.reduce((total, activity) => total + activity.capacity, 0);
            const occupancyRate = capacityTotal > 0 ? Number(((activeEnrollmentsTotal / capacityTotal) * 100).toFixed(1)) : 0;
            return reply.send({
                participantsTotal,
                organizersTotal,
                activitiesTotal: activities.length,
                activeEnrollmentsTotal,
                capacityTotal,
                occupancyRate,
                activities: activities.map(activity => ({
                    id: activity.id,
                    title: activity.title,
                    startsAt: activity.startsAt,
                    capacity: activity.capacity,
                    activeEnrollments: activity._count.enrollments,
                    occupancyRate: activity.capacity > 0 ? Number(((activity._count.enrollments / activity.capacity) * 100).toFixed(1)) : 0
                }))
            });
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Erro ao gerar resumo de relatórios.' });
        }
    });
}
