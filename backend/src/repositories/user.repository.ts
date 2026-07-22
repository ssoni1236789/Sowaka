import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ 
      where: { email },
      include: { tenant: true }
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { tenant: true }
    });
  }

  async updateUser(id: string, data: { name?: string; email?: string; avatar?: string; companyName?: string }) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: { tenant: true }
    });

    if (data.companyName !== undefined && data.companyName.trim() !== '') {
      await prisma.tenant.update({
        where: { id: user.tenantId },
        data: { name: data.companyName }
      });
      user.tenant.name = data.companyName;
    }

    return user;
  }

  async findDirectReports(managerId: string, tenantId: string) {
    return prisma.user.findMany({
      where: {
        managerId,
        tenantId,
      },
      include: {
        evaluationsReceived: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  async findDirectReport(managerId: string, employeeId: string, tenantId: string) {
    return prisma.user.findFirst({
      where: {
        id: employeeId,
        managerId,
        tenantId,
      },
      include: {
        evaluationsReceived: {
          include: {
            cycle: true,
            scores: true
          }
        }
      }
    });
  }

  async findAllInTenant(tenantId: string) {
    return prisma.user.findMany({
      where: { tenantId },
      include: {
        manager: {
          select: { name: true }
        }
      }
    });
  }

  async countByTenantIdAndRole(tenantId: string, role: import('@prisma/client').Role) {
    return prisma.user.count({
      where: { tenantId, role }
    });
  }

  async findManagersInTenant(tenantId: string) {
    return prisma.user.findMany({
      where: { tenantId, role: 'MANAGER' },
      include: {
        directReports: {
          include: {
            evaluationsReceived: true
          }
        }
      }
    });
  }
}

export const userRepository = new UserRepository();
