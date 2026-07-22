import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting exact seed as per requirements...');
  
  // Clean up existing data to prevent conflicts
  await prisma.evaluationScore.deleteMany({});
  await prisma.evaluation.deleteMany({});
  await prisma.cycle.deleteMany({});
  await prisma.user.updateMany({ data: { managerId: null } }); // Break self-relations
  await prisma.user.deleteMany({});
  await prisma.tenant.deleteMany({});

  const password = await bcrypt.hash('Password@123', 10);

  // --- COMPANY 1: Ashoka Textiles ---
  console.log('Seeding Ashoka Textiles...');
  const ashoka = await prisma.tenant.create({
    data: { name: 'Ashoka Textiles' },
  });

  const kavitaHR = await prisma.user.create({
    data: {
      email: 'hr@ashoka.com',
      password,
      name: 'Kavita',
      role: 'HR',
      tenantId: ashoka.id,
      avatar: 'https://ui-avatars.com/api/?name=Kavita+HR',
    }
  });

  const coo = await prisma.user.create({
    data: {
      email: 'coo@ashoka.com',
      password,
      name: 'COO',
      role: 'MANAGER',
      tenantId: ashoka.id,
      avatar: 'https://ui-avatars.com/api/?name=COO',
    }
  });

  const rohan = await prisma.user.create({
    data: {
      email: 'rohan@ashoka.com',
      password,
      name: 'Rohan',
      role: 'MANAGER',
      tenantId: ashoka.id,
      managerId: coo.id,
      avatar: 'https://ui-avatars.com/api/?name=Rohan',
    }
  });

  const priya = await prisma.user.create({
    data: {
      email: 'priya@ashoka.com',
      password,
      name: 'Priya',
      role: 'MANAGER',
      tenantId: ashoka.id,
      managerId: rohan.id,
      avatar: 'https://ui-avatars.com/api/?name=Priya',
    }
  });

  const ashokaEmpNames = ['Rahul', 'Amit', 'Sneha', 'Neha', 'Arjun', 'Mehul'];
  const ashokaEmployees = [];
  for (const name of ashokaEmpNames) {
    ashokaEmployees.push(await prisma.user.create({
      data: {
        email: `${name.toLowerCase()}@ashoka.com`,
        password,
        name,
        role: 'EMPLOYEE',
        tenantId: ashoka.id,
        managerId: priya.id,
        avatar: `https://ui-avatars.com/api/?name=${name}`,
      }
    }));
  }

  // --- COMPANY 2: Bright Path Consulting ---
  console.log('Seeding Bright Path Consulting...');
  const brightPath = await prisma.tenant.create({
    data: { name: 'Bright Path Consulting' },
  });

  const brightPathHR = await prisma.user.create({
    data: {
      email: 'hr@brightpath.com',
      password,
      name: 'HR Lead',
      role: 'HR',
      tenantId: brightPath.id,
      avatar: 'https://ui-avatars.com/api/?name=HR+Lead',
    }
  });

  const founder = await prisma.user.create({
    data: {
      email: 'founder@brightpath.com',
      password,
      name: 'Founder',
      role: 'MANAGER',
      tenantId: brightPath.id,
      avatar: 'https://ui-avatars.com/api/?name=Founder',
    }
  });

  const brightPathEmployees = [];
  for (let i = 1; i <= 8; i++) {
    brightPathEmployees.push(await prisma.user.create({
      data: {
        email: `employee${i}@brightpath.com`,
        password,
        name: `Employee ${i}`,
        role: 'EMPLOYEE',
        tenantId: brightPath.id,
        managerId: founder.id,
        avatar: `https://ui-avatars.com/api/?name=Employee+${i}`,
      }
    }));
  }

  // --- CYCLES ---
  const seedCyclesForTenant = async (tenantId: string) => {
    const may = await prisma.cycle.create({
      data: {
        name: 'May 2026',
        startDate: new Date('2026-05-01T00:00:00Z'),
        endDate: new Date('2026-05-31T23:59:59Z'),
        status: 'CLOSED',
        tenantId
      }
    });

    const june = await prisma.cycle.create({
      data: {
        name: 'June 2026',
        startDate: new Date('2026-06-01T00:00:00Z'),
        endDate: new Date('2026-06-30T23:59:59Z'),
        status: 'CLOSED',
        tenantId
      }
    });

    const july = await prisma.cycle.create({
      data: {
        name: 'July 2026',
        startDate: new Date('2026-07-01T00:00:00Z'),
        endDate: new Date('2026-07-31T23:59:59Z'),
        status: 'ACTIVE',
        tenantId
      }
    });

    return { may, june, july };
  };

  const ashokaCycles = await seedCyclesForTenant(ashoka.id);
  const brightPathCycles = await seedCyclesForTenant(brightPath.id);

  // --- FEEDBACK RECORDS & SCORES ---
  const parameters = ['Ownership', 'Communication', 'Quality of Work', 'Collaboration', 'Problem Solving'];
  
  const getCommentsForScore = (param: string, score: number) => {
    const good = {
      'Ownership': 'Takes ownership of assigned tasks.',
      'Communication': 'Communicates clearly during meetings.',
      'Quality of Work': 'Produces clean and reliable work.',
      'Collaboration': 'Works effectively with teammates.',
      'Problem Solving': 'Identifies practical solutions quickly.'
    };
    const average = {
      'Ownership': 'Generally takes ownership, though sometimes needs reminders.',
      'Communication': 'Communicates well, but could be more proactive.',
      'Quality of Work': 'Produces decent work with occasional minor errors.',
      'Collaboration': 'Collaborates fairly well with the immediate team.',
      'Problem Solving': 'Solves standard problems, struggles slightly with complex issues.'
    };
    const poor = {
      'Ownership': 'Struggles to take full ownership of tasks.',
      'Communication': 'Communication is often delayed or unclear.',
      'Quality of Work': 'Work quality needs significant improvement.',
      'Collaboration': 'Prefers working in silos, needs to collaborate more.',
      'Problem Solving': 'Often gets stuck on problems without seeking help.'
    };
    
    if (score >= 4) return good[param as keyof typeof good];
    if (score === 3) return average[param as keyof typeof average];
    return poor[param as keyof typeof poor];
  };

  // Helper to create an evaluation with an improvement trend based on the month
  const createEval = async (cycleId: string, employeeId: string, managerId: string, isCompleted: boolean, month: number) => {
    if (!isCompleted) {
      await prisma.evaluation.create({
        data: { cycleId, employeeId, managerId, status: 'PENDING' }
      });
      return;
    }

    // Creating a visible improvement trend: May=~3, June=~4, July=~5
    let baseScore = 3;
    if (month === 6) baseScore = 4;
    if (month === 7) baseScore = 5;

    const scores = parameters.map(p => {
      // Small variation to make it look realistic, but keeping the trend
      const score = Math.max(1, Math.min(5, baseScore + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0)));
      return {
        parameter: p,
        score,
        comment: getCommentsForScore(p, score)
      };
    });

    const overallScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;

    await prisma.evaluation.create({
      data: {
        cycleId, 
        employeeId, 
        managerId, 
        status: 'COMPLETED',
        overallScore,
        comments: `Performance feedback for the cycle.`,
        scores: { create: scores }
      }
    });
  };

  console.log('Seeding Ashoka Evaluations...');
  // COO -> Rohan
  await createEval(ashokaCycles.may.id, rohan.id, coo.id, true, 5);
  await createEval(ashokaCycles.june.id, rohan.id, coo.id, true, 6);
  await createEval(ashokaCycles.july.id, rohan.id, coo.id, true, 7);

  // Rohan -> Priya
  await createEval(ashokaCycles.may.id, priya.id, rohan.id, true, 5);
  await createEval(ashokaCycles.june.id, priya.id, rohan.id, true, 6);
  await createEval(ashokaCycles.july.id, priya.id, rohan.id, true, 7);

  // Priya -> Employees
  // Rahul, Amit, Sneha = Completed for July. Neha, Arjun, Mehul = Pending for July.
  const completedInJuly = ['Rahul', 'Amit', 'Sneha'];
  for (const emp of ashokaEmployees) {
    // May & June completed for all
    await createEval(ashokaCycles.may.id, emp.id, priya.id, true, 5);
    await createEval(ashokaCycles.june.id, emp.id, priya.id, true, 6);
    
    // July mix
    const isCompleted = completedInJuly.includes(emp.name);
    await createEval(ashokaCycles.july.id, emp.id, priya.id, isCompleted, 7);
  }

  console.log('Seeding Bright Path Evaluations...');
  // Founder -> Employees
  // Random mix for July pending/completed
  let completedCount = 0;
  for (const emp of brightPathEmployees) {
    await createEval(brightPathCycles.may.id, emp.id, founder.id, true, 5);
    await createEval(brightPathCycles.june.id, emp.id, founder.id, true, 6);
    
    // Make first 4 completed, next 4 pending for a realistic mix
    const isCompleted = completedCount < 4;
    await createEval(brightPathCycles.july.id, emp.id, founder.id, isCompleted, 7);
    if (isCompleted) completedCount++;
  }

  console.log('Seed completed successfully! Matches all assignment requirements.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
