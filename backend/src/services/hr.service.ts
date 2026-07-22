import { cycleRepository } from '../repositories/cycle.repository';
import { userRepository } from '../repositories/user.repository';
import prisma from '../config/prisma';

class HrService {
  async getDashboard(tenantId: string, query: any) {
    const currentCycle = await cycleRepository.getActiveCycle(tenantId);

    const totalEmployees = await userRepository.countByTenantIdAndRole(tenantId, 'EMPLOYEE');

    let completedEvaluations = 0;
    if (currentCycle) {
      completedEvaluations = await prisma.evaluation.count({
        where: { cycleId: currentCycle.id, status: 'COMPLETED' }
      });
    }

    const allCycles = await cycleRepository.findAllInTenant(tenantId);

    // Apply pagination if provided
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 20;
    const skip = (page - 1) * limit;
    
    // Using prisma directly for managers query with pagination
    const managers = await prisma.user.findMany({
      where: { tenantId, role: 'MANAGER' },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        role: true,
        avatar: true,
        avatar: true,
        employees: {
          select: {
            id: true,
            evaluationsReceived: currentCycle ? {
              where: { cycleId: currentCycle.id, status: 'COMPLETED' }
            } : { where: { id: 'none' } }
          }
        }
      }
    });

    const managersOverview = managers.map(mgr => {
      const totalReports = mgr.employees.length;
      const completed = mgr.employees.filter(r => r.evaluationsReceived.length > 0).length;
      return {
        id: mgr.id,
        name: mgr.name,
        role: mgr.role,
        avatar: mgr.avatar,
        teamSize: totalReports,
        completedEvaluations: completed,
        progress: totalReports > 0 ? Math.round((completed / totalReports) * 100) : 0
      };
    });

    return {
      currentCycle,
      metrics: {
        totalEmployees,
        completedEvaluations,
        completionRate: totalEmployees > 0 ? Math.round((completedEvaluations / totalEmployees) * 100) : 0
      },
      history: allCycles,
      managersOverview,
      pagination: {
        page,
        limit
      }
    };
  }

  async createCycle(tenantId: string, data: any) {
    return cycleRepository.createCycle({
      name: data.name,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      tenantId
    });
  }

  async getEmployees(tenantId: string) {
    return prisma.user.findMany({
      where: { tenantId, role: 'EMPLOYEE' },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        manager: {
          select: { name: true }
        }
      }
    });
  }

  async getManagers(tenantId: string) {
    const managers = await prisma.user.findMany({
      where: { tenantId, role: 'MANAGER' },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        employees: {
          select: {
            id: true,
            evaluationsReceived: {
              select: { status: true }
            }
          }
        }
      }
    });

    return managers.map(mgr => {
      const teamSize = mgr.employees.length;
      let completed = 0;
      let pending = 0;
      
      mgr.employees.forEach(emp => {
        const evals = emp.evaluationsReceived;
        if (evals.length > 0) {
          // just count the latest evaluation for simplicity, or count all active
          const latest = evals[0]; 
          if (latest.status === 'COMPLETED') completed++;
          if (latest.status === 'PENDING') pending++;
        }
      });

      return {
        id: mgr.id,
        name: mgr.name,
        email: mgr.email,
        avatar: mgr.avatar,
        teamSize,
        pending,
        completed,
        completionRate: teamSize > 0 ? Math.round((completed / teamSize) * 100) : 0
      };
    });
  }

  async getCycles(tenantId: string) {
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

  async getReviews(tenantId: string, status?: string) {
    const whereClause: any = {
      cycle: { tenantId }
    };
    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    return prisma.evaluation.findMany({
      where: whereClause,
      include: {
        employee: { select: { name: true, avatar: true } },
        manager: { select: { name: true } },
        cycle: { select: { name: true } }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getReports(tenantId: string) {
    return prisma.evaluation.findMany({
      where: { cycle: { tenantId }, status: 'COMPLETED' },
      include: {
        employee: { select: { name: true, avatar: true } },
        manager: { select: { name: true } },
        cycle: { select: { name: true } }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }
}

export const hrService = new HrService();
