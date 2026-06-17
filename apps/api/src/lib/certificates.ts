import { EnrollmentStatus } from '@prisma/client';
import { prisma } from './prisma';

const AUTO_CERTIFICATE_DELAY_MS = 3 * 24 * 60 * 60 * 1000;

export function generateCertificateCode(enrollmentId: string) {
  return `SAGE-${enrollmentId.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
}

export async function autoIssueOverdueCertificates() {
  const deadline = new Date(Date.now() - AUTO_CERTIFICATE_DELAY_MS);
  const pendingEnrollments = await prisma.enrollment.findMany({
    where: {
      status: EnrollmentStatus.ATIVA,
      attendanceConfirmedAt: { not: null },
      certificateIssuedAt: null,
      activity: {
        endsAt: { lte: deadline }
      }
    },
    select: { id: true }
  });

  if (pendingEnrollments.length === 0) {
    return 0;
  }

  const issuedAt = new Date();

  await prisma.$transaction(
    pendingEnrollments.map(enrollment =>
      prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          certificateIssuedAt: issuedAt,
          certificateCode: generateCertificateCode(enrollment.id),
        }
      })
    )
  );

  return pendingEnrollments.length;
}
