import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class EvaluationRepository {
  async findActiveForEmployee(employeeId: string, cycleId: string) {
    return prisma.evaluation.findUnique({
      where: {
        cycleId_employeeId: {
          cycleId,
          employeeId
        }
      },
      include: {
        scores: true,
        manager: { select: { name: true } }
      }
    });
  }

  async findHistoryForEmployee(employeeId: string) {
    return prisma.evaluation.findMany({
      where: {
        employeeId,
        status: 'COMPLETED'
      },
      include: {
        cycle: true,
        scores: true,
        manager: { select: { name: true } }
      },
      orderBy: {
        cycle: { endDate: 'desc' }
      }
    });
  }

  async findById(id: string) {
    return prisma.evaluation.findUnique({
      where: { id },
      include: { cycle: true, scores: true, employee: true }
    });
  }

  async findPendingForManager(managerId: string, cycleId: string) {
    // A pending review is one where the employee is a direct report, 
    // and they either have no evaluation for the active cycle, or it's PENDING.
    const directReports = await prisma.user.findMany({
      where: { managerId }
    });
    const reportIds = directReports.map(r => r.id);

    const completedEvals = await prisma.evaluation.findMany({
      where: { cycleId, employeeId: { in: reportIds }, status: 'COMPLETED' }
    });
    
    const completedEmployeeIds = completedEvals.map(e => e.employeeId);
    
    return prisma.user.findMany({
      where: { 
        managerId,
        id: { notIn: completedEmployeeIds }
      }
    });
  }

  async findCompletedForManager(managerId: string, cycleId: string) {
    return prisma.evaluation.findMany({
      where: {
        managerId,
        cycleId,
        status: 'COMPLETED'
      },
      include: {
        employee: true,
        scores: true
      }
    });
  }

  async saveEvaluation(data: {
    cycleId: string;
    employeeId: string;
    managerId: string;
    status: string;
    overallScore?: number;
    comments?: string;
    scores: { parameter: string; score: number; comment?: string }[];
  }) {
    return prisma.$transaction(async (tx) => {
      const evaluation = await tx.evaluation.upsert({
        where: {
          cycleId_employeeId: {
            cycleId: data.cycleId,
            employeeId: data.employeeId
          }
        },
        update: {
          status: data.status,
          overallScore: data.overallScore,
          comments: data.comments,
        },
        create: {
          cycleId: data.cycleId,
          employeeId: data.employeeId,
          managerId: data.managerId,
          status: data.status,
          overallScore: data.overallScore,
          comments: data.comments,
        }
      });

      // Clear existing scores and insert new ones
      await tx.evaluationScore.deleteMany({
        where: { evaluationId: evaluation.id }
      });

      if (data.scores.length > 0) {
        await tx.evaluationScore.createMany({
          data: data.scores.map(s => ({
            evaluationId: evaluation.id,
            parameter: s.parameter,
            score: s.score,
            comment: s.comment
          }))
        });
      }

      return evaluation;
    });
  }

  async findAllInTenant(tenantId: string) {
    return prisma.evaluation.findMany({
      where: {
        employee: { tenantId }
      },
      include: {
        cycle: true,
        employee: { select: { name: true, role: true } },
        manager: { select: { name: true } }
      }
    });
  }
}

export const evaluationRepository = new EvaluationRepository();
