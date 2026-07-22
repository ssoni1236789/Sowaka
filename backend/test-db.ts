import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const evals = await prisma.evaluation.findMany({
    where: { employee: { name: 'Ashoka Employee 6' } },
    orderBy: { updatedAt: 'desc' }
  });
  console.log("Employee 6:", evals.map(e => ({ status: e.status, comments: e.comments, updated: e.updatedAt })));

  const evals3 = await prisma.evaluation.findMany({
    where: { employee: { name: 'Ashoka Employee 3' } },
    orderBy: { updatedAt: 'desc' }
  });
  console.log("Employee 3:", evals3.map(e => ({ status: e.status, comments: e.comments, updated: e.updatedAt })));
}

main().finally(() => prisma.$disconnect());
