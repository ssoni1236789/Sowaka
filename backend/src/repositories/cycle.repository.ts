import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CycleRepository {
  async getActiveCycle(tenantId: string) {
    return prisma.cycle.findFirst({
      where: {
        tenantId,
        status: 'ACTIVE',
      },
      orderBy: { startDate: 'desc' }
    });
  }

  async findAllInTenant(tenantId: string) {
    return prisma.cycle.findMany({
      where: { tenantId },
      orderBy: { startDate: 'desc' },
      include: {
        _count: {
          select: { evaluations: true }
        }
      }
    });
  }

  async createCycle(data: { name: string; startDate: Date; endDate: Date; tenantId: string }) {
    return prisma.$transaction(async (tx) => {
      // Close active cycles
      await tx.cycle.updateMany({
        where: { tenantId: data.tenantId, status: 'ACTIVE' },
        data: { status: 'CLOSED' }
      });

      // Create new
      return tx.cycle.create({
        data: {
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          status: 'ACTIVE',
          tenantId: data.tenantId
        }
      });
    });
  }
}

export const cycleRepository = new CycleRepository();
