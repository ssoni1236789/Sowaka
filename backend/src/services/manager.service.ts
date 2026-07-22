import { cycleRepository } from '../repositories/cycle.repository';
import { evaluationRepository } from '../repositories/evaluation.repository';
import { userRepository } from '../repositories/user.repository';

class ManagerService {
  async getTeam(managerId: string, tenantId: string) {
    const currentCycle = await cycleRepository.getActiveCycle(tenantId);
    
    // We get direct reports and include their evaluations for the current cycle
    const team = await userRepository.findDirectReports(managerId, tenantId);

    // map it so it matches the frontend's expectation, although with standard response format
    const mappedTeam = team.map(member => {
      let currentEval = null;
      if (currentCycle) {
         currentEval = member.evaluationsReceived.find(e => e.cycleId === currentCycle.id) || null;
      }
      return {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        avatar: member.avatar,
        evaluationsReceived: currentEval ? [currentEval] : []
      };
    });

    return {
      currentCycle,
      team: mappedTeam
    };
  }

  async submitEvaluation(managerId: string, evaluationId: string, data: any) {
    // Make sure the evaluation belongs to this manager's report
    const evaluation = await evaluationRepository.findById(evaluationId);
    if (!evaluation || evaluation.managerId !== managerId) {
      throw new Error('Evaluation not found or access denied');
    }

    const { scores, comments } = data;
    
    let overallScore = 0;
    if (scores && scores.length > 0) {
      overallScore = scores.reduce((acc: number, curr: any) => acc + curr.score, 0) / scores.length;
    }

    return evaluationRepository.saveEvaluation({
      cycleId: evaluation.cycleId,
      employeeId: evaluation.employeeId,
      managerId,
      status: 'COMPLETED',
      comments,
      overallScore,
      scores
    });
  }
}

export const managerService = new ManagerService();
