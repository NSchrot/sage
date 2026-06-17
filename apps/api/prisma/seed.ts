import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  await prisma.enrollment.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 8);

  const organizer = await prisma.user.create({
    data: {
      name: 'Organizador SAGE',
      email: 'organizador@sage.com',
      passwordHash,
      role: UserRole.ORGANIZADOR,
    },
  });

  const participant = await prisma.user.create({
    data: {
      name: 'Participante SAGE',
      email: 'participante@sage.com',
      passwordHash,
      role: UserRole.PARTICIPANTE,
    },
  });

  console.log('✅ Users created:', { organizer: organizer.email, participant: participant.email });

  const now = new Date();
  
  const activity1 = await prisma.activity.create({
    data: {
      title: 'Apresentação de TCC - Sala A',
      description: 'Sessão de bancas examinadoras de TCC do curso de Ciência da Computação.',
      location: 'Bloco C, Sala 102',
      startsAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      endsAt: new Date(now.getTime() + 26 * 60 * 60 * 1000),
      registrationDeadline: new Date(now.getTime() + 20 * 60 * 60 * 1000),
      capacity: 30,
      createdById: organizer.id,
    },
  });

  const activity2 = await prisma.activity.create({
    data: {
      title: 'Workshop de React e Tailwind CSS',
      description: 'Aprenda na prática a construir interfaces ricas e responsivas utilizando React com Tailwind CSS v4.',
      location: 'Laboratório de Informática 3',
      startsAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      endsAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
      registrationDeadline: new Date(now.getTime() + 36 * 60 * 60 * 1000),
      capacity: 2,
      createdById: organizer.id,
    },
  });

  const activity3 = await prisma.activity.create({
    data: {
      title: 'Palestra: IA e o Futuro do Trabalho Acadêmico',
      description: 'Discussão aberta sobre o impacto da inteligência artificial generativa na pesquisa científica e escrita de artigos.',
      location: 'Auditório Principal',
      startsAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      endsAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      registrationDeadline: new Date(now.getTime() + 60 * 60 * 60 * 1000),
      capacity: 100,
      createdById: organizer.id,
    },
  });

  console.log('✅ Activities created:', [activity1.title, activity2.title, activity3.title]);

  console.log('🌱 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
