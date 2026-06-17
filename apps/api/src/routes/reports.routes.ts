import { FastifyInstance } from 'fastify';
import { EnrollmentStatus, UserRole } from '@prisma/client';
import { prisma } from '../lib/prisma';

export async function reportsRoutes(fastify: FastifyInstance) {
  fastify.get('/reports/summary', {
    preHandler: [fastify.onlyRole(UserRole.ORGANIZADOR)]
  }, async (_request, reply) => {
    try {
      const [participantsTotal, organizersTotal, certificatesIssuedTotal, attendancesConfirmedTotal, activities] = await Promise.all([
        prisma.user.count({ where: { role: UserRole.PARTICIPANTE } }),
        prisma.user.count({ where: { role: UserRole.ORGANIZADOR } }),
        prisma.enrollment.count({
          where: {
            status: EnrollmentStatus.ATIVA,
            certificateIssuedAt: { not: null }
          }
        }),
        prisma.enrollment.count({
          where: {
            status: EnrollmentStatus.ATIVA,
            attendanceConfirmedAt: { not: null }
          }
        }),
        prisma.activity.findMany({
          include: {
            _count: {
              select: {
                enrollments: {
                  where: { status: EnrollmentStatus.ATIVA }
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
        attendancesConfirmedTotal,
        certificatesIssuedTotal,
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
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Erro ao gerar resumo de relatórios.' });
    }
  });
}
