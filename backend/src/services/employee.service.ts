import { cycleRepository } from '../repositories/cycle.repository';
import { evaluationRepository } from '../repositories/evaluation.repository';
import prisma from '../config/prisma';

class EmployeeService {
  async getDashboardData(userId: string, tenantId: string) {
    const currentCycle = await cycleRepository.getActiveCycle(tenantId);
    
    const evaluations = await prisma.evaluation.findMany({
      where: { employeeId: userId, status: 'COMPLETED' },
      include: { scores: true }
    });

    let totalScore = 0;
    let scoreCount = 0;
    evaluations.forEach(ev => {
      ev.scores.forEach(s => {
        totalScore += s.score;
        scoreCount++;
      });
    });

    const averageScore = scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : 0;

    return {
      currentCycle,
      completedEvaluationsCount: evaluations.length,
      averageOverallScore: averageScore,
      latestFeedbackDate: evaluations.length > 0 ? evaluations[evaluations.length - 1].updatedAt : null
    };
  }

  async getCurrentFeedback(userId: string, tenantId: string) {
    const currentCycle = await cycleRepository.getActiveCycle(tenantId);
    if (!currentCycle) return null;

    return evaluationRepository.findActiveForEmployee(userId, currentCycle.id);
  }

  async getFeedbackHistory(userId: string) {
    return evaluationRepository.findHistoryForEmployee(userId);
  }

  async getPerformanceTrend(userId: string) {
    const history = await prisma.evaluation.findMany({
      where: { employeeId: userId, status: 'COMPLETED' },
      include: { cycle: true, scores: true },
      orderBy: { createdAt: 'asc' }
    });

    return history.map(ev => {
      const parameterScores: Record<string, number> = {};
      ev.scores.forEach(s => {
        parameterScores[s.parameter] = s.score;
      });
      return {
        cycle: ev.cycle.name,
        score: ev.overallScore || 0,
        parameters: parameterScores
      };
    });
  }
}

export const employeeService = new EmployeeService();
