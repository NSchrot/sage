"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCertificateCode = generateCertificateCode;
exports.autoIssueOverdueCertificates = autoIssueOverdueCertificates;
const client_1 = require("@prisma/client");
const prisma_1 = require("./prisma");
const AUTO_CERTIFICATE_DELAY_MS = 3 * 24 * 60 * 60 * 1000;
function generateCertificateCode(enrollmentId) {
    return `SAGE-${enrollmentId.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
}
async function autoIssueOverdueCertificates() {
    const deadline = new Date(Date.now() - AUTO_CERTIFICATE_DELAY_MS);
    const pendingEnrollments = await prisma_1.prisma.enrollment.findMany({
        where: {
            status: client_1.EnrollmentStatus.ATIVA,
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
    await prisma_1.prisma.$transaction(pendingEnrollments.map(enrollment => prisma_1.prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
            certificateIssuedAt: issuedAt,
            certificateCode: generateCertificateCode(enrollment.id),
        }
    })));
    return pendingEnrollments.length;
}
